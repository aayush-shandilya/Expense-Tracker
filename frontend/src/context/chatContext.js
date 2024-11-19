// // frontend/src/context/chatContext.js
// import React, { createContext, useContext, useState } from 'react';
// import axios from 'axios';

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//     const [chats, setChats] = useState([]);
//     const [activeChat, setActiveChat] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const createPrivateChat = async (participantId) => {
//         try {
//             const response = await axios.post(
//                 'http://localhost:5001/api/v1/chat/private',
//                 { participantId },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     }
//                 }
//             );
//             setChats(prev => [...prev, response.data]);
//             return response.data;
//         } catch (error) {
//             console.error('Error creating private chat:', error);
//             throw error;
//         }
//     };

//     const createGroupChat = async (name, participants) => {
//         try {
//             const response = await axios.post(
//                 'http://localhost:5001/api/v1/chat/group',
//                 { name, participants },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     }
//                 }
//             );
//             setChats(prev => [...prev, response.data]);
//             return response.data;
//         } catch (error) {
//             console.error('Error creating group chat:', error);
//             throw error;
//         }
//     };

//     const fetchUserChats = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(
//                 'http://localhost:5001/api/v1/chat/user-chats',
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     }
//                 }
//             );
//             setChats(response.data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching user chats:', error);
//             setLoading(false);
//             throw error;
//         }
//     };

//     return (
//         <ChatContext.Provider
//             value={{
//                 chats,
//                 activeChat,
//                 loading,
//                 setActiveChat,
//                 createPrivateChat,
//                 createGroupChat,
//                 fetchUserChats
//             }}
//         >
//             {children}
//         </ChatContext.Provider>
//     );
// };

// export const useChatContext = () => useContext(ChatContext);


// src/context/chatContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socketService } from '../services/socketService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);

    // Initialize socket connection when the context is mounted
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decode the token to get user ID (assuming JWT)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.id; // Adjust according to your token structure
            
            const newSocket = socketService.connect(userId);
            setSocket(newSocket);

            // Socket event listeners
            newSocket.on('new_message', handleNewMessage);
            newSocket.on('user_status_change', handleUserStatusChange);
        }

        return () => {
            socketService.disconnect();
        };
    }, []);

    const handleNewMessage = (message) => {
        // Update chats when new message is received
        setChats(prevChats => {
            return prevChats.map(chat => {
                if (chat._id === message.chatRoom) {
                    return {
                        ...chat,
                        lastMessage: message.content,
                        lastMessageTime: message.timestamp
                    };
                }
                return chat;
            });
        });

        // If the message belongs to active chat, update it
        if (activeChat?._id === message.chatRoom) {
            setActiveChat(prev => ({
                ...prev,
                lastMessage: message.content,
                lastMessageTime: message.timestamp
            }));
        }
    };

    const handleUserStatusChange = ({ userId, status }) => {
        // Update user status in chats
        setChats(prevChats => {
            return prevChats.map(chat => {
                if (chat.type === 'private') {
                    const participant = chat.participants.find(p => p._id === userId);
                    if (participant) {
                        return {
                            ...chat,
                            participants: chat.participants.map(p => 
                                p._id === userId ? { ...p, status } : p
                            )
                        };
                    }
                }
                return chat;
            });
        });
    };

    const createPrivateChat = async (participantId) => {
        try {
            const response = await axios.post(
                'http://localhost:5001/api/v1/chat/private',
                { participantId },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            const newChat = response.data.data;
            setChats(prev => [...prev, newChat]);
            
            // Join the socket room for the new chat
            if (socket) {
                socket.emit('join_room', newChat._id);
            }
            
            return newChat;
        } catch (error) {
            console.error('Error creating private chat:', error);
            throw error;
        }
    };

    const createGroupChat = async (name, participants) => {
        try {
            const response = await axios.post(
                'http://localhost:5001/api/v1/chat/group',
                { name, participants },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            const newChat = response.data.data;
            setChats(prev => [...prev, newChat]);
            
            // Join the socket room for the new chat
            if (socket) {
                socket.emit('join_room', newChat._id);
            }
            
            return newChat;
        } catch (error) {
            console.error('Error creating group chat:', error);
            throw error;
        }
    };

    const fetchUserChats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                'http://localhost:5001/api/v1/chat/user-chats',
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            const userChats = response.data.data;
            setChats(userChats);
            
            // Join all chat rooms
            if (socket) {
                userChats.forEach(chat => {
                    socket.emit('join_room', chat._id);
                });
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user chats:', error);
            setLoading(false);
            throw error;
        }
    };

    const sendMessage = async (chatId, content, files = []) => {
        try {
            const formData = new FormData();
            formData.append('chatRoomId', chatId);
            formData.append('content', content.trim() || ' ');
            
            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await axios.post(
                'http://localhost:5001/api/v1/chat/messages',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            const message = response.data.data;
            
            // Emit the message through socket
            if (socket) {
                socket.emit('send_message', message);
            }

            return message;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                activeChat,
                loading,
                socket,
                setActiveChat,
                createPrivateChat,
                createGroupChat,
                fetchUserChats,
                sendMessage
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);