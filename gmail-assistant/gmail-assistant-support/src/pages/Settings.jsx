import { useEffect, useState } from "react";
import SettingsAttribute from "../components/SettingsAttribute";
import { auth, getUserDetailsByUid, getTriggerStatus } from "../config/firebase";
import axios from "axios";
import { addKeywords } from '../config/firebase';
import SmallButton from "../components/SmallButton";
import { Audio } from 'react-loader-spinner';
import { useSnackbar } from 'notistack'

const Settings = ({ user }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [username, setUsername] = useState("");
    const [gmailAccount, setGmailAccount] = useState("No connected account");
    const [slackAccount, setSlackAccount] = useState("No connected account");
    const [enableTrigger, setEnableTrigger] = useState(false);
    const [enableTriggerLoading, setEnableTriggerLoading] = useState(false);
    const [gmailAccountLoading, setGmailAccountLoading] = useState(false);
    const [slackAccountLoading, setSlackAccountLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [keywords, setKeywords] = useState([
        {
            keywords: "",
            email: "",
            slackChannel: ""
        },
        {
            keywords: "",
            email: "",
            slackChannel: ""
        },
        {
            keywords: "",
            email: "",
            slackChannel: ""
        }
    ]);
    const [addingAgent, setAddingAgent] = useState(false);

    const fetchUserDetails = async () => {
        try {
            const details = await getUserDetailsByUid(user.uid);
            setUserDetails(details);
            return details;
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleAddAgent = async (e) => {
        e.preventDefault();
        setAddingAgent(true);
        if (!keywords[0].keywords || !keywords[0].email || !keywords[0].slackChannel) {
            enqueueSnackbar("Please fill in all fields for keywords, email, and Slack channel for at least the first set.", { variant: 'warning' });
            setAddingAgent(false);
            return;
        }
        enqueueSnackbar('Updating keywords and creating new configurations...', { variant: 'info' });
        await addKeywords(user.uid, keywords);
        try {
            const idToken = await user.getIdToken(true);
            const createsheetURL = import.meta.env.VITE_BACKEND_URL + "/initialiseagent"
            const response = await axios.post(createsheetURL, {
                username: user.email.split("@")[0]
            }, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.data) {
                enqueueSnackbar('Configuration updated successfully.', { variant: 'success' });
                enqueueSnackbar('A test email has been sent to your gmail, wait & watch the magic!', { variant: 'success' });
            } else {
                enqueueSnackbar('Failed to update configuration.', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error:', error);
            enqueueSnackbar('An error occurred while adding keywords', { variant: 'error' });
        } finally {
            setAddingAgent(false);
        }
    }

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

        const initializeUserData = async () => {
            const details = await fetchUserDetails();
            if (details && details.keywords) {
                setKeywords(details.keywords);
            }
        };

        const checkTriggerStatus = async () => {
            const res = await getTriggerStatus(user.email.split("@")[0])
            setEnableTrigger(res)
        }

        checkConnectionStatus("GMAIL", setGmailAccount);
        checkConnectionStatus("SLACKBOT", setSlackAccount);
        checkTriggerStatus();
        setUsername(user.email.split("@")[0]);
        initializeUserData();
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
            enqueueSnackbar("Trigger enabled", { variant: 'success' });
        } catch (error) {
            enqueueSnackbar("Error enabling trigger", { variant: 'error' });
            console.error('Error enabling trigger:', error);
        } finally {
            setEnableTriggerLoading(false);
        }
    }

    const linkAccount = async (appType) => {
        const loadingStateSetter = appType === "GMAIL" ? setGmailAccountLoading : setSlackAccountLoading;
        try {
            loadingStateSetter(true);
            const idToken = await auth.currentUser.getIdToken(true);
            const data = {
                username: user.email.split("@")[0],
                appType: appType,
                redirectUrl: window.location.href
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
    const linkSlackAccount = () => linkAccount("SLACKBOT");

    const handleKeywordChange = (index, field, value) => {
        setKeywords(prevKeywords => {
            const newKeywords = [...prevKeywords];
            if (newKeywords[index]) {
                newKeywords[index] = { ...newKeywords[index], [field]: value };
            }
            return newKeywords;
        });
    };

    return <div className="flex flex-1 flex-col gap-6 min-h-screen py-8 px-4 mx-auto mt-10 max-w-screen-md text-center lg:py-16 lg:px-12">
        <div className="flex items-center mb-6">
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mx-4">Connect Accounts</h1>
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        </div>
        <SettingsAttribute type="username" displayName="Composio Account" value={username} linkAction={() => { enqueueSnackbar("Account already connected", { variant: 'success' }) }} loading={false} />
        <SettingsAttribute type="gmail" displayName="Gmail Account" value={gmailAccount} linkAction={linkGmailAccount} loading={gmailAccountLoading} />
        <SettingsAttribute type="slack" displayName="Slack Account" value={slackAccount} linkAction={linkSlackAccount} loading={slackAccountLoading} />
        <SettingsAttribute type="trigger" displayName="Enable Gmail Trigger" value={enableTrigger ? "Enabled" : "Disabled"} linkAction={enableTriggerFun} loading={enableTriggerLoading} buttonName={"Enable"} />
        <br />
        <div className="flex items-center mb-6">
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mx-4">Add Agent</h1>
            <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="space-y-6">
            <div className="space-y-4">
                <SettingsAttribute 
                    type="keywords" 
                    displayName="Keywords 1" 
                    value={keywords[0]?.keywords || 'e.g. bugs, errors, issues'}
                    loading={false} 
                    buttonName="View" 
                    showButton={false} 
                    textArea={true} 
                    onChangeFunction={(value) => handleKeywordChange(0, 'keywords', value)} 
                />
                <SettingsAttribute 
                    type="email" 
                    displayName="Email 1" 
                    value={keywords[0]?.email || 'e.g. devteam@company.com'} 
                    loading={false} 
                    buttonName="View" 
                    showButton={false} 
                    textArea={false} 
                    onChangeFunction={(value) => handleKeywordChange(0, 'email', value)} 
                />
                <SettingsAttribute 
                    type="slackChannel" 
                    displayName="Slack Channel 1" 
                    value={keywords[0]?.slackChannel || 'e.g. dev-channel'} 
                    loading={false} 
                    buttonName="View" 
                    showButton={false} 
                    textArea={false} 
                    onChangeFunction={(value) => handleKeywordChange(0, 'slackChannel', value)} 
                />
            </div>
            <h2 className="text-xl text-left pt-8 font-bold text-gray-700 dark:text-gray-300">Optional</h2>
            <div className="space-y-4">
                <SettingsAttribute 
                    type="keywords" 
                    displayName="Keywords 2" 
                    value={keywords[1]?.keywords || ''} 
                    loading={false} 
                    buttonName="View" 
                    showButton={false} 
                    textArea={true} 
                    onChangeFunction={(value) => handleKeywordChange(1, 'keywords', value)} 
                />
                <SettingsAttribute 
                    type="email" 
                    displayName="Email 2" 
                    value={keywords[1]?.email || ''} 
                    loading={false} 
                    buttonName="View" 
                    showButton={false} 
                    textArea={false} 
                    onChangeFunction={(value) => handleKeywordChange(1, 'email', value)} 
                />
                <SettingsAttribute 
                    type="slackChannel" 
                    displayName="Slack Channel 2" 
                    value={keywords[1]?.slackChannel || ''} 
                    loading={false} 
                    buttonName="View" 
                    showButton={false} 
                    textArea={false} 
                    onChangeFunction={(value) => handleKeywordChange(1, 'slackChannel', value)} 
                />
            </div>
            <div className="space-y-4">
                <SettingsAttribute 
                    type="keywords" 
                    displayName="Keywords 3" 
                    value={keywords[2]?.keywords || ''} 
                    loading={false} 
                    buttonName="View" 
                    showButton={false} 
                    textArea={true} 
                    onChangeFunction={(value) => handleKeywordChange(2, 'keywords', value)} 
                />
                <SettingsAttribute 
                    type="email" 
                    displayName="Email 3" 
                    value={keywords[2]?.email || ''} 
                    loading={false} 
                    buttonName="View" 
                    showButton={false} 
                    textArea={false} 
                    onChangeFunction={(value) => handleKeywordChange(2, 'email', value)} 
                />
                <SettingsAttribute 
                    type="slackChannel" 
                    displayName="Slack Channel 3" 
                    value={keywords[2]?.slackChannel || ''} 
                    loading={false} 
                    buttonName="View" 
                    showButton={false} 
                    textArea={false} 
                    onChangeFunction={(value) => handleKeywordChange(2, 'slackChannel', value)} 
                />
            </div>
        </div>
        <div className="flex justify-center mt-8">
            <SmallButton width="14rem" name={addingAgent ? <Audio
                height="15"
                width="200"
                color="white"
                ariaLabel="loading"
            /> : "Activate My Gmail Genius!"} action={handleAddAgent} />
        </div>
    </div>
};

export default Settings;
