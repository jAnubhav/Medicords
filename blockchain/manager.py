from aptos_sdk.account import Account
from aptos_sdk.transactions import TransactionArgument
from aptos_sdk.bcs import Serializer

from helper import publish_contract, entry_function, encode_key

from data import man_dir, man_subdir, cli_dir, cli_subdir
from private_key import key

import asyncio as asy



# One-time function

async def publish_manager():
    '''
    This function will publish the Manager contract on the blockchain (Only once).
    '''
    
    acc, add = Account.load_key(key), acc.account_address
    publish_contract(acc, add, man_dir, man_subdir)

    await entry_function(acc, add, "manager", "create_manager", [])

async def publish_client():
    '''
    This function will publish the Client contract continuously on the blockchain.
    '''
    
    acc, add = Account.generate(), acc.account_address
    publish_contract(acc, add, cli_dir, cli_subdir)
    
    await entry_function(acc, add, "manager", "add_account", [
        TransactionArgument(encode_key(add), Serializer.str)])

    await entry_function(acc, add, "client", "create_manager", [])

async def publish_clients():
    pass