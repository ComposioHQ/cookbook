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
    sender_email = payload['sender']
    sender_email = sender_email.strip()

    def get_user_by_username(username):
        users_ref = db.collection('users')
        query = users_ref.where('username', '==', username).limit(1)
        docs = query.get()

        for doc in docs:
            return doc.to_dict()

        return False

    user = get_user_by_username(event.metadata.connection.clientUniqueUserId)
    uid = user['uid']
    keywords = user['keywords']
    user_email = user['email']

    # Tools
    composio_toolset = ComposioToolSet(
        api_key=os.environ.get("COMPOSIO_API_KEY"),
        output_dir=Path.cwd() / "attachments",
        entity_id=event.metadata.connection.clientUniqueUserId)
    tools = composio_toolset.get_actions(actions=[Action.GMAIL_SEND_EMAIL, Action.GMAIL_GET_ATTACHMENT, Action.GMAIL_REPLY_TO_THREAD, Action.SLACKBOT_SENDS_A_MESSAGE_TO_A_SLACK_CHANNEL])

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

    prompt1 = f"""
        1. Send an automatic reply to the sender of the email with the following message:
            "Thank you for your email. We have received it and will get back to you shortly"
            using GMAIL_REPLY_TO_THREAD action & if any attachments are present, use GMAIL_SEND_EMAIL send that too.
        2. Check if the email subject (subject) or body (messageText) in the payload contains any of the keywords specified in this dictionary: {[{'slackChannel': 'dev-channel', 'email': 'hrishikeshvastrad14@gmail.com', 'keywords': 'bugs, errors, issues'}, {'slackChannel': 'growth-channel', 'email': 'mskarthikugalawat@gmail.com', 'keywords': 'Collaboration, partnership, sponser'}, {'slackChannel': 'hrishikesh-channel', 'email': 'hrishikesh@gmail.com', 'keywords': 'bill'}]}.
        3. If a keyword match is found:
            a. Check if the original email contains any attachments.
            b. If attachments are present, use the GMAIL_GET_ATTACHMENT action to download them.
            c. Send the email payload to the corresponding email address and slack channel. And if attachments are present include the downloaded attachments.
            message: 'Forwarded email: subject & body'
        Payload: {payload}
        """
    prompt2 = f"""
        1. Check if the email subject (subject) or body (messageText) in the payload contains any of the keywords specified in this dictionary: {keywords}.
        2. If a keyword match is found:
            a. Check if the original email contains any attachments.
            b. If attachments are present, use the GMAIL_GET_ATTACHMENT action to download them.
            c. Send the email payload to the corresponding email address and slack channel. And if attachments are present include the downloaded attachments.
            message: 'Forwarded email: subject & body'
        Payload: {payload}
        """

    task_description = prompt1 if user_email != sender_email else prompt2

    process_new_email = Task(
        description=task_description,
        agent=email_assistant,
        expected_output="Summary of email processing, including confirmation of auto-reply sent, whether the email was forwarded & message sent to slack based on keyword matching, and if any attachments were included in the forwarded email.",
    )

    email_processing_crew = Crew(
        agents=[email_assistant],
        tasks=[process_new_email],
        verbose=1,
        process=Process.sequential,
    )
    result = email_processing_crew.kickoff()
    return result


print("Email trigger listener activated!")
listener.listen()