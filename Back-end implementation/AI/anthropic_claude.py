from anthropic import Anthropic
import os

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def generate_asset_description(item_name, condition, status):
    prompt = f"""
    Write a short, professional description for a surplus inventory system.

    Item: {item_name}
    Condition: {condition}
    Status: {status}
    """

    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=100,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.content[0].text
