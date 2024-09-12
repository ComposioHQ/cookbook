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

def lookup_twitter_user(username: str) -> str:
    print("Looking up Twitter user by username")
    
    # Tools
    tools = composio_toolset.get_actions(actions=[Action.TWITTER_USER_LOOKUP_BY_USERNAME])

    # Agent
    twitter_agent = Agent(
        role="Twitter Agent",
        goal="Lookup Twitter users by username",
        backstory="You're an AI assistant that looks up Twitter users by their username.",
        verbose=True,
        llm=llm,
        tools=tools,
        allow_delegation=False,
    )

    task_description = f"""
    1. Lookup the Twitter user with the following username:
       "{username}"
    """

    process_twitter_request = Task(
        description=task_description,
        agent=twitter_agent,
        expected_output="Details of the Twitter user with the specified username.",
    )

    twitter_processing_crew = Crew(
        agents=[twitter_agent],
        tasks=[process_twitter_request],
        verbose=1,
        process=Process.sequential,
    )
    
    result = twitter_processing_crew.kickoff()
    return result

lookup_twitter_user("rahul_tester101")