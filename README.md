# Medicords - Your Health, Your Privacy Secured by Blockchain

### Introduction:
**Medicords** (aka 'Medical Records') is more than just an idea—it's a revolution. Our vision is to securely store every individual's complete medical history on the blockchain, eliminating paper-based records and preventing any dilution, destruction, or tampering by individuals or organizations.

### User Roles:
- Patients:
  - Create accounts using their Aadhar ID for unique identification.
  - Access and view their medical records securely through the portal.

- Hospitals:
  - Register using their National Identification Number (NIN).
  - Use the portal to add and manage medical records for registered patients.

### Key Features:
1. Blockchain powered Security to critical data.
2. Anytime, anywhere access with permissions.
3. Cheaper Data Storage for Hospitals and Clinics.

### Tech Stack:
- Blockchain: Aptos (Rust-based)
- Smart Contracts: Move Programmming Language
- Blockchain Interactions: Aptos-SDK for Python
- Backend / API: Quart WebFramework for Python
- Frontend: ReactJS
- Account Data: RedisDB (Key-Value)

### Getting Started:
1. Clone the Github Repository

   ```bash
   git clone https://github.com/jAnubhav/Medicords-Combined
   ```
3. Download a Blockchain wallet that supports Aptos.
4. Create a file `private_data.py` in the folder with the following data:

   ```py
   key = "Your Private Key"
   secret_key = 'Your Secret Key'
    
   host = 'Your Redis Cloud'
   port = Redis_Port_Number
   password = "Your Redis Password"
   ```
6. Install the listed packages for Python:
   - aptos-sdk
   - quart
   - quart-cors
   - redis
   - bcrypt
   - pyjwt
5. Open `controller.py`, comment line no. 108 and uncomment line no. 106.
6. Execute the file `controller.py`.
7. Execute the file `main.py`.
8. Open `./frontend `

   ```bash
   cd ./frontend
   ```
9. Start the React Application

    ```bash
    npm install
    npm start
    ```
