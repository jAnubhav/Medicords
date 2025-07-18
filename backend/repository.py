import logging
from datetime import datetime, timedelta
from aptos_sdk.account import Account
from aptos_sdk.async_client import RestClient, FaucetClient
from aptos_sdk.aptos_cli_wrapper import AptosCLIWrapper
from aptos_sdk.package_publisher import PackagePublisher

from aptos_sdk.transactions import EntryFunction, TransactionPayload

from jwt import encode, decode ,  InvalidSignatureError, DecodeError

from json import load

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

rest_client = RestClient("https://api.devnet.aptoslabs.com/v1")
faucet_client = FaucetClient("https://faucet.devnet.aptoslabs.com", rest_client)

publisher = PackagePublisher(rest_client)



### Blockchain-based Functions

async def publish_contract(account: Account, cdir: str, subdir: str) -> None:
    try:
        logger.info(f"Compiling and deploying contract for {account.account_address}...")
        meta, move = "package-metadata.bcs", "bytecode_modules/main.mv"
        address, amount = account.account_address, 100_000_000
        await faucet_client.fund_account(address, amount)
        AptosCLIWrapper.compile_package(cdir, {"Account": address})
        with open(f"{cdir}{subdir}{move}", "rb") as f: module = f.read()
        with open(f"{cdir}{subdir}{meta}", "rb") as f: mtdata = f.read()
        txn_hash = await publisher.publish_package(account, mtdata, [module])
        await rest_client.wait_for_transaction(txn_hash)
        logger.info(f"Contract published for {account.account_address}.")
    except Exception as e:
        logger.error(f"Error in publish_contract for {account.account_address}: {str(e)}")
        raise

async def entry_function(account: Account, func_name: str, args: list) -> None:
    try:
        logger.info(f"Calling entry function {func_name} for {account.account_address}...")
        address, amount = account.account_address, 100_000_000
        await faucet_client.fund_account(address, amount)
        pay = TransactionPayload(
            EntryFunction.natural(f"{address}::main", func_name, [], args))
        await rest_client.submit_and_wait_for_bcs_transaction(await rest_client.create_bcs_signed_transaction(account, pay))
        logger.info(f"Entry function {func_name} called for {account.account_address}.")
    except Exception as e:
        logger.error(f"Error in entry_function {func_name} for {account.account_address}: {str(e)}")
        raise

async def get_account_resource(address, res_type: str):
    try:
        logger.info(f"Fetching account resource {res_type} for {address}...")
        result = await rest_client.account_resource(address, f"{address}::main::{res_type}")
        logger.info(f"Account resource {res_type} fetched for {address}.")
        return result
    except Exception as e:
        logger.error(f"Error in get_account_resource {res_type} for {address}: {str(e)}")
        raise

async def get_table_item(key: str):
    try:
        logger.info(f"Fetching table item for key: {key}")
        with open("handle.json", "r") as f:
            handle = load(f)["handle"]
        result = await rest_client.get_table_item(handle, "0x1::string::String", "0x1::string::String", key)
        logger.info(f"Table item fetched for key: {key}")
        return result
    except Exception as e:
        logger.error(f"Error in get_table_item for key {key}: {str(e)}")
        raise



### Normal Functions

def encode_key(key: str) -> str:
    '''
    This function will encode the given Account Address.
    '''
    
    return "".join(chr(int(key[i:i+2], 16)) for i in range(15, len(key), 2))

def decode_key(key: str) -> str:
    '''
    This function will decode the given Account Address.
    '''

    return "0x" + "".join(hex(ord(c))[2:].zfill(2) for c in key)

def generate_token(secret_key: str, value: str) -> str:
    try:
        exp = datetime.utcnow() + timedelta(hours=2)  # Token valid for 2 hours
        token = encode({"client_id": value, "exp": exp}, secret_key, algorithm="HS256")
        logger.info(f"Token generated for {value}")
        return token if isinstance(token, str) else token.decode()
    except Exception as e:
        logger.error(f"Error generating token for {value}: {str(e)}")
        raise

def decode_token(secret_key: str, token: str)->str:
    try:
        logger.info("Decoding token...")
        return decode(token, secret_key, algorithms=["HS256"])["client_id"]
    except Exception as e:
        logger.error(f"Error decoding token: {str(e)}")
        raise