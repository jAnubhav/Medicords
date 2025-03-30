import { useContext, useEffect } from "react";
import { CredContext } from "../contexts/CredContext";

const Dashboard = () => {
    const { isAuth } = useContext(CredContext);

    useEffect(() => {
        const fetchData = async () => {    
            const res = await fetch("http://localhost:5000/get-data", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({ "token": isAuth })
            }).then(data => data.text());
            
            console.log(res);
        }

        fetchData()
    }, [])

    return (
        <div>Dashboard</div>
    );
};

export default Dashboard;