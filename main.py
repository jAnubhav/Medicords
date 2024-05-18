# from web3 import Web3
# from solcx import compile_source
from json import load
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from random import randrange

# with open("./static/data/data.json", "r") as f:
#     dataJson = load(f)
# w3 = Web3(Web3.HTTPProvider(dataJson['url']))
# build_data = {"chainId": dataJson['chainId'], "from": dataJson['wallet']}

# with open("./contracts/records.sol", "r") as f:
#     _, interface = compile_source(f.read(), output_values=['abi', 'bin'], solc_version="0.8.23").popitem()
# abi, bytecode = interface['abi'], interface['bin']

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:anubhav@localhost/medicords'
db = SQLAlchemy(app)

class Patientrecords(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    phone = db.Column(db.String(10))
    email = db.Column(db.String(30))
    dob = db.Column(db.Date)
    gender = db.Column(db.String(10))
    bloodGroup = db.Column(db.String(10))
    password = db.Column(db.String(40))

class Hospitalrecords(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    phone = db.Column(db.String(10))
    email = db.Column(db.String(30))
    website = db.Column(db.String(30))
    password = db.Column(db.String(40))

def generatePatientId():
    data = db.session.execute(text("select id from patientrecords"))
    data = data.fetchall()
    data = [i[0] for i in data]
    while (True):
        value = randrange(100000000, 1000000000)
        if (value not in data):
            break
    return value

def generateHospitalId():
    data = db.session.execute(text("select id from hospitalrecords"))
    data = data.fetchall()
    data = [i[0] for i in data]
    while (True):
        value = randrange(100000, 1000000)
        if (value not in data):
            break
    return value

# def getBuildData():
#     return build_data | {"gasPrice": w3.eth.gas_price*2, "nonce": w3.eth.get_transaction_count(dataJson['wallet'])}

# def performTxn(txn):
#     signed_txn = w3.eth.account.sign_transaction(txn, private_key = dataJson['privateKey'])
#     txn_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
#     return w3.eth.wait_for_transaction_receipt(txn_hash)

# def runConstructor():
#     txn = w3.eth.contract(abi = abi, bytecode = bytecode).constructor().build_transaction(getBuildData())
#     return w3.eth.contract(performTxn(txn)['contractAddress'], abi=abi)

# def addData(patientId, age, symptoms, diagnosis, treatment, hospitalName):
#     txn = contract.functions.addRecord(patientId, age, symptoms, diagnosis, treatment, hospitalName).build_transaction(getBuildData())
#     _ = performTxn(txn)

# def retrieveData(patientId, index):
#     return contract.functions.getRecord(patientId, index).call()

# def retrieveRecords(patientId):
#     return [contract.functions.getRecords(patientId).call(), contract.functions.getLength(patientId).call()]

@app.route("/")
def home():
    return render_template("index.html", file="style", title="A Simple Solution for Safety")

@app.route("/patient/login")
def loginForPatients():
    return render_template("login.html", file="login", title="Log In for Patients", user="Patient")

@app.route("/hospital/login")
def loginForHospitals():
    return render_template("login.html", file="login", title="Log In for Hospitals", user="Hospital")

@app.route("/patient/signup")
def signupForPatients():
    return render_template("signup.html", file="login", title="Sign Up for Patients", user="Patient")

@app.route("/hospital/signup")
def signupForHospitals():
    return render_template("signup.html", file="login", title="Sign Up for Hospitals", user="Hospital")

@app.route("/patient/dashboard", methods=["GET", "POST"])
def patientDash():
    if (request.method == "POST"):
        username = request.form.get("username")
        password = request.form.get("password")

        if (username == None):
            name = request.form.get("name")
            email = request.form.get("email")
            phone = request.form.get("phone")
            dob = request.form.get("dob")
            gender = request.form.get("gender")
            bloodGroup = request.form.get("bloodGroup")
            password = request.form.get("password")

            entry = Patientrecords(id=generatePatientId(), name=name, phone=phone, email=email, dob=dob, gender=gender, bloodGroup=bloodGroup, password=password)

            db.session.add(entry)
            db.session.commit()
        else:
            data = db.session.get(Patientrecords, username)
    print(data.name)
    return "Nothing"

@app.route("/hospital/dashboard", methods=["GET", "POST"])
def hospitalDash():
    if (request.method == "POST"):
        username = request.form.get("username")
        password = request.form.get("password")

        if (username == None):
            name = request.form.get("name")
            email = request.form.get("email")
            phone = request.form.get("phone")
            website = request.form.get("website")
            password = request.form.get("password")

            entry = Hospitalrecords(id=generateHospitalId(), name=name, phone=phone, email=email, website=website, password=password)

            db.session.add(entry)
            db.session.commit()
        else:
            data = db.session.get(Hospitalrecords, username)
    return render_template("hospitaldash.html", file="hospitaldash", title="Hospital Dashboard", id=data.id, name=data.name, email=data.email, phone=data.phone, website=data.website)

@app.route("/success", methods=["GET", "POST"])
def success():
    if (request.method == "POST"):
        username = int(request.form.get("username"))
        name = request.form.get("name")
        age = int(request.form.get("age"))
        symptoms = request.form.get("symptoms")
        diagnosis = request.form.get("diagnosis")
        treatment = request.form.get("treatment")
        print(username, name, age, symptoms, diagnosis, treatment)
        addData(username, age, symptoms, diagnosis, treatment, name)
    return render_template("success.html", file="style", title="Success")

contract = runConstructor()

@app.route("/allrecords", methods=["GET", "POST"])
def allRecords():
    if request.method == "POST":
        username = int(request.form.get("username2"))
        print(retrieveRecords(username))
    return render_template("data.html", file="data", title="All Records")

if __name__ == "__main__":
    app.run(debug=True)
