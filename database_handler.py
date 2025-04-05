from redis import Redis
from bcrypt import checkpw, gensalt, hashpw

from private_data import host, port, password



### RedisDB Object on Cloud

redisObj = Redis(
    host=host, port=port, decode_responses=True,
    username="default", password=password,
)



### Functions to add and retrieve Patients and Hospitals

def add_patient(aadharId: str, *data):
    '''
    This function will add Patient details.
    '''

    redisObj.json().set(aadharId, "$", data)

def get_patient(aadharId: str):
    '''
    This function will retrieve Patient details.
    '''
    
    data = redisObj.json().get(aadharId)
    return {"fullName": data[0], "password": data[1]}

def add_hospital(nationalId: str, *data):
    '''
    This function will add Hospital details.
    '''

    redisObj.json().set(nationalId, "$", data)

def get_hospital(nationalId: str):
    '''
    This function will retirieve Hospital details.
    '''

    data = redisObj.json().get(nationalId)
    return {"fullName": data[0], "password": data[1]}



class Patient:
    salt = gensalt()

    @staticmethod
    def add_data(aadharId: str, fullName: str, password: str):
        redisObj.json().set(aadharId, "$", [fullName, 
            hashpw(password.encode(), Patient.salt).decode()])

    @staticmethod
    def check_pw(aadharId: str, password: str):
        return checkpw(password.encode(), Patient.get_data(aadharId)[1].encode())

    @staticmethod
    def get_data(aadharId: str):
        return redisObj.json().get(aadharId)
    

d = {"aadharId": "1234", "fullName": "Anubhav Jain", "password": "Anubhav@1234"}

Patient.add_data(*d.values())

print(Patient.get_data("1234"))