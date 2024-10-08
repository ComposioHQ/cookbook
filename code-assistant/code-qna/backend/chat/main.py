from dotenv import load_dotenv
load_dotenv()
import os
import sys
from openai import OpenAI
from db import ChatDB

from .codebase_agent import find_code_snippet
from .tools import code_search_tool

# Add the parent directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

chat_db = ChatDB(db_path=os.path.join(parent_dir, 'db', 'db.json'))

def chatbot(messages: list):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=code_search_tool,
    )

    if completion.choices[0].message.tool_calls:
        tool_call = completion.choices[0].message.tool_calls[0]
        function_name = tool_call.function.name
        arguments = eval(tool_call.function.arguments)
        if function_name == "find_code_snippet":
            result = find_code_snippet(**arguments)
            print(f"Code snippet result: {result}")
            # messages.append({"role": "user", "content": f"User query: {user_msg}"})
            # messages.append({"role": "assistant", "content": f"Code snippet result: {result}"})
            
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
            )
            
            response = completion.choices[0].message.content
            print("(Bot): ", response)
            # messages.append({"role": "assistant", "content": response})
    else:
        response = completion.choices[0].message.content
        print("(Bot): ", response)
        # messages.append({"role": "assistant", "content": response})
    return "ok"