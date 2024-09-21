const Working = () => {
    return <div className="my-36 px-4 mx-auto text-cente md:max-w-screen-md lg:max-w-screen-lg lg:px-28">
        <span className="font-semibold text-3xl text-gray-900">How does this work?</span>
        <div className="text-left text-xl gap-y-8 flex flex-wrap justify-center items-center mt-16 text-gray-500 sm:justify-between">
            <ol className="space-y-6 text-gray-500 list-decimal list-inside dark:text-gray-400">
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Connect Services:</span>
                    <span className="flex-1">Link your <span className="text-gray-700 dark:text-gray-300 font-medium">Gmail</span> and <span className="text-gray-700 dark:text-gray-300 font-medium">Slack</span> accounts to GmailGenius for seamless integration and automated email management.</span>
                </li>
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Configure Keywords:</span>
                    <span className="flex-1">Add <span className="text-gray-700 dark:text-gray-300 font-medium">keywords</span> along with corresponding email addresses and Slack channel names to customize your email routing and notification preferences.</span>
                </li>
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Automatic Processing:</span>
                    <span className="flex-1">When a new email arrives in your inbox, GmailGenius <span className="text-gray-700 dark:text-gray-300 font-medium">automatically processes</span> it using your predefined rules and settings.</span>
                </li>
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Intelligent Routing:</span>
                    <span className="flex-1">Based on the configured keywords, GmailGenius <span className="text-gray-700 dark:text-gray-300 font-medium">forwards the email</span> to the right email address ensuring efficient distribution of information.</span>
                </li>
                <li className="flex items-start">
                    <span className="font-semibold text-gray-900 dark:text-white w-full md:w-1/3 mb-2 md:mb-0">Slack Notification:</span>
                    <span className="flex-1">GmailGenius also sends a notification to the corresponding <span className="text-gray-700 dark:text-gray-300 font-medium">Slack channel</span> keeping your team informed in real-time.</span>
                </li>
            </ol>
        </div>
    </div>
}

export default Working;