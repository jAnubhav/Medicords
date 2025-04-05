module Account::main {
    use std::signer; use std::vector;
    use aptos_std::string::String;

    struct Record has store, copy, drop {
        client_id: String, date: String,
        symptoms: String, diagnosis: String, treatment: String
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
        account: &signer, client_id: String, date: String,
        symptoms: String, diagnosis: String, treatment: String
    ) acquires RecManager {
        let manager = borrow_global_mut<RecManager>(
            signer::address_of(account));

        vector::push_back(&mut manager.records, Record {
            client_id, date, symptoms, diagnosis, treatment });
    }
}