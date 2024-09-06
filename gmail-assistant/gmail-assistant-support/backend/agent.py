import os
import re
import glob
import json
from composio.client.collections import TriggerEventData
from composio_crewai import Action, ComposioToolSet
from crewai import Agent, Crew, Task, Process
from crewai_tools.tools.base_tool import BaseTool
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from typing import Any, Dict
import requests
from firebase.init import update_row
from firebase.init import db
# get_user_by_username
from pathlib import Path

load_dotenv()

llm = ChatOpenAI(model="gpt-4o")

# Trigger instance
composio_toolset1 = ComposioToolSet(api_key=os.environ.get("COMPOSIO_API_KEY"))
listener = composio_toolset1.create_trigger_listener()


@listener.callback(filters={"trigger_name": "GMAIL_NEW_GMAIL_MESSAGE"})
def callback_new_message(event: TriggerEventData) -> None:
    print("Received new email")
    payload = event.payload
    print("\n\npayload: ", payload)

    # def get_user_by_username(username):
    #     users_ref = db.collection('users')
    #     query = users_ref.where('username', '==', username).limit(1)
    #     docs = query.get()

    #     for doc in docs:
    #         return doc.to_dict()

    #     return False

    # user = get_user_by_username(event.metadata.connection.clientUniqueUserId)
    # uid = user['uid']
    # keyword_dict = user['emailForwarding']
    
    # Tools
    composio_toolset = ComposioToolSet(
        api_key=os.environ.get("COMPOSIO_API_KEY"),
        output_dir=Path.cwd() / "attachments",
        entity_id=event.metadata.connection.clientUniqueUserId)
    tools = composio_toolset.get_actions(actions=[Action.GMAIL_SEND_EMAIL, Action.GMAIL_GET_ATTACHMENT, Action.GMAIL_REPLY_TO_THREAD])

    # Agent
    email_assistant = Agent(
        role="Email Assistant",
        goal="Process incoming emails, send auto-replies, and forward emails based on keywords",
        backstory="You're an AI assistant that handles incoming emails, sends automatic responses, and forwards emails to appropriate recipients based on content, including attachments.",
        verbose=True,
        llm=llm,
        tools=tools,
        allow_delegation=False,
    )

    keyword_dict = {
        "bugs, Issues, glitches, bad user experience": "hrishikeshvastrad14@gmail.com",
        "Growth, Marketing, partnerships, suggestions, feedback": "mskarthikugalawat@gmail.com",
    }

    process_new_email = Task(
        description=f"""
        1. Send an automatic reply to the sender of the email with the following message:
           "Thank you for your email. We have received it and will get back to you shortly. Our team is reviewing your message and will respond as soon as possible."
           using GMAIL_REPLY_TO_THREAD action.
        2. Check if the email subject (subject) or body (messageText) in the payload contains any of the keywords specified in this dictionary: {keyword_dict}.
        3. If a keyword match is found:
           a. Check if the original email contains any attachments.
           b. If attachments are present, use the GMAIL_GET_ATTACHMENT action to download them.
           c. Send the email payload to the corresponding email address. And if attachments are present include the downloaded attachments.
        4. Use the GMAIL_SEND_EMAIL action for sending the email (with attachments if applicable).
        Payload: {payload}
        """,
        agent=email_assistant,
        expected_output="Summary of email processing, including confirmation of auto-reply sent, whether the email was forwarded based on keyword matching, and if any attachments were included in the forwarded email.",
    )

    email_processing_crew = Crew(
        agents=[email_assistant],
        tasks=[process_new_email],
        verbose=1,
        process=Process.sequential,
    )
    result = email_processing_crew.kickoff()
    # result = "test"
    return result


print("Email trigger listener activated!")
listener.listen()
