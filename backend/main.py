from quart import Quart, request, jsonify
from quart_cors import cors

from controller import assign_account, get_data, add_data

from repository import generate_token, decode_token
from private_data import secret_key

from database_handler import *
from jwt.exceptions import InvalidSignatureError, DecodeError

import logging


### Quart App

app = Quart("Medicords"); cors(app)
app.secret_key = secret_key

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


### Routes

@app.route("/login", methods=["POST"])
async def login():
    try:
        data = await request.get_json(silent=True)
        if not data or "password" not in data or "aadharId" not in data or "nationalId" not in data:
            logger.warning("Login: Missing fields in request")
            return jsonify({"error": "Missing required fields"}), 400

        password = data["password"]
        client_id = data["aadharId"] + data["nationalId"]
        user = retrieve(client_id)

        if not user or type(user) is not dict:
            logger.info(f"Login failed: user {client_id} not found")
            return jsonify({"error": "User not found"}), 404
        elif not check_pw(password, user["password"]):
            logger.info(f"Login failed: wrong password for {client_id}")
            return jsonify({"error": "Incorrect password"}), 403

        token = generate_token(secret_key, client_id)
        logger.info(f"Login success for {client_id}")
        return jsonify({"token": token}), 200
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/signup", methods=["POST"])
async def signup():
    try:
        data = await request.get_json(silent=True)
        if not data or "aadharId" not in data or "nationalId" not in data or "name" not in data or "password" not in data:
            logger.warning("Signup: Missing fields in request")
            return jsonify({"error": "Missing required fields"}), 400

        client_id = data["aadharId"] + data["nationalId"]
        user = retrieve(client_id)

        if user:
            logger.info(f"Signup failed: user {client_id} already exists")
            return jsonify({"error": "User already exists"}), 409
        await assign_account(client_id)
        add(client_id, data["name"], data["password"])
        token = generate_token(secret_key, client_id)
        logger.info(f"Signup success for {client_id}")
        return jsonify({"token": token}), 201
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
@app.route("/get-data", methods=["POST"])
async def get_user_data():
    try:
        data = await request.get_json(silent=True)
        if not data or "token" not in data:
            logger.warning("Get-data: Missing token in request")
            return jsonify({"error": "Missing token"}), 400
        token = data.get("token")
        try:
            cli_id = decode_token(secret_key, token)
        except (InvalidSignatureError, DecodeError) as jwt_err:
            logger.warning(f"Get-data: Invalid or expired token: {jwt_err}")
            return jsonify({"error": "Invalid or expired token"}), 403
        except Exception as jwt_e:
            logger.error(f"Get-data: JWT decode error: {jwt_e}")
            return jsonify({"error": "Token decode error"}), 403
        key = "aadharId" if len(cli_id) == 12 else "nationalId"
        user = retrieve(cli_id)
        if not user:
            logger.info(f"Get-data: user {cli_id} not found")
            return jsonify({"cred": "Failure"}), 404
        records = await get_data(cli_id)
        logger.info(f"Get-data: data returned for {cli_id}")
        return jsonify({"cred": get(key, cli_id), "records": records})
    except Exception as e:
        logger.error(f"Get-data error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500




### Hospital Functions adding records

@app.route("/add-record", methods=["POST"])
async def add_record():
    try:
        data = await request.get_json(silent=True)
        if not data or "client_id" not in data:
            logger.warning("Add-record: Missing client_id in request")
            return jsonify({"error": "Missing client_id"}), 400
        user = retrieve(data["client_id"])
        if not user:
            logger.info(f"Add-record: user {data['client_id']} not found")
            return jsonify({"error": "AadharId not found"}), 404
        date = await add_data(**data)
        logger.info(f"Add-record: record added for {data['client_id']} on {date}")
        return jsonify({"date": date}), 201
    except Exception as e:
        logger.error(f"Add-record error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500



if __name__ == "__main__":
    app.run(debug=True, port=5000)