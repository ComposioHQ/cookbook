import os
from composio_crewai import Action, ComposioToolSet
from crewai import Agent, Crew, Task, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

llm = ChatOpenAI(model="gpt-4o")

# ComposioToolSet instance
composio_toolset = ComposioToolSet(api_key=os.environ.get("COMPOSIO_API_KEY"))

def send_slack_message_and_file(message: str, channel: str, file_path: str = None) -> str:
    print("Sending Slack message with attachment")
    
    # Tools
    tools = composio_toolset.get_actions(actions=[
        Action.SLACKBOT_SENDS_A_MESSAGE_TO_A_SLACK_CHANNEL,
        Action.SLACKBOT_UPLOAD_OR_CREATE_A_FILE_IN_SLACK
    ])

    # Agent
    slack_assistant = Agent(
        role="Slack Assistant",
        goal="Send messages and files to Slack channels",
        backstory="You're an AI assistant that sends messages",
        verbose=True,
        llm=llm,
        tools=tools,
        allow_delegation=False,
    )

    task_description = f"""
    1. Send the following message to the Slack channel '{channel}':
       "{message}" along with the file: {file_path}
    """

    process_slack_request = Task(
        description=task_description,
        agent=slack_assistant,
        expected_output="Confirmation that the message was sent to the specified Slack channel.",
    )

    slack_processing_crew = Crew(
        agents=[slack_assistant],
        tasks=[process_slack_request],
        verbose=1,
        process=Process.sequential,
    )
    
    result = slack_processing_crew.kickoff()
    return result

send_slack_message_and_file("Hello, this is a test message with attachment", "dev-channel", "/Users/abhishekpatil/Desktop/cookbook-local-new/gmail-assistant/gmail-assistant-support/backend/attachments/GMAIL_GET_ATTACHMENT_abishkpatil_1725767832.0156858_Screenshot 2024-09-07 at 10.40.59 PM.png")