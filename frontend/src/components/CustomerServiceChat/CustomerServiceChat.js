import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, 
    Typography, 
    Avatar, 
    Paper, 
    styled,
    TextField,
    IconButton,
    CircularProgress,
    Card,
    CardContent,
    Button
} from '@mui/material';
import { Send } from '@mui/icons-material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useCustomerService } from '../../context/CustomerServiceContext';

// Existing styled components remain the same
const ChatContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'rgba(252, 246, 249, 0.78)',
}));

const ChatHeader = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: 'rgba(252, 246, 249, 0.9)',
    borderBottom: '1px solid rgba(34, 34, 96, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
}));

const MessageContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2), // Increased gap between messages
}));

const MessageWrapper = styled(Box)({
    width: '100%',
    display: 'flex',
    position: 'relative',
});

const MessageBubble = styled(Box)(({ theme, isown }) => ({
    position: 'relative',
    maxWidth: '70%',
    padding: theme.spacing(2),
    borderRadius: '16px',
    backgroundColor: isown === 'true' 
        ? 'rgba(25, 118, 210, 0.9)'   // Blue for user messages
        : 'rgba(34, 34, 96, 0.1)',    // Light purple for bot messages
    color: isown === 'true' ? '#fff' : 'inherit',
    marginLeft: isown === 'true' ? 'auto' : '0', // This pushes user messages to the right
    marginRight: isown === 'true' ? '0' : 'auto', // This keeps bot messages on the left
    width: 'auto',
    minWidth: '100px',
}));


const InputContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: 'rgba(252, 246, 249, 0.9)',
    borderTop: '1px solid rgba(34, 34, 96, 0.1)',
    display: 'flex',
    gap: theme.spacing(1)
}));

const QuestionButton = styled(Button)(({ theme }) => ({
    textAlign: 'left',
    justifyContent: 'flex-start',
    textTransform: 'none',
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(1),
    backgroundColor: 'rgba(34, 34, 96, 0.05)',
    color: 'rgba(34, 34, 96, 0.8)',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid rgba(34, 34, 96, 0.1)',
    '&:hover': {
        backgroundColor: 'rgba(34, 34, 96, 0.1)',
        borderColor: 'rgba(34, 34, 96, 0.2)',
    }
}));

// New styled component for question selection card
const QuestionCard = styled(Card)(({ theme }) => ({
    maxWidth: '70%',
    alignSelf: 'flex-start',
    marginBottom: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '& .MuiCardContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiButton-root': {
        textAlign: 'left',
        justifyContent: 'flex-start',
        textTransform: 'none',
        padding: theme.spacing(1),
        marginTop: theme.spacing(1),
        backgroundColor: 'rgba(34, 34, 96, 0.1)',
        color: 'rgba(34, 34, 96, 0.8)',
        '&:hover': {
            backgroundColor: 'rgba(34, 34, 96, 0.2)',
        }
    }
}));

