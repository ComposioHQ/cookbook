import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SettingsAttribute from "../components/SettingsAttribute";
import { auth, getUserDetailsByUid, getTriggerStatus } from "../config/firebase";
import axios from "axios";
import { Audio } from 'react-loader-spinner';
import SmallButton from "../components/SmallButton";


const Settings = ({ user }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [gmailAccount, setGmailAccount] = useState("No connected account");
    const [sheetsAccount, setSheetsAccount] = useState("No connected account");
    const [enableTrigger, setEnableTrigger] = useState(false);
    const [enableTriggerLoading, setEnableTriggerLoading] = useState(false);
    const [gmailAccountLoading, setGmailAccountLoading] = useState(false);
    const [sheetsAccountLoading, setSheetsAccountLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const checkConnectionStatus = async (appType, setAccountStatus) => {
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
        };

        const fetchUserDetails = async () => {
            try {
                const details = await getUserDetailsByUid(user.uid);
                setUserDetails(details);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        const checkTriggerStats = async () => {
            const res = await getTriggerStatus(user.email.split("@")[0])
            setEnableTrigger(res)
        }

        checkConnectionStatus("GMAIL", setGmailAccount);
        checkConnectionStatus("GOOGLESHEETS", setSheetsAccount);
        checkTriggerStats();
        setUsername(user.email.split("@")[0]);
        fetchUserDetails();
    }, [user.email, user.uid]);

    const enableTriggerFun = async () => {
        try {
            setEnableTriggerLoading(true);
            const idToken = await auth.currentUser.getIdToken(true);
            const data = {
                username: user.email.split("@")[0],
            };
            const enableTriggerURL = import.meta.env.VITE_BACKEND_URL + "/enabletrigger"
            const response = await axios.post(enableTriggerURL, data, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.authenticated === "yes") {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error enabling trigger:', error);
        } finally {
            setEnableTriggerLoading(false);
        }
    }

    const linkAccount = async (appType) => {
        const loadingStateSetter = appType === "GMAIL" ? setGmailAccountLoading : setSheetsAccountLoading;
        try {
            loadingStateSetter(true);
            const idToken = await auth.currentUser.getIdToken(true);
            const data = {
                username: user.email.split("@")[0],
                appType: appType
            };
            const newEntityURL = import.meta.env.VITE_BACKEND_URL + "/newentity"
            const response = await axios.post(newEntityURL, data, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.authenticated === "yes") {
                alert(response.data.message);
            } else if (response.data.authenticated === "no") {
                window.open(response.data.url, '_blank');
            }
        } catch (error) {
            console.error('Error sending data:', error);
        } finally {
            loadingStateSetter(false);
        }
    }

    const linkGmailAccount = () => linkAccount("GMAIL");
    const linkSheetsAccount = () => linkAccount("GOOGLESHEETS");

    return <div className="flex flex-1 flex-col gap-6 min-h-screen py-8 px-4 mx-auto mt-10 max-w-screen-md text-center lg:py-16 lg:px-12">
        <SettingsAttribute type="username" displayName="Composio Account" value={username} linkAction={() => { alert("Account already connected") }} loading={false} />
        <SettingsAttribute type="gmail" displayName="Gmail Account" value={gmailAccount} linkAction={linkGmailAccount} loading={gmailAccountLoading} />
        <SettingsAttribute type="sheets" displayName="Sheets Account" value={sheetsAccount} linkAction={linkSheetsAccount} loading={sheetsAccountLoading} />
        <SettingsAttribute type="trigger" displayName="Enable Trigger" value={enableTrigger} linkAction={enableTriggerFun} loading={enableTriggerLoading} buttonName="Enable" />
        <br />
        <SettingsAttribute type="sheetid" displayName="Sheet ID" value={userDetails?.sheetsConfig?.spreadsheet_id || "No sheet ID"} linkAction={() => {
            if (userDetails?.sheetsConfig?.spreadsheet_id) {
                window.open(`https://docs.google.com/spreadsheets/d/${userDetails.sheetsConfig.spreadsheet_id}`, '_blank');
            } else {
                alert("No sheet ID available");
            }
        }} loading={false} buttonName="Open" />
        <SettingsAttribute type="sheettitle" displayName="Sheet Title" value={userDetails?.sheetsConfig?.sheetTitle || "No sheet title configured"} linkAction={() => { }} loading={false} buttonName="View" showButton={false} />
        <SettingsAttribute type="keywords" displayName="Keywords" value={userDetails?.sheetsConfig?.keywords || "No keywords configured"} linkAction={() => { }} loading={false} buttonName="View" showButton={false} />
        <SettingsAttribute type="attributes" displayName="Attributes" value={userDetails?.sheetsConfig?.attributes || "No attributes configured"} linkAction={() => { }} loading={false} buttonName="View" showButton={false} />
    </div>
};

export default Settings;
