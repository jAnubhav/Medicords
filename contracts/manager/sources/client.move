module Manager::client {
    use std::signer;

    use aptos_std::table;
    use aptos_std::smart_vector;

    struct Account has store, drop, copy {
        account_address: vector<u8>,
        private_key: vector<u8>,
        public_key: vector<u8>
    }

    struct AccManager has key {
        assigned: table::Table<u64, Account>,
        unassigned: smart_vector::SmartVector<Account>
    }

    public entry fun create_manager(account: &signer) {
        let manager = AccManager {
            assigned: table::new(),
            unassigned: smart_vector::new()
        };

        move_to(account, manager);
    }

    public entry fun create_account(
        account: &signer, account_address: vector<u8>,
        private_key: vector<u8>, public_key: vector<u8>
    ) acquires AccManager {
        let manager = borrow_global_mut<
            AccManager>(signer::address_of(account));

        let new_acc = Account {
            account_address, private_key, public_key };

        smart_vector::push_back(&mut manager.unassigned, new_acc);
    }

    public entry fun assign_account(
        account: &signer, aadhar_id: u64
    ) acquires AccManager {
        let manager = borrow_global_mut<
            AccManager>(signer::address_of(account));

        table::upsert(&mut manager.assigned, aadhar_id,
            smart_vector::pop_back(&mut manager.unassigned));
    }
}