import React, { useState, useRef } from 'react';
import { 
    Box, 
    TextField, 
    IconButton, 
    Typography, 
    Chip,
    ImageList,
    ImageListItem
} from '@mui/material';
import { 
    AttachFile, 
    Send, 
    Close,
    Image as ImageIcon,
    Description
} from '@mui/icons-material';

const MessageBubble = ({ message, isOwn, onDownload }) => {
    const isImage = (file) => file.fileType.startsWith('image/');

    return (
        <Box
            sx={{
                maxWidth: '70%',
                padding: 1,
                borderRadius: '20px',
                backgroundColor: isOwn ? 'rgba(34, 34, 96, 0.8)' : 'rgba(34, 34, 96, 0.1)',
                color: isOwn ? '#fff' : 'inherit',
                alignSelf: isOwn ? 'flex-end' : 'flex-start',
               
            }}
        >
            <Typography variant="body1">
                {message.content}
            </Typography>

            {message.attachments && message.attachments.length > 0 && (
                <Box sx={{ mt: 1 }}>
                    {/* Images */}
                    {message.attachments.filter(file => isImage(file)).length > 0 && (
                        <ImageList cols={2} rowHeight={100} sx={{ mt: 1 }}>
                            {message.attachments
                                .filter(file => isImage(file))
                                .map(file => (
                                    <ImageListItem key={file._id}>
                                        <img
                                            src={`http://localhost:5001/api/v1/chat/messages/${message._id}/files/${file._id}`}
                                            alt={file.originalName}
                                            loading="lazy"
                                            style={{ 
                                                maxWidth: '100%', 
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => onDownload(message._id, file._id)}
                                        />
                                    </ImageListItem>
                                ))}
                        </ImageList>
                    )}

                    {/* Other files */}
                    {message.attachments
                        .filter(file => !isImage(file))
                        .map(file => (
                            <Chip
                                key={file._id}
                                icon={<Description />}
                                label={file.originalName}
                                onClick={() => onDownload(message._id, file._id)}
                                variant="outlined"
                                size="small"
                                sx={{ 
                                    mt: 1,
                                    mr: 1,
                                    backgroundColor: isOwn ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                                }}
                            />
                        ))}
                </Box>
            )}

            <Typography 
                variant="caption" 
                sx={{ 
                    display: 'block',
                    textAlign: isOwn ? 'right' : 'left',
                    mt: 0.5,
                    opacity: 0.7
                }}
            >
                {new Date(message.timestamp).toLocaleTimeString()}
            </Typography>
        </Box>
    );
};

const MessageInput = ({ 
    newMessage, 
    setNewMessage, 
    sending, 
    selectedFiles, 
    setSelectedFiles, 
    fileInputRef, 
    handleSubmit 
}) => {
    const removeFile = (fileToRemove) => {
        setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
    };

    const isImage = (file) => file.type.startsWith('image/');

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: 2,
                backgroundColor: 'rgba(252, 246, 249, 0.9)',
                borderTop: '1px solid rgba(34, 34, 96, 0.1)'
            }}
        >
            {/* File Preview */}
            {selectedFiles.length > 0 && (
                <Box sx={{ mb: 1 }}>
                    {/* Image previews */}
                    {selectedFiles.filter(file => isImage(file)).length > 0 && (
                        <ImageList cols={3} rowHeight={100} sx={{ mb: 1 }}>
                            {selectedFiles
                                .filter(file => isImage(file))
                                .map((file, index) => (
                                    <ImageListItem key={index}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            loading="lazy"
                                            style={{ height: '100px', objectFit: 'cover' }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => removeFile(file)}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                                                }
                                            }}
                                        >
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </ImageListItem>
                                ))}
                        </ImageList>
                    )}

                    {/* Other file chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedFiles
                            .filter(file => !isImage(file))
                            .map((file, index) => (
                                <Chip
                                    key={index}
                                    label={file.name}
                                    onDelete={() => removeFile(file)}
                                    size="small"
                                    icon={<Description />}
                                />
                            ))}
                    </Box>
                </Box>
            )}

            {/* Input Area */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setSelectedFiles([...selectedFiles, ...files]);
                        e.target.value = '';
                    }}
                />

                <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending}
                >
                    <AttachFile />
                </IconButton>

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
                    disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending}
                >
                    <Send />
                </IconButton>
            </Box>
        </Box>
    );
};

export { MessageBubble, MessageInput };