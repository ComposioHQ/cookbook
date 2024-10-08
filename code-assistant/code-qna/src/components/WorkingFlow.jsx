import { FileSpreadsheet, ArrowRight } from "lucide-react"
import Logo from "../assets/brain.svg";
import NewMail from "./NewMail";
import RedirectedTo from "./RedirectedTo";
import main_post from "../assets/twitterUI/main_post.png";
import repost1 from "../assets/twitterUI/repost1.png";
import repost2 from "../assets/twitterUI/repost2.png";

const WorkingFlow = () => {
    return (<div className="max-w-6xl mx-auto py-8 bg-gray-100 rounded-xl shadow-inner">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
            <img src={main_post} alt="main_post" className="w-96" />
            {/* Arrow and Brain Logo */}
            <div className="flex flex-row items-center justify-center">
                <ArrowRight className="h-8 w-8 text-gray-600" />
                <div className="bg-white rounded-full px-1 py-2 shadow-lg mx-2">
                    <img src={Logo} className="logo mx-3" alt="Tweetify logo" width={50} />
                </div>
                <ArrowRight className="h-8 w-8 text-gray-600" />
                {/* <div className="flex flex-col gap-3 items-center">
                    <ArrowRight className="h-8 w-8 text-gray-600" style={{ transform: 'rotate(-30deg)' }} />
                    <ArrowRight className="h-8 w-8 text-gray-600" style={{ transform: 'rotate(30deg)' }} />
                </div> */}
            </div>
            <RedirectedTo />
        </div>
    </div>
    )
}

export default WorkingFlow;