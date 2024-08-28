import firebase_admin
from firebase_admin import credentials, auth, firestore
from pathlib import Path


cred = credentials.Certificate(f"{Path.cwd()}/firebase/genius-57d8d-firebase-adminsdk-ue7u9-90656332c6.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def get_user_by_username(username):
    users_ref = db.collection('users')
    query = users_ref.where('username', '==', username).limit(1)
    docs = query.get()
    
    for doc in docs:
        return doc.to_dict()
    
    return False


def update_row(uid, new_row):
    users_ref = db.collection('users')
    user_doc = users_ref.document(uid)
    
    try:
        user_doc.update({
            'sheetsConfig.row': str(new_row) 
        })
        return True
    except Exception as e:
        print(f"Error updating user row: {e}")
        return False
