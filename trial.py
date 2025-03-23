from aptos_sdk.account import Account
from aptos_sdk.async_client import RestClient, FaucetClient
from aptos_sdk.transactions import EntryFunction, TransactionArgument, TransactionPayload
from aptos_sdk.bcs import Serializer

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

cli_dir, cli_subdir = data["cli_dir"], data["cli_subdir"]

async def publish_client():
    client = Account.generate(); cli_address = client.address()
    pri_key = client.private_key, pub_key = client.public_key()

    await faucet_client.fund_account(cli_address, 100_000_000)

    AptosCLIWrapper.compile_package(cli_dir, { "Account": cli_address })

    with open(f"{cli_dir}{cli_subdir}bytecode_modules/records.mv",
                "rb") as f: module = f.read()
    
    with open(f"{cli_dir}{cli_subdir}package-metadata.bcs",
                "rb") as f: metadata = f.read()
    
    txn_hash = await publisher.publish_package(client, metadata, [module])
    await rest_client.wait_for_transaction(txn_hash)

    payload = TransactionPayload(EntryFunction.natural(
        f"{address}::client", "create_account", [], [
            TransactionArgument(cli_address.__str__(), Serializer.str), 
            TransactionArgument(pri_key.__str__(), Serializer.str),
            TransactionArgument(pub_key.__str__(), Serializer.str)
        ]
    ))
    
    txn_req = await rest_client.create_bcs_signed_transaction(account, payload)
    txn_hash = await rest_client.submit_and_wait_for_bcs_transaction(txn_req)

if __name__ == "__main__":
    asy.run(publish_client())