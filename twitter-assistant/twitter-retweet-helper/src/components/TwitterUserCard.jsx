import { BsCheckCircle } from "react-icons/bs";
import SmallButton from "./SmallButton";
import { Audio } from 'react-loader-spinner';
import { useState } from "react";
import Clipboard from "./Clipboard";

const TwitterUserCard = ({ user, action, connected, authUrl }) => {
    return <div className="border border-gray-200 rounded-md bg-white px-16 py-5 max-w-3xl gap-4 mx-8">
        <div className="flex flex-wrap items-center justify-between">
            <div>
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <img className="h-14 w-14 rounded-full" src={user.profile_image_url} alt="" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 text-left">{user.name}</h3>
                        <p className="text-sm text-gray-500 hover:text-gray-700 text-left">
                            <a href={`https://x.com/${user.username}`} target="_blank" rel="noopener noreferrer">@{user.username}</a>
                        </p>
                    </div>
                </div>
            </div>
            {connected ?
                <div className="bg-green-500 rounded-full text-green-100 text-2xl">
                    <BsCheckCircle />
                </div>
                :
                <Clipboard authUrl={authUrl} />
            }
        </div>
    </div>
}

export default TwitterUserCard;