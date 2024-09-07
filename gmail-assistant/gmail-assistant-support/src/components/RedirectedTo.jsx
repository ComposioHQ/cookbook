import gmailLogo from '../assets/gmailLogo.png'
import slackLogo from '../assets/slackLogo.png'
const RedirectedTo = () => {
    return <div className="flex flex-col gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-sm text-gray-900 text-left flex flex-col gap-10">
            <div className="flex gap-2 items-center justify-center">
                <span className="bg-gray-200 rounded-md px-1.5 py-1">Issue</span>
                <span className="bg-yellow-200 rounded-md px-1.5 py-1">Bug</span>
                <span className="bg-gray-200 rounded-md px-1.5 py-1">Glitch</span>
                <span className="bg-gray-200 rounded-md px-1.5 py-1">Error</span>
            </div>
            <div className='flex gap-6 items-end justify-center'>
                <div className='flex flex-col gap-2 justify-center items-center'>
                    <img src={gmailLogo} className="logo" alt="Gmail logo" width={40} />
                    <span className='text-sm text-gray-600 text-left'>devteam@company.com</span>
                </div>
                <div className='flex flex-col gap-2 justify-center items-center'>
                    <img src={slackLogo} className="logo" alt="Slack logo" width={40} />
                    <span className='text-sm text-gray-600 text-left'>@dev-channel</span>
                </div>
            </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-sm text-gray-900 text-left flex flex-col gap-10">
            <div className="flex gap-2 items-center justify-center">
                <span className="bg-gray-200  rounded-md px-1.5 py-1">Growth</span>
                <span className="bg-gray-200  rounded-md px-1.5 py-1">Marketing</span>
                <span className="bg-yellow-200  rounded-md px-1.5 py-1">Collaboration</span>
            </div>
            <div className='flex gap-6 items-end justify-center'>
                <div className='flex flex-col gap-2 justify-center items-center'>
                    <img src={gmailLogo} className="logo" alt="Gmail logo" width={40} />
                    <span className='text-sm text-gray-600 text-left'>growth@company.com</span>
                </div>
                <div className='flex flex-col gap-2 justify-center items-center'>
                    <img src={slackLogo} className="logo" alt="Slack logo" width={40} />
                    <span className='text-sm text-gray-600 text-left'>@growth-channel</span>
                </div>
            </div>
        </div>
    </div>
}

export default RedirectedTo;