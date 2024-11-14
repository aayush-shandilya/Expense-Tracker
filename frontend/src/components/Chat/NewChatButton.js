
// // frontend/components/Chat/NewChatButton.js
// import React, { useState } from 'react';
// import { 
//     Button, 
//     Dialog, 
//     DialogTitle, 
//     DialogContent,
//     DialogActions,
//     TextField,
//     List,
//     ListItem,
//     ListItemText,
//     ListItemAvatar,
//     Avatar,
//     CircularProgress,
//     Box,
//     Typography,
//     Snackbar,
//     Alert
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';

// const NewChatButton = ({ onChatCreated, setActiveChat }) => {
//     const [open, setOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [users, setUsers] = useState([]);
//     const [error, setError] = useState('');

//         const handleSearch = async (value) => {
//         setSearchTerm(value);
//         if (value.length < 0) {
//             setUsers([]);
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await fetch(`http://localhost:5001/api/v1/auth/search?term=${value}`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to search users');
//             }
//             const data = await response.json();
//             setUsers(data);
//         } catch (error) {
//             console.error('Error searching users:', error);
//             setError('Failed to search users');
//         } finally {
//             setLoading(false);
//         }
//     };
    

//     const startChat = async (selectedUser) => {
//         try {
//             setLoading(true);
//             // First check if a chat already exists with this user
//             const chatsResponse = await fetch('http://localhost:5001/api/v1/chat/user-chats', {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
            
//             if (!chatsResponse.ok) {
//                 throw new Error('Failed to fetch chats');
//             }
            
//             const chatsData = await chatsResponse.json();
//             const existingChats = chatsData.data || []; // Access the data property
            
//             // Check if there's already a private chat with this user
//             const existingChat = existingChats.find(chat => 
//                 chat.type === 'private' && 
//                 chat.participants.some(p => p._id === selectedUser._id)
//             );

//             if (existingChat) {
//                 setActiveChat(existingChat);
//                 setOpen(false);
//                 return;
//             }

//             // If no existing chat, create new one
//             const response = await fetch('http://localhost:5001/api/v1/chat/private', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify({ participantId: selectedUser._id })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to create chat');
//             }

//             const newChatData = await response.json();
            
//             if (!newChatData.success) {
//                 throw new Error(newChatData.error || 'Failed to create chat');
//             }

//             // Update the chat list
//             if (onChatCreated) {
//                 await onChatCreated();
//             }
            
//             setActiveChat(newChatData.data);
            
//             setOpen(false);
//         } catch (error) {
//             console.error('Error starting chat:', error);
//             setError(error.message || 'Failed to start chat');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <Button
//                 fullWidth
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={() => setOpen(true)}
//                 sx={{
//                     mt:2,
//                     backgroundColor: 'rgba(34, 34, 96, 1)',
//                     '&:hover': {
//                         backgroundColor: 'rgb(0, 148, 0)'
//                     }
//                 }}
//             >
//                 New Chat
//             </Button>

//             <Dialog 
//                 open={open} 
//                 onClose={() => {
//                     setOpen(false);
//                     setSearchTerm('');
//                     setUsers([]);
//                     setError('');
//                 }}
//                 fullWidth 
//                 maxWidth="sm"
//                 aria-labelledby="chat-dialog-title"
//                 slotProps={{
//                     backdrop: {
//                         'aria-hidden': true
//                     }
//                 }}
//             >
//                 <DialogTitle id="chat-dialog-title">Start New Chat</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Search users by name or email"
//                         fullWidth
//                         value={searchTerm}
//                         onChange={(e) => handleSearch(e.target.value)}
//                         variant="outlined"
//                         disabled={loading}
//                     />
                    
//                     {loading && (
//                         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//                             <CircularProgress />
//                         </Box>
//                     )}

//                     {!loading && users.length === 0 && searchTerm.length >= 2 && (
//                         <Box sx={{ textAlign: 'center', mt: 2 }}>
//                             <Typography color="textSecondary">
//                                 No users found
//                             </Typography>
//                         </Box>
//                     )}

//                     <List>
//                         {users.map((user) => (
//                             <ListItem 
//                                 button 
//                                 key={user._id}
//                                 onClick={() => startChat(user)}
//                                 disabled={loading}
//                             >
//                                 <ListItemAvatar>
//                                     <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
//                                         {user.name[0].toUpperCase()}
//                                     </Avatar>
//                                 </ListItemAvatar>
//                                 <ListItemText 
//                                     primary={user.name} 
//                                     secondary={user.email}
//                                     primaryTypographyProps={{
//                                         sx: { color: 'rgba(34, 34, 96, 0.8)' }
//                                     }}
//                                 />
//                             </ListItem>
//                         ))}
//                     </List>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button 
//                         onClick={() => {
//                             setOpen(false);
//                             setSearchTerm('');
//                             setUsers([]);
//                             setError('');
//                         }}
//                     >
//                         Cancel
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <Snackbar 
//                 open={!!error} 
//                 autoHideDuration={6000} 
//                 onClose={() => setError('')}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             >
//                 <Alert 
//                     onClose={() => setError('')} 
//                     severity="error" 
//                     sx={{ width: '100%' }}
//                 >
//                     {error}
//                 </Alert>
//             </Snackbar>
//         </>
//     );
// };

// export default NewChatButton;







import React, { useState } from 'react';
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
    Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const NewChatButton = ({ onChatCreated, setActiveChat }) => {
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
        if (value.length < 2) {
            setUsers([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/v1/auth/search?term=${value}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to search users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error searching users:', error);
            setError('Failed to search users');
        } finally {
            setLoading(false);
        }
    };

    const startPrivateChat = async (selectedUser) => {
        try {
            setLoading(true);
            const chatsResponse = await fetch('http://localhost:5001/api/v1/chat/user-chats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!chatsResponse.ok) throw new Error('Failed to fetch chats');
            
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
                body: JSON.stringify({ participantId: selectedUser._id })
            });

            if (!response.ok) throw new Error('Failed to create chat');

            const newChatData = await response.json();
            if (!newChatData.success) throw new Error(newChatData.error);

            if (onChatCreated) await onChatCreated();
            setActiveChat(newChatData.data);
            handleClose();
        } catch (error) {
            setError(error.message || 'Failed to start chat');
        } finally {
            setLoading(false);
        }
    };

    const createGroupChat = async () => {
        if (!groupName || selectedUsers.length < 2) {
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

            if (!response.ok) throw new Error('Failed to create group');

            const newGroupData = await response.json();
            if (!newGroupData.success) throw new Error(newGroupData.error);

            if (onChatCreated) await onChatCreated();
            setActiveChat(newGroupData.data);
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
                            value={groupName}
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
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        variant="outlined"
                        disabled={loading}
                    />

                    {tabValue === 1 && selectedUsers.length > 0 && (
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

                    {!loading && users.length === 0 && searchTerm.length >= 2 && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography color="textSecondary">
                                No users found
                            </Typography>
                        </Box>
                    )}

                    <List>
                        {users.map((user) => (
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
                                    <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
                                        {user.name[0].toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={user.name} 
                                    secondary={user.email}
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
                            disabled={loading || !groupName || selectedUsers.length < 2}
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