import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SettingsAttribute from "../components/SettingsAttribute";
import { auth, getUserDetailsByUid } from "../config/firebase";
import axios from "axios";


const Settings = ({ user }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [accountStatuses, setAccountStatuses] = useState({
        gmail: "No connected account",
        sheets: "No connected account"
    });

    const checkConnectionStatus = async (appType) => {
        try {
            const idToken = await auth.currentUser.getIdToken(true);
            const data = {
                username: user.username,
                appType: appType
            };
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/checkconnection`, data, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.authenticated === "yes") {
                setAccountStatuses(prev => ({...prev, [appType.toLowerCase()]: "Connected"}));
            }
        } catch (error) {
            console.error(`Error checking ${appType} connection status:`, error);
        }
    };

    useEffect(() => {
        const checkAllConnections = async () => {
            await Promise.all([
                checkConnectionStatus("GMAIL"),
                checkConnectionStatus("GOOGLESHEETS")
            ]);
        };

        checkAllConnections();
        setUsername(user.username);
    }, [user.username]);
    const [gmailAccountLoading, setGmailAccountLoading] = useState(false);
    const [sheetsAccountLoading, setSheetsAccountLoading] = useState(false);

    const linkAccount = async (appType) => {
        const loadingStateSetter = appType === "GMAIL" ? setGmailAccountLoading : setSheetsAccountLoading;
        try {
            loadingStateSetter(true);
            const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
            const data = {
                username: user.username,
                appType: appType
            };
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/newentity`, data, {
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
        <SettingsAttribute type="username" displayName="Composio Account" value={username} linkAction={() => { }} loading={false} />
        <SettingsAttribute type="gmail" displayName="Gmail Account" value={accountStatuses.gmail} linkAction={linkGmailAccount} loading={gmailAccountLoading} />
        <SettingsAttribute type="sheets" displayName="Sheets Account" value={accountStatuses.sheets} linkAction={linkSheetsAccount} loading={sheetsAccountLoading} />
    </div>
};

export default Settings;