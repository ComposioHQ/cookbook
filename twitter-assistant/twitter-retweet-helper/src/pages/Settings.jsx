import { useEffect, useState, useCallback } from "react";
import SettingsAttribute from "../components/SettingsAttribute";
import { auth, getUserDetailsByUid } from "../config/firebase";
import axios from "axios";
import linkTwitterAccount from "../utils/composio/linkAccount";
import SmallButton from "../components/SmallButton";
import { Audio } from 'react-loader-spinner';
import { useSnackbar } from 'notistack'

const Settings = ({ user }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [username, setUsername] = useState("");
    const [addingUser, setAddingUser] = useState(false);
    const [twitterAccount, setTwitterAccount] = useState("No connected account");
    const [twitterAccountLoading, setTwitterAccountLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [newUsername, setNewUsername] = useState("");
    const [authorisedUsers, setAuthorisedUsers] = useState([
        {
            name: "",
            username: "",
            profilePicUrl: ""
        },
        {
            name: "",
            username: "",
            profilePicUrl: ""
        },
        {
            name: "",
            username: "",
            profilePicUrl: ""
        }
    ]);

    const fetchUserDetails = async () => {
        try {
            const details = await getUserDetailsByUid(user.uid);
            setUserDetails(details);
            return details;
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setAddingUser(true);
        if (!newUsername) {
            enqueueSnackbar("Please enter a username.", { variant: 'warning' });
            setAddingUser(false);
            return;
        }
        enqueueSnackbar('Adding new user...', { variant: 'info' });
        try {
            // Add your logic here to add the new user
            // For example:
            // await addNewUser(user.uid, newUsername);
            enqueueSnackbar('User added successfully.', { variant: 'success' });
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('An error occurred while adding the user', { variant: 'error' });
        } finally {
            setAddingUser(false);
            setNewUsername("");
        }
    }

    const checkConnectionStatus = useCallback(async (appType, setAccountStatus) => {
        try {
            const idToken = await auth.currentUser.getIdToken(true);
            const data = {
                username: user.email.split("@")[0],
                appType: appType
            };
            const checkconnectionURL = import.meta.env.VITE_BACKEND_URL + "/checkconnection"
            const response = await axios.post(checkconnectionURL, data, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.authenticated === "yes") {
                setAccountStatus("Connected");
            }
        } catch (error) {
            console.error(`Error checking ${appType} connection status:`, error);
        }
    }, [user.email]);

    useEffect(() => {
        const initializeUserData = async () => {
            const details = await fetchUserDetails();
            if (details && details.keywords) {
                setKeywords(details.keywords);
            }
        };

        checkConnectionStatus("TWITTER", setTwitterAccount);
        setUsername(user.email.split("@")[0]);
        initializeUserData();
    }, [user.email, user.uid, checkConnectionStatus]);

    const handleLinkTwitterAccount = useCallback(() => {
        linkTwitterAccount(setTwitterAccountLoading, user);
    }, [user]);

    return <div className="flex flex-1 flex-col gap-6 min-h-screen py-8 px-4 mx-auto mt-10 max-w-screen-md text-center lg:py-16 lg:px-12">
        <div className="flex items-center mb-6">
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mx-4">Connect Accounts</h1>
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        </div>
        <SettingsAttribute type="username" displayName="Composio Account" value={username} linkAction={() => { enqueueSnackbar("Account already connected", { variant: 'success' }) }} loading={false} />
        <SettingsAttribute type="twitter" displayName="Twitter Account" value={twitterAccount} linkAction={handleLinkTwitterAccount} loading={twitterAccountLoading} />
        <br />
        <div className="flex items-center mb-6">
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mx-4">Add Users</h1>
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="space-y-6">
            <div className="space-y-4">
                <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full px-4 py-2 border rounded-md"
                />
                <SmallButton 
                    width="14rem" 
                    name={addingUser ? <Audio height="15" width="200" color="white" ariaLabel="loading" /> : "Add User"} 
                    action={handleAddUser} 
                />
            </div>
        </div>
        <br />
        <div className="flex items-center mb-6">
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mx-4">Create Post</h1>
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="space-y-6">
            {/* Add your create post form or components here */}
            <p>Add your create post functionality here.</p>
        </div>
    </div>
};

export default Settings;
