import { useState } from "react";
import ReTweetCard from "./ReTweetCard";
import SkeletonLoader from "./SkeletonLoader";
import { useSnackbar } from "notistack";

const AuthorisedUsers = ({ authorisedUsers, setAuthorisedUsers, allAuthorisedUsers, setAllAuthorisedUsers }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) {
            const suggestions = allAuthorisedUsers.filter(user =>
                user.name.toLowerCase().includes(term.toLowerCase()) ||
                user.username.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredUsers(suggestions);
        } else {
            setFilteredUsers([]);
        }
    };

    const handleUserSelect = (user) => {
        if (authorisedUsers.some(authUser => authUser.id === user.id)) {
            enqueueSnackbar('User is already added', { variant: 'warning' });
            return;
        }
        const updatedUsers = [...authorisedUsers, user];
        setAuthorisedUsers(updatedUsers);
        setSearchTerm("");
        setFilteredUsers([]);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && filteredUsers.length > 0) {
            handleUserSelect(filteredUsers[0]);
        }
    };

    return (
        <div className="flex flex-col justify-center gap-4">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for users..."
                    className={`p-2 border border-gray-300 ${searchTerm ? 'border-b-0 rounded-t-md rounded-bl-none rounded-br-none' : 'rounded-md'} min-w-[640px] focus:outline-none focus:ring-0 focus:border-gray-300`}
                />
                {filteredUsers.length > 0 ? (
                    <ul className="absolute z-10 min-w-[640px] ml-4 border border-gray-300 rounded-b-md bg-white">
                        {filteredUsers.map((user, index) => (
                            <li
                                key={user.id}
                                onClick={() => handleUserSelect(user)}
                                className={`p-2 cursor-pointer hover:bg-gray-200 ${index === filteredUsers.length - 1 ? 'rounded-b-md' : ''} ${index === 0 ? 'border-t-0' : 'border-t-[1px]'} border-gray-300`}
                            >
                                {user.name} (@{user.username})
                            </li>
                        ))}
                    </ul>
                ) : (
                    searchTerm && <p className="absolute z-10 min-w-[640px] ml-4 border border-gray-300 border-t-1 rounded-b-md bg-white p-2 text-gray-500">No users found</p>
                )}
            </div>
            {authorisedUsers.length > 0 ? (
                authorisedUsers.map((user) => (
                    <ReTweetCard user={user} key={user.id} setAuthorisedUsers={setAuthorisedUsers}/>
                ))
            ) : (
                <p className="text-gray-500 text-center">no reposters selected</p>
            )}
        </div>
    );
}

export default AuthorisedUsers;
