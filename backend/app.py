from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from pymongo import MongoClient
import config  # For MongoDB URI configuration
from datetime import datetime, timedelta
import jwt
from functools import wraps
from bson import ObjectId  # Import ObjectId to convert the user_id for MongoDB query

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# MongoDB connection
client = MongoClient(config.MONGO_URI)
db = client['user_db']
users = db['users']

db.users.create_index("email", unique=True)
db.users.create_index("username", unique=True)

# Decorator to check if the user is authenticated
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"msg": "Token is missing!"}), 403
        try:
            token = token.split(" ")[1]  # Remove 'Bearer' prefix
            data = jwt.decode(token, config.JWT_SECRET, algorithms=["HS256"])
            current_user = users.find_one({"_id": ObjectId(data['user_id'])})
        except Exception as e:
            return jsonify({"msg": "Token is invalid!"}), 403
        return f(current_user, *args, **kwargs)
    return decorated_function

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Validate required fields
    required_fields = ['username', 'email', 'password', 'mobile']
    for field in required_fields:
        if field not in data or not data[field].strip():
            return jsonify({"msg": f"{field} is required"}), 400

    # Check for existing username or email
    existing_user = users.find_one({"$or": [{"username": data['username']}, {"email": data['email']}]})

    if existing_user:
        return jsonify({"msg": "Username or email already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Create the user object
    user = {
        "username": data['username'],
        "email": data['email'],
        "password": hashed_password,
        "mobile": data['mobile']
    }

    # Insert the user into the database
    try:
        users.insert_one(user)
        return jsonify({"msg": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"msg": "Error creating user", "error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    # Get JSON data from the request
    data = request.get_json()

    # Check if the email or username exists in the database
    user = users.find_one({
        "$or": [
            {"email": data['email']},
            {"username": data['username']}
        ]
    })

    if user:
        # Check if the password matches (hashed password comparison)
        if bcrypt.check_password_hash(user['password'], data['password']):
            # Create a JWT token with the user's id (or any other info you want to include)
            token = jwt.encode(
                {"user_id": str(user['_id']), "exp": datetime.utcnow() + timedelta(hours=1)},  # expires in 1 hour
                config.JWT_SECRET,  # Secret key from your config
                algorithm="HS256"
            )
            return jsonify({"success": True, "msg": "Login successful", "token": token}), 200
        else:
            # Invalid password
            return jsonify({"success": False, "msg": "Invalid credentials"}), 401
    else:
        # User not found
        return jsonify({"success": False, "msg": "Invalid credentials"}), 401

@app.route('/user-info', methods=['GET'])
@token_required
def get_user_info(current_user):
    # Return user information
    if current_user:
        return jsonify({
            "user": {
                "username": current_user["username"],
                "email": current_user["email"],
                "mobile": current_user["mobile"]
            }
        }), 200
    return jsonify({"msg": "User not found!"}), 404

if __name__ == '__main__':
    app.run(debug=True)
