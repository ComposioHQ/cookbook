from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import json
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

def writeData(keywords: str, attributes: str, sheetId: str):
    data = {
        "keywords": keywords,
        "attributes": attributes,
        "sheetId": sheetId
    }
    
    with open("taskData.json", "w") as file:
        json.dump(data, file, indent=4)

class Message(BaseModel):
    emailKeywords: str
    attributes: str
    sheetId: str

@app.post("/configparameters")
async def handle_request(message: Message):
    try:
        logger.info(f"Received request with emailKeywords: {message.emailKeywords} and attributes: {message.attributes}")
        writeData(message.emailKeywords, message.attributes, message.sheetId)
        logger.info(f"Data written successfully to taskData.json")
        return {"message": "Data written successfully"}
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# To start the server: uvicorn main:app --reload