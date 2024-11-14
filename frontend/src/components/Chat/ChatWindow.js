// // frontend/src/components/Chat/ChatWindow.js
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const ChatWindow = ({ chatRoom, socket, currentUser }) => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [loading, setLoading] = useState(true);
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         if (chatRoom) {
//             fetchMessages();
//             socket?.emit('join_room', chatRoom._id);
//         }

//         return () => {
//             if (chatRoom) {
//                 socket?.emit('leave_room', chatRoom._id);
//             }
//         };
//     }, [chatRoom]);

//     useEffect(() => {
//         if (socket) {
//             socket.on('receive_message', (message) => {
//                 setMessages(prev => [...prev, message]);
//             });
//         }
//     }, [socket]);

//     const fetchMessages = async () => {
//         try {
//             const response = await axios.get(
//                 `http://localhost:5001/api/v1/chat/messages/${chatRoom._id}`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     }
//                 }
//             );
//             setMessages(response.data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//             setLoading(false);
//         }
//     };

//     const sendMessage = async (e) => {
//         e.preventDefault();
//         if (!newMessage.trim()) return;

//         try {
//             const messageData = {
//                 chatRoomId: chatRoom._id,
//                 content: newMessage,
//                 userId: currentUser._id
//             };

//             socket?.emit('send_message', messageData);
//             setNewMessage('');
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     useEffect(scrollToBottom, [messages]);

//     return (
//         <div className="h-full flex flex-col">
//             <div className="p-4 border-b">
//                 <h2 className="text-xl font-semibold">
//                     {chatRoom.type === 'private' 
//                         ? chatRoom.participants[0].name 
//                         : chatRoom.name}
//                 </h2>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4">
//                 {loading ? (
//                     <div className="flex items-center justify-center h-full">
//                         Loading messages...
//                     </div>
//                 ) : (
//                     messages.map((message, index) => (
//                         <div
//                             key={index}
//                             className={`mb-4 ${
//                                 message.sender === currentUser._id
//                                     ? 'text-right'
//                                     : 'text-left'
//                             }`}
//                         >
//                             <div
//                                 className={`inline-block p-3 rounded-lg ${
//                                     message.sender === currentUser._id
//                                         ? 'bg-blue-500 text-white'
//                                         : 'bg-gray-200'
//                                 }`}
//                             >
//                                 {message.content}
//                             </div>
//                             <div className="text-xs text-gray-500 mt-1">
//                                 {new Date(message.timestamp).toLocaleTimeString()}
//                             </div>
//                         </div>
//                     ))
//                 )}
//                 <div ref={messagesEndRef} />
//             </div>
//             <form onSubmit={sendMessage} className="p-4 border-t">
//                 <div className="flex">
//                     <input
//                         type="text"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         placeholder="Type a message..."
//                         className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:border-blue-500"
//                     />
//                     <button
//                         type="submit"
//                         className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
//                     >
//                         Send
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default ChatWindow;




// components/Chat/ChatWindow.js
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
}));

const ChatWindow = ({ chatRoom, socket, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (chatRoom?._id) {
            fetchMessages();
            socket?.emit('join_room', chatRoom._id);
        }

        return () => {
            if (chatRoom?._id) {
                socket?.emit('leave_room', chatRoom._id);
            }
        };
    }, [chatRoom?._id]);

    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (message) => {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            });
        }
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
            //setMessages(data);


            setMessages(data.data || []); // Access the data property and provide fallback
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            const messageData = {
                chatRoomId: chatRoom._id,
                content: newMessage.trim(),
                senderId: currentUser._id
            };

            socket?.emit('send_message', messageData);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
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

            {/* <MessageContainer>
                {messages.map((message, index) => (
                    <MessageBubble
                        key={index}
                        isOwn={message.sender === currentUser._id}
                    >
                        <Typography variant="body1">
                            {message.content}
                        </Typography>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                opacity: 0.7,
                                display: 'block',
                                textAlign: message.sender === currentUser._id ? 'right' : 'left'
                            }}
                        >
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                    </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
            </MessageContainer> */}

            <MessageContainer>
                {Array.isArray(messages) && messages.map((message, index) => (
                    <MessageBubble
                        key={message._id || index}
                        isOwn={message.sender === currentUser?._id}
                    >
                        <Typography variant="body1">
                            {message.content}
                        </Typography>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                opacity: 0.7,
                                display: 'block',
                                textAlign: message.sender === currentUser?._id ? 'right' : 'left'
                            }}
                        >
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                    </MessageBubble>
                ))}
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