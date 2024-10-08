import { useEffect, useState, useCallback } from "react";
import { useSnackbar } from 'notistack'
import Separator from "../components/Separator";
import AuthorizedUsers from "../components/AuthorizedUsers";
import { getUserDetailsByUid } from "../config/firebase";
import axios from "axios";
import { auth } from "../config/firebase";
import { Audio } from 'react-loader-spinner';
import SettingsAttribute from "../components/SettingsAttribute";
import GetPostTextArea from "../components/GetPostTextArea";
import HelpButton from "../components/HelpButton";
import { driverObjRepostPageConfig } from "../utils/driver_config_utils";
const driver = window.driver.js.driver;

const RepostExistingTweet = ({ user }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [twitterPostUrl, setTwitterPostUrl] = useState("tweet url");
    const [tweetId, setTweetId] = useState("");
    const [twitterPostUrlLoading, setTwitterPostUrlLoading] = useState(false);
    const [post, setPost] = useState("");
    const [authorisedUsers, setAuthorisedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [generatingQuotes, setGeneratingQuotes] = useState(false);
    const [allAuthorisedUsers, setAllAuthorisedUsers] = useState([]);
    const [handleDriverRepostPage, setHandleDriverRepostPage] = useState(() => { });
    const [quoteGeneratorPrompt, setQuoteGeneratorPrompt] = useState("Generate repost quote for a tweet and emoji in the same string, keep it short, simple, informal and no filler words, also sound like a human");

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
                const connectedUsers = details.authorisedUsers
                    .filter(user => user.isConnected === true)
                    .map(user => ({ ...user, repostWithQuote: false }));
                setAllAuthorisedUsers(connectedUsers);
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
            const admin__id = user.email.split("@")[0];
            const repostDataList = authorisedUsers.map(user => ({
                entity_id: user.username,
                quote: user.quote
            }));
            const response = await axios.post(tweetURL, {
                admin_entity_id: admin__id,
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
                prompt: quoteGeneratorPrompt,
                tweetContent: post,
                numberOfQuotes: authorisedUsers.length
            }, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            const updatedUsers = authorisedUsers.map((user, index) => {
                return {
                    ...user,
                    quote: user.repostWithQuote && data.quotes[index] ? data.quotes[index].replace(/^"|"$/g, '') : ''
                };
            });
            setAuthorisedUsers(updatedUsers);
        } catch (error) {
            console.error("Error generating quotes:", error);
            enqueueSnackbar('Failed to generate quotes', { variant: 'error' });
        } finally {
            setGeneratingQuotes(false);
        }
    }

    useEffect(() => {
        const drive = () => {
            driver(driverObjRepostPageConfig).drive();
        }
        setHandleDriverRepostPage(() => drive);
        fetchUserDetails();
    }, []);

    return <div className="flex flex-1 flex-col gap-6 min-h-screen py-8 px-4 mx-auto mt-10 max-w-screen-md text-center lg:py-16 lg:px-12">
        <div className="border border-gray-200 rounded-md bg-white px-16 py-8 gap-6 flex flex-col shadow-md" id="repost-existing-tweet-section">
            <Separator title="Get Post" />
            <div className="flex flex-col gap-4 items-center justify-center">
                <SettingsAttribute type="password" displayName="Tweet Url" value={twitterPostUrl} linkAction={handleGetTweetText} loading={twitterPostUrlLoading} buttonName="Get" onChangeFunction={setTwitterPostUrl} readOnly={false} nolabel={true} placeholder="enter tweet url" id="tweet-url-input" />
                <GetPostTextArea post={post} setPost={setPost} handlePost={handlePost} handleGenerateQuotes={handleGenerateQuotes} posting={posting} generatingQuotes={generatingQuotes} quoteGeneratorPrompt={quoteGeneratorPrompt} setQuoteGeneratorPrompt={setQuoteGeneratorPrompt} />
            </div>
        </div>
        {/* <div className="border border-gray-200 rounded-md flex flex-col gap-4 py-5 mt-12"> */}
        <div className="mt-12 pt-8 pb-16  border border-gray-200 rounded-md bg-white shadow-md" id="reposters-section-for-repost-existing-tweet">
            <Separator title="Reposters" />
            <AuthorizedUsers authorisedUsers={authorisedUsers} setAuthorisedUsers={setAuthorisedUsers} allAuthorisedUsers={allAuthorisedUsers} setAllAuthorisedUsers={setAllAuthorisedUsers} />
        </div>
        <HelpButton action={handleDriverRepostPage} />
    </div>
};

export default RepostExistingTweet;
