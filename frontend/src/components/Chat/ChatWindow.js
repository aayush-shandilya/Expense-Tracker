import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, Badge, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MessageBubble, MessageInput } from './MessageInput';
import ChatHeader from './ChatHeader';
import { useChatContext } from '../../context/chatContext';

const MessageContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
}));

const OnlineBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const ChatWindow = ({ chatRoom, currentUser, onChatRoomUpdate }) => {
    const { socket, sendMessage: contextSendMessage } = useChatContext();
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);
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
            updateParticipantsStatus();
        }
    }, [chatRoom?._id]);

    useEffect(() => {
        if (!socket) return;
    
        socket.on('receive_message', (message) => {
            console.log('Received new message:', message);
            setMessages(prev => [
                ...prev.filter(m => m._id !== message._id),
                message
            ]);
        });
    
        socket.on('user_status_changed', ({ userId, isOnline }) => {
            setParticipants(prev => prev.map(participant => {
                if (participant._id === userId) {
                    return { ...participant, isOnline };
                }
                return participant;
            }));
        });
    
        return () => {
            socket.off('receive_message');
            socket.off('user_status_changed');
            socket.off('error');
        };
    }, [socket]);

    const updateParticipantsStatus = async () => {
        if (!chatRoom?.participants) return;
        
        try {
            const response = await fetch(
                `http://localhost:5001/api/v1/chat/users/search?term=${chatRoom.participants.map(p => p._id).join(',')}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (!response.ok) throw new Error('Failed to fetch participants status');
            
            const data = await response.json();
            if (data.success) {
                setParticipants(data.data);
            }
        } catch (error) {
            console.error('Error fetching participants status:', error);
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
            const message = await contextSendMessage(
                chatRoom._id,
                newMessage.trim(),
                selectedFiles
            );

            setNewMessage('');
            setSelectedFiles([]);
            setMessages(prev => [...prev, message]);
            scrollToBottom();
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

//     return (
//         <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <ChatHeader 
//                 chat={chatRoom} 
//                 currentUser={currentUser}
//                 onChatRoomUpdate={onChatRoomUpdate}
//                 participants={participants}
//             />
//             <MessageContainer>
//                 {messages.map((message) => {
//                     const isOwn = message.sender._id === currentUser._id;
//                     const participant = participants.find(p => p._id === message.sender._id);
//                     return (
//                         <Box key={message._id} 
//                             sx={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 gap: 1,
//                                 justifyContent: isOwn ? 'flex-end' : 'flex-start',
//                                 flexDirection: isOwn ? 'row-reverse' : 'row'
//                             }}
//                         >
//                             <OnlineBadge
//                                 overlap="circular"
//                                 anchorOrigin={{ vertical: 'bottom', horizontal: isOwn ? 'left' : 'right'  }}
//                                 variant="dot"
//                                 invisible={!participant?.isOnline}
//                             >
//                                 <Avatar>{message.sender.name[0]}</Avatar>
//                             </OnlineBadge>
//                             <Box 
//                                 sx={{ 
//                                     maxWidth: '70%',
//                                     display: 'flex',
//                                     flexDirection: 'column',
//                                     alignItems: isOwn ? 'flex-end' : 'flex-start'
//                                 }}
//                             >
//                             <MessageBubble
//                                 message={message}
//                                 isOwn={message.sender._id === currentUser._id}
//                                 onDownload={handleDownload}
//                             />
//                             </Box>
//                         </Box>
//                     );
//                 })}
//                 <div ref={messagesEndRef} />
//             </MessageContainer>
//             <MessageInput
//                 newMessage={newMessage}
//                 setNewMessage={setNewMessage}
//                 sending={sending}
//                 selectedFiles={selectedFiles}
//                 setSelectedFiles={setSelectedFiles}
//                 fileInputRef={fileInputRef}
//                 handleSubmit={sendMessage}
//             />
//         </Box>
//     );
// };

// export default ChatWindow;


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