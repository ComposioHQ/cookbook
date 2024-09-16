import TwitterUserCard from "./TwitterUserCard";
import { checkConnectionStatus } from "../utils/composio_utils";
import { useState, useEffect, useCallback } from "react";
import { linkTwitterAccount } from "../utils/composio_utils";

const AddedUsers = ({ authorisedUsers }) => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const linkAccount = async (user) => {
        await linkTwitterAccount(user);
    }

    const checkUsersConnection = useCallback(async () => {
        const updatedUsers = await Promise.all(
            // authorisedUsers.map(async (user) => {
            //     let isConnected = false;
            //     await checkConnectionStatus("TWITTER", (status) => {
            //         isConnected = status === "Connected";
            //     }, user.username);
            //     return { ...user, isConnected };
            // })
            authorisedUsers.map(async (user) => {
                let isConnected = false;
                let res = await checkConnectionStatus("TWITTER", setConnected, user.username);
                if(res==="yes"){
                    isConnected = true;
                }
                return { ...user, isConnected };
            })
        );
        setConnectedUsers(updatedUsers);
    }, [authorisedUsers]);

    useEffect(() => {
        checkUsersConnection();
    }, [checkUsersConnection]);

    return (
        <div className="flex flex-col justify-center gap-4">
            {connectedUsers.length > 0 ? (
                connectedUsers.map((user) => (
                    <TwitterUserCard user={user} key={user.id} connected={user.isConnected} action={() => linkAccount(user.username)} />
                ))
            ) : (
                <p className="text-gray-500">No authorised users added yet.</p>
            )}
        </div>
    );
}

export default AddedUsers;
