from flask import Flask, request, jsonify, send_from_directory
import sqlite3

app = Flask(__name__)

# ==============================
# DATABASE SETUP
# ==============================

def init_db():
    conn = sqlite3.connect("visitors.db")
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            mobile TEXT,
            flat TEXT,
            purpose TEXT,
            status TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# ==============================
# ROUTES
# ==============================

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/dashboard')
def dashboard():
    return send_from_directory('.', 'dashboard.html')

@app.route('/host')
def host():
    return send_from_directory('.', 'host.html')

@app.route('/style.css')
def style():
    return send_from_directory('.', 'style.css')

@app.route('/script.js')
def script():
    return send_from_directory('.', 'script.js')

# ==============================
# API ROUTES
# ==============================

@app.route('/add_visitor', methods=['POST'])
def add_visitor():
    data = request.json

    conn = sqlite3.connect("visitors.db")
    c = conn.cursor()
    c.execute('''
        INSERT INTO visitors (name, mobile, flat, purpose, status)
        VALUES (?, ?, ?, ?, ?)
    ''', (data['name'], data['mobile'], data['flat'], data['purpose'], "Pending"))
    conn.commit()
    conn.close()

    return jsonify({"message": "Visitor Added"})


@app.route('/get_visitors')
def get_visitors():
    conn = sqlite3.connect("visitors.db")
    c = conn.cursor()
    c.execute("SELECT * FROM visitors")
    rows = c.fetchall()
    conn.close()

    visitors = []
    for row in rows:
        visitors.append({
            "id": row[0],
            "name": row[1],
            "mobile": row[2],
            "flat": row[3],
            "purpose": row[4],
            "status": row[5]
        })

    return jsonify(visitors)


@app.route('/update_status/<int:id>', methods=['POST'])
def update_status(id):
    data = request.json
    conn = sqlite3.connect("visitors.db")
    c = conn.cursor()
    c.execute("UPDATE visitors SET status=? WHERE id=?", (data['status'], id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Status Updated"})


if __name__ == '__main__':
    app.run(debug=True)