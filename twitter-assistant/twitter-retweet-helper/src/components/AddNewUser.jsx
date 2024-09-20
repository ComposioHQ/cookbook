import getUserDataByUsername from "../utils/twitter_utils";
import { useSnackbar } from "notistack";
import { Audio } from "react-loader-spinner";
import SmallButton from "./SmallButton";
import Separator from "./Separator";
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
            return;
        }
        //add feat to link twitter account here by passing the username, store the url
        try {
            let url = await linkTwitterAccount(user.email.split("@")[0], newUser);
            await addUserToAuthorisedUsers(user.uid, userData, url);
            setAuthorisedUsers([...authorisedUsers, { description: userData.data.description, id: userData.data.id, name: userData.data.name, profile_image_url: userData.data.profile_image_url, username: userData.data.username, isConnected: false, authUrl: url }]);
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
        <UsersIcon />
        <AddNewUserSearchBar open={newUserSearchBarOpen} setOpen={setNewUserSearchBarOpen} newUser={newUser} setNewUser={setNewUser} handleNewAddUser={handleNewAddUser} />
        <AddNewUserOutline loading={addingUser} onClick={() => setNewUserSearchBarOpen(true)} />
        <AddedUsers authorisedUsers={authorisedUsers} adminId={user.uid} />
    </>
}

export default AddNewUser;