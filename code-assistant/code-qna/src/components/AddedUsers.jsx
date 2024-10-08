import TwitterUserCard from "./TwitterUserCard";
import { checkConnectionStatus } from "../utils/composio_utils";
import { useState, useEffect, useCallback } from "react";
import SkeletonLoader from "./SkeletonLoader";
import { updateAuthorisedUserConnectionStatus } from "../config/firebase";

const AddedUsers = ({ authorisedUsers, adminId, adminUsername }) => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);

    const checkUsersConnection = useCallback(async () => {
        setFetchingUsers(true);
        const updatedUsers = await Promise.all(
            authorisedUsers.map(async (user) => {
                let isConnected = user.isConnected;
                if (!isConnected) {
                    let res = await checkConnectionStatus(adminUsername, "TWITTER", setConnected, user.username);
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

    return (<>
        <input
            type="text"
            placeholder="Search users..."
            className="border border-gray-300 rounded-md mx-8 mt-8"
            onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                setConnectedUsers(
                    authorisedUsers.filter((user) =>
                        user.username.toLowerCase().includes(searchTerm)
                    )
                );
            }}
        />
        <div className="flex flex-col gap-4 h-96 overflow-y-scroll">
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
    </>
    );
}

export default AddedUsers;
