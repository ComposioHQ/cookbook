from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from firebase.init import auth
from composio_config import createNewEntity, isEntityConnected, createTwitterIntegrationAndInitiateAdminConnection
import logging
from quote_generator import generate_repost_quote
from TweetAndRepost import tweet

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://gmail-assistant-six.vercel.app",
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_token(auth_credentials: HTTPAuthorizationCredentials = Depends(
    HTTPBearer())):
    token = auth_credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Pydantic models
class UserData(BaseModel):
    username: str
    appType: str

class EnableTriggerData(BaseModel):
    username: str

class InitialiseAgentData(BaseModel):
    username: str

class TweetData(BaseModel):
    tweetContent: str
    numberOfQuotes: int

class TweetRequestData(BaseModel):
    initial_tweet_entity_id: str
    post: str
    repost_data_list: list

class NewIntegrationData(BaseModel):
    username: str
    redirectUrl: str

class NewEntityData(BaseModel):
    username: str
    newUserId: str
    redirectUrl: str

@app.post("/newintegration")
async def handle_request(user_data: NewIntegrationData,
                         decoded_token: dict = Depends(verify_token)):
    user_id = decoded_token['uid']
    username = user_data.username
    redirectUrl = user_data.redirectUrl
    res = createTwitterIntegrationAndInitiateAdminConnection(username, redirectUrl)
    return res

@app.post("/newentity")
async def handle_request(user_data: NewEntityData,
                         decoded_token: dict = Depends(verify_token)):
    user_id = decoded_token['uid']
    username = user_data.username
    newUserId = user_data.newUserId
    redirectUrl = user_data.redirectUrl
    res = createNewEntity(username, newUserId, redirectUrl)
    return res

@app.post("/enabletrigger")
async def handle_request(user_data: EnableTriggerData,
                         decoded_token: dict = Depends(verify_token)):
    user_id = decoded_token['uid']
    username = user_data.username
    res = enable_gmail_trigger(username)
    return res

@app.post("/checkconnection")
async def handle_request(user_data: UserData,
                         decoded_token: dict = Depends(verify_token)):
    user_id = decoded_token['uid']
    username = user_data.username
    appType = user_data.appType
    res = isEntityConnected(username, appType)
    return res

@app.post("/initialiseagent")
async def handle_request(user_data: InitialiseAgentData,
                         decoded_token: dict = Depends(verify_token)):
    username = user_data.username
    res = initialise(username)
    return res

@app.post("/getquotes")
async def handle_request(tweet_data: TweetData,
                         decoded_token: dict = Depends(verify_token)):
    user_id = decoded_token['uid']
    tweet_content = tweet_data.tweetContent
    number_of_quotes = tweet_data.numberOfQuotes
    res = generate_repost_quote(tweet_content, number_of_quotes)
    return {"quotes": res}

@app.post("/tweet")
async def handle_request(tweet_request_data: TweetRequestData,
                         decoded_token: dict = Depends(verify_token)):
    initial_tweet_entity_id = tweet_request_data.initial_tweet_entity_id
    initial_tweet = tweet_request_data.post
    repost_data_list = tweet_request_data.repost_data_list
    res = tweet(initial_tweet_entity_id, initial_tweet, repost_data_list)
    return {"result": res}

@app.get("/")
async def handle_request():
    return "ok"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Start the server (if running locally)
# Run the following command in your terminal: uvicorn main:app --reload
