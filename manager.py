from aptos_sdk.account import Account
from aptos_sdk.async_client import RestClient, FaucetClient
from aptos_sdk.transactions import EntryFunction, TransactionArgument, TransactionPayload
from aptos_sdk.bcs import Serializer

from aptos_sdk.aptos_cli_wrapper import AptosCLIWrapper
from aptos_sdk.package_publisher import PackagePublisher

from json import load
import asyncio as asy

from datetime import datetime

with open("./data/manager.json", "r") as f:
    data = load(f)

with open("./data/private_key.json", "r") as f:
    private_key = load(f)["private_key"]

account = Account.load_key(private_key)
address = account.address()

rest_client = RestClient(data["rest_url"])
faucet_client = FaucetClient(data["faucet_url"], rest_client)

publisher = PackagePublisher(rest_client)

man_dir, man_subdir = data["man_dir"], data["man_subdir"]
cli_dir, cli_subdir = data["cli_dir"], data["cli_subdir"]











async def publish_manager():
    await faucet_client.fund_account(address, 100_000_000)
    AptosCLIWrapper.compile_package(man_dir, {})

    with open(f"{man_dir}{man_subdir}bytecode_modules/manager.mv",
                "rb") as f: module = f.read()
    
    with open(f"{man_dir}{man_subdir}package-metadata.bcs",
                "rb") as f: metadata = f.read()
    
    txn_hash = await publisher.publish_package(account, metadata, [module])
    await rest_client.wait_for_transaction(txn_hash)

    payload = TransactionPayload(EntryFunction.natural(
        f"{address}::manager", "create_manager", [], []
    ))
    
    txn_req = await rest_client.create_bcs_signed_transaction(account, payload)
    await rest_client.submit_and_wait_for_bcs_transaction(txn_req)














async def publish_client():
    client = Account.generate(); cli_address = client.address()
    pri_key, pub_key = client.private_key, client.public_key()

    await faucet_client.fund_account(cli_address, 100_000_000)

    AptosCLIWrapper.compile_package(cli_dir, { "Account": cli_address })

    with open(f"{cli_dir}{cli_subdir}bytecode_modules/client.mv",
                "rb") as f: module = f.read()
    
    with open(f"{cli_dir}{cli_subdir}package-metadata.bcs",
                "rb") as f: metadata = f.read()
    
    txn_hash = await publisher.publish_package(client, metadata, [module])
    await rest_client.wait_for_transaction(txn_hash)

    payload = TransactionPayload(EntryFunction.natural(
        f"{address}::manager", "create_account", [], [
            TransactionArgument(str(cli_address), Serializer.str), 
            TransactionArgument(str(pri_key), Serializer.str),
            TransactionArgument(str(pub_key), Serializer.str)
        ]
    ))

    print(str(cli_address))
    
    txn_req = await rest_client.create_bcs_signed_transaction(account, payload)
    await rest_client.submit_and_wait_for_bcs_transaction(txn_req)

    payload = TransactionPayload(EntryFunction.natural(
        f"{cli_address}::client", "create_manager", [], []
    ))

    txn_req = await rest_client.create_bcs_signed_transaction(client, payload)
    await rest_client.submit_and_wait_for_bcs_transaction(txn_req)

async def client_publisher():
    for i in range(10): 
        await publish_client()
        print(i)













async def assign_account(aadharId):
    payload = TransactionPayload(EntryFunction.natural(
        f"{address}::manager", "assign_account", [], [
            TransactionArgument(aadharId, Serializer.u64)
        ]
    ))
    
    txn_req = await rest_client.create_bcs_signed_transaction(account, payload)
    await rest_client.submit_and_wait_for_bcs_transaction(txn_req)












async def get_address():
    res = await rest_client.account_resource(
        address, f"{address}::manager::AccManager")

    handle = res["data"]["assigned"]["handle"]

    return await rest_client.get_table_item(handle, "u64", 
        f"{address}::manager::Account", "111111111111")
    









async def do_transaction(data):
    acc_add, hospitalId, diagnosis, symptoms, treatment = data.values()
    print(len(acc_add))
    date = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    
    payload = TransactionPayload(EntryFunction.natural(
        f"{acc_add}::client", "add_record", [], [
            TransactionArgument(int(hospitalId), Serializer.u32),
            TransactionArgument(date, Serializer.str),
            TransactionArgument(symptoms, Serializer.str),
            TransactionArgument(diagnosis, Serializer.str),
            TransactionArgument(treatment, Serializer.str)
        ]
    ))
    
    txn_req = await rest_client.create_bcs_signed_transaction(account, payload)
    await rest_client.submit_and_wait_for_bcs_transaction(txn_req)









if __name__ == "__main__":
    # asy.run(publish_manager())
    loop = asy.new_event_loop()
    loop.run_until_complete(client_publisher())