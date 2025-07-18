# 🏥 Medicords – Your Health, Your Privacy in Your Hands (Secured by Blockchain)

## 🌐 Introduction
**Medicords** (short for *Medical Records*) is a secure and decentralized platform to manage medical histories on the **Aptos blockchain**. It eliminates reliance on fragile paper-based systems, prevents tampering or unauthorized access, and empowers users with full control over their health data.

## 👥 User Roles

### 🧑‍⚕️ Patients
- Register using **Aadhar ID** for unique identification.
- Access and view medical records securely with permission-based access.

### 🏥 Hospitals
- Register using **National Identification Number (NIN)**.
- Add, manage, and retrieve patient records via a secure dashboard.

## 🔐 Key Features
1. **Blockchain Security** for tamper-proof data integrity.
2. **Permissioned Access** to health records anytime, anywhere.
3. **Cost-Effective Storage** for hospitals and clinics.

## 📸 Sample Interfaces

**Hospital Dashboard**  
<img src="./sample/Hospital Dashboard.png" alt="Hospital Dashboard"/>

**Tech Stack Overview**  
<img src="./sample/TechStack.png" alt="Tech Stack" width="400"/>

---

## ⚙️ Tech Stack

| Layer             | Technology                  |
|------------------|-----------------------------|
| **Blockchain**    | Aptos (Rust-based)          |
| **Smart Contracts** | Move Programming Language |
| **Backend/API**    | Python (Quart Framework)   |
| **Blockchain SDK** | aptos-sdk for Python       |
| **Frontend**       | ReactJS                    |
| **Data Storage**   | RedisDB (Key-Value Store)  |

---

## 🚀 Getting Started

### Clone the Repository
```bash
git clone https://github.com/jAnubhav/Medicords
cd Medicords
```

### Backend Setup
📁 All backend-related files including smart contracts are in the backend/ directory.
Before running any Python commands, always navigate to the backend folder:

```bash
cd backend
```

a. Install Python Dependencies
```bash
pip install -r requirements.txt
```

> 🧰 **Included in `requirements.txt`:**
>
> - `aptos-sdk` – Interact with the Aptos blockchain
> - `quart` – Async Python web framework
> - `quart-cors` – CORS support for Quart
> - `redis` – Communication with RedisDB
> - `bcrypt` – Secure password hashing
> - `pyjwt` – JSON Web Token handling

b. Create Configuration File
In the backend folder, create a file named private_data.py:
```python
key = "Your Aptos Private Key"
secret_key = "Your Secret Key"

host = "Your Redis Host"
port = 6379  # Replace with your Redis port
password = "Your Redis Password"
```

c. Pre-Warm Aptos Accounts (Run Once)
a. Open controller.py:
  1. Comment line 108
  2. Uncomment line 106

Then run:
```bash
python controller.py
```

Once completed, revert the changes in controller.py and run again:
```bash
python controller.py
```

This process pre-creates Aptos accounts and stores them in Redis for faster user onboarding.

d. Start Backend Server
```bash
py main.py
```

💻 Frontend Setup
```bash
cd frontend
npm install
npm start
```

This launches the ReactJS app that interacts with the Quart backend.

📂 Folder Structure
```bash
Medicords/
├── backend/
│   ├── contracts/           # Move smart contracts
│   ├── controller.py        # Account management service
│   ├── main.py              # Quart backend entrypoint
│   ├── private_data.py      # Local secrets (not versioned)
│   └── ...
├── frontend/                # React frontend
└── sample/                  # Dashboard & tech stack images
```

📌 Notes
1. Ensure your Aptos wallet is funded and configured for the desired network (devnet/testnet).
2. Keep private_data.py secure and out of version control.
3. Smart contracts are written in Move and located under backend/contracts/.

🤝 Contributing
Pull requests and feature contributions are welcome. Please open an issue first to discuss major changes.
