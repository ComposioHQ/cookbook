from composio import ComposioToolSet, App, Composio, Action
from composio.client.exceptions import NoItemsFound
import os
from dotenv import load_dotenv
load_dotenv()
from firebase.init import update_twitter_integration_id, get_composio_api_key, get_twitter_integration_id

def isEntityConnected(ent_id: str, appType: str):
    toolset = ComposioToolSet(api_key=get_composio_api_key(ent_id),
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

def createTwitterIntegrationAndInitiateAdminConnection(ent_id: str, redirectUrl: str):
    toolset = ComposioToolSet(api_key=get_composio_api_key(ent_id),
                              entity_id=ent_id)
    entity = toolset.get_entity()
    twitter_app_id = "b3a9602b-731b-4044-9c9a-d0137ef5c887"
    integration = entity.client.integrations.create(name="Tweetify_integration", app_id=twitter_app_id, auth_mode="oauth2", use_composio_auth=True)
    update_twitter_integration_id(ent_id, integration.id)
    request = entity.initiate_connection("TWITTER", redirect_url=redirectUrl, integration=integration)
    response = {
        "authenticated": "no",
        "message": f"User {ent_id} is not yet authenticated with Twitter. Please authenticate.",
        "url": request.redirectUrl
    }
    return response


def createNewEntity(ent_id: str, newUserId: str, redirectUrl: str):
    toolset = ComposioToolSet(api_key=get_composio_api_key(ent_id),
                              entity_id=newUserId)
    entity = toolset.get_entity()
    try:
        entity.get_connection(app="TWITTER")
        response = {
            "authenticated": "yes",
            "message":
            f"User {newUserId} is already authenticated with TWITTER",
            "url": ""
        }
        return response

    except NoItemsFound as e:
        integration = entity.client.integrations.get_by_id(get_twitter_integration_id(ent_id))
        request = entity.initiate_connection(
                app_name="TWITTER", redirect_url=redirectUrl, integration=integration
        )
        response = {
            "authenticated": "no",
            "message": f"User {newUserId} is not yet authenticated with TWITTER. Please authenticate.",
            "url": request.redirectUrl
        }
        return response