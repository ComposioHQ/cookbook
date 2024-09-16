import React, { useState, useRef } from 'react';

const Clipboard = ({ authUrl }) => {
    const [copied, setCopied] = useState(false);
    const inputRef = useRef(null);
    const tooltipRef = useRef(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(authUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error('Failed to copy: ', err));
    };

    const showTooltip = () => {
        if (tooltipRef.current) {
            tooltipRef.current.classList.remove('invisible', 'opacity-0');
            tooltipRef.current.classList.add('visible', 'opacity-100');
        }
    };

    const hideTooltip = () => {
        if (tooltipRef.current) {
            tooltipRef.current.classList.add('invisible', 'opacity-0');
            tooltipRef.current.classList.remove('visible', 'opacity-100');
        }
    };

    return (
        <div className="w-full max-w-[16rem]">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={authUrl ? `${authUrl.slice(0, 30)}...` : ''}
                    disabled
                    readOnly
                />
                <button
                    onClick={handleCopy}
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                    className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
                >
                    <span className={copied ? 'hidden' : ''}>
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                        </svg>
                    </span>
                    <span className={copied ? '' : 'hidden'}>
                        <svg className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                        </svg>
                    </span>
                </button>
            </div>
            <span className="text-gray-500 text-xs">Share the link with user to get authorization</span>
        </div>
    );
}

export default Clipboard;