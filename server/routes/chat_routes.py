import os
import json
from flask import Blueprint, jsonify, request
import requests
from openai import AzureOpenAI
from dotenv import load_dotenv
import pandas as pd
from pandasai import Agent
from utils.query import Query

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


@chat_routes.route("/insights", methods=["GET"])
@login_required
def get_insights():
    """
    Fetch transaction data, update the global PandasAI agent, and process the hardcoded prompt.
    """
    # Step 1: Fetch transaction data
    transactions = Query().get_transactions(response_type="list")

    if not transactions:
        return jsonify({"error": "No transaction data available"}), 404
    print(transactions)

    transactions_df = pd.DataFrame(transactions)
    transactions_df['amount'] = pd.to_numeric(transactions_df['amount'], errors='coerce')
    transactions_df['transaction_date'] = pd.to_datetime(transactions_df['transaction_date'], errors='coerce')

    if transactions_df.empty:
        return jsonify({"error": "Transaction data is empty"}), 404

    agent = Agent([transactions_df])

    # Step 4: Hardcoded prompt for insights
    prompt = "Give me some general trends about my spending data!"

    # Step 5: Use the global agent to analyze the data
    try:
        insights = agent.chat(prompt)
        print(insights)
        return jsonify({"insights": insights}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
