import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

app = Flask(__name__)

# Hugging Face configuration
HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "meta-llama/Llama-3.2-3B-Instruct"

client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json or {}
    user_messages = data.get("messages", [])

    if not user_messages:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Give your assistant its personality
        formatted_messages = [
            {"role": "system", "content": "You are a friendly and intelligent AI assistant."}
        ] + user_messages

        # Call the Hugging Face Serverless Chat API
        response = client.chat_completion(
            messages=formatted_messages,
            max_tokens=450,
            temperature=0.7
        )

        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Render binds dynamic port via the PORT environment variable
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
