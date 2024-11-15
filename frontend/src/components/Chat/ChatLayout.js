//ChatLayout.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, styled } from '@mui/material';
import io from 'socket.io-client';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import NewChatButton from './NewChatButton';
import { useAuth } from '../../context/AuthContext';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  background: 'rgba(252, 246, 249, 0.78)',
  borderRadius: '10px',
  overflow: 'hidden'
}));

const ChatSidebar = styled(Box)(({ theme }) => ({
  width: '300px',
  borderRight: '2px solid rgba(34, 34, 96, 0.1)',
  display: 'flex',
  flexDirection: 'column'
}));

const ChatMain = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  color: 'rgba(34, 34, 96, 0.6)',
  textAlign: 'center'
}));

const ChatLayout = () => {
    const [socket, setSocket] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const newSocket = io('http://localhost:5001', {
            withCredentials: true,
            auth: {
                token: localStorage.getItem('token')
            }
        });

        setSocket(newSocket);
        fetchChats();

        return () => newSocket.close();
    }, []);


    const fetchChats = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/v1/chat/user-chats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setChats(data.data || []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chats:', error);
            setLoading(false);
        }
    };

    const handleChatRoomUpdate = (updatedChat) => {
        // Update the active chat with the new data
        setActiveChat(prev => {
            if (prev?._id === updatedChat._id) {
                return updatedChat;
            }
            return prev;
        });
        
        // Update the chat in the chats list
        setChats(prevChats => 
            prevChats.map(chat => 
                chat._id === updatedChat._id ? updatedChat : chat
            )
        );
    };

    const handleNewChat = (newChat) => {
        setChats(prevChats => [...prevChats, newChat]);
        setActiveChat(newChat);
    };

    

    if (loading) {
        return (
            <EmptyStateContainer>
                <CircularProgress size={40} sx={{ color: 'rgba(34, 34, 96, 0.6)' }} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Loading chats...
                </Typography>
            </EmptyStateContainer>
        );
    }

return (
    <ChatContainer>
        <ChatSidebar>
            <NewChatButton 
                onChatCreated={handleNewChat}
                setActiveChat={setActiveChat}
            />
            <ChatList
                chats={chats}
                onChatSelect={setActiveChat}
                activeChat={activeChat}
                currentUser={user}
            />
        </ChatSidebar>
        <ChatMain>
            {activeChat ? (
                <ChatWindow 
                    chatRoom={activeChat}
                    socket={socket}
                    currentUser={user}  
                    onChatRoomUpdate={handleChatRoomUpdate}
                />
            ) : (
                <EmptyStateContainer>
                    <Typography variant="h6" sx={{ color: 'rgba(34, 34, 96, 0.8)', mb: 1 }}>
                        Welcome to Chat
                    </Typography>
                    <Typography variant="body1">
                        Select a chat or start a new conversation
                    </Typography>
                </EmptyStateContainer>
            )}
        </ChatMain>
    </ChatContainer>
);
};

export default ChatLayout;