from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from pymongo import MongoClient
import config  # For MongoDB URI configuration
from datetime import datetime, timedelta
import jwt


app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# MongoDB connection
client = MongoClient(config.MONGO_URI)
db = client['user_db']
users = db['users']

db.users.create_index("email", unique=True)
db.users.create_index("username", unique=True)


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print("Data",data)
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = {
        "usename": data['username'],
        "email": data['email'],
        "password": hashed_password,
        "mobile": data['mobile'],
        "created_at": datetime.utcnow(),

    }
    users.insert_one(user)
    return jsonify({"msg": "User created"}), 201

@app.route('/login', methods=['POST'])
def login():
    # Get JSON data from the request
    data = request.get_json()
    
    # Check if the email exists in the database
    user = users.find_one({"email": data['email']})
    
    if user:
        # Check if the password matches (hashed password comparison)
        if bcrypt.check_password_hash(user['password'], data['password']):
            # Successful login, you can add more info if needed (e.g., JWT token)
            return jsonify({"success": True, "msg": "Login successful"}), 200
        else:
            # Invalid password
            return jsonify({"success": False, "msg": "Invalid credentials"}), 401
    else:
        # User not found
        return jsonify({"success": False, "msg": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True)
