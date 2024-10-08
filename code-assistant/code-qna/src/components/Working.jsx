const Working = () => {
    return <div className="my-36 px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-28">
        <span className="font-semibold text-3xl text-gray-900">How does Tweetify work?</span>
        <div className="text-left text-xl gap-y-8 flex flex-wrap justify-center items-center mt-16 text-gray-500 sm:justify-between">
            <ol className="space-y-6 text-gray-500 list-decimal list-inside dark:text-gray-400">
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Create a Post:</span>
                    <span className="flex-1">Craft your <span className="text-gray-700 dark:text-gray-300 font-medium">tweet content</span> using Tweetify's intuitive interface, allowing you to compose engaging messages for your audience.</span>
                </li>
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Generate Sharing Links:</span>
                    <span className="flex-1">Tweetify creates unique <span className="text-gray-700 dark:text-gray-300 font-medium">permission links</span> that you can share with others, allowing them to connect their Twitter accounts and grant you posting privileges.</span>
                </li>
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Expand Your Reach:</span>
                    <span className="flex-1">As users grant you permission, you can <span className="text-gray-700 dark:text-gray-300 font-medium">post on their behalf</span>, significantly increasing your content's visibility and reach across multiple accounts.</span>
                </li>
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Generate Retweet Content:</span>
                    <span className="flex-1">Tweetify helps you <span className="text-gray-700 dark:text-gray-300 font-medium">create engaging retweet content</span>, making it easy to repurpose and amplify your original tweets for maximum impact.</span>
                </li>
            </ol>
        </div>
    </div>
}

export default Working;