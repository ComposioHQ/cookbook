import LogoComponent from "./LogoComponent";
const Navbar = () => {
    return <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <LogoComponent />
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <a href="https://github.com/abhishekpatil4/GmailGenius" target="_blank" >
                    <button type="button" className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">Star on github</button>
                </a>
            </div>
        </div>
    </nav>

}

export default Navbar;  