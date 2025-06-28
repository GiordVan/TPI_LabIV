from jwt import encode, decode

# Usa una clave de al menos 32 caracteres
SECRET_KEY = "f8e7c0d93a2b4f1a8e5d7c0b3f4a1e9d5a7b2c8f1e0d3a9b7c6f5e4d2a1b8c0d"

def create_token(data: dict) -> str:
    token: str = encode(payload=data, key=SECRET_KEY, algorithm="HS256")
    return token

def validate_token(token: str) -> dict:
    data: dict = decode(token, key=SECRET_KEY, algorithms=["HS256"])
    return data