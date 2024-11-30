module Manager::main {
    use std::string::String;
    use std::signer;

    use aptos_std::table;
    use aptos_std::smart_vector;

    struct Manager has key {
        accounts: smart_vector::SmartVector<Account>,
        manager: table::Table<u32, Account>
    }

    struct Account has store, copy, drop {
        version: u64, hash: String, acc_address: String,
        private_key: String, public_key: String,
    }

    public entry fun initialize(account: &signer) {
        let acc_manager = Manager {
            accounts: smart_vector::new(), manager: table::new()
        }; move_to(account, acc_manager);
    }

    public entry fun addEntry(
        account: &signer,

        version: u64, hash: String, acc_address: String,
        private_key: String, public_key: String,
    ) acquires Manager {
        let signer_address = signer::address_of(account);
        let acc_manager = borrow_global_mut<Manager>(signer_address);

        let new_entry = Account {
            version, hash, acc_address, private_key, public_key
        };

        smart_vector::push_back(&mut acc_manager.accounts, new_entry);
    }

    public entry fun getEntry(
        account: &signer, patientId: u32
    ) acquires Manager {
        let signer_address = signer::address_of(account);
        let acc_manager = borrow_global_mut<Manager>(signer_address);

        let entry = smart_vector::pop_back(&mut acc_manager.accounts);
        table::upsert(&mut acc_manager.manager, patientId, entry);
    }
}