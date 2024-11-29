# config.py
import os

MONGO_URI = "mongodb://localhost:27017/"

JWT_SECRET = os.getenv('JWT_SECRET', 'mosin') 

# You can use a secure random key, or load it from environment variables for better security