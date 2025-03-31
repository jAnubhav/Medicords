from aptos_sdk.account import Account
from aptos_sdk.transactions import TransactionArgument
from aptos_sdk.bcs import Serializer

from helper import *

from data import man_dir, man_subdir, cli_dir, cli_subdir
from private_data import key

import asyncio as asy

account = Account.load_key(key)
address = account.account_address


### Contract related Functions

# One-time function
async def publish_manager() -> None:
    '''
    This function will publish the Manager contract on the blockchain (Only once).
    '''
    await publish_contract(account, man_dir, man_subdir)
    await entry_function(account, "create_manager", [])

async def publish_client(client: Account) -> None:
    '''
    This function will publish the Client contract on the blockchain.
    '''
    
    await publish_contract(client, cli_dir, cli_subdir)
    
    await entry_function(account, "add_account", [TransactionArgument(
        encode_key(str(client.account_address)), Serializer.str)])

    await entry_function(client, "create_manager", [])

async def publish_clients() -> None:
    '''
    This function will continuously publish the Client contract.
    '''

    for _ in range(10): await publish_client(Account.generate())



### Assignment and Record Creation Functions
    
async def assign_account(iden: str) -> None:
    '''
    This function calls the "Assign Account" function in the Manager Contract.
    '''

    await entry_function(account, "assign_account", 
                         [TransactionArgument(iden, Serializer.str)])

async def get_data(iden: str):
    '''
    This function will return the account resources from the blockchain.
    '''

    data = await get_account_resource(address, "AccManager")

    add = decode_key(await get_table_item(data["data"]["assigned"]["handle"], 
        "0x1::string::String", "0x1::string::String", iden))
    
    return (await get_account_resource(add, "RecManager"))["data"]["records"]



if __name__ == "__main__":
    # One-time Called
    # asy.run(publish_manager())

    asy.run(publish_clients())