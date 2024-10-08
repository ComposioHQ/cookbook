import 'rsuite/Loader/styles/index.css';
import { Loader } from 'rsuite';
import ComingSoon from './ComingSoon';
import { useState } from 'react';
export default function GetPostTextArea({ post, setPost, handlePost, handleGenerateQuotes, posting, generatingQuotes, quoteGeneratorPrompt, setQuoteGeneratorPrompt }) {
    const [comingSoon, setComingSoon] = useState(false);
    return (
        <div className="flex items-start w-full">
            <div className="min-w-0 flex-1">
                <form onSubmit={(e) => handlePost(e)} className="relative">
                    <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <textarea
                            readOnly
                            rows={8}
                            placeholder="tweet content..."
                            className="cursor-default block w-full resize-none border-0 bg-transparent p-3 text-gray-900 placeholder:text-gray-400 focus:ring-0"
                            value={post}
                        />
                        <div aria-hidden="true" className="py-2">
                            <div className="py-px">
                                <div className="h-9" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex justify-between p-3">
                        <div className="flex items-center space-x-5">
                            <button onClick={() => setComingSoon(true)} type="button" className="text-sm text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full px-3 py-1">Advanced Options</button>
                        </div>
                        <div className="flex-shrink-0 flex gap-2">
                            <button
                                id="generate-retweet-quotes-for-existing-tweet-button"
                                type="button"
                                className="focus:outline-none text-white w-60 bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 h-[2.5rem]"
                                onClick={handleGenerateQuotes}
                            >
                                {generatingQuotes ? <Loader speed="slow" size="sm" /> : "Generate Retweet Quotes"}
                            </button>
                            <button
                                id="repost-existing-tweet-button"
                                type="submit"
                                className="w-24 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 h-[2.5rem]"
                            >
                                {posting ? <Loader speed="slow" size="sm" /> : "Repost"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <ComingSoon open={comingSoon} setOpen={setComingSoon} quoteGeneratorPrompt={quoteGeneratorPrompt} setQuoteGeneratorPrompt={setQuoteGeneratorPrompt}/>
        </div>
    )
}