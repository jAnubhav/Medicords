from aptos_sdk.account import Account
from aptos_sdk.transactions import TransactionArgument
from aptos_sdk.bcs import Serializer

from helper import publish_contract, entry_function, encode_key

from data import man_dir, man_subdir, cli_dir, cli_subdir
from private_key import key

import asyncio as asy

account = Account.load_key(key)

# One-time function

async def publish_manager():
    '''
    This function will publish the Manager contract on the blockchain (Only once).
    '''
    await publish_contract(account, man_dir, man_subdir)
    await entry_function(account, "create_manager", [])

async def publish_client(client):
    '''
    This function will publish the Client contract on the blockchain.
    '''
    
    await publish_contract(client, cli_dir, cli_subdir)
    
    await entry_function(account, "add_account", [TransactionArgument(
        encode_key(str(client.account_address)), Serializer.str)])

    await entry_function(client, "create_manager", [])

async def publish_clients():
    '''
    This function will continuously publish the Client contract.
    '''

    for _ in range(10): await publish_client(Account.generate())

if __name__ == "__main__":
    # One-time Called
    # asy.run(publish_manager())

    asy.run(publish_clients())