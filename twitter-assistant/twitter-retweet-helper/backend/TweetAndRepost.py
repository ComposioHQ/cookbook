import os
from composio_crewai import Action, ComposioToolSet
from crewai import Agent, Crew, Task, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

llm = ChatOpenAI(model="gpt-4o")

def post_twitter_message(entity_id: str, message: str) -> str:
    composio_toolset = ComposioToolSet(api_key=os.environ.get("COMPOSIO_API_KEY"), entity_id=entity_id)
    tools = composio_toolset.get_actions(actions=[Action.TWITTER_CREATION_OF_A_POST])
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
    2. Return only the tweet ID of the posted tweet.
    """

    process_twitter_request = Task(
        description=task_description,
        agent=twitter_agent,
        expected_output="The tweet ID of the posted tweet.",
    )

    twitter_processing_crew = Crew(
        agents=[twitter_agent],
        tasks=[process_twitter_request],
        verbose=1,
        process=Process.sequential,
    )
    
    result = twitter_processing_crew.kickoff()
    return result

def repost_tweet_with_quote(entity_id: str, task_description: str) -> str:
    composio_toolset = ComposioToolSet(api_key=os.environ.get("COMPOSIO_API_KEY"), entity_id=entity_id)
    tools = composio_toolset.get_actions(actions=[Action.TWITTER_CREATION_OF_A_POST])
    twitter_agent = Agent(
        role="Twitter Agent",
        goal="Repost tweets on Twitter with a quote",
        backstory="You're an AI assistant that reposts tweets with a quote on Twitter.",
        verbose=True,
        llm=llm,
        tools=tools,
        allow_delegation=False,
    )

    process_twitter_request = Task(
        description=task_description,
        agent=twitter_agent,
        expected_output="Result of the repost",
    )

    twitter_processing_crew = Crew(
        agents=[twitter_agent],
        tasks=[process_twitter_request],
        verbose=1,
        process=Process.sequential,
    )
    
    result = twitter_processing_crew.kickoff()
    return result


def tweet(initial_tweet_entity_id: str, initial_tweet: str, repost_data_list: list):
    tweet_id = post_twitter_message(initial_tweet_entity_id, initial_tweet)
    
    for repost_data in repost_data_list:
        entity_id = repost_data["entity_id"]
        quote = repost_data["quote"]
        
        task_description = f"""
        Repost the tweet with ID {tweet_id} with the following quote:
           "{quote}"
        """
        
        repost_result = repost_tweet_with_quote(entity_id, task_description)
        print(f"Repost result for {entity_id}: {repost_result}")

    return "Tweeting and reposting process completed."
