// // // // frontend/src/components/Chat/ChatList.js
// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';

// // // const ChatList = ({ onChatSelect, activeChat }) => {
// // //     const [chats, setChats] = useState([]);
// // //     const [loading, setLoading] = useState(true);

// // //     useEffect(() => {
// // //         fetchChats();
// // //     }, []);

// // //     const fetchChats = async () => {
// // //         try {
// // //             const response = await axios.get('http://localhost:5001/api/v1/chat/user-chats', {
// // //                 headers: {
// // //                     'Authorization': `Bearer ${localStorage.getItem('token')}`
// // //                 }
// // //             });
// // //             setChats(response.data);
// // //             setLoading(false);
// // //         } catch (error) {
// // //             console.error('Error fetching chats:', error);
// // //             setLoading(false);
// // //         }
// // //     };

// // //     return (
// // //         <div className="h-full flex flex-col">
// // //             <div className="p-4 border-b">
// // //                 <h2 className="text-xl font-semibold">Chats</h2>
// // //             </div>
// // //             {loading ? (
// // //                 <div className="flex-1 flex items-center justify-center">
// // //                     Loading...
// // //                 </div>
// // //             ) : (
// // //                 <div className="flex-1 overflow-y-auto">
// // //                     {chats.map((chat) => (
// // //                         <div
// // //                             key={chat._id}
// // //                             className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
// // //                                 activeChat?._id === chat._id ? 'bg-blue-50' : ''
// // //                             }`}
// // //                             onClick={() => onChatSelect(chat)}
// // //                         >
// // //                             <h3 className="font-medium">
// // //                                 {chat.type === 'private' 
// // //                                     ? chat.participants[0].name 
// // //                                     : chat.name}
// // //                             </h3>
// // //                             <p className="text-sm text-gray-500">
// // //                                 {chat.type === 'private' ? 'Private Chat' : 'Group'}
// // //                             </p>
// // //                         </div>
// // //                     ))}
// // //                 </div>
// // //             )}
// // //         </div>
// // //     );
// // // };

// // // export default ChatList;



// // // components/Chat/ChatList.js
// // import React from 'react';
// // import { 
// //     List, 
// //     ListItem, 
// //     ListItemText, 
// //     ListItemAvatar, 
// //     Avatar,
// //     Typography,
// //     Box,
// //     styled
// // } from '@mui/material';

// // const StyledListItem = styled(ListItem)(({ theme, active }) => ({
// //     backgroundColor: active ? 'rgba(34, 34, 96, 0.1)' : 'transparent',
// //     '&:hover': {
// //         backgroundColor: 'rgba(34, 34, 96, 0.05)'
// //     }
// // }));

// // const ChatList = ({ chats, onChatSelect, activeChat }) => {
// //     if (!chats || chats.length === 0) {
// //         return (
// //             <Box sx={{ p: 3, textAlign: 'center', color: 'rgba(34, 34, 96, 0.6)' }}>
// //                 <Typography variant="body1">
// //                     No chats yet. Start a new conversation!
// //                 </Typography>
// //             </Box>
// //         );
// //     }

// //     return (
// //         <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
// //             {chats.map((chat) => (
// //                 <StyledListItem
// //                     key={chat._id}
// //                     button
// //                     active={activeChat?._id === chat._id}
// //                     onClick={() => onChatSelect(chat)}
// //                 >
// //                     <ListItemAvatar>
// //                         <Avatar>
// //                             {chat.type === 'private' 
// //                                 ? chat.participants[0].name[0]
// //                                 : chat.name[0]}
// //                         </Avatar>
// //                     </ListItemAvatar>
// //                     <ListItemText
// //                         primary={
// //                             <Typography variant="subtitle1" sx={{ color: 'rgba(34, 34, 96, 0.8)' }}>
// //                                 {chat.type === 'private' 
// //                                     ? chat.participants[0].name 
// //                                     : chat.name}
// //                             </Typography>
// //                         }
// //                         secondary={
// //                             <Typography variant="body2" sx={{ color: 'rgba(34, 34, 96, 0.6)' }}>
// //                                 {chat.lastMessage?.content || 'No messages yet'}
// //                             </Typography>
// //                         }
// //                     />
// //                 </StyledListItem>
// //             ))}
// //         </List>
// //     );
// // };

// // export default ChatList;

// // //ChatList.js
// // import React from 'react';
// // import { 
// //     List, 
// //     ListItem, 
// //     ListItemText, 
// //     ListItemAvatar, 
// //     Avatar,
// //     Typography,
// //     Box,
// //     styled
// // } from '@mui/material';

// // const StyledListItem = styled(ListItem)(({ theme, active }) => ({
// //     backgroundColor: active ? 'rgba(34, 34, 96, 0.1)' : 'transparent',
// //     '&:hover': {
// //         backgroundColor: 'rgba(34, 34, 96, 0.05)'
// //     }
// // }));

// // const ChatList = ({ chats = [], onChatSelect, activeChat }) => {
// //     // Add defensive check for chats
// //     const chatArray = Array.isArray(chats) ? chats : [];
    
