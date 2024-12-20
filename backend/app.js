//app.js
const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { protect } = require('./middleware/auth');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const { GridFSBucket } = require('mongodb');
const { createServer } = require('http');
const { Server } = require('socket.io');
const redisService = require('./services/redisService'); // Add this line
const Message = require('./models/MessageModel');

const ChatRoom = require('./models/ChatRoomModel');
const User = require('./models/UserModel');


const app = express();
const httpServer = createServer(app);
require('dotenv').config();

const PORT = process.env.PORT;

// Socket.IO initialization
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
    }
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// GridFS setup
let bucket;
const connectDB = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URL);
        const db = client.db();
        
        bucket = new GridFSBucket(db, {
            bucketName: 'uploads'
        });
        
        const testStream = bucket.openUploadStream('test');
        testStream.end();
        await new Promise((resolve, reject) => {
            testStream.on('finish', resolve);
            testStream.on('error', reject);
        });
        
        console.log('GridFS bucket initialized and tested successfully');
        return db;
    } catch (error) {
        console.error('MongoDB/GridFS initialization error:', error);
        throw error;
    }
};

// GridFS middleware
app.use((req, res, next) => {
    if (!bucket) {
        console.error('GridFS bucket not initialized');
        return res.status(500).json({
            success: false,
            error: 'File storage system not available'
        });
    }
    req.bucket = bucket;
    next();
});
// Socket.IO connection handling
io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    // Debug logging for all events
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });

    socket.on('user_login', async (userId) => {
        try {
            console.log(`User login attempt - UserID: ${userId}, SocketID: ${socket.id}`);

            // Store userId in socket instance
            socket.userId = userId;

            // Add user to Redis with online status
            const success = await redisService.addUserToRedis(userId, socket.id);

            if (success) {
                // Join user's personal room
                socket.join(`user:${userId}`);

                // Get user's chat rooms and join them
                const userChats = await ChatRoom.find({ participants: userId });
                for (const chat of userChats) {
                    socket.join(`chat:${chat._id}`);
                }

                // Get all active users' status
                const activeUsers = await redisService.getBulkOnlineStatus(
                    (await User.find({}, '_id')).map(user => user._id.toString())
                );

                // Send initial online status to the newly connected user
                socket.emit('initial_online_status', activeUsers);

                // Broadcast user's online status to all connected users
                await redisService.broadcastUserStatus(userId, true, io);

                // Send confirmation to user
                socket.emit('login_success', {
                    userId,
                    activeUsers
                });

                console.log(`User ${userId} successfully logged in`);
            }
        } catch (error) {
            console.error('Error in user_login:', error);
            socket.emit('login_error', { message: 'Login failed' });
        }
    });

    socket.on('send_message', async (data) => {
        try {
            if (!socket.userId) {
                throw new Error('Not authenticated');
            }

            const { chatRoomId, content } = data;

            // Validate chat room
            const chatRoom = await ChatRoom.findById(chatRoomId);
            if (!chatRoom) {
                throw new Error('Chat room not found');
            }

            // Create message
            const newMessage = await Message.create({
                chatRoom: chatRoomId,
                sender: socket.userId,
                content,
                timestamp: new Date()
            });

            // Populate sender details
            const populatedMessage = await Message.findById(newMessage._id)
                .populate('sender', 'name email');

            console.log('Message created:', populatedMessage._id);

            const messageToSend = populatedMessage.toObject();

            // Update chat room's last message
            await ChatRoom.findByIdAndUpdate(chatRoomId, {
                lastMessage: content,
                lastMessageTime: new Date()
            });

            // Handle message delivery to each participant
            for (const participantId of chatRoom.participants) {
                if (participantId.toString() !== socket.userId) {
                    const isOnline = await redisService.isUserOnline(participantId.toString());
                    
                    const delivered = await redisService.handleMessage(
                        messageToSend,
                        socket.userId,
                        participantId.toString(),
                        io
                    );

                    console.log(`Message delivery to ${participantId}: ${delivered ? 'success' : 'queued'}`);
                }
            }

            // Send confirmation to sender with delivery status
            socket.emit('message_sent', {
                message: messageToSend,
                status: 'sent',
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('join_chat', async (chatId) => {
        try {
            if (!socket.userId) {
                throw new Error('Not authenticated');
            }

            const chatRoom = await ChatRoom.findOne({
                _id: chatId,
                participants: socket.userId
            });

            if (chatRoom) {
                socket.join(`chat:${chatId}`);
                socket.emit('chat_joined', { chatId });
                
                // Get online status of all participants
                const participantStatuses = await redisService.getBulkOnlineStatus(
                    chatRoom.participants.map(p => p.toString())
                );
                socket.emit('chat_participants_status', {
                    chatId,
                    participantStatuses
                });
            }
        } catch (error) {
            console.error('Error joining chat:', error);
            socket.emit('error', { message: 'Failed to join chat' });
        }
    });

    socket.on('leave_chat', async (chatId) => {
        if (socket.userId) {
            socket.leave(`chat:${chatId}`);
            socket.emit('chat_left', { chatId });
        }
    });

    socket.on('disconnect', async () => {
        if (socket.userId) {
            try {
                // Update user's status in Redis
                await redisService.removeUserFromRedis(socket.userId, socket.id);
                
                // Broadcast offline status to all users
                await redisService.broadcastUserStatus(socket.userId, false, io);
                
                console.log(`User ${socket.userId} disconnected`);
            } catch (error) {
                console.error('Error handling disconnect:', error);
            }
        }
    });

    // Handle ping to keep connection alive
    socket.on('ping', () => {
        socket.emit('pong');
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
        if (socket.userId) {
            redisService.removeUserFromRedis(socket.userId, socket.id)
                .catch(err => console.error('Error removing user on socket error:', err));
        }
    });
});


app.use('/api/v1/customer-service', protect, require('./routes/customerServiceRoutes'));

// Add these socket handlers in your socket.io connection block
io.on('connection', async (socket) => {
    // ... your existing socket handlers ...

    // Customer service specific handlers
    socket.on('join_customer_service', async (userId) => {
        try {
            if (!socket.userId) {
                throw new Error('Not authenticated');
            }

            // Find or create customer service chat room
            let customerServiceChat = await ChatRoom.findOne({
                type: 'customer_service',
                participants: socket.userId
            });

            if (!customerServiceChat) {
                const botUser = await User.findOne({ role: 'bot' });
                if (!botUser) {
                    throw new Error('Customer service bot not found');
                }

                customerServiceChat = await ChatRoom.create({
                    type: 'customer_service',
                    name: 'Customer Service',
                    participants: [socket.userId, botUser._id],
                    botId: botUser._id,
                    createdBy: socket.userId
                });
            }

            socket.join(`chat:${customerServiceChat._id}`);
            socket.emit('customer_service_joined', {
                chatId: customerServiceChat._id,
                botId: customerServiceChat.botId
            });

        } catch (error) {
            console.error('Error joining customer service:', error);
            socket.emit('error', { message: 'Failed to join customer service chat' });
        }
    });

    socket.on('customer_service_message', async (data) => {
        try {
            if (!socket.userId) {
                throw new Error('Not authenticated');
            }

            const { chatId, content } = data;

            // Validate chat room
            const chatRoom = await ChatRoom.findOne({
                _id: chatId,
                type: 'customer_service',
                participants: socket.userId
            });

            if (!chatRoom) {
                throw new Error('Customer service chat not found');
            }

            // Create user message
            const userMessage = await Message.create({
                chatRoom: chatId,
                sender: socket.userId,
                content,
                messageType: 'customer_service',
                timestamp: new Date()
            });

            // Generate bot response
            const botResponse = await generateBotResponse(content);
            
            // Create bot message
            const botMessage = await Message.create({
                chatRoom: chatId,
                sender: chatRoom.botId,
                content: botResponse,
                messageType: 'bot_response',
                timestamp: new Date()
            });

            // Populate messages
            const populatedUserMessage = await Message.findById(userMessage._id)
                .populate('sender', 'name email');
            const populatedBotMessage = await Message.findById(botMessage._id)
                .populate('sender', 'name email');

            // Update chat room
            await ChatRoom.findByIdAndUpdate(chatId, {
                lastMessage: botResponse,
                lastMessageTime: new Date()
            });

            // Emit messages
            io.to(`chat:${chatId}`).emit('receive_message', populatedUserMessage);
            io.to(`chat:${chatId}`).emit('receive_message', populatedBotMessage);

        } catch (error) {
            console.error('Error in customer service message:', error);
            socket.emit('error', { message: error.message });
        }
    });
});

// Add bot response generator function
const generateBotResponse = async (message) => {
    const lowercaseMessage = message.toLowerCase();
    
    // Simple response mapping - you can enhance this
    const responses = {
        'hello': 'Hi! How can I assist you today?',
        'hi': 'Hello! What can I help you with?',
        'help': 'I\'m here to help! What do you need assistance with?',
        'thanks': 'You\'re welcome! Is there anything else you need?',
        'bye': 'Goodbye! Have a great day!'
    };

    // Check for keywords in the message
    for (const [key, response] of Object.entries(responses)) {
        if (lowercaseMessage.includes(key)) {
            return response;
        }
    }

    // Default response
    return "I understand you need help. Could you please provide more details about your question?";
};

// Initialize bot user on server start
const initializeBot = async () => {
    try {
        const botExists = await User.findOne({ role: 'bot' });
        if (!botExists) {
            await User.create({
                name: 'Customer Service Bot',
                email: 'bot@yourapp.com',
                password: require('crypto').randomBytes(32).toString('hex'),
                role: 'bot'
            });
            console.log('Bot user initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing bot user:', error);
    }
};




// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/transactions', protect, require('./routes/transaction'));
app.use('/api/v1/chat', protect, require('./routes/chatRoutes')); // New chat routes

app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        code: err.code
    });

    if (err.code === 'GRIDFS_ERROR') {
        return res.status(500).json({
            success: false,
            error: 'File storage operation failed'
        });
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            error: 'File upload error: ' + err.message
        });
    }

    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Server initialization
const server = async () => {
    try {
        await connectDB();
        
        await db();
        
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server initialization failed:', error);
        process.exit(1);
    }
};






server();

// Export for testing purposes
module.exports = { app, httpServer, io };