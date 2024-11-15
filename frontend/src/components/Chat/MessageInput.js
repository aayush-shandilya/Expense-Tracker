import React from 'react';
import { Box, TextField, IconButton, Typography, Chip } from '@mui/material';
import { AttachFile, Send, Close } from '@mui/icons-material';

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
            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedFiles.map((file, index) => (
                        <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => removeFile(file)}
                            size="small"
                            sx={{ 
                                backgroundColor: 'rgba(34, 34, 96, 0.1)',
                                '& .MuiChip-deleteIcon': {
                                    color: 'rgba(34, 34, 96, 0.6)'
                                }
                            }}
                        />
                    ))}
                </Box>
            )}

            {/* Input Area */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setSelectedFiles([...selectedFiles, ...files]);
                        // Reset input value to allow selecting the same file again
                        e.target.value = '';
                    }}
                />
                
                <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending}
                    sx={{
                        color: 'rgba(34, 34, 96, 0.8)',
                        '&:hover': {
                            backgroundColor: 'rgba(34, 34, 96, 0.1)'
                        }
                    }}
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
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fff'
                        }
                    }}
                />

                <IconButton 
                    type="submit" 
                    disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending}
                    sx={{
                        color: 'rgba(34, 34, 96, 0.8)',
                        '&:hover': {
                            backgroundColor: 'rgba(34, 34, 96, 0.1)'
                        }
                    }}
                >
                    <Send />
                </IconButton>
            </Box>

            {/* File Upload Status */}
            {selectedFiles.length > 0 && (
                <Typography 
                    variant="caption" 
                    sx={{ 
                        mt: 1, 
                        display: 'block',
                        color: 'rgba(34, 34, 96, 0.6)'
                    }}
                >
                    {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                </Typography>
            )}
        </Box>
    );
};

export default MessageInput;