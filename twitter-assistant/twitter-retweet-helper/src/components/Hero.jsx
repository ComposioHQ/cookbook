import ActionButton from "./ActionButton";
import WorkingFlow from "./WorkingFlow";

const Hero = () => {
    return <>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">⚡️Supercharge your Twitter</h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-24 dark:text-gray-400">Improve your Twitter game with Tweetify! Create and schedule posts, share permissions effortlessly, and let our AI generate engaging retweet content. Amplify your reach while you focus on what matters most.</p>
        <WorkingFlow />
        <div className="my-10">
            <ActionButton displayName={"Get started"} link={"#"} />
        </div>
        <iframe className="m-auto md:min-w-[854px] md:min-h-[480px]" src="https://www.loom.com/embed/c1ff7adf304d47259f71fae09e5f738c?sid=8faf168d-9647-4ad8-b103-0acc55feee9e"  allow="autoplay"></iframe>
    </>
}

export default Hero;