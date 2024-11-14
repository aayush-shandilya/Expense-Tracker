// frontend/src/context/chatContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(false);

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
            setChats(prev => [...prev, response.data]);
            return response.data;
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
            setChats(prev => [...prev, response.data]);
            return response.data;
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
            setChats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user chats:', error);
            setLoading(false);
            throw error;
        }
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                activeChat,
                loading,
                setActiveChat,
                createPrivateChat,
                createGroupChat,
                fetchUserChats
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);