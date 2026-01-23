import { useState, useEffect } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        // If token is not present, prompt login
        if (!token) {
            window.alert("You need to login to access the dashboard");
            navigate("/signin");
            return;
        }

        // Fetch current user details
        axios.get('http://localhost:3000/api/v1/user/me', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            setUserId(response.data.user._id);
            setUsername(response.data.user.username);
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
            window.alert("Failed to load user information.");
            navigate("/signin");
        });

        // Fetch balance when the component mounts
        axios.get('http://localhost:3000/api/v1/account/balance', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            setBalance(response.data.balance);
            if (response.data.balance === 0) {
                window.alert("Your balance is 0. You cannot send money.");
            }
        })
        .catch(error => {
            console.error("Error fetching balance:", error);
        });
    }, [navigate]);

    return (
        <div>
            <Appbar />
            <div className="m-8">
                <div className="text-2xl font-bold mb-4">Welcome {username}!</div>
                <Balance value={(balance / 100).toFixed(2)} />
                <Users currentUserId={userId} />
            </div>
        </div>
    );
};