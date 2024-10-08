import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { LuEraser } from "react-icons/lu";
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

const Chat = () => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('response', (data) => {
            console.log('Response from server:', data);
            setMessages(prevMessages => [...prevMessages, { role: "agent", content: data }]);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return () => {
            socket.off('connect');
            socket.off('response');
            socket.off('error');
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        localStorage.setItem("chatMessages", JSON.stringify(messages));
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = { role: "user", content: input };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        // Emit message to server
        socket.emit('message', {
            chat_id: '5792023f-5412-4de5-9bb7-9076439b2808', // You might want to implement chat_id management
            content: input,
            role: 'user'
        });

        setInput("");
    };

    const clearMessages = () => {
        if (window.confirm("Are you sure you want to clear the chat messages?")) {
            setMessages([]);
            localStorage.removeItem("chatMessages");
        }
    };


    const renderMessage = (message, index) => {
        const parts = message.content.split(/(```[\s\S]*?```)/);
        const containsCode = parts.some(part => part.startsWith("```") && part.endsWith("```"));

        return (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                    className={`px-3 py-1.5 my-2 rounded-lg ${
                        message.role === "user" ? "bg-purple-700 text-white" : "bg-gray-200 text-black"
                    } ${containsCode ? "w-4/5" : "max-w-lg"}`}
                >
                    {parts.map((part, partIndex) => {
                        if (part.startsWith("```") && part.endsWith("```")) {
                            const code = part.slice(3, -3).trim();
                            return (
                                <pre key={partIndex} className="bg-gray-800 text-green-400 p-2 rounded my-2 overflow-x-auto">
                                    <code>{code}</code>
                                </pre>
                            );
                        } else {
                            return <p key={partIndex}>{part}</p>;
                        }
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow p-6 overflow-y-auto mt-24 px-80">
                {messages.map((message, index) => renderMessage(message, index))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex justify-center">
                <form className="flex w-2/5 gap-2 bg-gray-200 rounded-lg px-6 pt-6 pb-8" onSubmit={handleSend}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="block w-full ml-auto rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 py-2 px-3 focus:outline-none resize-none overflow-hidden"
                        placeholder="Type your message..."
                        rows="1"
                        style={{ height: 'auto' }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                                e.target.style.height = 'auto';
                            }
                        }}
                    />
                    <button
                        type="submit"
                        className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 rounded-lg text-lg px-4 py-2.5 h-[2.5rem]"
                    >
                        <FiSend />
                    </button>
                    <button
                        type="button"
                        className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 rounded-lg text-lg px-4 py-2.5 h-[2.5rem]"
                        onClick={clearMessages}
                    >
                        <LuEraser />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
