module Account::main {
    use std::signer; use std::vector;
    use aptos_std::string::String;

    struct Record has store, copy, drop {
        record_id: u64, client_id: String, date: String
    }

    struct RecManager has key {
        records: vector<Record>
    }

    public entry fun create_manager(account: &signer) {
        let manager = RecManager {
            records: vector::empty()
        }; move_to(account, manager);
    }

    public entry fun add_record(
        account: &signer, record_id: u64,
        client_id: String, date: String
    ) acquires RecManager {
        let manager = borrow_global_mut<RecManager>(
            signer::address_of(account));

        let record = Record { record_id, client_id, date };
        vector::push_back(&mut manager.records, record);
    }
}