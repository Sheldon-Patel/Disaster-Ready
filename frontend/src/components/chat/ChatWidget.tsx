import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
// @ts-ignore
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatWidget: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<Message[]>([
        { role: 'assistant', content: `Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm Safety Buddy! Ask me anything about staying safe during disasters. I'm here to help you be a hero!` }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [history, isOpen]);

    // Only show for students
    if (!isAuthenticated || user?.role !== 'student') {
        return null;
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = message.trim();
        setMessage('');
        const newHistory: Message[] = [...history, { role: 'user', content: userMessage }];
        setHistory(newHistory);
        setIsLoading(true);

        try {
            const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const API_BASE = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `${API_BASE}/auth/chat`,
                { message: userMessage, history: history.slice(-5) }, // Send last 5 for context
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setHistory([...newHistory, response.data]);
        } catch (error) {
            console.error('Chat Error:', error);
            setHistory([...newHistory, { role: 'assistant', content: "Oops! Safety Buddy is a bit sleepy. Can you try asking me again in a minute?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            {/* Floating Button Redesign - Compact */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 ${isOpen
                    ? 'bg-gray-800 border-gray-700 w-14 h-14 sm:w-16 sm:h-16'
                    : 'bg-gradient-to-r from-red-600 to-orange-500 border-white/20 w-14 h-14 sm:w-16 sm:h-16'
                    }`}
            >
                {isOpen ? (
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                        <span className="text-2xl sm:text-3xl drop-shadow-md pb-0.5">⛑️</span>
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-400 rounded-full border-[2px] border-orange-500 animate-pulse"></span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[70vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-red-600 p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-black text-sm uppercase tracking-wider">Safety Buddy</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-white/80 font-bold uppercase">Online & Ready</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {history.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] p-3.5 rounded-2xl text-[15px] font-medium shadow-sm transition-all ${msg.role === 'user'
                                        ? 'bg-red-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }`}
                                >
                                    {msg.role === 'user' ? (
                                        msg.content
                                    ) : (
                                        <div className="prose prose-sm max-w-none break-words">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }: any) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                                    strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
                                                    ul: ({ children }: any) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                                                    ol: ({ children }: any) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                                                    li: ({ children }: any) => <li className="pl-1">{children}</li>,
                                                    h1: ({ children }: any) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                                    h2: ({ children }: any) => <h2 className="text-md font-bold mb-2">{children}</h2>,
                                                    h3: ({ children }: any) => <h3 className="font-bold mb-1">{children}</h3>,
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask me about safety..."
                                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
