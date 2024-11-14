// // // components/Chat/NewChatButton.js
// // import React, { useState } from 'react';
// // import { 
// //     Box,
// //     Button, 
// //     Dialog, 
// //     DialogTitle, 
// //     DialogContent, 
// //     DialogActions,
// //     TextField,
// //     List,
// //     ListItem,
// //     ListItemText,
// //     ListItemAvatar,
// //     Avatar,
// //     CircularProgress
// // } from '@mui/material';
// // import AddIcon from '@mui/icons-material/Add';

// // const NewChatButton = ({ onChatCreated }) => {
// //     const [open, setOpen] = useState(false);
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [loading, setLoading] = useState(false);
// //     const [users, setUsers] = useState([]);

// //     const handleSearch = async (value) => {
// //         setSearchTerm(value);
// //         if (value.length < 2) {
// //             setUsers([]);
// //             return;
// //         }

// //         setLoading(true);
// //         try {
// //             const response = await fetch(`http://localhost:5001/api/v1/auth/search?term=${value}`, {
// //                 headers: {
// //                     'Authorization': `Bearer ${localStorage.getItem('token')}`
// //                 }
// //             });
// //             const data = await response.json();
// //             setUsers(data);
// //         } catch (error) {
// //             console.error('Error searching users:', error);
// //         }
// //         setLoading(false);
// //     };

// //     const startChat = async (userId) => {
// //         try {
// //             const response = await fetch('http://localhost:5001/api/v1/chat/private', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                     'Authorization': `Bearer ${localStorage.getItem('token')}`
// //                 },
// //                 body: JSON.stringify({ participantId: userId })
// //             });
// //             const data = await response.json();
// //             onChatCreated();
// //             setOpen(false);
// //         } catch (error) {
// //             console.error('Error creating chat:', error);
// //         }
// //     };

// //     return (
// //         <>
// //             <Button
// //                 fullWidth
// //                 variant="contained"
// //                 startIcon={<AddIcon />}
// //                 onClick={() => setOpen(true)}
// //                 sx={{
// //                     m: 2,
// //                     backgroundColor: 'rgba(34, 34, 96, 0.8)',
// //                     '&:hover': {
// //                         backgroundColor: 'rgba(34, 34, 96, 1)'
// //                     }
// //                 }}
// //             >
// //                 New Chat
// //             </Button>

// //             <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
// //                 <DialogTitle>Start New Chat</DialogTitle>
// //                 <DialogContent>
// //                     <TextField
// //                         autoFocus
// //                         margin="dense"
// //                         label="Search users"
// //                         fullWidth
// //                         value={searchTerm}
// //                         onChange={(e) => handleSearch(e.target.value)}
// //                         variant="outlined"
// //                     />
                    
// //                     {loading && (
// //                         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
// //                             <CircularProgress size={24} />
// //                         </Box>
// //                     )}

// //                     <List>
// //                         {users.map((user) => (
// //                             <ListItem 
// //                                 button 
// //                                 key={user._id}
// //                                 onClick={() => startChat(user._id)}
// //                             >
// //                                 <ListItemAvatar>
// //                                     <Avatar>{user.name[0]}</Avatar>
// //                                 </ListItemAvatar>
// //                                 <ListItemText 
// //                                     primary={user.name} 
// //                                     secondary={user.email} 
// //                                 />
// //                             </ListItem>
// //                         ))}
// //                     </List>
// //                 </DialogContent>
// //                 <DialogActions>
// //                     <Button onClick={() => setOpen(false)}>Cancel</Button>
// //                 </DialogActions>
// //             </Dialog>
// //         </>
// //     );
// // };

// // export default NewChatButton;


// // components/Chat/NewChatButton.js
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

//     const handleSearch = async (value) => {
//         setSearchTerm(value);
//         if (value.length < 2) {
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
//             const existingChats = await chatsResponse.json();
            
//             // Check if there's already a private chat with this user
//             const existingChat = existingChats.find(chat => 
//                 chat.type === 'private' && 
//                 chat.participants.some(p => p._id === selectedUser._id)
//             );

