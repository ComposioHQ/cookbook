import ReTweetCard from "./ReTweetCard";
import SkeletonLoader from "./SkeletonLoader";

const AuthorisedUsers = ({ authorisedUsers, setAuthorisedUsers }) => {
    return (<div className="flex flex-col justify-center gap-4">
            {authorisedUsers.length > 0 ? (
                authorisedUsers.map((user) => (
                    <ReTweetCard user={user} key={user.id} setAuthorisedUsers={setAuthorisedUsers}/>
                ))
            ) : (
                <p className="text-gray-500 text-center">No authorized users</p>
            )}
        </div>);
}

export default AuthorisedUsers;
