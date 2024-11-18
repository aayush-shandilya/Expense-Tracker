// ChatHeader.js
import React, { useState, useMemo } from 'react';
import { 
    Box, 
    Typography, 
    Avatar, 
    Paper, 
    IconButton,
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
    TextField,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
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
            onClose();
        } finally {
            setIsSelecting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

const ChatHeader = ({ chat, currentUser, onChatRoomUpdate }) => {
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
                body: JSON.stringify({ participantIds: [userId] })
            });
            
            if (!response.ok) throw new Error('Failed to add member');
            
            const data = await response.json();
            if (data.success) {
                onChatRoomUpdate && onChatRoomUpdate(data.data);
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
                onChatRoomUpdate && onChatRoomUpdate(data.data);
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

    if (!chat?.participants) {
        return null;
    }

    if (chat.type !== 'group') {
        const chatPartner = chat.participants.find(p => p._id !== currentUser._id);
        return (
            <StyledChatHeader elevation={1}>
                <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
                    {chatPartner?.name?.[0]?.toUpperCase() || '?'}
                </Avatar>
                <Typography variant="h6" sx={{ color: 'rgba(34, 34, 96, 0.8)' }}>
                    {chatPartner?.name || 'Unknown User'}
                </Typography>
            </StyledChatHeader>
        );
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
                onClose={() => setShowMembers(false)}
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
                    <Button onClick={() => setShowMembers(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <UserSearchDialog
                open={showAddMembers}
                onClose={() => setShowAddMembers(false)}
                onSelect={handleAddMembers}
                currentMembers={chat.participants || []}
            />
        </StyledChatHeader>
    );
};

export default ChatHeader;