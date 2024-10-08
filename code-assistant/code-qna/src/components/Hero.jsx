import ActionButton from "./ActionButton";
import WorkingFlow from "./WorkingFlow";

const Hero = () => {
    return <>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">⚡️Supercharge your Twitter</h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-24 dark:text-gray-400">Improve your Twitter game with Tweetify! Create posts, share permissions effortlessly, and let our AI generate engaging retweet content. Amplify your reach while you focus on what matters most.</p>
        <WorkingFlow />
        <div className="mt-36">
            <ActionButton displayName={"Get started"} link={"#"} />
        </div>
    </>
}

export default Hero;