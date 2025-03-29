from aptos_sdk.async_client import RestClient, FaucetClient
from aptos_sdk.aptos_cli_wrapper import AptosCLIWrapper
from aptos_sdk.package_publisher import PackagePublisher

from aptos_sdk.transactions import EntryFunction, TransactionPayload

from data import rest_url, faucet_url

rest_client = RestClient(rest_url)
faucet_client = FaucetClient(faucet_url, rest_client)

publisher = PackagePublisher()



# Blockchain-based functions

async def publish_contract(account, address, cdir, subdir):
    '''
    This function will compile and deploy the contract on the blockchain.
    '''

    meta, move = "package-metadata.bcs", "bytecode_modules/main.mv"

    await faucet_client.fund_account(address, 100_000_000)
    AptosCLIWrapper.compile_package(cdir, {"Account": address})

    with open(f"{cdir}{subdir}{move}", "rb") as f: module = f.read()
    with open(f"{cdir}{subdir}{meta}", "rb") as f: mtdata = f.read()
    
    txn_hash = await publisher.publish_package(account, mtdata, [
        module]); await rest_client.wait_for_transaction(txn_hash)
    
async def entry_function(acc, add, pkg, func_name, args):
    '''
    This function will call the Entry Function that interacts with the blockchain.
    '''
    
    pay = TransactionPayload(EntryFunction.natural(
        f"{add}::{pkg}", func_name, [], args))
    
    await rest_client.submit_and_wait_for_bcs_transaction(
        await rest_client.create_bcs_signed_transaction(acc, pay))



# General functions

def encode_key(key):
    '''
    This function will encode the Account Address. It is used when pushing data in blockchain.
    '''

    return "".join(chr(int(key[i:i+2], 16)) for i in range(2, len(key), 2))

def decode_key(key):
    '''
    This function will decode the Account Address. Is is used when retrieving data from blockchain.
    '''

    return "0x" + "".join(hex(ord(c))[2:] for c in key)