// //     if (chatArray.length === 0) {
// //         return (
// //             <Box sx={{ p: 3, textAlign: 'center', color: 'rgba(34, 34, 96, 0.6)' }}>
// //                 <Typography variant="body1">
// //                     No chats yet. Start a new conversation!
// //                 </Typography>
// //             </Box>
// //         );
// //     }

// //     return (
// //         <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
// //             {chatArray.map((chat) => {
// //                 // Add null check for chat participants
// //                 const participantName = chat?.participants?.[0]?.name || 'Unknown';
// //                 const firstLetter = participantName[0] || '?';
// //                 const lastMessage = chat?.lastMessage?.content || 'No messages yet';
                
// //                 return (
// //                     <StyledListItem
// //                         key={chat._id}
// //                         button
// //                         active={activeChat?._id === chat._id}
// //                         onClick={() => onChatSelect(chat)}
// //                     >
// //                         <ListItemAvatar>
// //                             <Avatar>
// //                                 {chat.type === 'private' 
// //                                     ? firstLetter
// //                                     : (chat.name?.[0] || '?')}
// //                             </Avatar>
// //                         </ListItemAvatar>
// //                         <ListItemText
// //                             primary={
// //                                 <Typography variant="subtitle1" sx={{ color: 'rgba(34, 34, 96, 0.8)' }}>
// //                                     {chat.type === 'private' 
// //                                         ? participantName
// //                                         : (chat.name || 'Unnamed Chat')}
// //                                 </Typography>
// //                             }
// //                             secondary={
// //                                 <Typography variant="body2" sx={{ color: 'rgba(34, 34, 96, 0.6)' }}>
// //                                     {lastMessage}
// //                                 </Typography>
// //                             }
// //                         />
// //                     </StyledListItem>
// //                 );
// //             })}
// //         </List>
// //     );
// // };

// // export default ChatList;






// import React from 'react';
// import {
//     List,
//     ListItem,
//     ListItemText,
//     ListItemAvatar,
//     Avatar,
//     Typography,
//     Box,
//     styled
// } from '@mui/material';

// const StyledListItem = styled(ListItem)(({ theme, active }) => ({
//     backgroundColor: active ? 'rgba(34, 34, 96, 0.1)' : 'transparent',
//     '&:hover': {
//         backgroundColor: 'rgba(34, 34, 96, 0.05)'
//     }
// }));

// const ChatList = ({ users = [], onUserSelect, activeChat }) => {
//     // Add defensive check for users
//     const userArray = Array.isArray(users) ? users : [];
    
//     if (userArray.length === 0) {
//         return (
//             <Box sx={{ p: 3, textAlign: 'center', color: 'rgba(34, 34, 96, 0.6)' }}>
//                 <Typography variant="body1">
//                     No users available for chat
//                 </Typography>
//             </Box>
//         );
//     }

//     return (
//         <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
//             {userArray.map((user) => {
//                 const name = user.name || 'Unknown User';
//                 const firstLetter = name[0] || '?';
                
//                 return (
//                     <StyledListItem
//                         key={user._id}
//                         button
//                         active={activeChat?.participants?.some(p => p._id === user._id)}
//                         onClick={() => onUserSelect(user)}
//                     >
//                         <ListItemAvatar>
//                             <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
//                                 {firstLetter.toUpperCase()}
//                             </Avatar>
//                         </ListItemAvatar>
//                         <ListItemText
//                             primary={
//                                 <Typography 
//                                     variant="subtitle1" 
//                                     sx={{ color: 'rgba(34, 34, 96, 0.8)' }}
//                                 >
//                                     {name}
//                                 </Typography>
//                             }
//                         />
//                     </StyledListItem>
//                 );
//             })}
//         </List>
//     );
// };

// export default ChatList;


import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Box,
    styled
} from '@mui/material';

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
    backgroundColor: active ? 'rgba(34, 34, 96, 0.1)' : 'transparent',
    '&:hover': {
        backgroundColor: 'rgba(34, 34, 96, 0.05)'
    }
}));

const ChatList = ({ chats = [], onChatSelect, activeChat, currentUser }) => {
    // Add defensive check for chats
    const chatArray = Array.isArray(chats) ? chats : [];
    
    if (chatArray.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center', color: 'rgba(34, 34, 96, 0.6)' }}>
                <Typography variant="body1">
                    No chats yet. Start a new conversation!
                </Typography>
            </Box>
        );
    }

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {chatArray.map((chat) => {
                // Find the other participant (not the current user)
                const otherParticipant = chat.participants?.find(
                    p => p._id !== currentUser?._id
                );
                
                const name = otherParticipant?.name || 'Unknown User';
                const firstLetter = name[0] || '?';

                return (
                    <StyledListItem
                        key={chat._id}
                        button
                        active={activeChat?._id === chat._id}
                        onClick={() => onChatSelect(chat)}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
                                {firstLetter.toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ color: 'rgba(34, 34, 96, 0.8)' }}
                                >
                                    {name}
                                </Typography>
                            }
                            secondary={
                                chat.lastMessage ? (
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: 'rgba(34, 34, 96, 0.6)' }}
                                    >
                                        {chat.lastMessage.content}
                                    </Typography>
                                ) : null
                            }
                        />
                    </StyledListItem>
                );
            })}
        </List>
    );
};

export default ChatList;