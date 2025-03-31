module Account::main {
    use std::signer; use std::vector;

    use aptos_std::string::String;
    use aptos_std::table::{Self, Table};

    struct AccManager has key {
        available: vector<String>,
        assigned: Table<String, String>
    }

    struct Record has store, copy, drop {
        symptoms: String, diagnosis: String, treatment: String
    }

    struct RecHolder has key {
        records: Table<u64, Record>
    }

    public entry fun create_manager(account: &signer) {
        let acc_manager = AccManager {
            available: vector::empty(), 
            assigned: table::new()
        }; move_to(account, acc_manager);

        let rec_holder = RecHolder {
            records: table::new()
        }; move_to(account, rec_holder);
    }

    public entry fun add_account(
        account: &signer, acc_address: String
    ) acquires AccManager {
        let manager = borrow_global_mut<AccManager>(
            signer::address_of(account));

        vector::push_back(&mut manager
            .available, acc_address);
    }

    public entry fun assign_account(
        account: &signer, client_id: String
    ) acquires AccManager {
        let manager = borrow_global_mut<AccManager>(
            signer::address_of(account));

        table::upsert(&mut manager.assigned, client_id,
            vector::pop_back(&mut manager.available));
    }

    public entry fun create_record(
        account: &signer, record_id: u64,

        symptoms: String, diagnosis: String, treatment: String
    ) acquires RecHolder {
        let manager = borrow_global_mut<RecHolder>(
            signer::address_of(account));

        let record = Record { symptoms, diagnosis, treatment };
        table::upsert(&mut manager.records, record_id, record);
    }
}