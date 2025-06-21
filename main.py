from quart import Quart, request, jsonify
from quart_cors import cors

from controller import assign_account, get_data, add_data

from repository import generate_token, decode_token
from private_data import secret_key

from database_handler import *



### Quart App

app = Quart("Medicords"); cors(app)
app.secret_key = secret_key



### Routes

@app.route("/login", methods=["POST"])
async def login():
    '''
    This API will handle Login Requests
    '''

    data = await request.get_json(); password = data["password"]
    client_id = data["aadharId"] + data["nationalId"]

    user = retrieve(client_id)

    if (not user): return "Failure"
    elif (not check_pw(password, user["password"])): return "Password"
    
    return generate_token(secret_key, client_id)

@app.route("/signup", methods=["POST"])
async def signup():
    '''
    This API will handle Signup Requests
    '''

    data = await request.get_json()
    client_id = data["aadharId"] + data["nationalId"]

    user = retrieve(client_id)

    if (user): return "Failure"
    await assign_account(client_id)

    add(client_id, data["name"], data["password"])
    
    return generate_token(secret_key, client_id)

@app.route("/get-data", methods=["POST"])
async def get_user_data():
    '''
    This API will decode the token and return data
    '''

    cli_id = decode_token(secret_key, (await request.get_json())["token"])
    key, user = "aadharId" if (len(cli_id) == 12) else "nationalId", retrieve(cli_id)

    if (not user): return jsonify({"cred": "Failure"})
    
    records = await get_data(cli_id)
    return jsonify({"cred": get(key, cli_id), "records": records})



### Hospital Functions adding records

@app.route("/add-record", methods=["POST"])
async def add_record():
    data = await request.get_json()
    user = retrieve(data["client_id"])

    if (not user): return "AadharId"
    date = await add_data(**data)

    return date



if __name__ == "__main__":
    app.run(debug=True, port=5000)