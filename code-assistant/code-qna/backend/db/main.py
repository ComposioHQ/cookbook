from tinydb import TinyDB, Query
import uuid

class ChatDB:
    def __init__(self, db_path='db.json'):
        self.db = TinyDB(db_path)

    def create_chat(self, chat_name):
        chat_id = str(uuid.uuid4())
        messages = [{
            "role": "system",
            "content": f"You are an assistant that answers questions based on the codebase located at {chat_name}. Respond to users' messages in a simple & concise manner. Don't use filler words. If you don't find enough context to respond to the user find/query code using find_code_snippet tool."
        }]
        self.db.insert({'chat_id': chat_id, 'chat_name': chat_name, 'messages': messages})
        return chat_id

    
    def add_message(self, chat_id, content, role):
        Chat = Query()
        chat = self.db.get(Chat.chat_id == chat_id)
        if chat:
            chat['messages'].append({'role': role, 'content': content})
            self.db.update({'messages': chat['messages']}, Chat.chat_id == chat_id)
        else:
            raise ValueError(f"Chat ID not found: {chat_id}")

    
    def get_chat(self, chat_id):
        Chat = Query()
        return self.db.get(Chat.chat_id == chat_id)

    def list_all_chats(self):
        return self.db.all()
    

# Remove or comment out these lines
chat_db_instance = ChatDB()
print(chat_db_instance.get_chat("b1bb99ee-a797-4910-87a4-ee32d3dea76b"))
# chats = chat_db_instance.list_all_chats()
# print(f"from db :: chats: {chats}")
# chat_id = chat_db_instance.create_chat("test101")
# print(f"New chat created with chat_id: {chat_id}")
# ba0b4d00-95a9-4068-877c-ef633ed7ca4e