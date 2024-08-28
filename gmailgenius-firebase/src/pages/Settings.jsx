import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SettingsAttribute from "../components/SettingsAttribute";
import { auth, getUserDetailsByUid } from "../config/firebase";
import axios from "axios";


const Settings = ({ user }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [gmailAccount, setGmailAccount] = useState("No connected account");
    const [sheetsAccount, setSheetsAccount] = useState("No connected account");
    useEffect(() => {
        const getGmailConnectionStatus = async () => {
            try {
                const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
                const data = {
                    username: "abishkpatil",
                    appType: "GMAIL"
                };
                const response = await axios.post('http://localhost:8000/checkconnection', data, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data.authenticated === "yes") {
                    setGmailAccount("Connected");
                }
            } catch (error) {
                console.error('Error sending data:', error);
            }
        }
        const getSheetsConnectionStatus = async () => {
            try {
                const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
                const data = {
                    username: "abishkpatil",
                    appType: "GOOGLESHEETS"
                };
                const response = await axios.post('http://localhost:8000/checkconnection', data, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data.authenticated === "yes") {
                    setSheetsAccount("Connected");

                }
            } catch (error) {
                console.error('Error sending data:', error);
            }
        }
        if (gmailAccount === "No connected account") {
            getGmailConnectionStatus();
        }
        if (sheetsAccount === "No connected account") {
            getSheetsConnectionStatus();
        }
        setUsername(user.email.split("@")[0]);
    }, [])
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [gmailAccountLoading, setGmailAccountLoading] = useState(false);
    const [sheetsAccountLoading, setSheetsAccountLoading] = useState(false);

    const linkGmailAccount = async () => {
        try {
            setGmailAccountLoading(true);
            const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
            const data = {
                username: "abishkpatil",
                appType: "GMAIL"
            };
            const response = await axios.post('http://localhost:8000/newentity', data, {
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
            setGmailAccountLoading(false);
        }
    }
    const linkSheetsAccount = async () => {
        try {
            setSheetsAccountLoading(true);
            const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
            const data = {
                username: "abishkpatil",
                appType: "GOOGLESHEETS"
            };
            const response = await axios.post('http://localhost:8000/newentity', data, {
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
            setSheetsAccountLoading(false);
        }
    }

    return <div className="flex flex-1 flex-col gap-6 min-h-screen py-8 px-4 mx-auto mt-10 max-w-screen-md text-center lg:py-16 lg:px-12">
        <SettingsAttribute type="username" displayName="Composio Account" value={username} linkAction={() => { }} loading={usernameLoading} />
        <SettingsAttribute type="gmail" displayName="Gmail Account" value={gmailAccount} linkAction={linkGmailAccount} loading={gmailAccountLoading} />
        <SettingsAttribute type="sheets" displayName="Sheets Account" value={sheetsAccount} linkAction={linkSheetsAccount} loading={sheetsAccountLoading} />
    </div>
};

export default Settings;