const CustomerServiceChat = ({ currentUser }) => {
    const { messages: messages, sendMessage: sendContextMessage, joinCustomerService, isLoading,updateMessages,handleQuestionSelection} = useCustomerService();
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const [localMessages, setLocalMessages] = useState([{
        _id: 'welcome',
        content: 'Hello! How can I assist you today?',
        sender: { _id: 'bot', name: 'Customer Service Bot' },
        timestamp: new Date().toISOString()
    }]);

    useEffect(() => {
        if (currentUser?._id) {
            joinCustomerService(currentUser._id);
        }
    }, [currentUser?._id, joinCustomerService]);

    useEffect(() => {
        if (messages?.length) {
            setLocalMessages(prev => {
                const welcome = prev.find(m => m._id === 'welcome');
                return welcome ? [welcome, ...messages] : messages;
            });
        }
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [localMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    // const handleQuestionSelect = (messageId, selectedQuestion, selectedAnswer) => {
    //     // Update the card to show selected question
    //     setLocalMessages(prev => prev.map(message => 
    //         message._id === messageId
    //             ? {
    //                 ...message,
    //                 content: selectedQuestion,
    //                 isQuestionCard: false
    //             }
    //             : message
    //     ));
    
    //     // Add the answer as a new message while preserving history
    //     const answerMessage = {
    //         _id: `answer-${Date.now()}`,
    //         content: selectedAnswer,
    //         sender: { _id: 'bot', name: 'Customer Service Bot' },
    //         timestamp: new Date().toISOString()
    //     };
        
    //     setLocalMessages(prev => [...prev, answerMessage]);
    // };

    const handleQuestionSelect = (messageId, selectedQuestion, selectedAnswer) => {
        handleQuestionSelection(messageId, selectedQuestion, selectedAnswer);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;
    
        try {
            setSending(true);
            
            // Create user message
            const userMessage = {
                _id: `user-${Date.now()}`,
                content: newMessage.trim(),
                sender: { _id: currentUser._id, name: currentUser.name },
                timestamp: new Date().toISOString()
            };
    
            // Add user message to context
            updateMessages(userMessage);
            
            // Get FAQ responses
            const responses = await sendContextMessage(newMessage.trim());
            console.log('Responses from server:', responses);
            
            const botMessageId = `bot-${Date.now()}`;
    
            if (responses.length === 1) {
                // Single response - show both question and answer
                const questionMessage = {
                    _id: botMessageId,
                    content: responses[0].question,
                    sender: { _id: 'bot', name: 'Customer Service Bot' },
                    timestamp: new Date().toISOString()
                };
                
                const answerMessage = {
                    _id: `answer-${Date.now()}`,
                    content: responses[0].answer,
                    sender: { _id: 'bot', name: 'Customer Service Bot' },
                    timestamp: new Date().toISOString()
                };
                
                // Add bot messages to context
                updateMessages([questionMessage, answerMessage]);
            } else {
                // Multiple responses - show question selection card
                const botMessage = {
                    _id: botMessageId,
                    content: responses,
                    sender: { _id: 'bot', name: 'Customer Service Bot' },
                    timestamp: new Date().toISOString(),
                    isQuestionCard: true
                };
                
                // Add bot message to context
                updateMessages(botMessage);
            }
            
            setNewMessage('');
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Add error message to context
            const errorMessage = {
                _id: `error-${Date.now()}`,
                content: "Sorry, I'm having trouble responding right now. Please try again later.",
                sender: { _id: 'bot', name: 'Customer Service Bot' },
                timestamp: new Date().toISOString()
            };
            updateMessages(errorMessage);
        } finally {
            setSending(false);
        }
    };

const renderMessage = (message, currentUser) => {
    if (message.isQuestionCard && Array.isArray(message.content)) {
        return (
            <MessageWrapper>
                <QuestionCard>
                    <CardContent>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: 'rgba(34, 34, 96, 0.8)',
                                fontWeight: 500,
                                mb: 2 
                            }}
                        >
                            I found these relevant questions. Which one matches your query?
                        </Typography>
                        {message.content.map((qa, index) => (
                            <QuestionButton
                                key={index}
                                onClick={() => handleQuestionSelection(message._id, qa.question, qa.answer)}
                                sx={{ mt: index === 0 ? 0 : 1 }}
                            >
                                {qa.question}
                            </QuestionButton>
                        ))}
                    </CardContent>
                </QuestionCard>
            </MessageWrapper>
        );
    }

    const isOwn = message.sender._id === currentUser._id;
    
    return (
        <MessageWrapper>
            <MessageBubble isown={isOwn ? 'true' : 'false'}>
                <Typography 
                    variant="body1"
                    sx={{
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    {message.content}
                </Typography>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        display: 'block',
                        textAlign: isOwn ? 'right' : 'left',
                        mt: 0.5,
                        opacity: 0.7,
                        color: isOwn ? 'rgba(255, 255, 255, 0.8)' : 'inherit'
                    }}
                >
                    {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
            </MessageBubble>
        </MessageWrapper>
    );
};

// Make sure to use currentUser in your render
return (
    <ChatContainer>
        <ChatHeader elevation={1}>
            <Avatar sx={{ bgcolor: 'rgba(34, 34, 96, 0.8)' }}>
                <SupportAgentIcon />
            </Avatar>
            <Box>
                <Typography variant="h6" sx={{ color: 'rgba(34, 34, 96, 0.8)' }}>
                    Customer Service
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    We're here to help!
                </Typography>
            </Box>
        </ChatHeader>

        {/* <MessageContainer>
            {messages.map((message) => (
                <Box key={message._id} sx={{ width: '100%' }}>
                    {renderMessage(message, currentUser)}
                </Box>
            ))}
            <div ref={messagesEndRef} />
        </MessageContainer> */}

        <MessageContainer>
            {localMessages.map((message) => ( 
                <Box key={message._id} sx={{ width: '100%' }}>
                    {renderMessage(message, currentUser)}
                </Box>
            ))}
            <div ref={messagesEndRef} />
        </MessageContainer>

        <InputContainer component="form" onSubmit={handleSendMessage}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
                size="small"
            />
            <IconButton 
                type="submit" 
                disabled={!newMessage.trim() || sending}
            >
                {sending ? <CircularProgress size={24} /> : <Send />}
            </IconButton>
        </InputContainer>
    </ChatContainer>
);
};

export default CustomerServiceChat;


