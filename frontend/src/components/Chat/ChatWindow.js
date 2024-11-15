//ChatWindow.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Box, 
    TextField, 
    IconButton, 
    Typography,
    Avatar,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    styled
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { UserPlus, UserMinus, Users, Search } from 'lucide-react';

const StyledChatHeader = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: 'rgba(252, 246, 249, 0.9)',
    borderBottom: '1px solid rgba(34, 34, 96, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
}));


const UserSearchDialog = ({ open, onClose, onSelect, currentMembers }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);

    const searchUsers = async (query) => {
        if (!query.trim()) {
            setUsers([]);
            return;
        }
    
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/v1/chat/users/search?query=${query}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to search users');
            
            const data = await response.json();
            const filteredUsers = data.data.filter(
                user => !currentMembers.some(member => member._id === user._id)
            );
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = async (userId) => {
        try {
            setIsSelecting(true);
            await onSelect(userId);
        } finally {
            setIsSelecting(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={() => !isSelecting && onClose()}
            maxWidth="sm" 
            fullWidth
            aria-modal={true}
        >
            <DialogTitle>Add Members</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchUsers(e.target.value);
                        }}
                        disabled={isSelecting}
                        InputProps={{
                            startAdornment: <Search size={20} style={{ marginRight: 8 }} />
                        }}
                    />
                </Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <List>
                        {users.map((user) => (
                            <ListItem 
                                key={user._id} 
                                button 
                                onClick={() => handleSelectUser(user._id)}
                                disabled={isSelecting}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
                                        {user.name[0].toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={user.name}
                                    secondary={user.email}
                                />
                                {isSelecting && (
                                    <CircularProgress size={20} sx={{ ml: 1 }} />
                                )}
                            </ListItem>
                        ))}
                        {searchQuery && users.length === 0 && !loading && (
                            <Typography sx={{ p: 2, textAlign: 'center' }}>
                                No users found
                            </Typography>
                        )}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
};

const GroupChatHeader = ({ chat, currentUser, onAddMembers, onRemoveMember, onChatRoomUpdate }) => {
    const [showMembers, setShowMembers] = useState(false);
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [loadingStates, setLoadingStates] = useState({
        adding: {},
        removing: {}
    });

    const isAdmin = useMemo(() => 
        chat?.admins?.some(admin => 
            (typeof admin === 'object' ? admin._id : admin).toString() === currentUser._id.toString()
        ),
        [chat?.admins, currentUser._id]
    );

    const refreshChatData = async () => {
        try {
            const response = await fetch(
                `http://localhost:5001/api/v1/chat/chat/group/${chat._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (!response.ok) throw new Error('Failed to refresh chat data');
            
            const data = await response.json();
            if (data.success && onChatRoomUpdate) {
                onChatRoomUpdate(data.data);
            }
        } catch (error) {
            console.error('Error refreshing chat data:', error);
        }
    };

    const handleAddMembers = async (userId) => {
        if (loadingStates.adding[userId]) return;
        
        setLoadingStates(prev => ({
            ...prev,
            adding: { ...prev.adding, [userId]: true }
        }));
        
        try {
            const response = await fetch(`http://localhost:5001/api/v1/chat/group/${chat._id}/participant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    participantIds: [userId]
                })
            });
            
            if (!response.ok) throw new Error('Failed to add member');
            
            const data = await response.json();
            if (data.success) {
                await refreshChatData();
                setShowAddMembers(false);
            }
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Failed to add member');
        } finally {
            setLoadingStates(prev => ({
                ...prev,
                adding: { ...prev.adding, [userId]: false }
            }));
        }
    };

    const handleRemoveMember = async (userId) => {
        if (loadingStates.removing[userId]) return;
        
        setLoadingStates(prev => ({
            ...prev,
            removing: { ...prev.removing, [userId]: true }
        }));
        
        try {
            const response = await fetch(
                `http://localhost:5001/api/v1/chat/group/${chat._id}/participant/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (!response.ok) throw new Error('Failed to remove member');
            
            const data = await response.json();
            if (data.success) {
                await refreshChatData();
            }
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Failed to remove member');
        } finally {
            setLoadingStates(prev => ({
                ...prev,
                removing: { ...prev.removing, [userId]: false }
            }));
        }
    };

    const isAnyLoading = Object.values(loadingStates.adding).some(Boolean) || 
                        Object.values(loadingStates.removing).some(Boolean);

    if (!chat || !chat.participants) {
        return null;
    }

    return (
        <StyledChatHeader elevation={1}>
            <Avatar sx={{ bgcolor: 'rgba(96, 34, 34, 0.8)' }}>
                {chat.name?.[0]?.toUpperCase() || '?'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ color: 'rgba(34, 34, 96, 0.8)' }}>
                    {chat.name}
                </Typography>
                <Typography variant="caption">
                    {chat.participants?.length || 0} members
                </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                    onClick={() => setShowMembers(true)}
                    size="small"
                >
                    <Users size={20} />
                </IconButton>
                
                {isAdmin && (
                    <IconButton 
                        onClick={() => setShowAddMembers(true)}
                        size="small"
                    >
                        <UserPlus size={20} />
                    </IconButton>
                )}
            </Box>

            <Dialog 
                open={showMembers} 
                onClose={() => !isAnyLoading && setShowMembers(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Group Members</DialogTitle>
                <DialogContent>
                    <List>
                        {chat.participants?.map((participant) => (
                            <ListItem key={participant._id}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
                                        {participant.name?.[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={participant.name}
                                    secondary={
                                        <>
                                            {participant.email}
                                            {chat.admins?.some(admin => 
                                                (typeof admin === 'object' ? admin._id : admin).toString() === participant._id.toString()
                                            ) && ' • Admin'}
                                        </>
                                    }
                                />
                                {isAdmin && participant._id !== currentUser._id && (
                                    <ListItemSecondaryAction>
                                        {loadingStates.removing[participant._id] ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            <IconButton 
                                                edge="end" 
                                                onClick={() => handleRemoveMember(participant._id)}
                                                size="small"
                                            >
                                                <UserMinus size={20} />
                                            </IconButton>
                                        )}
                                    </ListItemSecondaryAction>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowMembers(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <UserSearchDialog
                open={showAddMembers}
                onClose={() => !isAnyLoading && setShowAddMembers(false)}
                onSelect={handleAddMembers}
                currentMembers={chat.participants || []}
                loadingStates={loadingStates.adding}
            />
        </StyledChatHeader>
    );
};


    const ChatHeader = ({ chat, currentUser, onAddMembers, onRemoveMember, onChatRoomUpdate }) => {
        if (chat?.type === 'group') {
            return (
                <GroupChatHeader
                    chat={chat}
                    currentUser={currentUser}
                    onAddMembers={onAddMembers}
                    onRemoveMember={onRemoveMember}
                    onChatRoomUpdate={onChatRoomUpdate}
                />
            );
        }

    const chatPartner = chat.participants.find(p => p._id !== currentUser._id);

    return (
        <StyledChatHeader elevation={1}>
            <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
                {chatPartner?.name[0].toUpperCase() || '?'}
            </Avatar>
            <Typography variant="h6" sx={{ color: 'rgba(34, 34, 96, 0.8)' }}>
                {chatPartner?.name || 'Unknown User'}
            </Typography>
        </StyledChatHeader>
    );
};

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

const ChatWindow = ({ chatRoom, socket, currentUser, onChatRoomUpdate }) => {
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
            console.log('Fetching messages for chat:', chatRoom._id);
            const response = await fetch(
                `http://localhost:5001/api/v1/chat/messages/${chatRoom._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (!response.ok) {
                console.error('Response not OK:', response.status);
                throw new Error('Failed to fetch messages');
            }
            
            const data = await response.json();
            console.log('Fetched messages:', data);
    
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

const handleAddMembers = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5001/api/v1/chat/group/${chatRoom._id}/participant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ 
                participantIds: [userId] 
            })
        });
        
        if (!response.ok) throw new Error('Failed to add member');
        
        const data = await response.json();
        if (data.success && typeof onChatRoomUpdate === 'function') {
            // Ensure we update with the complete chat data
            onChatRoomUpdate({
                ...chatRoom,
                ...data.data
            });
        }
    } catch (error) {
        console.error('Error adding member:', error);
        alert('Failed to add member');
    }
};

