from aptos_sdk.account import Account
from aptos_sdk.async_client import RestClient, FaucetClient

from aptos_sdk.aptos_cli_wrapper import AptosCLIWrapper
from aptos_sdk.package_publisher import PackagePublisher

from json import load
import asyncio as asy

with open("./data/manager.json", "r") as f:
    data = load(f)

with open("./data/private_key.json", "r") as f:
    private_key = load(f)["private_key"]

account = Account.load_key(private_key)
address = account.address()

rest_client = RestClient(data["rest_url"])
faucet_client = FaucetClient(data["faucet_url"], rest_client)

publisher = PackagePublisher(rest_client)

'''
The below function is only available for one time use to deploy the contract
'''

# async def publish_manager():
#     await faucet_client.fund_account(address, 1_000_000_000)
#     AptosCLIWrapper.compile_package(data["man_dir"], {})

#     with open(f"{data["man_dir"]}{data["man_subdir"]}bytecode_modules/client.mv",
#                 "rb") as f: module = f.read()
    
#     with open(f"{data["man_dir"]}{data["man_subdir"]}package-metadata.bcs",
#                 "rb") as f: metadata = f.read()

#     txn_hash = await PackagePublisher(rest_client)\
#         .publish_package(account, metadata, [module])

#     await rest_client.wait_for_transaction(txn_hash)

async def publish_client():
    client = Account.generate(); cli_address = client.address()
    await faucet_client.fund_account(cli_address, 100_000_000)

    cli_dir, cli_subdir = data["cli_dir"], data["cli_subdir"]

    AptosCLIWrapper.compile_package(cli_dir, { "Account": cli_address })

    with open(f"{cli_dir}{cli_subdir}bytecode_modules/records.mv",
                "rb") as f: module = f.read()
    
    with open(f"{cli_dir}{cli_subdir}package-metadata.bcs",
                "rb") as f: metadata = f.read()
    
    txn_hash = await publisher.publish_package(client, metadata, [module])
    await rest_client.wait_for_transaction(txn_hash)
    
    print(txn_hash)

if __name__ == "__main__":
    asy.run(publish_client())
    pass