import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MessageBubble, MessageInput } from './MessageInput';
import ChatHeader from './ChatHeader';

const MessageContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
}));

const ChatWindow = ({ chatRoom, socket, currentUser, onChatRoomUpdate }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (chatRoom?._id) {
            setMessages([]);
            fetchMessages();
            socket?.emit('join_room', chatRoom._id);
            return () => socket?.emit('leave_room', chatRoom._id);
        }
    }, [chatRoom?._id, socket]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            setMessages(prev => {
                return prev.some(m => m._id === message._id) 
                    ? prev 
                    : [...prev, message];
            });
            scrollToBottom();
        };

        socket.on('receive_message', handleNewMessage);
        return () => socket.off('receive_message', handleNewMessage);
    }, [socket]);

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
            if (data.success && Array.isArray(data.data)) {
                setMessages(data.data);
                scrollToBottom();
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

    const sendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && selectedFiles.length === 0) || sending) return;

        try {
            setSending(true);
            const formData = new FormData();
            formData.append('chatRoomId', chatRoom._id);
            formData.append('content', newMessage.trim() || ' ');
            
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch('http://localhost:5001/api/v1/chat/messages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to send message');

            if (data.success) {
                socket?.emit('send_message', data.data);
                setNewMessage('');
                setSelectedFiles([]);
                setMessages(prev => [...prev, data.data]);
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleDownload = async (messageId, fileId) => {
        try {
            const response = await fetch(
                `http://localhost:5001/api/v1/chat/messages/${messageId}/files/${fileId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Download failed');
            }

            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'download';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert(`Failed to download file: ${error.message}`);
        }
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

    if (!chatRoom?.participants) {
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

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ChatHeader 
                chat={chatRoom} 
                currentUser={currentUser}
                onChatRoomUpdate={onChatRoomUpdate}
            />
            <MessageContainer>
                {messages.map((message) => (
                    <MessageBubble
                        key={message._id}
                        message={message}
                        isOwn={message.sender._id === currentUser._id}
                        onDownload={handleDownload}
                    />
                ))}
                <div ref={messagesEndRef} />
            </MessageContainer>
            <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sending={sending}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                fileInputRef={fileInputRef}
                handleSubmit={sendMessage}
            />
        </Box>
    );
};

export default ChatWindow;