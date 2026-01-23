import axios from "axios";
import { useState, useEffect } from "react";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Bottom";
import { NavLink, useNavigate } from "react-router-dom";

export const Me = () => {
    const [firstName, setFirstName] = useState("");
    const [username, setUsername] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState(""); // Add state for current password
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/user/me', {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            setFirstName(response.data.user.firstName); 
            setLastName(response.data.user.lastName); 
            setUsername(response.data.user.username); 
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
            alert("Failed to load user information.");
        });
    }, []);

    const handleUpdate = () => {
        const updateData = {};

        if (firstName.trim() !== "") updateData.firstName = firstName;
        if (lastName.trim() !== "") updateData.lastName = lastName;
        if (password.trim() !== "") updateData.password = password;
        if (currentPassword.trim() !== "") updateData.currentPassword = currentPassword;  // Include current password

        axios.put('http://localhost:3000/api/v1/user/update', 
            updateData,
            {
                headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(response => {
            navigate("/dashboard");
            alert("Details updated successfully!");
        })
        .catch(error => {
            console.error("Error updating details:", error);
            alert("Failed to update details. Please try again.");
        });
    };

    const handleDelete = () => {
        // const updateData = {};
        // if (currentPassword.trim() !== "") updateData.currentPassword = currentPassword;
        axios.delete('http://localhost:3000/api/v1/user/deleteMe', {
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            },
            data: {currentPassword} 
        })
        .then(response => {
            alert("User deleted successfully!");
            localStorage.removeItem("token");
            navigate("/signup");
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
        });
    };

    return (
        <div className="bg-gradient-to-r from-slate-300 to-gray-200 h-screen flex items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                <div className="rounded-full h-12 w-12 bg-gray-300 flex items-center justify-center text-xl font-semibold">
                    <NavLink to="/dashboard">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    </NavLink>
                </div>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">User Information</h1>
                </div>
                
                <div className="text-gray-700 mb-4">
                    <p><strong>Username:</strong> {username}</p>
                    <p><strong>First Name:</strong> {firstName}</p>
                    <p><strong>Last Name:</strong> {lastName}</p>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Details</h2>
                    
                    <InputBox 
                        label="First Name" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} 
                        placeholder="Updated First Name" 
                        className="mb-4"
                    />

                    <InputBox 
                        label="Last Name" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)} 
                        placeholder="Updated Last Name" 
                        className="mb-4"
                    />

                    <InputBox 
                        label="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Updated Password (leave blank to keep current)" 
                        className="mb-4"
                    />

                    <InputBox 
                        label="Current Password"  // New field for current password
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        placeholder="Current Password" 
                        className="mb-6"
                    />
                    <br></br>
                    <Button 
                        onClick={handleUpdate}
                        label={"Update details"} 
                    />

                    <Button 
                        onClick={handleDelete}
                        label={"Delete Account"} 
                    />
                </div>
            </div>
        </div>
    );
};