// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.8.0 <0.9.0;

contract Records {
    struct PatientRecord {
        uint timestamp;
        uint age;
        string symptoms;
        string diagnosis;
        string treatment;
        string hospitalName;
    }

    mapping(uint => PatientRecord[]) records;

    constructor(){}

    event addrecord(
        uint timestamp,
        uint age,
        string symptoms,
        string diagnosis,
        string treatment,
        string hospitalName
    );

    function addRecord(
        uint patientId,
        uint age,
        string memory symptoms,
        string memory diagnosis,
        string memory treatment,
        string memory hospitalName
    ) public {
        records[patientId].push(
            PatientRecord(block.timestamp, age, symptoms, diagnosis, treatment, hospitalName)
        );
        emit addrecord(block.timestamp, age, symptoms, diagnosis, treatment, hospitalName);
    }

    function getRecord(
        uint patientId,
        uint index
    ) public view returns (PatientRecord memory) {
        return records[patientId][index];
    }

    function getRecords(
        uint patientId
    ) public view returns (PatientRecord[] memory) {
        return records[patientId];
    }

    function getLength(uint patientId) public view returns(uint) {
        return records[patientId].length;
    }
}
