import React, { useState } from 'react';

// Sample JSON data
const faqData = [
    {
        id: 1,
        question: "What is Tweetify?",
        answer: "Tweetify is a powerful tool that enhances your Twitter experience. It allows you to create tweets, generate shareable links for collaborative posting, and create retweet content"
    },
    {
        id: 2,
        question: "How does Tweetify work?",
        answer: "Tweetify integrates with your Twitter account and provides a user-friendly interface for generating permission links for other users, and use AI to create engaging retweet content and repost on their behalf"
    },
    {
        id: 3,
        question: "What are the main features of Tweetify?",
        answer: "Tweetify offers four key features: 1) Tweet creation, 2) Shareable permission links can be generated, other people will provide authorization, and you can post on their behalf, and 3) AI-powered retweet content generation."
    },
    {
        id: 4,
        question: "How do I get started with Tweetify?",
        answer: "To get started with Tweetify, click the 'Get Started' button. Connect your Twitter account, add other users on behalf of whom you want to repost. Generate a link using which they can authorize, then start posting."
    },
    {
        id: 5,
        question: "Is my Twitter account safe with Tweetify?",
        answer: "Absolutely. We prioritize the security of your Twitter account. Tweetify uses secure OAuth protocols for authentication and doesn't store your Twitter password. You can revoke Tweetify's access to your account at any time through your Twitter settings."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="mt-36 mb-10 px-4 mx-auto text-cente md:max-w-screen-md lg:max-w-screen-lg lg:px-28">
            <span className="font-semibold text-3xl text-gray-900">FAQs</span>
            <div className='mt-8'  id="accordion-collapse" data-accordion="collapse">
                {faqData.map((faq, index) => (
                    <div key={faq.id}>
                        <h2 id={`accordion-collapse-heading-${faq.id}`}>
                            <button
                                type="button"
                                className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 
                ${index === 0 ? 'rounded-t-xl border-b-0' : ''} 
                ${index === faqData.length - 1 ? '' : ''} 
                ${index > 0 && index < faqData.length - 1 ? 'border-b-0' : ''} 
                focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3`}
                                onClick={() => toggleAccordion(faq.id)}
                                aria-expanded={openIndex === faq.id}
                                aria-controls={`accordion-collapse-body-${faq.id}`}
                            >
                                <span>{faq.question}</span>
                                <svg
                                    className={`w-3 h-3 transition-transform duration-200 ${openIndex === faq.id ? '' : 'rotate-180'}`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                                </svg>
                            </button>
                        </h2>
                        <div
                            id={`accordion-collapse-body-${faq.id}`}
                            className={`${openIndex === faq.id ? '' : 'hidden'}`}
                            aria-labelledby={`accordion-collapse-heading-${faq.id}`}
                        >
                            <div className={`p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900  ${index === faqData.length - 1 ? 'rounded-b-xl' : ''}`}>
                                <p className="text-left mb-2 text-gray-500 dark:text-gray-400">{faq.answer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;