import { useEffect, useState } from "react";
import { Button } from "./Bottom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = ({ currentUserId }) => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter)
            .then(response => {
                setUsers(response.data.user);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }, [filter]);

    return (
        <>
            <div className="font-bold mt-6 text-2xl">
                Users:
            </div>
            <div className="my-2">
                <input 
                    onChange={(e) => setFilter(e.target.value)} 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {users.map(user => (
                    <User key={user._id} user={user} currentUserId={currentUserId} />
                ))}
            </div>
        </>
    );
};

function User({ user, currentUserId }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between mb-4 p-2 border-b border-slate-200">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-2">
                    <span className="text-xl font-semibold">{user.firstName[0]}</span>
                </div>
                <div className="flex flex-col justify-center">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center">
                {user._id !== currentUserId && (
                    <Button 
                        onClick={() => navigate("/send?id=" + user._id + "&name=" + user.firstName)} 
                        label="Send Money" 
                    />
                )}
            </div>
        </div>
    );
}