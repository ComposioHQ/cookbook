import { useState, useEffect } from "react";

const ReTweetCard = ({ user, setAuthorisedUsers }) => {
    const [quote, setQuote] = useState("");
    const [isChecked, setIsChecked] = useState(false);

    const updateUser = (newQuote, repostWithQuote) => {
        setAuthorisedUsers(prev => {
            const updatedUsers = prev.map(u => {
                if (u.id === user.id) {
                    return { ...u, quote: newQuote, repostWithQuote: repostWithQuote };
                }
                return u;
            });
            return updatedUsers;
        });
    };

    useEffect(() => {
        setQuote(user.quote || "");
    }, [user]);

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsChecked(checked);
        if (!checked) {
            setQuote("");
            updateUser("", false);
        } else {
            updateUser(quote, true);
        }
    };

    return <div className="border border-gray-200 rounded-md bg-white px-8 py-5 max-w-3xl gap-4 mx-4">
        <div className="flex flex-wrap items-center justify-between">
            <div>
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <img className="h-14 w-14 rounded-full" src={user.profile_image_url} alt="" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 text-left">{user.name}</h3>
                        <p className="text-sm text-gray-500 hover:text-gray-700">
                            <a href={`https://x.com/${user.username}`} target="_blank" rel="noopener noreferrer">@{user.username}</a>
                        </p>
                    </div>
                </div>
                <div>
                    <div className="relative flex items-start mt-7">
                        <div className="flex h-6 items-center gap-2 ml-2">
                            <input
                                type="checkbox"
                                aria-describedby="comments-description"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            <label className="text-gray-500 text-left text-sm">
                                Repost with quote
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <textarea
                className="block w-3/5  rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 py-1.5 px-3"
                placeholder="Retweet quote..."
                value={quote}
                rows={4}
                onChange={(e) => {
                    const newQuote = e.target.value;
                    setQuote(newQuote);
                    if (newQuote) {
                        setIsChecked(true);
                        updateUser(newQuote, true);
                    } else {
                        updateUser(newQuote, isChecked);
                    }
                }}
                disabled={!isChecked}
            ></textarea>
        </div>
    </div>
}

export default ReTweetCard;