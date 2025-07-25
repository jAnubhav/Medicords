from aptos_sdk.account import Account
from aptos_sdk.transactions import TransactionArgument
from aptos_sdk.bcs import Serializer

from datetime import datetime

from repository import *
from private_data import key

from json import dump

import asyncio as asy
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

account = Account.load_key(key)
address = account.account_address

man_dir, man_subdir = "./contracts/manager/", "./build/manager/"
cli_dir, cli_subdir = "./contracts/client/", "./build/client/"



### Contract related Functions

# One-time function
async def publish_manager() -> None:
    try:
        logger.info("Publishing Manager contract...")
        await publish_contract(account, man_dir, man_subdir)
        await entry_function(account, "create_manager", [])
        data = await get_account_resource(address, "AccManager")
        with open("handle.json", "w") as f:
            dump({"handle": data["data"]["assigned"]["handle"]}, f)
        logger.info("Manager contract published and handle.json updated.")
    except Exception as e:
        logger.error(f"Error in publish_manager: {str(e)}")
        raise

async def publish_client(client: Account) -> None:
    try:
        logger.info(f"Publishing Client contract for {client.account_address}...")
        await publish_contract(client, cli_dir, cli_subdir)
        await entry_function(account, "add_account", [TransactionArgument(
            encode_key(str(client.private_key)), Serializer.str)])
        await entry_function(client, "create_manager", [])
        logger.info(f"Client contract published for {client.account_address}.")
    except Exception as e:
        logger.error(f"Error in publish_client: {str(e)}")
        raise

async def publish_clients() -> None:
    try:
        logger.info("Publishing multiple client contracts...")
        for _ in range(10):
            await publish_client(Account.generate())
        logger.info("All client contracts published.")
    except Exception as e:
        logger.error(f"Error in publish_clients: {str(e)}")
        raise



### Assignment and Record Creation Functions
    
async def assign_account(iden: str) -> None:
    try:
        logger.info(f"Assigning account for iden: {iden}")
        await entry_function(account, "assign_account", [TransactionArgument(iden, Serializer.str)])
        logger.info(f"Account assigned for iden: {iden}")
    except Exception as e:
        logger.error(f"Error in assign_account for {iden}: {str(e)}")
        raise

async def get_data(iden: str):
    try:
        logger.info(f"Getting data for iden: {iden}")
        add = Account.load_key(decode_key(await get_table_item(iden))).account_address
        result = (await get_account_resource(add, "RecManager"))["data"]["records"]
        logger.info(f"Data retrieved for iden: {iden}")
        return result
    except Exception as e:
        logger.error(f"Error in get_data for {iden}: {str(e)}")
        raise

async def add_data(nationalId: str, client_id: str, symptoms: str, diagnosis: str, treatment: str):
    try:
        logger.info(f"Adding data for client_id: {client_id}, nationalId: {nationalId}")
        mi_private_key = decode_key(await get_table_item(nationalId))
        pt_private_key = decode_key(await get_table_item(client_id))
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        await entry_function(Account.load_key(mi_private_key), "add_record", [
            TransactionArgument(client_id, Serializer.str),
            TransactionArgument(date, Serializer.str),
            TransactionArgument(symptoms, Serializer.str),
            TransactionArgument(diagnosis, Serializer.str),
            TransactionArgument(treatment, Serializer.str)
        ])
        await entry_function(Account.load_key(pt_private_key), "add_record", [
            TransactionArgument(nationalId, Serializer.str),
            TransactionArgument(date, Serializer.str),
            TransactionArgument(symptoms, Serializer.str),
            TransactionArgument(diagnosis, Serializer.str),
            TransactionArgument(treatment, Serializer.str)
        ])
        logger.info(f"Data added for client_id: {client_id} on {date}")
        return date
    except Exception as e:
        logger.error(f"Error in add_data for client_id: {client_id}, nationalId: {nationalId}: {str(e)}")
        raise


if __name__ == "__main__":
    # One-time Called
    # asy.run(publish_manager())

    asy.run(publish_clients())