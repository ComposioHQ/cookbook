import { useEffect, useState, useCallback } from "react";
import SettingsAttribute from "../components/SettingsAttribute";
import { auth, getUserDetailsByUid, addUserToAuthorisedUsers } from "../config/firebase";
import axios from "axios";
import linkTwitterAccount from "../utils/composio/linkAccount";
import { useSnackbar } from 'notistack'
import Separator from "../components/Separator";
import AddNewUser from "../components/AddNewUser";

const Settings = ({ user }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [username, setUsername] = useState("");
    const [twitterAccount, setTwitterAccount] = useState("No connected account");
    const [twitterAccountLoading, setTwitterAccountLoading] = useState(false);
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
        const initializeAuthorisedUsersData = async () => {
            const details = await fetchUserDetails();
            if (details && details.authorisedUsers) {
                setAuthorisedUsers(details.authorisedUsers);
            }
        };

        checkConnectionStatus("TWITTER", setTwitterAccount);
        setUsername(user.email.split("@")[0]);
        initializeAuthorisedUsersData();
    }, [user.email, user.uid, checkConnectionStatus]);

    const handleLinkTwitterAccount = useCallback(() => {
        linkTwitterAccount(setTwitterAccountLoading, user);
    }, [user]);

    return <div className="flex flex-1 flex-col gap-6 min-h-screen py-8 px-4 mx-auto mt-10 max-w-screen-md text-center lg:py-16 lg:px-12">
        <Separator title="Connect Accounts" />
        <SettingsAttribute type="username" displayName="Composio Account" value={username} linkAction={() => { enqueueSnackbar("Account already connected", { variant: 'success' }) }} loading={false} />
        <SettingsAttribute type="twitter" displayName="Twitter Account" value={twitterAccount} linkAction={handleLinkTwitterAccount} loading={twitterAccountLoading} />
        <br />
        <AddNewUser authorisedUsers={authorisedUsers} setAuthorisedUsers={setAuthorisedUsers} user={user} />
    </div>
};

export default Settings;
