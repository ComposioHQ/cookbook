import { Mail, Paperclip } from "lucide-react"
const NewMail = () => {
    return <div className="w-full lg:w-2/5 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Gmail</h2>
        </div>
        <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Message
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left"><span className="bg-yellow-200 dark:bg-yellow-800 rounded-md px-1.5 py-1">Bug</span> Report: App Crashing on Launch</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="line-clamp-2 text-gray-600 text-left">
                                Your app is constantly crashing when I try to open it. This is unacceptable! I've been a loyal user for years and now I can't even...
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-gray-50">
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">Hackathon <span className="bg-yellow-200 dark:bg-yellow-800 rounded-md px-1.5 py-1 animate-glow">Collaboration</span> Invitation</td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">Hackathon <span className="bg-yellow-200 dark:bg-yellow-800 rounded-md px-1.5 py-1">Collaboration</span> Invitation</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="line-clamp-2 text-gray-600 text-left">
                                We're hosting a hackathon and would love to have you collaborate with us. Your tools would be...
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}

export default NewMail;