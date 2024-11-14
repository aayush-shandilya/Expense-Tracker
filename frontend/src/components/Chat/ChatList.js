// //ChatList.js;
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

// const ChatList = ({ chats = [], onChatSelect, activeChat, currentUser }) => {
//     // Add defensive check for chats
//     const chatArray = Array.isArray(chats) ? chats : [];
    
//     if (chatArray.length === 0) {
//         return (
//             <Box sx={{ p: 3, textAlign: 'center', color: 'rgba(34, 34, 96, 0.6)' }}>
//                 <Typography variant="body1">
//                     No chats yet. Start a new conversation!
//                 </Typography>
//             </Box>
//         );
//     }

//     return (
//         // <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
//         //     {chatArray.map((chat) => {
//         //         // Find the other participant (not the current user)
//         //         const otherParticipant = chat.participants?.find(
//         //             p => p._id !== currentUser?._id
//         //         );
                
//         //         const name = otherParticipant?.name || 'Unknown User';
//         //         const firstLetter = name[0] || '?';

//         //         return (
//         //             <StyledListItem
//         //                 key={chat._id}
//         //                 button
//         //                 active={activeChat?._id === chat._id}
//         //                 onClick={() => onChatSelect(chat)}
//         //             >
//         //                 <ListItemAvatar>
//         //                     <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
//         //                         {firstLetter.toUpperCase()}
//         //                     </Avatar>
//         //                 </ListItemAvatar>
//         //                 <ListItemText
//         //                     primary={
//         //                         <Typography 
//         //                             variant="subtitle1" 
//         //                             sx={{ color: 'rgba(34, 34, 96, 0.8)' }}
//         //                         >
//         //                             {name}
//         //                         </Typography>
//         //                     }
//         //                     secondary={
//         //                         chat.lastMessage ? (
//         //                             <Typography 
//         //                                 variant="body2" 
//         //                                 sx={{ color: 'rgba(34, 34, 96, 0.6)' }}
//         //                             >
//         //                                 {chat.lastMessage.content}
//         //                             </Typography>
//         //                         ) : null
//         //                     }
//         //                 />
//         //             </StyledListItem>
//         //         );
//         //     })}
//         // </List>
//         <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
//             {chatArray.map((chat) => {
//                 let name, firstLetter;
                
//                 if (chat.type === 'group') {
//                     name = chat.name;
//                     firstLetter = name[0];
//                 } else {
//                     const otherParticipant = chat.participants?.find(
//                         p => p._id !== currentUser?._id
//                     );
//                     name = otherParticipant?.name || 'Unknown User';
//                     firstLetter = name[0] || '?';
//                 }

//                 return (
//                     <StyledListItem
//                         key={chat._id}
//                         button
//                         active={activeChat?._id === chat._id}
//                         onClick={() => onChatSelect(chat)}
//                     >
//                         <ListItemAvatar>
//                             <Avatar sx={{ 
//                                 bgcolor: chat.type === 'group' ? 
//                                     'rgba(96, 34, 34, 0.8)' : 
//                                     'rgba(34, 34, 96, 0.8)' 
//                             }}>
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
//                                     {chat.type === 'group' && 
//                                         ` (${chat.participants?.length || 0} members)`}
//                                 </Typography>
//                             }
//                             secondary={chat.lastMessage || null}
//                         />
//                     </StyledListItem>
//                 );
//             })}
//         </List>
//     );
// };

// export default ChatList;\




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
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
    backgroundColor: active ? 'rgba(34, 34, 96, 0.1)' : 'transparent',
    '&:hover': {
        backgroundColor: 'rgba(34, 34, 96, 0.05)'
    }
}));

const ChatList = ({ chats = [], onChatSelect, activeChat, currentUser }) => {
    // Ensure chats is an array and filter out any invalid entries
    const validChats = Array.isArray(chats) ? chats.filter(chat => 
        chat && chat.participants && Array.isArray(chat.participants)
    ) : [];

    if (validChats.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center', color: 'rgba(34, 34, 96, 0.6)' }}>
                <Typography variant="body1">
                    No chats yet. Start a new conversation!
                </Typography>
            </Box>
        );
    }

    const getChatName = (chat) => {
        if (!chat) return 'Unknown';
        
        if (chat.type === 'group') {
            return chat.name || 'Unnamed Group';
        }

        const otherParticipant = chat.participants?.find(
            p => p._id !== currentUser?._id
        );
        return otherParticipant?.name || 'Unknown User';
    };

    const getAvatarContent = (chat) => {
        if (!chat) return '?';

        if (chat.type === 'group') {
            return <GroupIcon />;
        }

        const name = getChatName(chat);
        return name[0]?.toUpperCase() || '?';
    };

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {validChats.map((chat) => {
                if (!chat) return null;

                const chatName = getChatName(chat);
                const isGroup = chat.type === 'group';

                return (
                    <StyledListItem
                        key={chat._id}
                        button
                        active={activeChat?._id === chat._id}
                        onClick={() => onChatSelect(chat)}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ 
                                bgcolor: isGroup ? 'rgba(96, 34, 34, 0.8)' : 'rgba(34, 34, 96, 0.8)'
                            }}>
                                {isGroup ? <GroupIcon /> : getAvatarContent(chat)}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography
                                    variant="subtitle1"
                                    sx={{ color: 'rgba(34, 34, 96, 0.8)' }}
                                >
                                    {chatName}
                                    {isGroup && chat.participants && 
                                        ` (${chat.participants.length} members)`}
                                </Typography>
                            }
                            secondary={
                                chat.lastMessage ? (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'rgba(34, 34, 96, 0.6)' }}
                                    >
                                        {chat.lastMessage}
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