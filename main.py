from flask import Flask, request, jsonify
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy

from bcrypt import hashpw, gensalt, checkpw
from jwt import encode, decode

from json import load
import asyncio as asy

from manager import assign_account, get_address, do_transaction

with open("./data/uri.json", "r") as f:
    uri = load(f)["uri"]

app = Flask("Medicords")
CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = uri
db = SQLAlchemy(app)

app.config['SECRET_KEY'] = "anubhav"









class User(db.Model):
    aadharId = db.Column(db.String(12), primary_key=True)
    fullname = db.Column(db.String(30), nullable=False)
    password = db.Column(db.BLOB, nullable=False)

    def __init__(self, aadharId, fullname, password):
        self.aadharId, self.fullname = aadharId, fullname
        self.password = hashpw(password.encode(), gensalt())

    def check_pw(self, password):
        return checkpw(password.encode(), self.password)







@app.route("/create-account", methods=["POST"])
def create_account():
    data = request.get_json(); aadharId = data["aadharId"]

    if (User.query.filter_by(aadharId=aadharId).first()):
        return jsonify({"message": "Failure"})
    
    data_obj = User(aadharId, data["fullName"], data["password"])
    db.session.add(data_obj); db.session.commit()

    auth_token = encode({"aadharId": aadharId}, 
                    app.config["SECRET_KEY"], algorithm="HS256")
    
    asy.run(assign_account(int(aadharId))); print("Account Created")
    return jsonify({"message": "Success", "token": auth_token})











@app.route("/sign-in", methods=["POST"])
def sign_in():
    data = request.get_json(); aadharId = data["aadharId"]
    user = User.query.filter_by(aadharId=aadharId).first()
    
    if (not user): return jsonify({"message": "AadharId"}) 
    if (not user.check_pw(data["password"])): 
        return jsonify({"message": "Password"})

    auth_token = encode({"aadharId": aadharId}, 
                    app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({"message": "Success", "token": auth_token})









@app.route("/decode-token", methods=["POST"])
def decode_token():
    data = request.get_json(); token = data["token"]

    aadharId = decode(token, app.config["SECRET_KEY"], 
                      algorithms=["HS256"])["aadharId"]
    
    record = asy.run(get_address())["account_address"]

    return jsonify({"cred":[aadharId, User.query.filter_by(
        aadharId=aadharId).first().fullname], "rec":record})










@app.route("/add-record", methods=["POST"])
def add_record():
    data = request.get_json()
    asy.run(do_transaction(data))

    return "Success"









if __name__ == "__main__":
    app.run(debug=True)