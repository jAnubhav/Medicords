from flask import Flask, request, jsonify
from flask_cors import CORS

from sqlalchemy.schema import Column
from sqlalchemy.types import BLOB, String

from flask_sqlalchemy import SQLAlchemy

from bcrypt import hashpw, gensalt, checkpw
import asyncio as asy

from manager import assign_account, get_accout_data

from helper import generate_token, decode_token
from private_data import uri, secret_key

app = Flask("Medicords"); CORS(app);
app.config['SQLALCHEMY_DATABASE_URI'] = uri
db = SQLAlchemy(app)

app.config['SECRET_KEY'] = secret_key

class Patients(db.Model):
    '''
    This is the ORM for MySQL DataBase table Patients.
    '''
    
    aadharId = Column(String(12), primary_key=True)
    fullName = Column(String(30), nullable=False)
    password = Column(BLOB, nullable=False)
    
    def __init__(self, aadharId, fullName, password):
        '''
        It assigns the values to the fiels of the ORM.
        '''
        
        self.aadharId, self.fullName = aadharId, fullName
        self.password = hashpw(password.encode(), gensalt())

    def check_pw(self, password):
        '''
        It checks whether the password entered matches or not.
        '''
        
        return checkpw(password.encode(), self.password)

@app.route("/login", methods=["POST"])
def sign_in():
    '''
    The API for handling Login requests.
    '''
    
    data = request.get_json(); aadharId = data["aadharId"]
    user = Patients.query.filter_by(aadharId=aadharId).first()

    if (not user): return "AadharId"
    elif (not user.check_pw(data["password"])): 
        return "Password"
    
    return generate_token(secret_key, aadharId)

@app.route("/signup", methods=["POST"])
def create_account():
    '''
    The API for handling Signup requests. It also assigns a blockchain account to the patient.
    '''
    
    data = request.get_json(); aadharId = data["aadharId"]
    user = Patients.query.filter_by(aadharId=aadharId).first()

    if (user): return "Failure"; asy.run(assign_account(aadharId))

    db.session.add(Patients(**data)); db.session.commit()
    return generate_token(secret_key, aadharId)

@app.route("/get-data", methods=["POST"])
def get_data():
    '''
    The API for decoding the Token and sending user credentials and medical data
    '''

    aadharId = decode_token(secret_key, request.get_json()["token"])
    res = asy.run(get_accout_data(aadharId))
    
    return aadharId;

if __name__ == "__main__":
    app.run(debug=True)