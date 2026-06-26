from flask import Flask, render_template, request, jsonify
import random
import string
from datetime import datetime

app = Flask(__name__)

password_history = []

def generate_password(length, upper, numbers, symbols):

    chars = string.ascii_lowercase

    if upper:
        chars += string.ascii_uppercase

    if numbers:
        chars += string.digits

    if symbols:
        chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    password = ''.join(random.choice(chars) for _ in range(length))

    strength = "Weak"

    if length >= 8:
        strength = "Medium"

    if length >= 12 and upper and numbers:
        strength = "Strong"

    if length >= 16 and upper and numbers and symbols:
        strength = "Very Strong"

    password_history.insert(0, {
        "password": password,
        "time": datetime.now().strftime("%H:%M:%S")
    })

    if len(password_history) > 10:
        password_history.pop()

    return password, strength


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate():

    data = request.json

    length = int(data['length'])
    upper = data['upper']
    numbers = data['numbers']
    symbols = data['symbols']

    password, strength = generate_password(
        length,
        upper,
        numbers,
        symbols
    )

    return jsonify({
        "password": password,
        "strength": strength,
        "history": password_history
    })


if __name__ == '__main__':
    app.run(debug=True)