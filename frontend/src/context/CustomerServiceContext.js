import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const CustomerServiceContext = createContext();

const FAQ_API_URL = "https://8f58-34-85-161-247.ngrok-free.app" 

export const CustomerServiceProvider = ({ children }) => {
    const [messages, setMessages] = useState([{
        _id: 'welcome',
        content: 'Hello! How can I assist you today?',
        sender: { _id: 'bot', name: 'FAQ Bot' },
        timestamp: new Date().toISOString()
    }]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const joinCustomerService = useCallback(async (userId) => {
        try {
            setIsLoading(true);
            // Test the connection first
            await axios.get(`${FAQ_API_URL}/health`);
        } catch (error) {
            console.error('Error joining customer service:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (message) => {
        try {
            setIsLoading(true);
            
            // Call the FAQ bot API
            const response = await axios.post(`${FAQ_API_URL}/ask`, {
                text: message
            });
            
            console.log('Raw API response:', response.data);
            
            // Format bot responses
            const qaResponses = response.data.responses.map(qa => ({
                question: qa.question,
                answer: qa.answer
            }));
            
            console.log('Formatted QA responses:', qaResponses);
            
            return qaResponses;
        } catch (error) {
            console.error('API Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // New function to update messages in context
    const updateMessages = useCallback((newMessages) => {
        setMessages(prev => Array.isArray(newMessages) ? [...prev, ...newMessages] : [...prev, newMessages]);
    }, []);

    const handleQuestionSelection = useCallback((messageId, selectedQuestion, selectedAnswer) => {
        setMessages(prev => {
            // Update the question card
            const updatedMessages = prev.map(message => 
                message._id === messageId
                    ? {
                        ...message,
                        content: selectedQuestion,
                        isQuestionCard: false
                    }
                    : message
            );
            
            // Add the answer message
            const answerMessage = {
                _id: `answer-${Date.now()}`,
                content: selectedAnswer,
                sender: { _id: 'bot', name: 'FAQ Bot' },
                timestamp: new Date().toISOString()
            };
            
            return [...updatedMessages, answerMessage];
        });
    }, []);

    // Function to get all messages
    const getMessages = useCallback(() => {
        return messages;
    }, [messages]);

    return (
        <CustomerServiceContext.Provider value={{
            messages,
            isLoading,
            error,
            sendMessage,
            joinCustomerService,
            updateMessages,
            handleQuestionSelection,
            getMessages
        }}>
            {children}
        </CustomerServiceContext.Provider>
    );
};

export const useCustomerService = () => {
    const context = useContext(CustomerServiceContext);
    if (!context) {
        throw new Error('useCustomerService must be used within a CustomerServiceProvider');
    }
    return context;
};