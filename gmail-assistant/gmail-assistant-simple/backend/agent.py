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
from pathlib import Path

load_dotenv()

llm = ChatOpenAI(model="gpt-4o")

#Get keywords, attributes & sheetid
def readData():
    with open("taskData.json", "r") as file:
        data = json.load(file)
        return [data["keywords"], data["attributes"], data["sheetId"]]

#Get the current counter value
def read_counter():
    try:
        with open("counter.json", "r") as file:
            data = json.load(file)
            return data["counter"]
    except FileNotFoundError:
        initial_data = {"counter": 0}
        with open("counter.json", "w") as file:
            json.dump(initial_data, file)
        return 0

#Tool to increment counter value
class incrementCounter(BaseTool):
    name: str = "Increment Counter"
    description: str = "This tool increments the counter value"

    def _run(self):
        current_value = read_counter()
        new_value = current_value + 1
        data = {"counter": new_value}
        with open("counter.json", "w") as file:
            json.dump(data, file)

#Get the attachment that was recently downloaded
def get_recent_attachment() -> str:
    pdf_files = glob.glob(os.path.join("/Users/abhishekpatil/Desktop/cookbook-local/gmailgenius-attachment-extract-store/backend/attachments/", "*.pdf")) #modify path as per need
    if not pdf_files:
        return None  
    
    most_recent_pdf = max(pdf_files, key=os.path.getctime)
    return most_recent_pdf

#Extract useful attributes from attachment
class extractorTool(BaseTool):
    name: str = "ExtractorTool"
    description: str = "This tool extracts useful attributes from pdf document/attachments"

    def _run(self) -> Dict[str, Any]:
        attachment = get_recent_attachment()
        url = os.environ.get("NANO_URL")
        FilePath = {'file': open(attachment, 'rb')}
        response = requests.post(url, auth=requests.auth.HTTPBasicAuth(os.environ.get("NANO_API_KEY"), ''), files=FilePath)
        return json.loads(response.text)["result"][0]["prediction"]

#Tools
IncrementCounter = incrementCounter()
Extractor_tool=extractorTool()
composio_toolset = ComposioToolSet(output_dir=Path.home()/"attachments",entity_id="abishkpatil")
google_tools = composio_toolset.get_actions(
    actions=[
        Action.GMAIL_GET_ATTACHMENT,
        Action.GOOGLESHEETS_BATCH_UPDATE
    ]
)
tools = google_tools + [Extractor_tool, IncrementCounter]

#Agent
google_assistant = Agent(
    role="Gmail Assistant",
    goal="""Understand the email subject and body, download attachments & extract attributes/information from it, store attributes in google sheet (Store just the values & not the attribute names)""",
    backstory=f"""You're an AI assistant that makes use of google tools/APIs and does work on behalf of user. You can extract attributes/information from attachments & Store in google sheet""",
    verbose=True,
    llm=llm,
    tools=tools,
    allow_delegation=False,
)

def formatData(payload):
    try:
        threadId = payload.get("threadId", "NA")
        attachmentDetails = payload.get("attachmentList", [])

        if not attachmentDetails or not isinstance(attachmentDetails, list):
            return [threadId, "NA", "NA"]

        attachmentId = attachmentDetails[0].get("attachmentId", "NA")
        filename = attachmentDetails[0].get("filename", "NA")

        return [threadId, attachmentId, filename]
    except (IndexError, AttributeError, TypeError) as e:
        # Log the error if needed
        return ["NA", "NA", "NA"]


#Trigger instance
listener = composio_toolset.create_trigger_listener()

@listener.callback(filters={"trigger_name": "GMAIL_NEW_GMAIL_MESSAGE"})
def callback_new_message(event: TriggerEventData) -> None:
    print("Received email")
    payload = event.payload
    formattedPayload = formatData(payload)
    message_id = formattedPayload[0]
    attachment_id = formattedPayload[1]
    file_name = formattedPayload[2]

    res = readData()
    keywords = res[0]
    attributes = res[1]
    sheetId = res[2]
    
    find_invoice_from_gmail = Task(
        description=f"""
        Check if the email subject or body contains keywords like {keywords}, if so then download the attachment & store the following attributes: {attributes} in google sheet with id {sheetId} & sheet name sheet1 and cell A{read_counter()},
        Email: {payload}
        """,
        agent=google_assistant,
        expected_output="If email matches criteria ({keywords}) then download attachment & store attributes on google sheet & increment counter if and only if email matches keywords, otherwise indicate email isnt related",
    )

    gmail_processing_crew = Crew(
        agents=[google_assistant],
        tasks=[find_invoice_from_gmail],
        verbose=1,
        process=Process.sequential,
    )
    result = gmail_processing_crew.kickoff()
    return result


print("Subscription created!")
listener.listen()