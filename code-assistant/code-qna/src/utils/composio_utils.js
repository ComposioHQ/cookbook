import { auth } from "../config/firebase";
import axios from "axios";

const initiateTwitterConnectionAndConnectAdmin = async (user, setTwitterAccountLoading = null) => {
    try {
        if (setTwitterAccountLoading) setTwitterAccountLoading(true);
        const idToken = await auth.currentUser.getIdToken(true);
        const data = {
            username: user,
            redirectUrl: window.location.href
        };
        const newIntegrationURL = import.meta.env.VITE_BACKEND_URL + "/newintegration"
        const response = await axios.post(newIntegrationURL, data, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.authenticated === "yes") {
            alert(response.data.message);
        } else if (response.data.authenticated === "no") {
            if (!setTwitterAccountLoading) {
                return response.data.url;
            }
            window.open(response.data.url, '_blank');
        }
    } catch (error) {
        console.error('Error sending data:', error);
    } finally {
        if (setTwitterAccountLoading) setTwitterAccountLoading(false);
    }
}

const linkTwitterAccount = async (admin, user) => {
    try {
        const idToken = await auth.currentUser.getIdToken(true);
        const data = {
            username: admin,
            newUserId: user,
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
            return response.data.url;
        }
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

const checkConnectionStatus = async (admin_username, appType, setAccountStatus, entityId) => {
    try {
        const idToken = await auth.currentUser.getIdToken(true);
        const data = {
            admin_username: admin_username,
            username: entityId,
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
        return response.data.authenticated;
    } catch (error) {
        console.error(`Error checking ${appType} connection status:`, error);
    }
}

export { checkConnectionStatus, linkTwitterAccount, initiateTwitterConnectionAndConnectAdmin };