//             if (existingChat) {
//                 // If chat exists, just open it
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

//             const newChat = await response.json();
            
//             // Update the chat list
//             await onChatCreated();
            
//             // Set the new chat as active
//             setActiveChat(newChat);
            
//             // Close the dialog
//             setOpen(false);
//         } catch (error) {
//             console.error('Error starting chat:', error);
//             setError('Failed to start chat');
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
//                     m: 2,
//                     backgroundColor: 'rgba(34, 34, 96, 0.8)',
//                     '&:hover': {
//                         backgroundColor: 'rgba(34, 34, 96, 1)'
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
//             >
//                 <DialogTitle>Start New Chat</DialogTitle>
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
//                             <CircularProgress size={24} />
//                         </Box>
//                     )}

//                     {users.length === 0 && searchTerm.length >= 2 && !loading && (
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
//                         color="primary"
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
//                 <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
//                     {error}
//                 </Alert>
//             </Snackbar>
//         </>
//     );
// };
// export default NewChatButton;


// frontend/components/Chat/NewChatButton.js
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
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const NewChatButton = ({ onChatCreated, setActiveChat }) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    // const handleSearch = async (value) => {
    //     setSearchTerm(value);
    //     if (value.length < 2) {
    //         setUsers([]);
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const response = await fetch(`http://localhost:5001/api/v1/auth/search?term=${value}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
    //             }
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to search users');
    //         }
    //         const data = await response.json();
    //         setUsers(data.data || []); // Access the data property
    //     } catch (error) {
    //         console.error('Error searching users:', error);
    //         setError('Failed to search users');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

        const handleSearch = async (value) => {
        setSearchTerm(value);
        if (value.length < 0) {
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
            if (!response.ok) {
                throw new Error('Failed to search users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error searching users:', error);
            setError('Failed to search users');
        } finally {
            setLoading(false);
        }
    };
    

    const startChat = async (selectedUser) => {
        try {
            setLoading(true);
            // First check if a chat already exists with this user
            const chatsResponse = await fetch('http://localhost:5001/api/v1/chat/user-chats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!chatsResponse.ok) {
                throw new Error('Failed to fetch chats');
            }
            
            const chatsData = await chatsResponse.json();
            const existingChats = chatsData.data || []; // Access the data property
            
            // Check if there's already a private chat with this user
            const existingChat = existingChats.find(chat => 
                chat.type === 'private' && 
                chat.participants.some(p => p._id === selectedUser._id)
            );

            if (existingChat) {
                setActiveChat(existingChat);
                setOpen(false);
                return;
            }

            // If no existing chat, create new one
            const response = await fetch('http://localhost:5001/api/v1/chat/private', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ participantId: selectedUser._id })
            });

            if (!response.ok) {
                throw new Error('Failed to create chat');
            }

            const newChatData = await response.json();
            
            if (!newChatData.success) {
                throw new Error(newChatData.error || 'Failed to create chat');
            }

            // Update the chat list
            if (onChatCreated) {
                await onChatCreated();
            }
            
            // Set the new chat as active
            setActiveChat(newChatData.data);
            
            // Close the dialog
            setOpen(false);
        } catch (error) {
            console.error('Error starting chat:', error);
            setError(error.message || 'Failed to start chat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
                sx={{
                    mt:2,
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
                onClose={() => {
                    setOpen(false);
                    setSearchTerm('');
                    setUsers([]);
                    setError('');
                }}
                fullWidth 
                maxWidth="sm"
                aria-labelledby="chat-dialog-title"
                // Remove aria-hidden from Dialog
                slotProps={{
                    backdrop: {
                        'aria-hidden': true
                    }
                }}
            >
                <DialogTitle id="chat-dialog-title">Start New Chat</DialogTitle>
                <DialogContent>
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
                                onClick={() => startChat(user)}
                                disabled={loading}
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
                    <Button 
                        onClick={() => {
                            setOpen(false);
                            setSearchTerm('');
                            setUsers([]);
                            setError('');
                        }}
                    >
                        Cancel
                    </Button>
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