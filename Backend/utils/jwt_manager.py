from jwt import encode, decode
from datetime import datetime, timedelta
from dotenv import load_dotenv
from os import getenv

load_dotenv()

SECRET_KEY = getenv("SECRET_KEY", "clavesecretaauxiliarparacasosdeemergencia")
ALGORITHM = getenv("ALGORITHM", "HS256")

def create_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=1)
    to_encode.update({"exp": expire})
    token = encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return token

def validate_token(token: str) -> dict:
    return decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
