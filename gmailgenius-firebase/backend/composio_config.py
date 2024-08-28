from composio import ComposioToolSet, App, Composio, Action
from composio.client.exceptions import NoItemsFound

def enable_gmail_trigger(ent_id: str):
    client = Composio()
    entity = client.get_entity(id=ent_id)
    trigger_Config = {'userId': 'me', 'interval': 1, 'labelIds': 'INBOX'}
    try:
        entity.enable_trigger(app=App.GMAIL, trigger_name='GMAIL_NEW_GMAIL_MESSAGE', config=trigger_Config)
        response = {
            "status": "success",
            "message": f"Trigger {trigger_name} enabled for {ent_id} on Gmail"
        }
        return response
    except Exception as e:
        response = {
            "status": "error",
            "message": f"Failed to enable trigger: {str(e)}"
        }
        return response

def isEntityConnected(ent_id: str, appType: str):
    toolset = ComposioToolSet(entity_id=ent_id)
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

def createNewEntity(ent_id: str, appType: str):
    toolset = ComposioToolSet(entity_id=ent_id)
    entity = toolset.get_entity()
    app_enum = getattr(App, appType)
    try:
        entity.get_connection(app=app_enum)
        response = {
            "authenticated": "yes",
            "message": f"User {ent_id} is already authenticated with {appType}",
            "url": ""
        }
        return response

    except NoItemsFound as e:
        # Create a request to initiate connection
        request = entity.initiate_connection(app_enum, redirect_url="http://localhost:5173/settings")
        response = {
            "authenticated": "no",
            "message": f"User {ent_id} is not yet authenticated with {appType}. Please authenticate.",
            "url": request.redirectUrl
        }
        return response
        # Poll until the connection is active
        connected_account = request.wait_until_active(client=toolset.client, timeout=100)
    


# print(createNewEntity("abhi_kle2", "GMAIL"))
# print(enable_gmail_trigger("abhi_kle2"))