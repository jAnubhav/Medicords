import { useContext, useEffect } from "react";
import { CredContext } from "../contexts/CredContext";

const Dashboard = () => {
    const { formData, setFormData, token, records, setRecords } = useContext(CredContext);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:5000/get-patient-data", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({ "token": token })
            }).then(data => data.json());

            setFormData({ ...res["cred"] }); setRecords(res["records"]);

            console.log(res)
        }

        fetchData()
    }, [])

    return (
        <div>{formData.aadharId}</div>
    );
};

export default Dashboard;