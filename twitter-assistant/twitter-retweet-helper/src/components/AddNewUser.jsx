import { addUserToAuthorisedUsers } from "../config/firebase";
import getUserDataByUsername from "../utils/twitter/getData";
import { useSnackbar } from "notistack";
import { Audio } from "react-loader-spinner";
import SmallButton from "./SmallButton";
import Separator from "./Separator";
import { useState } from "react";


const AddNewUser = ({ authorisedUsers, setAuthorisedUsers, user }) => {
    const [newUser, setNewUser] = useState("");
    const [addingUser, setAddingUser] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const fetchTwitterUserData = async (username) => {
        try {
            console.log("username: ", newUser);
            return await getUserDataByUsername(username);
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response && error.response.status === 429) {
                enqueueSnackbar('Too many requests. Please try again later.', { variant: 'error' });
            } else {
                enqueueSnackbar('Failed to fetch user data. Please check the username and try again.', { variant: 'error' });
            }
            setAddingUser(false);
            return;
        }
    }

    const checkUserExists = (username) => {
        return authorisedUsers.some(user => user.username === username);
    };

    const handleNewAddUser = async (e) => {
        e.preventDefault();
        setAddingUser(true);
        if (!newUser.trim()) {
            enqueueSnackbar("Please enter a username.", { variant: 'warning' });
            setAddingUser(false);
            return;
        }
        if (checkUserExists(newUser)) {
            enqueueSnackbar("User already exists.", { variant: 'warning' });
            setAddingUser(false);
            setNewUser("");
            return;
        }
        const userData = await fetchTwitterUserData(newUser);
        if (!userData) {
            return;
        }
        try {
            await addUserToAuthorisedUsers(user.uid, userData);
            setAuthorisedUsers([...authorisedUsers, userData]);
            enqueueSnackbar('User added successfully.', { variant: 'success' });
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('An error occurred while adding the user', { variant: 'error' });
        } finally {
            setAddingUser(false);
            setNewUser("");
        }
    }

    return <>
        <Separator title="Add Users" />
        <form onSubmit={handleNewAddUser} className="flex gap-4 items-center justify-center mx-14">
            <input value={newUser} onChange={(e) => setNewUser(e.target.value)} autoComplete="off" type="text" name="username" className="h-[2.5rem] block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 py-1.5 px-3" placeholder="username" />
            <SmallButton
                type="submit"
                width="14rem"
                name={addingUser ? <Audio height="15" width="200" color="white" ariaLabel="loading" /> : "Add User"}
            />
        </form>
        <br />
        <Separator title="Authorised Users" />
        <div className="flex flex-wrap justify-center gap-2">
            {authorisedUsers.length > 0 ? (
                authorisedUsers.map((user, index) => (
                    <div key={index} className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        {/* {user.description} | {user.id} | {user.name} | {user.profile_image_url} | {user.username} */}
                        {user.username}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No authorised users added yet.</p>
            )}
        </div>
    </>
}

export default AddNewUser;