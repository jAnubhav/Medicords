from flask import Flask, request, jsonify
from flask_cors import CORS

from sqlalchemy.schema import Column
from sqlalchemy.types import BLOB, String

from flask_sqlalchemy import SQLAlchemy

from bcrypt import hashpw, gensalt, checkpw
from json import load, dump
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
            "aadharId": self.aadharId,
            "fullName": self.fullName
        }
    
    @staticmethod
    def user_query(aadharId: int):
        Patients.query.filter_by(aadharId=aadharId).first()



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
            "nationalId": self.nationalId,
            "hospitalName": self.hospitalName
        }
    
    @staticmethod
    def user_query(nationalId: int):
        Hospitals.query.filter_by(nationalId=nationalId).first()
        


### Patient Interaction Functions

@app.route("/patient-login", methods=["POST"])
def patient_login():
    '''
    The API for handling Patient Login requests.
    '''
    
    data = request.get_json(); aadharId = data["aadharId"]
    user = Patients.query.filter_by(aadharId=aadharId).first()

    if (not user): return "AadharId"
    elif (not user.check_pw(data["password"])): 
        return "Password"
    
    return generate_token(secret_key, "aadharId", aadharId)

@app.route("/patient-signup", methods=["POST"])
def patient_signup():
    '''
    The API for handling Patient Signup requests. It also assigns a blockchain account to the patient.
    '''
    
    data = request.get_json(); aadharId = data["aadharId"]
    user = Patients.query.filter_by(aadharId=aadharId).first()

    if (user): return "Failure"
    asy.run(assign_account("PT_" + aadharId))

    db.session.add(Patients(**data)); db.session.commit()
    return generate_token(secret_key, "aadharId", aadharId)

@app.route("/get-patient-data", methods=["POST"])
def get_patient_data():
    '''
    The API for decoding the Token and sending patient credentials and medical data.
    '''

    aadharId = decode_token(secret_key, "aadharId", request.get_json()["token"])
    user = Patients.query.filter_by(aadharId=aadharId).first()
    
    records = asy.run(get_data("PT_" + aadharId))
    return jsonify({"cred": user.get_data(), "records": records})



### Hospital Interaction Functions

@app.route("/hospital-login", methods=["POST"])
def hospital_login():
    '''
    The API for handling Hospital Login requests.
    '''
    
    data = request.get_json(); nationalId = data["nationalId"]
    user = Hospitals.query.filter_by(nationalId=nationalId).first()

    if (not user): return "NationalId"
    elif (not user.check_pw(data["password"])): 
        return "Password"
    
    return generate_token(secret_key, "nationalId", nationalId)

@app.route("/hospital-signup", methods=["POST"])
def hospital_signup():
    '''
    The API for handling Hospital Signup requests. It also assigns a blockchain account to the hospital.
    '''
    
    data = request.get_json(); nationalId = data["nationalId"]
    user = Hospitals.query.filter_by(nationalId=nationalId).first()

    if (user): return "Failure"
    asy.run(assign_account("MI_" + nationalId))

    db.session.add(Hospitals(**data)); db.session.commit()
    return generate_token(secret_key, "nationalId", nationalId)

@app.route("/get-hospital-data", methods=["POST"])
def get_hospital_data():
    '''
    The API for decoding the Token and sending hospital credentials and medical data.
    '''

    nationalId = decode_token(secret_key, "nationalId", request.get_json()["token"])
    user = Hospitals.query.filter_by(nationalId=nationalId).first()
    
    records = asy.run(get_data("MI_" + nationalId))
    return jsonify({"cred": user.get_data(), "records": records})



### Hospital Functions adding records

@app.route("/add-record", methods=["POST"])
def add_record():
    data = request.get_json(); recordId = 0;

    with open("recordId.json", "r") as f:
        recordId = load(f)["recordId"]
    
    user = Patients.query.filter_by(
        aadharId=data["aadharId"]).first()

    if (not user): return jsonify({"msg": "AadharId"})
    record = asy.run(add_data(recordId, **data))

    with open("recordId.json", "w") as f:
        dump({"recordId": recordId + 1}, f)
    
    return jsonify({"msg": "Success", "record": record})



if __name__ == "__main__":
    app.run(debug=True)