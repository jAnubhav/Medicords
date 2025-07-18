from redis import Redis
from bcrypt import checkpw, gensalt, hashpw

from private_data import host, port, password



### RedisDB Object on Cloud

redisObj = Redis(
    host=host, port=port, decode_responses=True,
    username="default", password=password,
)



### Functions to add and retrieve Patients and Hospitals

def add(clientId: str, name: str, password: str):
    '''
    Adds a Key-Value pair to Redis with hashed password.
    '''
    hashed = hashpw(password.encode(), gensalt()).decode()
    redisObj.json().set(clientId, "$", {"name": name, "password": hashed})

def retrieve(clientId: str):
    '''
    Retrieves user data from Redis.
    '''
    return redisObj.json().get(clientId) or {}

def check_pw(plain_password: str, hashed_password: str):
    '''
    Checks if a plaintext password matches the hashed password.
    '''
    return checkpw(plain_password.encode(), hashed_password.encode('utf-8'))

def get(key: str, clientId: str):
    '''
    Returns dashboard data.
    '''
    data = redisObj.json().get(clientId)
    if type(data) is not dict: return {key: clientId}
    return {key: clientId, "name": data["name"]}
