from flask import Flask, request, jsonify
from flask_cors import CORS

from sqlalchemy.schema import Column
from sqlalchemy.types import BLOB, String

from flask_sqlalchemy import SQLAlchemy

from bcrypt import hashpw, gensalt, checkpw
import asyncio as asy

from manager import assign_account, get_data, add_data

from helper import generate_token, decode_token
from private_data import uri, secret_key

app = Flask("Medicords"); CORS(app);
app.config['SQLALCHEMY_DATABASE_URI'] = uri
db = SQLAlchemy(app)

app.config['SECRET_KEY'] = secret_key



### Patients Table ORM

class Patients(db.Model):
    '''
    This is the ORM for MySQL DataBase table Patients.
    '''
    
    aadharId = Column(String(12), primary_key=True)
    fullName = Column(String(30), nullable=False)
    password = Column(BLOB, nullable=False)
    
    def __init__(self, aadharId: str, fullName: str, password: str):
        '''
        It assigns the values to the fiels of the ORM.
        '''
        
        self.aadharId, self.fullName = aadharId, fullName
        self.password = hashpw(password.encode(), gensalt())

    def check_pw(self, password: str):
        '''
        It checks whether the password entered matches or not.
        '''
        
        return checkpw(password.encode(), self.password)
    
    def get_data(self):
        '''
        Returns the patient details as a dictionary.
        '''

        return {
            "aadharId": self.aadharId, "name": self.fullName
        }



### Hospitals Table ORM

class Hospitals(db.Model):
    '''
    This is the ORM for MySQL DataBase table Hospitals.
    '''
    
    nationalId = Column(String(10), primary_key=True)
    hospitalName = Column(String(30), nullable=False)
    password = Column(BLOB, nullable=False)
    
    def __init__(self, nationalId: str, hospitalName: str, password: str):
        '''
        It assigns the values to the fiels of the ORM.
        '''
        
        self.nationalId, self.hospitalName = nationalId, hospitalName
        self.password = hashpw(password.encode(), gensalt())

    def check_pw(self, password: str):
        '''
        It checks whether the password entered matches or not.
        '''
        
        return checkpw(password.encode(), self.password)
    
    def get_data(self):
        '''
        Returns the hospital details as a dictionary.
        '''

        return {
            "nationalId": self.nationalId, "name": self.hospitalName
        }
        


@app.route("/login", methods=["POST"])
def login():
    '''
    This API will handle Login Requests
    '''

    data = request.get_json(); passwd = data["password"]

    print(data)
    
    if (data["type"] == "hospitals"):
        return hospital_login(data["nationalId"], passwd)
    else: return patient_login(data["aadharId"], passwd)

@app.route("/signup", methods=["POST"])
def signup():
    '''
    This API will handle Signup Requests
    '''

    data = request.get_json(); name, passwd = data["name"], data["password"]

    if (data["type"] == "hospitals"):
        return hospital_signup(data["nationalId"], name, passwd)
    else: return patient_signup(data["aadharId"], name, passwd)

@app.route("/get-data", methods=["POST"])
def getdata():
    '''
    This API will decode the token and return data
    '''

    id = decode_token(secret_key, request.get_json()["token"])
    return patient_data(id) if (len(id) == 12) else hospital_data(id)


### Patient Interaction Functions

def patient_login(aadharId: str, password: str):
    '''
    The function for handling Patient Login requests.
    '''
    
    user = Patients.query.filter_by(aadharId=aadharId).first()

    if (not user): return "AadharId"
    elif (not user.check_pw(password)): return "Password"
    
    return generate_token(secret_key, aadharId)

def patient_signup(aadharId: str, name: str, password: str):
    '''
    The function for handling Patient Signup requests. It also assigns a blockchain account to the patient.
    '''
    
    user = Patients.query.filter_by(aadharId=aadharId).first()

    if (user): return "Failure"
    asy.run(assign_account(aadharId))

    db.session.add(Patients(aadharId, name, password))
    db.session.commit()
    
    return generate_token(secret_key, aadharId)

def patient_data(aadharId: str):
    '''
    The function for sending patient credentials and medical data.
    '''

    user = Patients.query.filter_by(aadharId=aadharId).first()

    if (not user): return jsonify({"cred": "Failure"})
    
    records = asy.run(get_data(aadharId))
    return jsonify({"cred": user.get_data(), "records": records})



### Hospital Interaction Functions

def hospital_login(nationalId: str, password: str):
    '''
    The function for handling Hospital Login requests.
    '''
    
    user = Hospitals.query.filter_by(nationalId=nationalId).first()

    if (not user): return "NationalId"
    elif (not user.check_pw(password)): return "Password"
    
    return generate_token(secret_key, nationalId)

def hospital_signup(nationalId: str, name: str, password: str):
    '''
    The function for handling Hospital Signup requests. It also assigns a blockchain account to the hospital.
    '''
    
    user = Hospitals.query.filter_by(nationalId=nationalId).first()

    if (user): return "Failure"
    asy.run(assign_account(nationalId))

    db.session.add(Hospitals(nationalId, name, password))
    db.session.commit()

    return generate_token(secret_key, nationalId)

def hospital_data(nationalId: str):
    '''
    The function for sending hospital credentials and medical data.
    '''

    user = Hospitals.query.filter_by(nationalId=nationalId).first()

    if (not user): return jsonify({"cred": "Failure"})
    
    records = asy.run(get_data(nationalId))
    return jsonify({"cred": user.get_data(), "records": records})



### Hospital Functions adding records

@app.route("/add-record", methods=["POST"])
def add_record():
    data = request.get_json()
    
    user = Patients.query.filter_by(
        aadharId=data["client_id"]).first()

    if (not user): return "AadharId"
    date = asy.run(add_data(**data))

    return date



if __name__ == "__main__":
    app.run(debug=True)