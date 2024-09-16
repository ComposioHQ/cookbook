import TwitterUserCard from "./TwitterUserCard";
import { checkConnectionStatus } from "../utils/composio_utils";
import { useState, useEffect, useCallback } from "react";
import { linkTwitterAccount } from "../utils/composio_utils";
import SkeletonLoader from "./SkeletonLoader";

const AddedUsers = ({ authorisedUsers }) => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);
    const linkAccount = async (user) => {
        await linkTwitterAccount(user);
    }

    const checkUsersConnection = useCallback(async () => {
        setFetchingUsers(true);
        const updatedUsers = await Promise.all(
            authorisedUsers.map(async (user) => {
                let isConnected = false;
                let res = await checkConnectionStatus("TWITTER", setConnected, user.username);
                if (res === "yes") {
                    isConnected = true;
                }
                return { ...user, isConnected };
            })
        );
        setConnectedUsers(updatedUsers);
        setFetchingUsers(false);
    }, [authorisedUsers]);

    useEffect(() => {
        checkUsersConnection();
    }, [checkUsersConnection]);

    return (
        <div className="flex flex-col justify-center gap-4">
            {fetchingUsers ? (
                // <p className="text-gray-500">Fetching users...</p>
                <SkeletonLoader />
            ) : (
                connectedUsers.length > 0 ? (
                    connectedUsers.map((user) => (
                        <TwitterUserCard user={user} key={user.id} connected={user.isConnected} action={() => linkAccount(user.username)} />
                    ))
                ) : (
                    <p className="text-gray-500">No authorised users added yet.</p>
                )
            )}
        </div>
    );
}

export default AddedUsers;
