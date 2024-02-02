import React, { useState, useEffect } from 'react';
import { fetchAllChats, fetchAllUsers } from '../../apis/chat';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const fetchUsers = async () => {
            const data = await fetchAllUsers();
            console.log(data)
            setUsers(data);
    };

    // Fetch users when the component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    // Function to handle the "Users" button click
    const handleUsersButtonClick = () => {
        setShowUserDropdown(!showUserDropdown);
    };

    return (
        <div>
            <button onClick={handleUsersButtonClick} className='mt-1 transition duration-150 ease-in-out text-[11px] font-normal tracking-wide flex items-center gap-x-1 bg-[#f6f6f6] text-[#1f2228] py-1 px-2 justify-start'>All Users</button>

            {showUserDropdown && (
                <div className="dropdown bg-[#5891E7] absolute z-50 mt-2 w-[300px] shadow-md overflow-hidden scrollbar-hide overflow-y-scroll">
                    <ul className='mt-1 flex flex-col justify-start items-start overflow-y-auto max-h-48'>
                        {users.map((user) => (
                            <li className='flex items-center px-4 py-2' key={user._id}>
                                <img className='h-8 mr-4' src="Image/AddUser.png" alt="" />
                                <p className='text-[13.6px] sm:text-[16px] text-[#000] font-bold'>
                                    {user.name}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

            )}
        </div>
    );
};

export default UserList;
