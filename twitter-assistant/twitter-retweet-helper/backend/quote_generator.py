import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_repost_quote(tweet_content: str, number_of_quotes: int) -> list[str]:
    quotes = []
    
    for _ in range(number_of_quotes):
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Generate a meaningful repost quote with hashtags and an emoji"},
                {"role": "user", "content": f"Generate a repost quote for this tweet: '{tweet_content}'. Include hashtags and an emoji in the same string. Please keep it short, simple, informal and no filler words, also sound like a human."}
            ]
        )
        
        quote = completion.choices[0].message.content.strip()
        quotes.append(quote)
    
    return quotes