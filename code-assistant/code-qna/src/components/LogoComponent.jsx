import { Link } from "react-router-dom"
import Logo from "../assets/brain.svg";
const LogoComponent = () => {
    return <Link to="/" className="flex items-center space-x-1 rtl:space-x-reverse">
        <img src={Logo} className="logo" alt="Tweetify logo" width={40} />
        <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">Code_QnA</span>
    </Link>
}

export default LogoComponent;