import BenefitCard from "./BenefitCard";

const benefits = [
    {
        "title": "AI-Powered Tweet Creation",
        "body": "Tweetify uses advanced AI to help you create engaging tweets and posts tailored to your audience and brand voice"
    },
    {
        "title": "Smart Scheduling",
        "body": "Easily schedule your tweets for optimal posting times, ensuring maximum visibility and engagement for your content"
    },
    {
        "title": "Seamless Account Connections",
        "body": "Generate unique links to securely connect multiple Twitter accounts, allowing you to manage and post on behalf of others"
    },
    {
        "title": "Retweet Content Generation",
        "body": "Automatically generate relevant and engaging retweet content to boost your social media presence and increase interaction"
    }
]

const Benefits = () => {
    return <div className="my-36 px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg xl:px-28 lg:px-16">
        <span className="font-semibold text-3xl text-gray-900 ">Benefits</span>
        <div className="text-left gap-y-8 flex flex-wrap justify-center items-center mt-8 text-gray-500 sm:justify-between">
            {
                benefits.map((benefit, idx) =>
                    <BenefitCard key={idx} title={benefit.title} body={benefit.body} />
                )
            }
        </div>
    </div>
}

export default Benefits;