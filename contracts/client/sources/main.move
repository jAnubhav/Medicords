module Account::main {
    use std::signer; use std::vector;

    struct RecManager has key {
        records: vector<u64>
    }

    public entry fun create_manager(account: &signer) {
        let manager = RecManager {
            records: vector::empty()
        }; move_to(account, manager);
    }

    public entry fun add_record(
        account: &signer, record_id: u64
    ) acquires RecManager {
        let manager = borrow_global_mut<RecManager>(
            signer::address_of(account));

        vector::push_back(&mut manager.records, record_id);
    }
}