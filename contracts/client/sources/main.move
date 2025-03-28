module Account::main {
    use std::signer; use std::vector;

    use aptos_std::string::String;
    use aptos_std::table::{Self, Table};

    struct RecManager has key {
        records: Table<String, vector<u64>>
    }

    public entry fun create_manager(account: &signer) {
        let manager = RecManager {
            records: table::new()
        }; move_to(account, manager);
    }

    public entry fun add_record(
        account: &signer, 
        client_id: String, record_id: u64
    ) acquires RecManager {
        let manager = borrow_global_mut<RecManager>(
            signer::address_of(account));

        let temp = vector::empty<u64>();
        let records = table::borrow_with_default(
            &manager.records, client_id, &temp);
        
        vector::push_back(&mut *(records), record_id);
        table::add(&mut manager.records, client_id, *records);
    }
}