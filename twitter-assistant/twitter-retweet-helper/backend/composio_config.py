from composio import ComposioToolSet, App, Composio, Action
from composio.client.exceptions import NoItemsFound
import os
from dotenv import load_dotenv
load_dotenv()

def isEntityConnected(ent_id: str, appType: str):
    toolset = ComposioToolSet(api_key=os.environ.get("COMPOSIO_API_KEY"),
                              entity_id=ent_id)
    entity = toolset.get_entity()
    app_enum = getattr(App, appType)
    try:
        entity.get_connection(app=app_enum)
        response = {
            "authenticated": "yes",
            "message": f"User {ent_id} is authenticated with {appType}",
        }
        return response
    except NoItemsFound as e:
        response = {
            "authenticated": "no",
            "message": f"User {ent_id} is not authenticated with {appType}",
        }
        return response


def createNewEntity(ent_id: str, appType: str, redirectUrl: str):
    toolset = ComposioToolSet(api_key=os.environ.get("COMPOSIO_API_KEY"),
                              entity_id=ent_id)
    entity = toolset.get_entity()
    app_enum = getattr(App, appType)
    try:
        entity.get_connection(app=app_enum)
        response = {
            "authenticated": "yes",
            "message":
            f"User {ent_id} is already authenticated with {appType}",
            "url": ""
        }
        return response

    except NoItemsFound as e:
        # Create a request to initiate connection
        request = entity.initiate_connection(app_enum, redirect_url=redirectUrl)
        response = {
            "authenticated": "no",
            "message": f"User {ent_id} is not yet authenticated with {appType}. Please authenticate.",
            "url": request.redirectUrl
        }
        #poll until the connection is active
        # connected_account = request.wait_until_active(client=toolset.client,timeout=100)
        return response