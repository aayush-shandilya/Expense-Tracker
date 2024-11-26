// controllers/customerServiceController.js
const Message = require('../models/MessageModel');
const Chat = require('../models/ChatRoomModel');
const User = require('../models/UserModel');

const customerServiceController = {
    // Initialize or get customer service chat
    initializeCustomerService: async (req, res) => {
        try {
            const userId = req.user._id;

            // Check if user already has a customer service chat
            let customerServiceChat = await Chat.findOne({
                type: 'customer_service',
                'participants': userId
            });

            if (!customerServiceChat) {
                // Create new customer service chat
                const botUser = await User.findOne({ role: 'bot' });
                
                if (!botUser) {
                    return res.status(404).json({
                        success: false,
                        error: 'Customer service bot not found'
                    });
                }

                customerServiceChat = await Chat.create({
                    type: 'customer_service',
                    participants: [userId, botUser._id],
                    name: 'Customer Service'
                });
            }

            // Get chat history
            const messages = await Message.find({ chat: customerServiceChat._id })
                .sort({ timestamp: 1 })
                .populate('sender', 'name');

            return res.status(200).json({
                success: true,
                data: {
                    chat: customerServiceChat,
                    messages
                }
            });
        } catch (error) {
            console.error('Error in initializeCustomerService:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    },

    // Handle bot messages
    handleBotMessage: async (req, res) => {
        try {
            const { message } = req.body;
            const userId = req.user._id;

            // Get or create customer service chat
            let customerServiceChat = await Chat.findOne({
                type: 'customer_service',
                'participants': userId
            });

            if (!customerServiceChat) {
                return res.status(404).json({
                    success: false,
                    error: 'Customer service chat not found'
                });
            }

            // Save user message
            const userMessage = await Message.create({
                chat: customerServiceChat._id,
                sender: userId,
                content: message,
                timestamp: new Date()
            });

            // Generate bot response based on user message
            const botResponse = await generateBotResponse(message);

            // Save bot response
            const botUser = await User.findOne({ role: 'bot' });
            const botMessage = await Message.create({
                chat: customerServiceChat._id,
                sender: botUser._id,
                content: botResponse,
                timestamp: new Date()
            });

            return res.status(200).json({
                success: true,
                data: {
                    userMessage,
                    botMessage
                }
            });
        } catch (error) {
            console.error('Error in handleBotMessage:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
};

// Helper function to generate bot responses
const generateBotResponse = async (userMessage) => {
    // Simple response logic - you can replace this with more sophisticated bot logic
    const commonQuestions = {
        'hello': 'Hi! How can I help you today?',
        'hi': 'Hello! How may I assist you?',
        'help': 'I\'m here to help! What do you need assistance with?',
        'bye': 'Goodbye! Have a great day!',
        'thank': 'You\'re welcome! Is there anything else I can help you with?'
    };

    // Check for common questions
    const lowercaseMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(commonQuestions)) {
        if (lowercaseMessage.includes(key)) {
            return response;
        }
    }

    // Default response
    return "I'm here to help! Please let me know what specific assistance you need.";
};

module.exports = customerServiceController;