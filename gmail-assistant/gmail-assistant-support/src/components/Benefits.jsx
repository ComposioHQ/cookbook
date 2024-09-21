import BenefitCard from "./BenefitCard";

const benefits = [
    {
        "title": "Automated Email Processing",
        "body": "GmailGenius automatically processes new emails, sending acknowledgments to senders and categorizing messages based on user-specified keywords"
    },
    {
        "title": "Intelligent Routing",
        "body": "Automatically directs emails to the right team (e.g., development for bugs, growth for collaborations) based on content analysis"
    },
    {
        "title": "Instant Team Notifications",
        "body": "Sends relevant messages to appropriate Slack channels, ensuring quick team awareness and response"
    },
    {
        "title": "Time and Resource Optimization",
        "body": "Eliminates manual email sorting and forwarding, allowing teams to focus on addressing important matters efficiently"
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