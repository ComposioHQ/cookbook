const driverObjSettingsPageConfig = {
    showProgress: true,
    steps: [
        {
            element: '#connect-accounts-section',
            popover: {
                title: 'Connect Accounts',
                description: 'Add your Composio API key and connect your Twitter account to get started.'
            }
        },
        {
            element: '#add-new-user-section',
            popover: {
                title: 'Add New User',
                description: 'Enter twitter username to add new user'
            }
        },
        {
            element: '#help-button',
            popover: {
                title: 'Help',
                description: 'If you need anything else, you can find me here'
            }
        }
    ]
};

const driverObjCreatePostPageConfig = {
    showProgress: true,
    steps: [
        {
            element: '#create-post-section',
            popover: {
                title: 'Create Post',
                description: 'Create a new post'
            },
        },
        {
            element: '#reposters-section-for-create-post',
            popover: {
                title: 'Reposters',
                description: 'Add users who will repost your tweet'
            },
        },
        {
            element: '#generate-retweet-quotes-button',
            popover: {
                title: 'Generate Retweet Quotes',
                description: 'Click if you want to generate repost quotes for users who are reposting'
            },
        },
        {
            element: '#post-tweet-button',
            popover: {
                title: 'Post Tweet',
                description: 'Click here to post the tweet and repost on behalf of selected users'
            },
        },
    ]
}

const driverObjRepostPageConfig = {
    showProgress: true,
    steps: [
        {
            element: '#repost-existing-tweet-section',
            popover: {
                title: 'Repost Existing Tweet',
                description: 'Repost an existing tweet'
            },
        },
        {
            element: '#tweet-url-input',
            popover: {
                title: 'Tweet Url',
                description: 'Enter the url of the tweet you want to repost'
            },
        },
        {
            element: '#reposters-section-for-repost-existing-tweet',
            popover: {
                title: 'Reposters',
                description: 'Add users who will repost your tweet'
            },
        },
        {
            element: '#generate-retweet-quotes-for-existing-tweet-button',
            popover: {
                title: 'Generate Retweet Quotes',
                description: 'Click if you want to generate repost quotes for users who are reposting'
            },
        },
        {
            element: '#repost-existing-tweet-button',
            popover: {
                title: 'Repost',
                description: 'Click here to repost the tweet'
            },
        }
    ]
};

export { driverObjSettingsPageConfig, driverObjCreatePostPageConfig, driverObjRepostPageConfig };
