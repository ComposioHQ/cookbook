import BenefitCard from "./BenefitCard";

const benefits = [
    {
        "title": "AI-Powered Tweet Creation",
        "body": "Tweetify uses advanced AI to help you create engaging tweets and posts tailored to your audience and brand voice"
    },
    {
        "title": "Account Connections & Reposts",
        "body": "Securely manage multiple accounts. Get authorization from other users to repost tweets on their behalf"
    },
    {
        "title": "AI Repost Quote Generation",
        "body": "Generate quotes based on the content of the post you are reposting using AI-powered repost quote generation"
    }
]

const Benefits = () => {
    return <div className="my-36 mx-auto text-center">
        <div className="flex flex-col gap-y-4">
            <span className="font-semibold text-5xl text-gray-900">What is Tweetify?</span>
            <span className="text-sm text-gray-500">AI-driven tweet creation and management.</span>
        </div>
        <div className="text-left gap-y-8 flex flex-wrap justify-center items-center mt-8 text-gray-500 gap-x-6 mt-[60px]">
            {
                benefits.map((benefit, idx) =>
                    <BenefitCard key={idx} title={benefit.title} body={benefit.body} />
                )
            }
        </div>
    </div>
}

export default Benefits;