import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import FAQ from "../components/FAQ";
import Working from "../components/Working";
import ActionButton from "../components/ActionButton";
import DemoVideo from "../components/DemoVideo";
const Home = () => {
    return <section className="bg-white dark:bg-gray-900 mt-24">
        <div className="px-4 mx-auto max-w-screen-xl text-center py-16">
            <Hero />
            <Benefits />
            <DemoVideo />
            <Working />
            <FAQ />
            <div className="mt-32">
                <ActionButton displayName={"Get started"} link={"#"} />
            </div>
        </div>
    </section>
}

export default Home;