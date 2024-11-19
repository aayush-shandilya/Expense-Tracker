import React, { useState, useEffect } from 'react';
import { 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    CircularProgress,
    Box,
    Typography,
    Snackbar,
    Alert,
    Tabs,
    Tab,
    Chip,
    Stack,
    Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useChatContext } from '../../context/chatContext';

// Online badge styling
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
}));

const NewChatButton = ({ onChatCreated, setActiveChat }) => {
    const { searchUsers } = useChatContext();
    const [open, setOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleSearch = async (value) => {
        setSearchTerm(value);
        if (!value || value.length < 1) {
            setUsers([]);
            return;
        }

        setLoading(true);
        try {
            // Use the searchUsers function from ChatContext
            const searchResults = await searchUsers(value);
            console.log('Search results:', searchResults);
            
            if (Array.isArray(searchResults)) {
                setUsers(searchResults);
            } else {
                setUsers([]);
                setError('Invalid search results format');
            }
        } catch (error) {
            console.error('Search error:', error);
            setUsers([]);
            setError(error.message || 'Failed to search users');
        } finally {
            setLoading(false);
        }
    };

    const formatLastActive = (lastActive) => {
        if (!lastActive) return 'Never';
        try {
            const date = new Date(lastActive);
            return date.toLocaleString();
        } catch (error) {
            return 'Unknown';
        }
    };


    const startPrivateChat = async (selectedUser) => {
        if (!selectedUser || !selectedUser._id) {
            setError('Invalid user selected');
            return;
        }

        try {
            setLoading(true);
            
            // Check for existing chat first
            const chatsResponse = await fetch('http://localhost:5001/api/v1/chat/user-chats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const chatsData = await chatsResponse.json();
            const existingChats = chatsData.data || [];
            
            const existingChat = existingChats.find(chat => 
                chat.type === 'private' && 
                chat.participants.some(p => p._id === selectedUser._id)
            );

            if (existingChat) {
                setActiveChat(existingChat);
                handleClose();
                return;
            }

            const response = await fetch('http://localhost:5001/api/v1/chat/private', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    participantId: selectedUser._id 
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to create chat');
            }

            if (onChatCreated) await onChatCreated();
            setActiveChat(data.data);
            handleClose();
        } catch (error) {
            console.error('Chat creation error:', error);
            setError(error.message || 'Failed to start chat');
        } finally {
            setLoading(false);
        }
    };

    const createGroupChat = async () => {
        if (!groupName || !selectedUsers || selectedUsers.length < 2) {
            setError('Group name and at least 2 members are required');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:5001/api/v1/chat/group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: groupName,
                    participantIds: selectedUsers.map(user => user._id)
                })
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to create group');
            }

            if (onChatCreated) await onChatCreated();
            setActiveChat(data.data);
            handleClose();
        } catch (error) {
            setError(error.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSearchTerm('');
        setUsers([]);
        setError('');
        setGroupName('');
        setSelectedUsers([]);
        setTabValue(0);
    };

    const toggleUserSelection = (user) => {
        if (!user || !user._id) return;
        
        setSelectedUsers(prev => {
            const isSelected = prev.some(u => u._id === user._id);
            if (isSelected) {
                return prev.filter(u => u._id !== user._id);
            }
            return [...prev, user];
        });
    };

return (
    <>
        <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
                mt: 2,
                backgroundColor: 'rgba(34, 34, 96, 1)',
                '&:hover': {
                    backgroundColor: 'rgb(0, 148, 0)'
                }
            }}
        >
            New Chat
        </Button>

        <Dialog 
            open={open} 
            onClose={handleClose}
            fullWidth 
            maxWidth="sm"
        >
            <DialogTitle>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
                    <Tab icon={<PersonAddIcon />} label="Private Chat" />
                    <Tab icon={<GroupAddIcon />} label="Group Chat" />
                </Tabs>
            </DialogTitle>

            <DialogContent>
                {tabValue === 1 && (
                    <TextField
                        margin="dense"
                        label="Group Name"
                        fullWidth
                        value={groupName || ''}
                        onChange={(e) => setGroupName(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                )}

                <TextField
                    autoFocus
                    margin="dense"
                    label="Search users by name or email"
                    fullWidth
                    value={searchTerm || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    variant="outlined"
                    disabled={loading}
                />

                {tabValue === 1 && selectedUsers && selectedUsers.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                        {selectedUsers.map((user) => (
                            <Chip
                                key={user._id}
                                label={user.name}
                                onDelete={() => toggleUserSelection(user)}
                                color="primary"
                            />
                        ))}
                    </Stack>
                )}
                
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && users && users.length === 0 && searchTerm && searchTerm.length >= 1 && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography color="textSecondary">
                            No users found
                        </Typography>
                    </Box>
                )}

                <List>
                    {Array.isArray(users) && users.map((user) => (
                        <ListItem 
                            button 
                            key={user._id}
                            onClick={() => tabValue === 0 ? 
                                startPrivateChat(user) : 
                                toggleUserSelection(user)}
                            disabled={loading}
                            selected={tabValue === 1 && 
                                selectedUsers.some(u => u._id === user._id)}
                        >
                            <ListItemAvatar>
                                <OnlineBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                    invisible={!user.isOnline}
                                >
                                    <Avatar 
                                        sx={{ 
                                            bgcolor: 'rgba(34, 34, 96, 0.8)'
                                        }}
                                    >
                                        {user.name && user.name[0] && user.name[0].toUpperCase()}
                                    </Avatar>
                                </OnlineBadge>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={user.name} 
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                        >
                                            {user.email}
                                        </Typography>
                                        <br />
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color={user.isOnline ? "success.main" : "text.secondary"}
                                        >
                                            {user.isOnline ? 'Online' : `Last active: ${formatLastActive(user.lastActive)}`}
                                        </Typography>
                                    </React.Fragment>
                                }
                                primaryTypographyProps={{
                                    sx: { color: 'rgba(34, 34, 96, 0.8)' }
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {tabValue === 1 && (
                    <Button 
                        onClick={createGroupChat}
                        disabled={loading || !groupName || !selectedUsers || selectedUsers.length < 2}
                    >
                        Create Group
                    </Button>
                )}
            </DialogActions>
        </Dialog>

        <Snackbar 
            open={!!error} 
            autoHideDuration={6000} 
            onClose={() => setError('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert 
                onClose={() => setError('')} 
                severity="error" 
                sx={{ width: '100%' }}
            >
                {error}
            </Alert>
        </Snackbar>
    </>
);
};

export default NewChatButton;