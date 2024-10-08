const HelpButton = ({ action }) => {
    return <button id="help-button" onClick={action} className="fixed bottom-8 right-8 w-16 h-16 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-full text-sm">Help</button>
}

export default HelpButton;