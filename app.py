import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

app = Flask(__name__)

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "meta-llama/Llama-3.2-3B-Instruct"

client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_messages = data.get("messages", [])

    if not user_messages:
        return jsonify({"error": "No message provided"}), 400

    try:
        formatted_messages = [
            {"role": "system", "content": "You are a helpful AI assistant."}
        ] + user_messages

        response = client.chat_completion(
            messages=formatted_messages,
            max_tokens=500,
            temperature=0.7
        )

        reply_content = response.choices[0].message.content
        return jsonify({"reply": reply_content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
