import { useEffect, useState, useCallback } from "react";
import { useSnackbar } from 'notistack'
import Separator from "../components/Separator";
import AuthorizedUsers from "../components/AuthorizedUsers";
import { getUserDetailsByUid } from "../config/firebase";
import SmallButton from "../components/SmallButton";
import axios from "axios";
import { auth } from "../config/firebase";
import { Audio } from 'react-loader-spinner';
import SettingsAttribute from "../components/SettingsAttribute";

const CreatePost = ({ user }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [twitterPostUrl, setTwitterPostUrl] = useState("");
    const [tweetId, setTweetId] = useState("");
    const [twitterPostUrlLoading, setTwitterPostUrlLoading] = useState(false);
    const [post, setPost] = useState("");
    const [authorisedUsers, setAuthorisedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [generatingQuotes, setGeneratingQuotes] = useState(false);

    const handleGetTweetText = async () => {
        setTwitterPostUrlLoading(true);
        const extractTweetId = (url) => {
            const urlParts = url.split('/');
            setTweetId(urlParts[urlParts.length - 1]);
            return urlParts[urlParts.length - 1];
        };
        try {
            const idToken = await auth.currentUser.getIdToken(true);
            const getTweetTextURL = import.meta.env.VITE_BACKEND_URL + "/gettweet";
            const response = await axios.post(getTweetTextURL, {
                tweet_id: extractTweetId(twitterPostUrl)
            }, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = response.data;
            setPost(data.tweet_text);
            enqueueSnackbar('Tweet text fetched successfully', { variant: 'success' });
        } catch (error) {
            console.error("Error fetching tweet text:", error);
            enqueueSnackbar('Failed to fetch tweet text', { variant: 'error' });
        } finally {
            setTwitterPostUrlLoading(false);
        }
    }

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const details = await getUserDetailsByUid(user.uid);
            if (details && details.authorisedUsers) {
                const connectedUsers = details.authorisedUsers.filter(user => user.isConnected === true);
                setAuthorisedUsers(connectedUsers);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            enqueueSnackbar('Failed to fetch user details', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    const handlePost = async (e) => {
        e.preventDefault();
        if (post.length === 0) {
            enqueueSnackbar('Please enter some post content', { variant: 'warning' });
            return;
        }
        try {
            setPosting(true);
            const idToken = await auth.currentUser.getIdToken(true);
            const tweetURL = import.meta.env.VITE_BACKEND_URL + "/repostexisting";
            const repostDataList = authorisedUsers.map(user => ({
                entity_id: user.username,
                quote: user.quote
            }));
            const response = await axios.post(tweetURL, {
                tweet_id: tweetId,
                repost_data_list: repostDataList
            }, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });
            enqueueSnackbar('Post created successfully', { variant: 'success' });
        } catch (error) {
            console.error("Error creating post:", error);
            enqueueSnackbar('Failed to create post', { variant: 'error' });
        } finally {
            setPosting(false);
        }
    }

    const handleGenerateQuotes = async () => {
        if (post.length === 0) {
            enqueueSnackbar('Please fetch the tweet text first', { variant: 'warning' });
            return;
        }
        try {
            setGeneratingQuotes(true);
            const idToken = await auth.currentUser.getIdToken(true);
            const getQuotesURL = import.meta.env.VITE_BACKEND_URL + "/getquotes";
            const response = await axios.post(getQuotesURL, {
                tweetContent: post,
                numberOfQuotes: authorisedUsers.length
            }, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            const updatedUsers = authorisedUsers.map((user, index) => ({
                ...user,
                quote: data.quotes[index] ? data.quotes[index].replace(/^"|"$/g, '') : ''
            }));
            setAuthorisedUsers(updatedUsers);
        } catch (error) {
            console.error("Error generating quotes:", error);
            enqueueSnackbar('Failed to generate quotes', { variant: 'error' });
        } finally {
            setGeneratingQuotes(false);
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return <div className="flex flex-1 flex-col gap-6 min-h-screen py-8 px-4 mx-auto mt-10 max-w-screen-md text-center lg:py-16 lg:px-12">
        <Separator title="Existing Post" />
        <form onSubmit={handlePost} className="flex flex-col gap-8 items-center justify-center">
            <SettingsAttribute type="password" displayName="Tweet Url" value={twitterPostUrl} linkAction={handleGetTweetText} loading={twitterPostUrlLoading} buttonName="Get" onChangeFunction={setTwitterPostUrl} readOnly={false}/>
            <textarea
                className="cursor-default block w-2/3 mx-auto focus:outline-none rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 py-1.5 px-3"
                placeholder="Tweet content.."
                value={post}
                rows={5}
                onChange={(e) => {
                    setPost(e.target.value);
                }}
                readOnly={true}
            ></textarea>
            <div className="flex gap-4">
                <SmallButton
                    type="submit"
                    width="10rem"
                    name={posting ? <Audio height="15" color="white" ariaLabel="loading" /> : "Retweet"}
                />
                <SmallButton
                    width="14rem"
                    name={generatingQuotes ? <Audio height="15" color="white" ariaLabel="loading" /> : "Generate Retweet Quotes"}
                    action={handleGenerateQuotes}
                />
            </div>
        </form>
        <div className="pt-12">
            <Separator title="Retweet Quotes" />
            <AuthorizedUsers authorisedUsers={authorisedUsers} setAuthorisedUsers={setAuthorisedUsers}/>
        </div>
    </div>
};

export default CreatePost;
