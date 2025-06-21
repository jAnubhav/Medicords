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
    This function will add Key-Value pair to Redis.
    '''
    
    redisObj.json().set(clientId, "$", [name, hashpw(
        password.encode(), gensalt()).decode()])

def retrieve(clientId: str):
    '''
    This function will retrieve Value based on the Key.
    '''

    return redisObj.json().get(clientId).__dict__

def check_pw(pass1: str, pass2: str):
    '''
    This function will check the entered password.
    '''

    return checkpw(pass1.encode(), pass2.encode())

def get(key: str, clientId: str):
    '''
    This function will return the data for the dashboard.
    '''

    data = redisObj.json().get(clientId)
    
    if (not data): return {key: clientId};
    return {key: clientId, "name": data[1]}