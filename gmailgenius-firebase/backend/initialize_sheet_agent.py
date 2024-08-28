import json
from composio_crewai import Action, ComposioToolSet
from crewai import Agent, Crew, Task, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
load_dotenv()
llm = ChatOpenAI(model="gpt-4o")

def createSheet(sheetTitle: str, attributes: str, entityId: str):
    values = [attr.strip().split(",") for attr in attributes.splitlines() if attr]
    # composio_toolset = ComposioToolSet(entity_id=entityId)
    composio_toolset = ComposioToolSet()
    google_tools = composio_toolset.get_actions(
        actions=[
            Action.GOOGLESHEETS_CREATE_GOOGLE_SHEET1,
            Action.GOOGLESHEETS_BATCH_UPDATE,
        ]
    )

    google_assistant = Agent(
        role="Gmail Assistant",
        goal="Create a Google Sheet and update it with provided values.",
        backstory="You're an AI assistant that handles Google Sheets operations using Google APIs.",
        verbose=True,
        llm=llm,
        tools=google_tools,
        allow_delegation=False,
    )

    create_google_sheet = Task(
        description=f"""
        Create a new Google Sheet titled '{sheetTitle}', batch update it with the following values starting from A1: {json.dumps(values)}, 
        Do not use includeValuesInResponse attribute.
        """,
        agent=google_assistant,
        expected_output="Create sheet, store values",
    )

    gmail_processing_crew = Crew(
        agents=[google_assistant],
        tasks=[create_google_sheet],
        verbose=1,
        process=Process.sequential,
    )
    return gmail_processing_crew.kickoff()

# Example usage
res = createSheet("dummy-sheet-99", "Finally, this, works", "abishkpatil")
print("Batch update result: ", res)
