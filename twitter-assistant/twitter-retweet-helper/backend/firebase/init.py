import firebase_admin
from firebase_admin import credentials, auth, firestore
from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()

creds = {
    "type": os.environ.get("type"),
    "project_id": os.environ.get("project_id"),
    "private_key_id": os.environ.get("private_key_id"),
    "private_key": os.environ.get("private_key"),
    "client_email": os.environ.get("client_email"),
    "client_id": os.environ.get("client_id"),
    "auth_uri": os.environ.get("auth_uri"),
    "token_uri": os.environ.get("token_uri"),
    "auth_provider_x509_cert_url":
    os.environ.get("auth_provider_x509_cert_url"),
    "client_x509_cert_url": os.environ.get("client_x509_cert_url"),
}

firebase_admin.initialize_app(credentials.Certificate(creds))
db = firestore.client()

def get_user_by_username(username):
    users_ref = db.collection('users')
    query = users_ref.where('uid', '==', username).limit(1)
    docs = query.get()

    for doc in docs:
        return doc.to_dict()

    return False

def update_twitter_integration_id(username: str, twitter_integration_id: str):
    users_ref = db.collection('users')
    query = users_ref.where('username', '==', username).limit(1)
    docs = query.get()

    for doc in docs:
        try:
            doc.reference.update(
                {'twitterIntegrationId': twitter_integration_id})
            print(f"Successfully updated twitterIntegrationId for user {username}")
            return True
        except Exception as e:
            print(f"Error updating twitterIntegrationId for user {username}: {e}")
            return False

    print(f"User {username} not found")
    return False

def get_twitter_integration_id(username: str) -> str:
    users_ref = db.collection('users')
    query = users_ref.where('username', '==', username).limit(1)
    docs = query.get()

    for doc in docs:
        user_data = doc.to_dict()
        return user_data.get('twitterIntegrationId', '')

    print(f"User {username} not found")
    return ''


def get_composio_api_key(username: str) -> str:
    users_ref = db.collection('users')
    query = users_ref.where('username', '==', username).limit(1)
    docs = query.get()

    for doc in docs:
        user_data = doc.to_dict()
        return user_data.get('composio_api_key', '')

    print(f"User {username} not found")
    return ''