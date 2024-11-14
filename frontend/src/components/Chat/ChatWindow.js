import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, 
    TextField, 
    IconButton, 
    Typography,
    Avatar,
    Paper,
    CircularProgress,
    styled
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatHeader = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: 'rgba(252, 246, 249, 0.9)',
    borderBottom: '1px solid rgba(34, 34, 96, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
}));

const MessageContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
    maxWidth: '70%',
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(2),
    backgroundColor: isOwn ? 'rgba(34, 34, 96, 0.8)' : 'rgba(34, 34, 96, 0.1)',
    color: isOwn ? '#fff' : 'inherit',
    alignSelf: isOwn ? 'flex-end' : 'flex-start',
    '& .MuiTypography-caption': {
        color: isOwn ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
    }
}));

const ChatWindow = ({ chatRoom, socket, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (chatRoom?._id) {
            setMessages([]); // Clear existing messages when changing chats
            fetchMessages();
            socket?.emit('join_room', chatRoom._id);
        }
    
        return () => {
            if (chatRoom?._id) {
                socket?.emit('leave_room', chatRoom._id);
            }
        };
    }, [chatRoom?._id,socket]); // Add chatRoom._id to dependency array

useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
        console.log('Received new message:', message);
        setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(m => m._id === message._id);
            if (messageExists) {
                return prev;
            }
            return [...prev, message];
        });
        scrollToBottom();
    };

    socket.on('receive_message', handleNewMessage);

    return () => {
        socket.off('receive_message', handleNewMessage);
    };
}, [socket]);

// Update sendMessage function
const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
        setSending(true);
        const messageData = {
            chatRoomId: chatRoom._id,
            content: newMessage.trim()
        };

        const response = await fetch('http://localhost:5001/api/v1/chat/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(messageData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to send message');
        }

        if (data.success) {
            // Emit the saved message through socket with all necessary data
            socket?.emit('send_message', data.data);
            setNewMessage('');
            setMessages(prev => [...prev, data.data]);
            scrollToBottom();
        }
    } catch (error) {
        console.error('Error sending message:', error);
    } finally {
        setSending(false);
    }
};

    const fetchMessages = async () => {
        try {
            const response = await fetch(
                `http://localhost:5001/api/v1/chat/messages/${chatRoom._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            console.log('Fetched messages:', data); // Debug log
            //setMessages(data);  // This was wrong
    
            if (data.success && Array.isArray(data.data)) {
                setMessages(data.data);
                scrollToBottom();
            } else {
                console.error('Invalid message data format:', data);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100%'
            }}>
                <CircularProgress />
            </Box>
        );
    }


    // Add null checks for chatRoom and participants
    if (!chatRoom || !chatRoom.participants) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100%'
            }}>
                <Typography>Chat room not available</Typography>
            </Box>
        );
    }

    const chatPartner = chatRoom.participants.find(p => p._id !== currentUser._id);

    return (
        <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column'
        }}>
            <ChatHeader elevation={1}>
                <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
                    {chatPartner?.name[0].toUpperCase()||'?'}
                </Avatar>
                <Typography variant="h6" sx={{ color: 'rgba(34, 34, 96, 0.8)' }}>
                    {chatPartner?.name || 'Unknown User'}
                </Typography>
            </ChatHeader>

            <MessageContainer>
                {Array.isArray(messages) && messages.map((message, index) => {
                    // Handle both cases where sender might be an ID string or an object
                    const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
                    const isOwnMessage = senderId === currentUser._id;
                    
                    return (
                        <MessageBubble
                            key={message._id || index}
                            isOwn={isOwnMessage}
                        >
                            <Typography variant="body1">
                                {message.content}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    display: 'block',
                                    textAlign: isOwnMessage ? 'right' : 'left',
                                    mt: 0.5
                                }}
                            >
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </Typography>
                        </MessageBubble>
                    );
                })}
                <div ref={messagesEndRef} />
            </MessageContainer>

            <Box
                component="form"
                onSubmit={sendMessage}
                sx={{
                    p: 2,
                    backgroundColor: 'rgba(252, 246, 249, 0.9)',
                    borderTop: '1px solid rgba(34, 34, 96, 0.1)',
                    display: 'flex',
                    gap: 1
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    size="small"
                />
                <IconButton 
                    type="submit" 
                    color="primary"
                    disabled={!newMessage.trim() || sending}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatWindow;