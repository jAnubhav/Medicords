module Account::client {
    use std::string::String;
    use aptos_std::signer;

    use std::vector;
    use aptos_std::table;

    struct Record has store, drop, copy {
        date: String, symptoms: String,
        diagnosis: String, treatment: String
    }

    struct RecManager has key {
        records: table::Table<u32, vector<Record>>
    }

    public entry fun create_manager(account: &signer) {
        let manager = RecManager { records: table::new() }; 
        move_to(account, manager);
    }

    public entry fun add_record(
        account: &signer, hospitalId: u32,
        
        date: String, symptoms: String,
        diagnosis: String, treatment: String
    ) acquires RecManager {
        let manager = borrow_global_mut<
            RecManager>(signer::address_of(account));

        let new_acc = Record { date, symptoms, diagnosis, 
            treatment }; let temp = vector::empty<Record>();

        let records = table::borrow_with_default(
            &manager.records, hospitalId, &temp);
        
        vector::push_back(&mut *(records), new_acc);
        table::add(&mut manager.records, hospitalId, *records);
    }
}