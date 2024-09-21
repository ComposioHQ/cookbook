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

def repost_tweet_with_quote(quote: str, tweet_id: str) -> str:
    print("Reposting tweet with quote")
    
    # Tools
    tools = composio_toolset.get_actions(actions=[Action.TWITTER_USER_LOOKUP_BY_USERNAME])

    # Agent
    twitter_agent = Agent(
        role="Twitter Agent",
        goal="Repost tweets on Twitter with a quote",
        backstory="You're an AI assistant that reposts tweets with a quote on Twitter.",
        verbose=True,
        llm=llm,
        tools=tools,
        allow_delegation=False,
    )

    task_description = f"""
    1. Repost the tweet with ID {tweet_id} with the following quote:
       "{quote}"
    """

    process_twitter_request = Task(
        description=task_description,
        agent=twitter_agent,
        expected_output="Confirmation that the tweet was reposted on Twitter with the quote.",
    )

    twitter_processing_crew = Crew(
        agents=[twitter_agent],
        tasks=[process_twitter_request],
        verbose=1,
        process=Process.sequential,
    )
    
    result = twitter_processing_crew.kickoff()
    return result

repost_tweet_with_quote("This sounds cool", "1833201520021803153")