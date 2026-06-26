from flask import Flask, render_template, request, jsonify
from datetime import datetime
import random

app = Flask(__name__)

chat_history = []

# Simple demo responses
responses = {
    "hello": [
        "Hello! Cyber AI online.",
        "Hi! How can I assist you today?",
        "Greetings. System ready."
    ],
    "who are you": [
        "I am Cyber AI, your virtual assistant.",
        "I am an AI chatbot built using Python and Flask."
    ],
    "time": [
        f"Current time is {datetime.now().strftime('%I:%M %p')}"
    ],
    "python": [
        "Python is a powerful programming language for AI and web development."
    ]
}


def get_ai_response(message):
    message = message.lower()

    for key in responses:
        if key in message:
            return random.choice(responses[key])

    return random.choice([
        "Interesting question. Tell me more.",
        "Processing request...",
        "I am still learning. Can you rephrase that?",
        "Cyber AI is analyzing your query."
    ])


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/chat', methods=['POST'])
def chat():

    user_message = request.json.get('message')

    bot_response = get_ai_response(user_message)

    chat_history.append({
        "user": user_message,
        "bot": bot_response
    })

    return jsonify({
        "response": bot_response
    })


if __name__ == "__main__":
    app.run(debug=True)