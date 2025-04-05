from aptos_sdk.account import Account
from aptos_sdk.async_client import RestClient, FaucetClient
from aptos_sdk.aptos_cli_wrapper import AptosCLIWrapper
from aptos_sdk.package_publisher import PackagePublisher

from aptos_sdk.transactions import EntryFunction, TransactionPayload

from jwt import encode, decode

from json import load

rest_client = RestClient("https://api.devnet.aptoslabs.com/v1")
faucet_client = FaucetClient("https://faucet.devnet.aptoslabs.com", rest_client)

publisher = PackagePublisher(rest_client)



### Blockchain-based Functions

async def publish_contract(account: Account, cdir: str, subdir: str) -> None:
    '''
    This function will compile and deploy the contract on the blockchain.
    '''

    meta, move = "package-metadata.bcs", "bytecode_modules/main.mv"
    address, amount = account.account_address, 100_000_000

    await faucet_client.fund_account(address, amount)
    AptosCLIWrapper.compile_package(cdir, {"Account": address})

    with open(f"{cdir}{subdir}{move}", "rb") as f: module = f.read()
    with open(f"{cdir}{subdir}{meta}", "rb") as f: mtdata = f.read()
    
    txn_hash = await publisher.publish_package(account, mtdata, [
        module]); await rest_client.wait_for_transaction(txn_hash)
    
async def entry_function(account: Account, func_name: str, args: list[any]) -> None:
    '''
    This function will call the Entry Function that interacts with the blockchain.
    '''
    
    address, amount = account.account_address, 100_000_000

    await faucet_client.fund_account(address, amount); pay = TransactionPayload(
        EntryFunction.natural(f"{address}::main", func_name, [], args))
    
    await rest_client.submit_and_wait_for_bcs_transaction(await 
        rest_client.create_bcs_signed_transaction(account, pay))

async def get_account_resource(address, res_type: str):
    '''
    This function will return the Account Resource based on the Account Address.
    '''

    return await rest_client.account_resource(address, f"{address}::main::{res_type}")

async def get_table_item(key: str):
    '''
    This function will return the Table Item from an Account.
    '''

    with open("handle.json", "r") as f:
        handle = load(f)["handle"]
    
    return await rest_client.get_table_item(handle, 
        "0x1::string::String", "0x1::string::String", key)



### Normal Functions

def encode_key(key: str) -> str:
    '''
    This function will encode the given Account Address.
    '''
    
    return "".join(chr(int(key[i:i+2], 16)) for i in range(2, len(key), 2))

def decode_key(key: str) -> str:
    '''
    This function will decode the given Account Address.
    '''

    return "0x" + "".join(hex(ord(c))[2:].zfill(2) for c in key)

def generate_token(secret_key: str, value: str):
    '''
    This function will generate the Authentication Token.
    '''
    
    return encode({ "client_id": value }, secret_key, algorithm="HS256")

def decode_token(secret_key: str, token: str):
    '''
    This function will decode the Authentication Token.
    '''
    
    return decode(token.encode(), secret_key, algorithms=["HS256"])["client_id"]