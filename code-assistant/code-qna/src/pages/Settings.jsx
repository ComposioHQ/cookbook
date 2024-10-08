import { useEffect, useState, useCallback } from "react";
import SettingsAttribute from "../components/SettingsAttribute";
import { checkConnectionStatus, linkTwitterAccount, initiateTwitterConnectionAndConnectAdmin } from "../utils/composio_utils";
import { getComposioApiKey, updateComposioApiKey } from "../config/firebase";
import { useSnackbar } from 'notistack'
import Separator from "../components/Separator";
import AddNewUser from "../components/AddNewUser";
import HelpButton from "../components/HelpButton";
import { driverObjSettingsPageConfig } from "../utils/driver_config_utils";
const driver = window.driver.js.driver;


const Settings = ({ user }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [username, setUsername] = useState("");
    const [twitterAccount, setTwitterAccount] = useState("No connected account");
    const [twitterAccountLoading, setTwitterAccountLoading] = useState(false);
    const [composioApiKey, setComposioApiKey] = useState("");
    const [composioApiKeyLoading, setComposioApiKeyLoading] = useState(false);
    const [handleDriverSettingsPage, setHandleDriverSettingsPage] = useState(() => { });

    useEffect(() => {
        const drive = () => {
            driver(driverObjSettingsPageConfig).drive();
        }
        setHandleDriverSettingsPage(() => drive);
        const getApiKey = async () => {
            const apiKey = await getComposioApiKey(user.uid);
            if (apiKey === "") {
                drive();
            } else {
                setComposioApiKey(apiKey);
            }
        }
        getApiKey();
        checkConnectionStatus(user.email.split("@")[0], "TWITTER", setTwitterAccount, user.email.split("@")[0]);
        setUsername(user.email.split("@")[0]);
    }, [user.uid, checkConnectionStatus]);

    const handleChangeComposioApiKey = async () => {
        try {
            setComposioApiKeyLoading(true)
            await updateComposioApiKey(user.uid, composioApiKey);
            enqueueSnackbar("Composio API key updated successfully", { variant: 'success' });
        } catch (error) {
            enqueueSnackbar("Error updating Composio API key", { variant: 'error' });
        } finally {
            setComposioApiKeyLoading(false)
        }
    }

    const handleLinkTwitterAccount = async () => {
        if (composioApiKey === "") {
            enqueueSnackbar("Please add Composio API key first", { variant: 'warning' });
            return;
        }
        await initiateTwitterConnectionAndConnectAdmin(user.email.split("@")[0], setTwitterAccountLoading);
    }

    return <div className="flex flex-1 flex-col gap-6 min-h-screen py-8 px-4 mx-auto mt-10 max-w-screen-md text-center lg:py-16 lg:px-12">
        <div className="border border-gray-200 rounded-md bg-white px-16 py-8 gap-6 flex flex-col shadow-md" id="connect-accounts-section">
            <Separator title="Connect Accounts" />
            <SettingsAttribute type="password" displayName="Composio API Key" value={composioApiKey} linkAction={handleChangeComposioApiKey} loading={composioApiKeyLoading} buttonName="Add" onChangeFunction={setComposioApiKey} readOnly={false} />
            <SettingsAttribute type="twitter" displayName="Twitter Account" value={twitterAccount} linkAction={handleLinkTwitterAccount} loading={twitterAccountLoading} />
        </div>
        <br />
        <AddNewUser user={user} />
        <HelpButton action={handleDriverSettingsPage} />
    </div>
};

export default Settings;
