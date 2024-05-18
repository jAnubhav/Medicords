from web3 import Web3
from solcx import compile_source
from json import load

def getBuildData():
    return build_data | {"gasPrice": w3.eth.gas_price, "nonce": w3.eth.get_transaction_count(data['wallet'])}

def performTxn(txn):
    signed_txn = w3.eth.account.sign_transaction(txn, private_key = data['privateKey'])
    txn_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    return w3.eth.wait_for_transaction_receipt(txn_hash)

def runConstructor():
    txn = w3.eth.contract(abi = abi, bytecode = bytecode).constructor().build_transaction(getBuildData())
    return w3.eth.contract(performTxn(txn)['contractAddress'], abi=abi)

def addData(patientId, age, symptoms, diagnosis, treatment, hospitalName):
    txn = contract.functions.addRecord(patientId, age, symptoms, diagnosis, treatment, hospitalName).build_transaction(getBuildData())
    _ = performTxn(txn)

def retrieveData(patientId, index):
    return contract.functions.getRecord(patientId, index).call()

def retrieveRecords(patientId):
    return [contract.functions.getRecords(patientId).call(), contract.functions.getLength(patientId).call()]

with open("./static/data/data.json", "r") as f:
    data = load(f)
w3 = Web3(Web3.HTTPProvider(data['url']))
build_data = {"chainId": data['chainId'], "from": data['wallet']}

with open("./contracts/records.sol", "r") as f:
    _, interface = compile_source(f.read(), output_values=['abi', 'bin'], solc_version="0.8.23").popitem()
abi, bytecode = interface['abi'], interface['bin']

contract = runConstructor()

addData(0, 20, "Fungus", "Something", "Something", "Fortis")
addData(0, 23, "Fungus1", "Something1", "Something1", "Apollo")

print(retrieveRecords(0))

print("success")