from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import config  # For MongoDB URI configuration
from datetime import datetime, timedelta
import jwt
from functools import wraps
from bson import ObjectId  # Import ObjectId to convert the user_id for MongoDB query
import os
from pymongo import MongoClient
from bson.objectid import ObjectId
import random
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from flask_uploads import UploadSet, configure_uploads, IMAGES



from flask import Flask, request, jsonify
from functools import wraps
import bcrypt
import jwt
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson.objectid import ObjectId
import config


app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# MongoDB connection
client = MongoClient(config.MONGO_URI)
db = client['user_db']
users = db['users']
content = db['content']

app.config['JWT_SECRET'] = 'mosin'
photos = UploadSet("photos", IMAGES)

db.users.create_index("email", unique=True)
db.users.create_index("username", unique=True)


UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Decorator to check if the user is authenticated


# Token required decorator
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
            try:
                token = jwt.encode(
                    {"user_id": str(user['_id']), "exp": datetime.utcnow() + timedelta(hours=1)},  # expires in 1 hour
                    config.JWT_SECRET,  # Secret key from your config
                    algorithm="HS256"
                )
                print(f"JWT Token: {token}")  # Print the generated token
                return jsonify({"success": True, "msg": "Login successful", "token": token}), 200
            except Exception as e:
                print(f"Error generating token: {str(e)}")
                return jsonify({"success": False, "msg": "Error generating token"}), 500
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
        avatar_url = (
            current_user.get("avatar", "default_avatar.png")
            if current_user.get("avatar", "")
            else "default_avatar.jpg"
        )  # Fallback to a default image if no avatar is set

        return jsonify({
            "user": {
                "username": current_user.get("username", ""),
                "email": current_user.get("email", ""),
                "mobile": current_user.get("mobile", ""),
                "bio": current_user.get("bio", ""),
                "website": current_user.get("website", ""),
                "gender": current_user.get("gender", ""),
                "fullName": current_user.get("fullName", ""),
                "avatar": f"/static/uploads/{avatar_url}" 
            }
        }), 200

    return jsonify({"msg": "User not found!"}), 404

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Route to upload files
@app.route('/upload', methods=['POST'])
@token_required
def upload_file(current_user):
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    
    file = request.files['file']
    description = request.form.get('description', '')  # Extract the description field
    title = request.form.get('title', '')
    subject = request.form.get('subject', '')
    
    print("description",description)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        

        # Insert file information into the database
        file_data = {
            "user_id": current_user['_id'],
            "username": current_user['username'],
            "email": current_user['email'],
            "file_name": filename,
            "file_path": file_path,
            "file_type": "image" if filename.split('.')[-1].lower() in ['png', 'jpg', 'jpeg', 'gif'] else "pdf",
            "description": description,  # Add the description field
            "subject": subject,  # Add the subject field
            "title": title,  # Add the title field
            
        }

        content.insert_one(file_data)

        return jsonify({"success": True, "msg": "File uploaded successfully"}), 200
    
    return jsonify({"msg": "Invalid file type"}), 400

# Route to get uploaded files
@app.route('/get-content', methods=['GET'])
@token_required
def get_content(current_user):
    files = content.find({"user_id": current_user['_id']})
    file_list = []
    for file in files:
        file_data = {
            "_id": str(file["_id"]),  # Ensure _id is returned as a string
            "name": file["file_name"],
            "url": file["file_path"],
            "type": file["file_type"],
            "title": file.get("title", ""),
            "subject": file.get("subject", ""),
            "description": file.get("description", ""),
            "avatar": file.get("avatar", "default_avatar.png") 
        }
        file_list.append(file_data)
    return jsonify({"files": file_list}), 200

