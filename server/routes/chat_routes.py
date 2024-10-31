import os
import json
from flask import Blueprint, jsonify, request
from openai import AzureOpenAI
from dotenv import load_dotenv

from utils.decorators import login_required

chat_routes = Blueprint("chat", __name__)
load_dotenv()

# Set up your Azure endpoint and API key (store these securely!)
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_API_KEY")
AZURE_DEPLOYMENT = os.getenv("DEPLOYMENT_NAME")

client = AzureOpenAI(
    azure_endpoint=AZURE_ENDPOINT,
    api_key=AZURE_OPENAI_API_KEY,
    api_version="2024-05-01-preview",
)

@chat_routes.route("/prompt", methods=["POST"])
# @login_required
def ask_chatbot():
      # Initialize Azure OpenAI client with key-based authentication
      data = request.get_json()
      if not data or 'query' not in data:
          return jsonify({"Error:" "No query provided!"}), 400

      # Prepare the chat prompt
      chat_prompt = [
        {
            "role": "system",
            "content": "You are an AI assistant that helps people find information."
        },
        {
            "role": "user",
            "content": data["query"]
        }
      ]

      # Generate the completion
      completion = client.chat.completions.create(
          model=AZURE_DEPLOYMENT,
          messages=chat_prompt,
          max_tokens=800,
          temperature=0.7,
          top_p=0.95,
          frequency_penalty=0,
          presence_penalty=0,
          stop=None,
          stream=False
      )
      completion_json = json.loads(completion.to_json())
      content = completion_json["choices"][0]["message"]["content"]
      return jsonify({"response": content})
