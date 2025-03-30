from aptos_sdk.async_client import RestClient, FaucetClient
from aptos_sdk.aptos_cli_wrapper import AptosCLIWrapper
from aptos_sdk.package_publisher import PackagePublisher

from aptos_sdk.transactions import EntryFunction, TransactionPayload

from data import rest_url, faucet_url

rest_client = RestClient(rest_url)
faucet_client = FaucetClient(faucet_url, rest_client)

publisher = PackagePublisher(rest_client)



# Blockchain-based functions

async def publish_contract(account, cdir, subdir):
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
    
async def entry_function(account, func_name, args):
    '''
    This function will call the Entry Function that interacts with the blockchain.
    '''
    
    address = account.account_address; pay = TransactionPayload(
        EntryFunction.natural(f"{address}::main", func_name, [], args))
    
    await rest_client.submit_and_wait_for_bcs_transaction(await 
        rest_client.create_bcs_signed_transaction(account, pay))

# Normal functions

def encode_key(key):
    '''
    This function will encode the given Account Address.
    '''
    
    return "".join(chr(int(key[i:i+2], 16)) for i in range(2, len(key), 2))

def decode_key(key):
    '''
    This function will decode the given Account Address.
    '''

    return "0x" + "".join(hex(ord(c))[2:] for c in key)