@app.route('/update-profile', methods=['POST'])
def update_profile():
    try:
        # Get the data from the form
        username = request.form.get('username')
        full_name = request.form.get('fullName')
        website = request.form.get('website')
        bio = request.form.get('bio')
        email = request.form.get('email')
        phone = request.form.get('phone')
        gender = request.form.get('gender')
        avatar = request.files.get('file')  # Avatar file upload

        print(username, full_name, website, bio, email, phone, gender)

        # Check if user exists
        existing_user = users.find_one({"username": username})

        if not existing_user:
            return jsonify({"error": "Username is already taken."}), 404

        # Handle file upload (avatar)
        avatar_path = None
        if avatar and allowed_file(avatar.filename):
            filename = secure_filename(avatar.filename)  # Secure the filename
            avatar_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)  # Absolute path
            avatar.save(avatar_path)  # Save file to the upload folder
            avatar_path = f"{UPLOAD_FOLDER}/{filename}"  # Convert to relative path

        # Update the user's profile
        update_data = {
            "fullName": full_name,
            "website": website,
            "bio": bio,
            "email": email,
            "phone": phone,
            "gender": gender,
        }

        if avatar_path:  # Only update avatar if a new one is uploaded
            update_data["avatar"] = avatar_path

        users.update_one(
            {"username": username},
            {"$set": update_data}
        )

        return jsonify({"msg": "Profile updated successfully!", "avatar": avatar_path}), 200

    except Exception as e:
        print(f"Error: {e}")  # Log the error for debugging
        return jsonify({"error": "Failed to update profile."}), 500

@app.route('/delete-file/<file_id>', methods=['DELETE'])
@token_required
def delete_file(current_user, file_id):
    try:
        # Find the file by ID
        file = content.find_one({"_id": ObjectId(file_id), "user_id": current_user["_id"]})
        if not file:
            return jsonify({"msg": "File not found or not authorized"}), 404
        
        # Remove the file from the file system
        file_path = file["file_path"]
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Remove the file record from the database
        content.delete_one({"_id": ObjectId(file_id)})

        return jsonify({"success": True, "msg": "File deleted successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"msg": "Error deleting file", "error": str(e)}), 500


    

@app.route('/random-images', methods=['GET'])
def get_random_images():
    try:
        # Fetch all images from the content collection
        images = list(content.find({"file_type": "image"}))  # Filter only image files
        
        # Check if there are at least 10 images
        if len(images) < 10:
            return jsonify({"msg": "Not enough images in the database."}), 404
        
        # Select 10 random images
        random_images = random.sample(images, 10)

        # Format the response with image data and user info
        image_data = []
        for image in random_images:
            user = users.find_one({"_id": ObjectId(image["user_id"])})
            user_avatar = user.get("avatar", "default_avatar.jpg")
            image_data.append({
                "id": str(image["_id"]),
                "image": f"/static/uploads/{image['file_name']}",
                "caption": image.get("description", ""),
                "likes": random.randint(1, 100),  # Mock data for likes
                "user": user.get("username", ""),
                "avatar": f"/static/uploads/{user_avatar}"  # User's avatar
            })

        return jsonify({"posts": image_data}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"msg": "Error fetching random images", "error": str(e)}), 500



@app.route('/user-profile/<username>', methods=['GET'])
def get_user_profile(username):
    try:
        # Fetch the user from the database by username
        user = users.find_one({"username": username})

        if not user:
            return jsonify({"msg": "User not found!"}), 404

        # Fetch the content (posts/images) uploaded by the user
        user_content = content.find({"user_id": user["_id"]})

        # Prepare user data
        user_data = {
            "username": user["username"],
            "email": user["email"],
            "fullName": user.get("fullName", ""),
            "bio": user.get("bio", ""),
            "avatar": user.get("avatar", "default_avatar.png")  # Default avatar if not set
        }

        # Prepare the content data
        content_data = []
        for post in user_content:
            content_data.append({
                "image": post["file_path"],  # Assuming file_path is the image URL
                "title": post.get("title", ""),
                "description": post.get("description", ""),
            })

        # Return user and content data
        return jsonify({
            "user": user_data,
            "content": content_data
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"msg": "Error fetching user profile."}), 500


if __name__ == '__main__':
    app.run(debug=True)
