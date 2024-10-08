import getUserDataByUsername from "../utils/twitter_utils";
import { useSnackbar } from "notistack";
import { useState } from "react";
import AddedUsers from "./AddedUsers";
import { auth, getUserDetailsByUid, addUserToAuthorisedUsers } from "../config/firebase";
import { useEffect } from "react";
import { linkTwitterAccount } from "../utils/composio_utils";
import AddNewUserOutline from "./AddNewUserOutline";
import UsersIcon from "./UsersIcon";
import AddNewUserSearchBar from "./AddNewUserSearchBar";


const AddNewUser = ({ user }) => {
    const [newUser, setNewUser] = useState("");
    const [newUserSearchBarOpen, setNewUserSearchBarOpen] = useState(false)
    const [addingUser, setAddingUser] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [userDetails, setUserDetails] = useState(null);
    const [authorisedUsers, setAuthorisedUsers] = useState([]);

    const fetchUserDetails = async () => {
        try {
            const details = await getUserDetailsByUid(user.uid);
            setUserDetails(details);
            return details;
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
                setNewUserSearchBarOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    useEffect(() => {
        const initializeAuthorisedUsersData = async () => {
            if (!userDetails) {
                const details = await fetchUserDetails();
                if (details && details.authorisedUsers) {
                    setAuthorisedUsers(details.authorisedUsers);
                }
            }
        };
        initializeAuthorisedUsersData();
    }, [userDetails])

    const fetchTwitterUserData = async (username) => {
        try {
            const userData = await getUserDataByUsername(username);
            if (userData.error) {
                enqueueSnackbar(userData.error, { variant: 'error' });
                setAddingUser(false);
                return null;
            }
            return userData;
        } catch (error) {
            console.error('Error fetching user data:', error);
            enqueueSnackbar('Failed to fetch user data. Please check the username and try again.', { variant: 'error' });
            setAddingUser(false);
            return null;
        }
    }

    const checkUserExists = (username) => {
        return authorisedUsers.some(user => user.username === username);
    };

    const handleNewAddUser = async (e) => {
        // e.preventDefault();
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
            setAddingUser(false);
            return;
        }
        //add feat to link twitter account here by passing the username, store the url
        try {
            let url = await linkTwitterAccount(user.email.split("@")[0], newUser);
            await addUserToAuthorisedUsers(user.uid, userData, url);
            if (userData.data) {
                setAuthorisedUsers([...authorisedUsers, { description: userData.data.description, id: userData.data.id, name: userData.data.name, profile_image_url: userData.data.profile_image_url, username: userData.data.username, isConnected: false, authUrl: url }]);
                enqueueSnackbar('User added successfully.', { variant: 'success' });
            } else {
                enqueueSnackbar('Failed to add user. Username might be invalid.', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('An error occurred while adding the user', { variant: 'error' });
        } finally {
            setAddingUser(false);
            setNewUser("");
        }
    }
{/* <div className="border border-gray-200 rounded-md flex flex-col gap-4 py-5"></div> */}
    return <div className="flex flex-col gap-4 py-5 border border-gray-200 shadow-md rounded-md py-8">
        <UsersIcon />
        <AddNewUserSearchBar open={newUserSearchBarOpen} setOpen={setNewUserSearchBarOpen} newUser={newUser} setNewUser={setNewUser} handleNewAddUser={handleNewAddUser} />
        <AddNewUserOutline loading={addingUser} onClick={() => setNewUserSearchBarOpen(true)} />
        <AddedUsers authorisedUsers={authorisedUsers} adminId={user.uid} adminUsername={user.email.split("@")[0]}/>
    </div>
}

export default AddNewUser;