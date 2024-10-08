import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { LuEraser } from "react-icons/lu";
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8000');

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get('http://localhost:8000/list_chats');
                setChats(response.data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('response', (data) => {
            console.log('Response from server:', data);
            if (currentChat) {
                setMessages(prevMessages => [...prevMessages, { role: "agent", content: data }]);
            }
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return () => {
            socket.off('connect');
            socket.off('response');
            socket.off('error');
        };
    }, [currentChat]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !currentChat) return;

        const newMessage = { role: "user", content: input };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        socket.emit('message', {
            chat_id: currentChat.chat_id,
            content: input,
            role: 'user'
        });

        setInput("");
    };

    const clearMessages = () => {
        if (window.confirm("Are you sure you want to clear the chat messages?")) {
            setMessages([]);
        }
    };

    const loadChat = async (chat) => {
        try {
            const response = await axios.get(`http://localhost:8000/get_chat/${chat.chat_id}`);
            setCurrentChat(response.data);
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    };

    const renderMessage = (message, index) => {
        const isUser = message.role === "user";
        return (
            <div key={index} className={`flex mb-4 cursor-pointer ${isUser ? 'justify-end' : ''}`}>
                {!isUser && (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img src="https://placehold.co/200x/2e83ad/ffffff.svg?text=AI&font=Lato" alt="AI Avatar" className="w-8 h-8 rounded-full" />
                    </div>
                )}
                <div className={`flex max-w-96 ${isUser ? 'bg-indigo-500 text-white' : 'bg-gray-100'} rounded-lg p-3 gap-3`}>
                    <p className={isUser ? '' : 'text-gray-700'}>{message.content}</p>
                </div>
                {isUser && (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=You&font=Lato" alt="User Avatar" className="w-8 h-8 rounded-full" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden pt-[4.5rem]">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r border-gray-300">
                {/* Contact List */}
                <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
                    <div onClick={() => {
                        const chatName = prompt("Enter a name for the new chat:");
                        if (chatName) {
                            fetch('http://localhost:8000/create_chat', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ chat_name: chatName }),
                            })
                            .then(response => response.json())
                            .then(data => {
                                return fetch(`http://localhost:8000/get_chat/${data}`);
                            })
                            .then(response => response.json())
                            .then(newChat => {
                                setChats(prevChats => [...prevChats, newChat]);
                                loadChat(newChat);
                            })
                            .catch(error => console.error('Error:', error));
                        }
                    }} className="border-2 border-dashed border-gray-400 flex items-center mb-4 cursor-pointer bg-gray-200 hover:bg-green-200 py-2 px-5 rounded-md h-10">
                        <h2 className="text-lg font-semibold truncate">+ New Chat</h2>
                    </div>
                    {chats.map(chat => (
                        <div 
                            key={chat.chat_id} 
                            onClick={() => loadChat(chat)} 
                            className={`flex items-center mb-4 cursor-pointer ${currentChat && currentChat.chat_id === chat.chat_id ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-300 py-2 px-5 rounded-md h-20`}
                        >
                            <div className="flex-1 overflow-hidden">
                                <h2 className="text-lg font-semibold truncate">{chat.chat_name}</h2>
                                <p className="text-gray-600 truncate">
                                    {chat.messages.length > 1 
                                        ? chat.messages[chat.messages.length - 1].content 
                                        : "No messages yet"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 pt-4">
                    {messages.map((message, index) => renderMessage(message, index))}
                </div>

                {/* Chat Input */}
                <footer className="bg-white border-t border-gray-300 p-4">
                    <form className="flex gap-2" onSubmit={handleSend}>
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
                        {/* <button
                            type="button"
                            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 rounded-lg text-lg px-4 py-2.5 h-[2.5rem]"
                            onClick={clearMessages}
                        >
                            <LuEraser />
                        </button> */}
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default Chat;