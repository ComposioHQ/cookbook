import { useEffect, useState, useCallback } from "react";
import SettingsAttribute from "../components/SettingsAttribute";
import { auth, getUserDetailsByUid, addUserToAuthorisedUsers } from "../config/firebase";
import axios from "axios";
import { checkConnectionStatus, linkTwitterAccount } from "../utils/composio_utils";
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

    useEffect(() => {
        const initializeAuthorisedUsersData = async () => {
            const details = await fetchUserDetails();
            if (details && details.authorisedUsers) {
                setAuthorisedUsers(details.authorisedUsers);
            }
        };
        checkConnectionStatus("TWITTER", setTwitterAccount, user.email.split("@")[0]);
        setUsername(user.email.split("@")[0]);
        initializeAuthorisedUsersData();
    }, [user.uid, checkConnectionStatus]);

    const handleLinkTwitterAccount = () => {
        linkTwitterAccount(setTwitterAccountLoading, user.email.split("@")[0]);
    }

    return <div className="flex flex-1 flex-col gap-6 min-h-screen py-8 px-4 mx-auto mt-10 max-w-screen-md text-center lg:py-16 lg:px-12">
        <Separator title="Connect Accounts" />
        <SettingsAttribute type="username" displayName="Composio Account" value={username} linkAction={() => { enqueueSnackbar("Account already connected", { variant: 'success' }) }} loading={false} />
        <SettingsAttribute type="twitter" displayName="Twitter Account" value={twitterAccount} linkAction={handleLinkTwitterAccount} loading={twitterAccountLoading} />
        <br />
        <AddNewUser authorisedUsers={authorisedUsers} setAuthorisedUsers={setAuthorisedUsers} user={user} />
    </div>
};

export default Settings;
