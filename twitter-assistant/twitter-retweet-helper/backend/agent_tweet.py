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

def post_twitter_message(message: str) -> str:
    print("Posting Twitter message")
    
    # Tools
    tools = composio_toolset.get_actions(actions=[Action.TWITTER_CREATION_OF_A_POST])

    # Agent
    twitter_agent = Agent(
        role="Twitter Agent",
        goal="Create and post tweets on Twitter",
        backstory="You're an AI assistant that crafts and shares tweets on Twitter.",
        verbose=True,
        llm=llm,
        tools=tools,
        allow_delegation=False,
    )

    task_description = f"""
    1. Post the following message on Twitter:
       "{message}"
    """

    process_twitter_request = Task(
        description=task_description,
        agent=twitter_agent,
        expected_output="Confirmation that the tweet was posted on Twitter.",
    )

    twitter_processing_crew = Crew(
        agents=[twitter_agent],
        tasks=[process_twitter_request],
        verbose=1,
        process=Process.sequential,
    )
    
    result = twitter_processing_crew.kickoff()
    return result

post_twitter_message("We will win this")

# 1833201520021803153