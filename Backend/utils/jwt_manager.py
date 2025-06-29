from jwt import encode, decode
from dotenv import load_dotenv
from os import getenv

load_dotenv()

SECRET_KEY = getenv("SECRET_KEY", "clavesecretaauxiliarparacasosdeemergencia")
ALGORITHM = getenv("ALGORITHM", "HS256")

def create_token(data: dict) -> str:
    token: str = encode(payload=data, key=SECRET_KEY, algorithm=ALGORITHM)
    return token

def validate_token(token: str) -> dict:
    data: dict = decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
    return data