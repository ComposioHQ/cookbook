import json
from composio_crewai import Action, ComposioToolSet
from crewai import Agent, Crew, Task, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from crewai_tools.tools.base_tool import BaseTool
from firebase.init import db
import os

load_dotenv()
llm = ChatOpenAI(model="gpt-4o")


def initialise(entityId: str):
    username = entityId

    def get_user_by_username(username):
        users_ref = db.collection('users')
        query = users_ref.where('username', '==', username).limit(1)
        docs = query.get()

        for doc in docs:
            return doc.to_dict()

        return False

    user = get_user_by_username(entityId)
    keywords = user['keywords'][0]['keywords']
    email = user['email']
    composio_toolset = ComposioToolSet(
        api_key=os.environ.get("COMPOSIO_API_KEY"), entity_id=entityId)

    google_tools = composio_toolset.get_actions(actions=[Action.GMAIL_SEND_EMAIL])

    google_assistant = Agent(
        role="Gmail Assistant",
        goal= """
        1. Send an email to the user with the specified keywords in the body.
        """,
        backstory=
        "You're an AI assistant that handles Gmail operations using Gmail APIs.",
        verbose=True,
        llm=llm,
        tools=google_tools,
        allow_delegation=False,
    )

    send_email_task = Task(
        description=f"""
        Send an email with the following details:
        1. Recipient email: {email}
        2. Subject: "Test email with keywords"
        3. Body: "This is a test email containing the following keywords: {keywords}. These keywords will be used to filter and forward your emails."
        Only specify recipient_email, subject, and body when sending the email.
        """,
        agent=google_assistant,
        expected_output=
        "Send an email to the user with the specified keywords",
    )

    gmail_processing_crew = Crew(
        agents=[google_assistant],
        tasks=[send_email_task],
        verbose=1,
        process=Process.sequential,
    )
    return gmail_processing_crew.kickoff()