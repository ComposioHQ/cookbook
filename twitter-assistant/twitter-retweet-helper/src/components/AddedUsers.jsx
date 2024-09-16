import TwitterUserCard from "./TwitterUserCard";
import { checkConnectionStatus } from "../utils/composio_utils";
import { useState, useEffect, useCallback } from "react";
import SkeletonLoader from "./SkeletonLoader";
import { updateAuthorisedUserConnectionStatus } from "../config/firebase";

const AddedUsers = ({ authorisedUsers, adminId }) => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);

    const checkUsersConnection = useCallback(async () => {
        setFetchingUsers(true);
        const updatedUsers = await Promise.all(
            authorisedUsers.map(async (user) => {
                let isConnected = user.isConnected;
                if (!isConnected) {
                    let res = await checkConnectionStatus("TWITTER", setConnected, user.username);
                    if (res === "yes") {
                        isConnected = true;
                        await updateAuthorisedUserConnectionStatus(adminId, user.username);
                    }
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
                <SkeletonLoader />
            ) : (
                connectedUsers.length > 0 ? (
                    connectedUsers.map((user) => (
                        <TwitterUserCard user={user} key={user.id} connected={user.isConnected} authUrl={user.authUrl} />
                    ))
                ) : (
                    <p className="text-gray-500">No authorised users added yet.</p>
                )
            )}
        </div>
    );
}

export default AddedUsers;
