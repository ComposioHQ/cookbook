import LogoComponent from "./LogoComponent";
const Footer = () => {
    return <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-screen-2xl p-4 py-6 lg:py-8">
            <div className="md:flex md:justify-between">
                <div className="mb-6 md:mb-0">
                    <LogoComponent />
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-16 sm:grid-cols-2">
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                        <ul className="text-gray-500 dark:text-gray-400 font-medium">
                            <li className="mb-4">
                                <a href="https://github.com/ComposioHQ/cookbook/tree/master/gmail-assistant/gmail-assistant-firebase" className="hover:underline">Github Repo</a>
                            </li>
                            <li>
                                <a href="https://replit.com/@abishkpatil/gmail-assistant-fb" className="hover:underline">Replit</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                        <ul className="text-gray-500 dark:text-gray-400 font-medium">
                            <li className="mb-4">
                                <a href="https://github.com/ComposioHQ" className="hover:underline ">Github</a>
                            </li>
                            <li>
                                <a href="https://x.com/composiohq" className="hover:underline">X/Twitter</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://github.com/abhishekpatil4/GmailGenius" className="hover:underline">GmailGenius™</a>. All Rights Reserved.</span>
            </div>
        </div>
    </footer>

}

export default Footer;