const handleRemoveMember = async (memberId) => {
    try {
        const response = await fetch(
            `http://localhost:5001/api/v1/chat/group/${chatRoom._id}/participant/${memberId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        
        if (!response.ok) throw new Error('Failed to remove member');
        
        const data = await response.json();
        if (data.success && typeof onChatRoomUpdate === 'function') {
            // Ensure we update with the complete chat data
            onChatRoomUpdate({
                ...chatRoom,
                ...data.data
            });
        }
    } catch (error) {
        console.error('Error removing member:', error);
        alert('Failed to remove member');
    }
};


const refreshChatRoom = async () => {
    try {
        const response = await fetch(
            `http://localhost:5001/api/v1/chat/group/${chatRoom._id}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        
        if (!response.ok) throw new Error('Failed to refresh chat room');
        
        const data = await response.json();
        if (data.success) {
            // Update the chat room data in the parent component
            // You'll need to pass this function as a prop from the parent
            onChatRoomUpdate(data.data);
        }
    } catch (error) {
        console.error('Error refreshing chat room:', error);
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

    return (
        <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column'
        }}>
            <ChatHeader 
                chat={chatRoom} 
                currentUser={currentUser}
                onAddMembers={handleAddMembers}
                onRemoveMember={handleRemoveMember}
                onChatRoomUpdate={onChatRoomUpdate} // Pass it here
            />

            <MessageContainer>
                {Array.isArray(messages) && messages.map((message, index) => {
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
export { UserSearchDialog, GroupChatHeader };
export default ChatWindow;