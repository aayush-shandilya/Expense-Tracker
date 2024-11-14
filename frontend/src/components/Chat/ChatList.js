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