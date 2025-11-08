
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Conversation, Message, User, Project } from '../../types';
import api from '../../api';

const MessageBubble: React.FC<{ message: Message, currentUser: User }> = ({ message, currentUser }) => {
    // Assuming message.sender is always populated by the backend to a User object for display
    const sender = message.sender as User; 
    const isCurrentUser = sender._id === currentUser._id;
    
    const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {!isCurrentUser && ( // Show avatar for other participants
                <img className="h-8 w-8 rounded-full object-cover self-start" src={sender.avatarUrl} alt={sender.name} />
            )}
            <div className={`rounded-xl p-3 max-w-md ${isCurrentUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-slate-500'} text-right`}>{timestamp}</p>
            </div>
            {isCurrentUser && ( // Show avatar for current user
                <img className="h-8 w-8 rounded-full object-cover self-start" src={sender.avatarUrl} alt={sender.name} />
            )}
        </div>
    );
};


const Messaging: React.FC = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [errorConversations, setErrorConversations] = useState<string | null>(null);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!user) {
                setLoadingConversations(false);
                return;
            }
            setLoadingConversations(true);
            setErrorConversations(null);
            try {
                const { data } = await api.get<Conversation[]>('/conversations');
                setConversations(data);
                if (data.length > 0) {
                    setSelectedConversation(data[0]); // Select the first conversation by default
                }
            } catch (err) {
                console.error('Failed to fetch conversations:', err);
                setErrorConversations('Failed to load conversations.');
            } finally {
                setLoadingConversations(false);
            }
        };
        fetchConversations();
    }, [user]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedConversation) {
                setLoadingMessages(true);
                setErrorMessages(null);
                try {
                    const { data } = await api.get<Message[]>(`/conversations/${selectedConversation._id}/messages`);
                    setMessages(data);
                } catch (err) {
                    console.error('Failed to fetch messages:', err);
                    setErrorMessages('Failed to load messages.');
                } finally {
                    setLoadingMessages(false);
                }
            } else {
                setMessages([]); // Clear messages if no conversation selected
            }
        };
        fetchMessages();
    }, [selectedConversation]);

    useEffect(() => {
        // Scroll to the bottom of the messages when they load or new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !user) return;

        try {
            const { data } = await api.post<Message>(`/conversations/${selectedConversation._id}/messages`, { text: newMessage });
            // Manually populate sender since the response might not include full User object from backend populate
            const populatedMessage: Message = { 
                ...data, 
                sender: { _id: user._id, name: user.name, avatarUrl: user.avatarUrl, email: user.email, role: user.role } 
            };
            setMessages(prev => [...prev, populatedMessage]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
            alert('Failed to send message.');
        }
    };

    if (!user) return null; // Should be protected by AuthContext, but good practice

    // Fix: Use a type predicate with find to correctly narrow the type of currentChatRecipient
    const currentChatRecipient = selectedConversation?.participants.find(
        (p): p is User => typeof p === 'object' && p._id !== user._id
    );
    const projectName = typeof selectedConversation?.projectId === 'object' ? selectedConversation.projectId.title : 'Project Chat';


    return (
        <div className="flex h-full bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200 flex-shrink-0">
                    <h2 className="text-xl font-semibold">Conversations</h2>
                </div>
                {loadingConversations ? (
                    <div className="p-4 text-center text-slate-500">Loading conversations...</div>
                ) : errorConversations ? (
                    <div className="p-4 text-center text-red-500">{errorConversations}</div>
                ) : conversations.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">No conversations found.</div>
                ) : (
                    <ul className="overflow-y-auto flex-1 divide-y divide-slate-100">
                        {conversations.map(conv => {
                            const projectTitle = typeof conv.projectId === 'object' ? conv.projectId.title : 'Unknown Project';
                            const otherParticipants = conv.participants.filter(p => typeof p === 'object' && p._id !== user._id) as User[];
                            const displayNames = otherParticipants.map(p => p.name).join(', ') || 'Admin/Client'; // Fallback
                            const firstOtherParticipantAvatar = otherParticipants[0]?.avatarUrl || 'https://picsum.photos/seed/default/200';
                            const isActive = selectedConversation?._id === conv._id;

                            return (
                                <li 
                                    key={conv._id} 
                                    className={`p-4 flex items-center hover:bg-slate-100 cursor-pointer transition-colors ${isActive ? 'border-l-4 border-l-indigo-500 bg-slate-50' : 'border-l-4 border-l-transparent'}`}
                                    onClick={() => setSelectedConversation(conv)}
                                >
                                    <img className="h-12 w-12 rounded-full object-cover mr-4" src={firstOtherParticipantAvatar} alt="Avatar" />
                                    <div>
                                        <h3 className="font-semibold text-sm">{projectTitle}</h3>
                                        <p className="text-sm text-slate-500 truncate">{displayNames}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Chat Window */}
            <div className="w-2/3 flex flex-col">
                <div className="p-4 border-b border-slate-200 flex items-center flex-shrink-0">
                    {currentChatRecipient ? (
                        <>
                            <img className="h-10 w-10 rounded-full object-cover mr-3" src={currentChatRecipient.avatarUrl} alt={currentChatRecipient.name} />
                            <div>
                                <h2 className="text-lg font-semibold">{currentChatRecipient.name}</h2>
                                <p className="text-xs text-green-500 flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>Online</p>
                            </div>
                        </>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold">Select a Conversation</h2>
                        </div>
                    )}
                </div>
                <div className="flex-1 p-6 overflow-y-auto bg-slate-100 space-y-6">
                    {loadingMessages ? (
                        <div className="text-center text-slate-500">Loading messages...</div>
                    ) : errorMessages ? (
                        <div className="text-center text-red-500">{errorMessages}</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-slate-500">No messages in this conversation yet.</div>
                    ) : (
                        messages.map(msg => <MessageBubble key={msg._id} message={msg} currentUser={user} />)
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
                    <div className="flex items-center bg-slate-100 rounded-xl">
                        <input 
                            type="text" 
                            placeholder="Type your message..." 
                            className="flex-1 p-3 bg-transparent border-none focus:outline-none focus:ring-0"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                            disabled={!selectedConversation}
                        />
                        <button className="p-3 text-slate-500 hover:text-indigo-600" disabled={!selectedConversation}>
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                        </button>
                        <button 
                            className="mr-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition-colors"
                            onClick={handleSendMessage}
                            disabled={!selectedConversation}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messaging;
