from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import logging
import socketio
import uuid
from db.main import ChatDB
from chat.main import chatbot

chat_db = ChatDB(db_path='./db/db.json')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    ping_timeout=3600  # 1 hour
)
socket_app = socketio.ASGIApp(sio, app)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Pydantic models
class CreateChatRequest(BaseModel):
    chat_name: str

class AddMessageRequest(BaseModel):
    chat_id: str
    message: str
    sender: str

class MessageResponse(BaseModel):
    sender: str
    message: str

@app.post("/create_chat")
async def create_chat(request: CreateChatRequest):
    chat_id = chat_db.create_chat(request.chat_name)
    if chat_id:
        return chat_id
    else:
        raise HTTPException(status_code=500, detail="Failed to create chat")

@app.get("/get_chat/{chat_id}")
async def get_chat(chat_id: str):
    chat_data = chat_db.get_chat(chat_id)
    if chat_data:
        return chat_data
    else:
        raise HTTPException(status_code=404, detail="Chat ID not found")

@app.get("/list_chats")
async def list_chats():
    try:
        chats = chat_db.list_all_chats()
        return chats
    except Exception as e:
        logger.error(f"Error listing chats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list chats")
    
@app.get("/")
async def handle_request():
    return "ok"

#socketio code
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def message(sid, data):
    print(f"Message received: {data}")
    chat_id = data.get('chat_id')
    content = data.get('content')
    role = data.get('role')
    
    if not chat_id or not content or not role:
        await sio.emit('error', 'Invalid data', room=sid)
        return

    try:
        chat_db.add_message(chat_id, content, role)
        messages = chat_db.get_chat(chat_id)['messages']
        response = chatbot(messages)
        print(f"from chatbot :: {response}")
        # response = f"Message from {role}: {content}"
        # chat_db.add_message(chat_id, response, "agent")
        # await sio.emit('response', response, room=sid)
        await sio.emit('response', "received", room=sid)
    except ValueError as e:
        await sio.emit('error', str(e), room=sid)
        

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(socket_app, host='127.0.0.1', port=8000)

# Start the server (if running locally)
# Run the following command in your terminal: uvicorn main:app --reload
