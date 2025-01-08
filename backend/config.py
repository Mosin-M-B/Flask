import os

# MongoDB URI
MONGO_URI = "mongodb://localhost:27017/"

# JWT Secret Key (you can set it via environment variable)
JWT_SECRET = os.getenv('JWT_SECRET', 'mosin')
