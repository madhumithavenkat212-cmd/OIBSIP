from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    
)

import sqlite3
from datetime import datetime
import matplotlib.pyplot as plt
from reportlab.pdfgen import canvas
import os

app = Flask(__name__)

# ---------------- DATABASE ---------------- #

def init_db():
    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS bmi_history(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER,
        gender TEXT,
        height REAL,
        weight REAL,
        bmi REAL,
        category TEXT,
        created_at TEXT
    )
    """)

    conn.commit()
    conn.close()


init_db()

# ---------------- HELPERS ---------------- #

def get_category(bmi):
    if bmi < 18.5:
        return "Underweight"

    elif bmi < 25:
        return "Normal"

    elif bmi < 30:
        return "Overweight"

    return "Obese"


def get_tip(category):

    tips = {
        "Underweight":
        "Increase protein and nutritious foods.",

        "Normal":
        "Excellent! Maintain your healthy lifestyle.",

        "Overweight":
        "Exercise daily and avoid junk foods.",

        "Obese":
        "Follow a proper diet plan and regular exercise."
    }

    return tips[category]


def get_water(weight):
    return round(weight * 0.035, 2)


def get_calories(weight, gender):

    if gender.lower() == "male":
        return int(weight * 30)

    return int(weight * 27)


# ---------------- ROUTES ---------------- #

@app.route("/")
def home():
    return render_template("index.html")


# ---------------- BMI CALCULATION ---------------- #

@app.route("/calculate", methods=["POST"])
def calculate():

    data = request.get_json()

    name = data["name"]
    age = int(data["age"])
    gender = data["gender"]
    height = float(data["height"])
    weight = float(data["weight"])

    bmi = round(
        weight /
        ((height / 100) ** 2),
        2
    )

    category = get_category(bmi)
    tip = get_tip(category)

    water = get_water(weight)
    calories = get_calories(
        weight,
        gender
    )

    conn = sqlite3.connect(
        "database.db"
    )

    cur = conn.cursor()

    cur.execute("""
    INSERT INTO bmi_history
    (
        name,
        age,
        gender,
        height,
        weight,
        bmi,
        category,
        created_at
    )
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?)
    """,
    (
        name,
        age,
        gender,
        height,
        weight,
        bmi,
        category,
        datetime.now().strftime(
            "%d-%m-%Y %H:%M:%S"
        )
    ))

    conn.commit()
    conn.close()

    return jsonify({

        "success": True,

        "bmi": bmi,

        "category": category,

        "tip": tip,

        "water": water,

        "calories": calories
    })


# ---------------- HISTORY ---------------- #

@app.route("/get_history")
def get_history():

    conn = sqlite3.connect(
        "database.db"
    )

    conn.row_factory = sqlite3.Row

    cur = conn.cursor()

    cur.execute("""
    SELECT *
    FROM bmi_history
    ORDER BY id DESC
    """)

    rows = cur.fetchall()

    conn.close()

    history = []

    for row in rows:
        history.append(
            dict(row)
        )

    return jsonify(history)


# ---------------- STATS ---------------- #

@app.route("/stats")
def stats():

    conn = sqlite3.connect(
        "database.db"
    )

    cur = conn.cursor()

    cur.execute(
        "SELECT COUNT(*) FROM bmi_history"
    )

    total_users = cur.fetchone()[0]

    cur.execute(
        "SELECT AVG(bmi) FROM bmi_history"
    )

    avg = cur.fetchone()[0]

    conn.close()

    if avg is None:
        avg = 0

    return jsonify({

        "total_users":
        total_users,

        "average_bmi":
        round(avg, 2)
    })


# ---------------- BMI CHART ---------------- #

@app.route("/chart")
def chart():

    conn = sqlite3.connect(
        "database.db"
    )

    cur = conn.cursor()

    cur.execute("""
    SELECT bmi
    FROM bmi_history
    ORDER BY id DESC
    LIMIT 10
    """)

    rows = cur.fetchall()

    conn.close()

    values = [
        row[0]
        for row in rows
    ][::-1]

    if len(values) == 0:
        values = [0]

    plt.figure(
        figsize=(7, 4)
    )

    plt.plot(
        values,
        marker="o"
    )

    plt.title(
        "BMI Trend"
    )

    plt.xlabel(
        "Records"
    )

    plt.ylabel(
        "BMI"
    )

    plt.grid(True)

    path = os.path.join(
        "static",
        "bmi_chart.png"
    )

    plt.savefig(path)
    plt.close()

    return jsonify({
        "chart":
        "/static/bmi_chart.png"
    })


# ---------------- START ---------------- #

import os

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )