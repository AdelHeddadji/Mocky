from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
import boto3
import bcrypt
import os
from dotenv import load_dotenv
import uuid
from google.oauth2 import id_token
from google.auth.transport import requests
import uvicorn
from datetime import datetime
from boto3.dynamodb.conditions import Key

load_dotenv()

app = FastAPI()
origins = ["*"]  # Update this in production

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AWS Configuration
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
USERS_TABLE = os.getenv('DDB_USERS_TABLE')

if not all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, USERS_TABLE]):
    raise Exception("Missing AWS configuration in .env file")

dynamodb_client = boto3.client(
    'dynamodb',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

# Describe the table to get the schema
response = dynamodb_client.describe_table(TableName=USERS_TABLE)
print("Table Schema:", response['Table']['KeySchema'])

dynamodb = boto3.resource(
    'dynamodb',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

user_table = dynamodb.Table(USERS_TABLE)

# Google Client ID
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
if not GOOGLE_CLIENT_ID:
    raise Exception("Missing GOOGLE_CLIENT_ID in environment variables.")

# Pydantic models
class UserSignUp(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: EmailStr
    password: str

class GoogleAuth(BaseModel):
    token: str

def create_user(email, password=None, is_google_account=False):
    user_item = {
        "username": email,
        "createdAt": str(datetime.utcnow()),
        "is_google_account": is_google_account,
    }
    if not is_google_account and password:
        user_item["password"] = password
    user_table.put_item(Item=user_item)

@app.get("/users/{user_id}")
def read_user(user_id: str):
    response = user_table.get_item(Key={"username": user_id})
    item = response.get("Item")
    if item:
        print(item)
        return item
    else:
        return {"message": "User not found"}

@app.post("/login")
def login(user: UserLogin):
    username = user.username.lower()
    password = user.password

    # Fetch user from DynamoDB
    response = user_table.get_item(Key={"username": username})
    if "Item" not in response:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    user_item = response["Item"]
    stored_password_hash = user_item.get("password")
    is_google_account = user_item.get("is_google_account", False)

    if is_google_account:
        raise HTTPException(status_code=400, detail="Please log in with Google.")

    if not stored_password_hash or not bcrypt.checkpw(
        password.encode("utf-8"), stored_password_hash.encode("utf-8")
    ):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Login successful
    return {"message": "Login successful"}

@app.post("/signup")
def signup(user: UserSignUp):
    email = user.email.lower()
    password = user.password

    if not email or not password:
        raise HTTPException(
            status_code=400, detail="Email and password are required."
        )

    # Check if user already exists
    # response = user_table.get_item(Key={"username": email})
    response = user_table.query(KeyConditionExpression=Key('username').eq(email))
    if "Item" in response:
        raise HTTPException(status_code=400, detail="User already exists.")

    # Hash the password
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Create user
    create_user(email, password=password_hash, is_google_account=False)

    return {"message": "User registered successfully."}

@app.post("/google-login")
def google_login(data: GoogleAuth):
    token = data.token
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")

    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )

        # Get user info
        email = idinfo["email"].lower()

        # Check if user exists
        response = user_table.query(KeyConditionExpression=Key('username').eq(email))
        if "Item" not in response:
            # Create a new user
            create_user(email, is_google_account=True)
        else:
            user_item = response["Item"]
            if not user_item.get("is_google_account", False):
                raise HTTPException(
                    status_code=400,
                    detail="An account with this email already exists. Please log in with your email and password."
                )

        return {"message": "Login successful."}
    except ValueError:
        # Invalid token
        raise HTTPException(status_code=400, detail="Invalid token")

# api.py

@app.post("/google-signup")
def google_signup(data: GoogleAuth):
    token = data.token
    if not token:
        raise HTTPException(status_code=400, detail="Token is required.")

    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )

        # Get user info
        email = idinfo.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Email not available in token.")

        email = email.lower()

        # Check if user already exists
        response = user_table.query(KeyConditionExpression=Key('username').eq(email))
        if "Item" in response:
            raise HTTPException(status_code=400, detail="User already exists.")

        # Create user
        create_user(email, is_google_account=True)

        return {"message": "User registered successfully via Google."}
    except ValueError as ve:
        # Invalid token
        print(f"Invalid token: {ve}")
        raise HTTPException(status_code=400, detail="Invalid token.")
    except Exception as e:
        print(f"Error during Google signup: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")


if __name__ == "__main__":
    print("inside here")
    HOST = os.getenv("HOST", "127.0.0.1")
    PORT = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=HOST, port=PORT)
