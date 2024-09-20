import requests
import os
from dotenv import load_dotenv
load_dotenv()

def get_tweet_text_by_id(tweet_id):
    url = f"https://api.twitter.com/2/tweets/{tweet_id}"
    bearer_token = os.getenv("TWITTER_TOKEN")
    headers = {
        "Authorization": f"Bearer {bearer_token}"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()['data']['text'].replace('\n', '')
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def get_user_id_by_username(username):
    url = f"https://api.x.com/2/users/by/username/{username}"
    bearer_token = os.getenv("TWITTER_TOKEN")
    headers = {
        "Authorization": f"Bearer {bearer_token}"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()['data']['id']
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None