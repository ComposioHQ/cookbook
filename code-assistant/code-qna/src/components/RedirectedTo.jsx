import gmailLogo from '../assets/gmailLogo.png'
import slackLogo from '../assets/slackLogo.png'
import repost1 from '../assets/twitterUI/repost1.png'
import repost2 from '../assets/twitterUI/repost2.png'

const RedirectedTo = () => {
    return <div className="flex flex-col gap-8">
        {/* <div className="w-96 h-56 overflow-hidden">
            <img src={repost1} alt="repost1" className="w-96" />
        </div> */}
        <div className="w-96 overflow-hidden">
            <img src={repost2} alt="repost2" className="w-96" />
        </div>
    </div>
}

export default RedirectedTo;