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
// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     // Join a chat room
//     socket.on('join_room', (roomId) => {
//         socket.join(roomId);
//         console.log(`User ${socket.id} joined room: ${roomId}`);
//     });

//     // Leave a chat room
//     socket.on('leave_room', (roomId) => {
//         socket.leave(roomId);
//         console.log(`User ${socket.id} left room: ${roomId}`);
//     });

//     // Handle new message
//     socket.on('send_message', async (messageData) => {
//         try {
//             const { chatRoomId } = messageData;
            
//             // Emit the complete message data to all users in the room
//             io.to(chatRoomId).emit('receive_message', messageData);
            
//             console.log('Message broadcasted to room:', chatRoomId);
//         } catch (error) {
//             console.error('Error sending message:', error);
//             socket.emit('error', { message: 'Error sending message' });
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// io.on('connection', async (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('user_login', async (userId) => {
//         await redisService.addOnlineUser(userId, socket.id);
//         io.emit('user_status_change', { userId, status: 'online' });
//     });

//     socket.on('send_message', async (messageData) => {
//         try {
//             const { chatRoomId, receiverId, content } = messageData;
            
//             // Check if receiver is online
//             const isReceiverOnline = await redisService.isUserOnline(receiverId);
//             const receiverSocketId = await redisService.getUserSocket(receiverId);

//             // Store message in database
//             const newMessage = await Message.create({
//                 chatRoom: chatRoomId,
//                 sender: socket.userId,
//                 content,
//                 deliveryStatus: isReceiverOnline ? 'delivered' : 'sent'
//             });

//             // If receiver is online, emit message immediately
//             if (isReceiverOnline && receiverSocketId) {
//                 io.to(receiverSocketId).emit('receive_message', {
//                     ...newMessage.toObject(),
//                     chatRoomId
//                 });
//             }

//             // Confirm message sent to sender
//             socket.emit('message_status', {
//                 messageId: newMessage._id,
//                 status: isReceiverOnline ? 'delivered' : 'sent'
//             });
            
//         } catch (error) {
//             console.error('Error sending message:', error);
//             socket.emit('error', { message: 'Error sending message' });
//         }
//     });

//     socket.on('disconnect', async () => {
//         const userId = await redisService.getUserFromSocket(socket.id);
//         if (userId) {
//             await redisService.removeOnlineUser(userId, socket.id);
//             io.emit('user_status_change', { userId, status: 'offline' });
//         }
//         console.log('User disconnected:', socket.id);
//     });
// });


// // Socket.IO connection handling
// io.on('connection', async (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('user_login', async (userId) => {
//         // Using the correct method name from our Redis service
//         await redisService.addUserToRedis(userId, socket.id);
//         io.emit('user_status_change', { userId, status: 'active' });
//     });

//     socket.on('send_message', async (messageData) => {
//         try {
//             const { chatRoomId, receiverId, content } = messageData;
            
//             // Check if receiver is in Redis using the correct method
//             const isReceiverActive = await redisService.isUserInRedis(receiverId);
//             const receiverSocketId = await redisService.getUserSocketId(receiverId);

//             // Store message in database
//             const newMessage = await Message.create({
//                 chatRoom: chatRoomId,
//                 sender: socket.userId,
//                 content,
//                 deliveryStatus: isReceiverActive ? 'delivered' : 'sent'
//             });

//             // Handle message delivery through Redis service
//             await redisService.handleMessage(
//                 {
//                     ...newMessage.toObject(),
//                     chatRoomId
//                 },
//                 socket.userId,
//                 receiverId,
//                 io
//             );

//             // Confirm message sent to sender
//             socket.emit('message_status', {
//                 messageId: newMessage._id,
//                 status: isReceiverActive ? 'delivered' : 'sent'
//             });
            
//         } catch (error) {
//             console.error('Error sending message:', error);
//             socket.emit('error', { message: 'Error sending message' });
//         }
//     });

//     socket.on('disconnect', async () => {
//         const userId = await redisService.getUserFromSocket(socket.id);
//         if (userId) {
//             // Using the correct method name from our Redis service
//             await redisService.removeUserFromRedis(userId, socket.id);
//             io.emit('user_status_change', { userId, status: 'inactive' });
//         }
//         console.log('User disconnected:', socket.id);
//     });
// });

// In app.js
// io.on('connection', async (socket) => {
//     console.log('User connected:', socket.id);

//     // Add authentication middleware for socket
//     socket.use(async (packet, next) => {
//         const [event, data] = packet;
//         if (event === 'user_login') {
//             return next();
//         }
        
//         const userId = await redisService.getUserFromSocket(socket.id);
//         if (!userId) {
//             return next(new Error('User not authenticated'));
//         }
//         socket.userId = userId;
//         next();
//     });

//     socket.on('user_login', async (userId) => {
//         socket.userId = userId; // Store userId in socket instance
//         await redisService.addUserToRedis(userId, socket.id);
//         io.emit('user_status_change', { userId, status: 'active' });
//     });

//     socket.on('send_message', async (messageData) => {
//         try {
//             const { chatRoomId, content } = messageData;
            
//             if (!socket.userId) {
//                 throw new Error('User not authenticated');
//             }

//             // Create and save the message with the proper sender ID
//             const newMessage = await Message.create({
//                 chatRoom: chatRoomId,
//                 sender: socket.userId, // Use the authenticated user's ID
//                 content,
//                 deliveryStatus: 'sent'
//             });

//             // Populate the sender information
//             const populatedMessage = await Message.findById(newMessage._id)
//                 .populate('sender', 'name email');

//             const messageToSend = {
//                 ...populatedMessage.toObject(),
//                 chatRoomId
//             };

//             // Get the chat room to find recipients
//             const chatRoom = await ChatRoom.findById(chatRoomId);
//             if (!chatRoom) {
//                 throw new Error('Chat room not found');
//             }

//             // Send to all participants except sender
//             for (const participantId of chatRoom.participants) {
//                 if (participantId.toString() !== socket.userId) {
//                     await redisService.handleMessage(
//                         messageToSend,
//                         socket.userId,
//                         participantId.toString(),
//                         io
//                     );
//                 }
//             }

//             // Send confirmation to sender
//             socket.emit('message_status', {
//                 messageId: newMessage._id,
//                 status: 'sent'
//             });

//         } catch (error) {
//             console.error('Error sending message:', error);
//             socket.emit('error', { message: 'Error sending message' });
//         }
//     });

//     socket.on('disconnect', async () => {
//         if (socket.userId) {
//             await redisService.removeUserFromRedis(socket.userId, socket.id);
//             io.emit('user_status_change', { userId: socket.userId, status: 'inactive' });
//         }
//         console.log('User disconnected:', socket.id);
//     });
// });


// io.on('connection', async (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('user_login', async (userId) => {
//         try {
//             console.log(`User login attempt - UserID: ${userId}, SocketID: ${socket.id}`);
            
//             socket.userId = userId;
//             const success = await redisService.addUserToRedis(userId, socket.id);
            
//             if (success) {
//                 io.emit('user_status_change', { userId, status: 'active' });
//                 console.log(`User ${userId} successfully logged in`);
                
//                 // Debug Redis state
//                 await redisService.debugRedisState();
//             } else {
//                 console.error(`Failed to add user ${userId} to Redis`);
//             }
//         } catch (error) {
//             console.error('Error in user_login:', error);
//         }
//     });

//     socket.on('send_message', async (messageData) => {
//         try {
//             const { chatRoomId, content } = messageData;
            
//             if (!socket.userId) {
//                 console.error('No userId found in socket');
//                 socket.emit('error', { message: 'Not authenticated' });
//                 return;
//             }

//             console.log('Message send attempt:', {
//                 userId: socket.userId,
//                 chatRoomId,
//                 content: content.substring(0, 50) // Log first 50 chars only
//             });

//             // Create and save the message
//             const newMessage = await Message.create({
//                 chatRoom: chatRoomId,
//                 sender: socket.userId,
//                 content,
//                 timestamp: new Date(),
//                 readBy: [{ user: socket.userId }]
//             });

//             const populatedMessage = await Message.findById(newMessage._id)
//                 .populate('sender', 'name email');

//             // Get chat room participants
//             const chatRoom = await ChatRoom.findById(chatRoomId);
            
//             if (!chatRoom) {
//                 throw new Error('Chat room not found');
//             }

//             // Handle message delivery to each participant
//             for (const participantId of chatRoom.participants) {
//                 if (participantId.toString() !== socket.userId) {
//                     await redisService.handleMessage(
//                         populatedMessage.toObject(),
//                         socket.userId,
//                         participantId.toString(),
//                         io
//                     );
//                 }
//             }

//             // Confirm message sent to sender
//             socket.emit('message_sent', {
//                 messageId: newMessage._id,
//                 status: 'sent'
//             });

//         } catch (error) {
//             console.error('Error sending message:', error);
//             socket.emit('error', { message: 'Error sending message' });
//         }
//     });

//     socket.on('disconnect', async () => {
//         try {
//             if (socket.userId) {
//                 await redisService.removeUserFromRedis(socket.userId, socket.id);
//                 io.emit('user_status_change', { userId: socket.userId, status: 'inactive' });
//                 console.log(`User ${socket.userId} disconnected`);
//             }
//         } catch (error) {
//             console.error('Error in disconnect:', error);
//         }
//     });
// });

// io.on('connection', async (socket) => {
//     console.log('User connected:', socket.id);

//     // Handle user login
//     socket.on('user_login', async (userId) => {
//         try {
//             if (!userId) {
//                 console.error('No userId provided for user_login');
//                 return;
//             }

//             console.log(`User login event received - UserID: ${userId}, SocketID: ${socket.id}`);
            
//             socket.userId = userId;
//             const success = await redisService.addUserToRedis(userId, socket.id);
            
//             if (success) {
//                 // Join a room specific to this user
//                 socket.join(`user:${userId}`);
                
//                 io.emit('user_status_change', { userId, status: 'active' });
//                 socket.emit('login_success', { userId });
                
//                 console.log(`User ${userId} successfully logged in and added to Redis`);
                
//                 // Debug current Redis state
//                 const redisState = await redisService.debugRedisState();
//                 console.log('Current Redis State:', redisState);
//             } else {
//                 console.error(`Failed to add user ${userId} to Redis`);
//                 socket.emit('login_error', { message: 'Failed to initialize user session' });
//             }
//         } catch (error) {
//             console.error('Error in user_login:', error);
//             socket.emit('login_error', { message: 'Internal server error during login' });
//         }
//     });

//     // Handle message sending
//     socket.on('send_message', async (messageData) => {
//         try {
//             const { chatRoomId, content } = messageData;
            
//             // Check if user is authenticated
//             if (!socket.userId) {
//                 console.error('Message attempted without authentication');
//                 socket.emit('error', { message: 'Please login first' });
//                 return;
//             }

//             console.log('Processing message:', {
//                 senderId: socket.userId,
//                 chatRoomId,
//                 content: content.substring(0, 50)
//             });

//             // Create and save message
//             const newMessage = await Message.create({
//                 chatRoom: chatRoomId,
//                 sender: socket.userId,
//                 content,
//                 timestamp: new Date(),
//                 readBy: [{ user: socket.userId }]
//             });

//             const populatedMessage = await Message.findById(newMessage._id)
//                 .populate('sender', 'name email');

//             // Update chat room
//             await ChatRoom.findByIdAndUpdate(chatRoomId, {
//                 lastMessage: content,
//                 lastMessageTime: new Date()
//             });

//             // Get chat room participants
//             const chatRoom = await ChatRoom.findById(chatRoomId);
//             if (!chatRoom) {
//                 throw new Error('Chat room not found');
//             }

//             const messageToSend = populatedMessage.toObject();

//             // Send to all participants
//             for (const participantId of chatRoom.participants) {
//                 if (participantId.toString() !== socket.userId) {
//                     console.log(`Sending message to participant: ${participantId}`);
                    
//                     // Emit to user's room
//                     io.to(`user:${participantId}`).emit('new_message', messageToSend);
                    
//                     // Handle through Redis for delivery status
//                     await redisService.handleMessage(
//                         messageToSend,
//                         socket.userId,
//                         participantId.toString(),
//                         io
//                     );
//                 }
//             }

//             // Confirm to sender
//             socket.emit('message_sent', {
//                 messageId: newMessage._id,
//                 status: 'sent'
//             });

//         } catch (error) {
//             console.error('Error sending message:', error);
//             socket.emit('error', { message: 'Error sending message' });
//         }
//     });

//     socket.on('disconnect', async () => {
//         try {
//             if (socket.userId) {
//                 await redisService.removeUserFromRedis(socket.userId, socket.id);
//                 io.emit('user_status_change', { userId: socket.userId, status: 'inactive' });
//                 console.log(`User ${socket.userId} disconnected and removed from Redis`);
//             }
//         } catch (error) {
//             console.error('Error in disconnect:', error);
//         }
//     });
// });


// io.on('connection', async (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('user_login', async (userId) => {
//         try {
//             console.log(`User login attempt - UserID: ${userId}, SocketID: ${socket.id}`);
            
//             socket.userId = userId;
//             const success = await redisService.addUserToRedis(userId, socket.id);
            
//             if (success) {
//                 io.emit('user_status_change', { userId, status: 'active' });
//                 console.log(`User ${userId} successfully logged in`);
//             }
//         } catch (error) {
//             console.error('Error in user_login:', error);
//         }
//     });

//     socket.on('send_message', async (messageData) => {
//         try {
//             const { chatRoomId, content } = messageData;
            
//             if (!socket.userId) {
//                 console.error('No userId found in socket');
//                 socket.emit('error', { message: 'Not authenticated' });
//                 return;
//             }

//             console.log('Processing message:', {
//                 senderId: socket.userId,
//                 chatRoomId,
//                 content: content
//             });

//             const chatRoom = await ChatRoom.findById(chatRoomId);
//             if (!chatRoom) {
//                 throw new Error('Chat room not found');
//             }

//             // Create and save the message
//             const newMessage = await Message.create({
//                 chatRoom: chatRoomId,
//                 sender: socket.userId,
//                 content,
//                 timestamp: new Date(),
//                 readBy: [{ user: socket.userId }]
//             });

//             const populatedMessage = await Message.findById(newMessage._id)
//                 .populate('sender', 'name email');

//             const messageToSend = populatedMessage.toObject();

//             // Send to all participants except sender
//             for (const participantId of chatRoom.participants) {
//                 if (participantId.toString() !== socket.userId) {
//                     await redisService.handleMessage(
//                         messageToSend,
//                         socket.userId,
//                         participantId.toString(),
//                         io
//                     );
//                 }
//             }

//             // Confirm to sender
//             socket.emit('message_sent', {
//                 messageId: newMessage._id,
//                 status: 'sent'
//             });

//         } catch (error) {
//             console.error('Error sending message:', error);
//             socket.emit('error', { message: 'Error sending message' });
//         }
//     });

//     socket.on('disconnect', async () => {
//         try {
//             if (socket.userId) {
//                 await redisService.removeUserFromRedis(socket.userId, socket.id);
//                 io.emit('user_status_change', { userId: socket.userId, status: 'inactive' });
//                 console.log(`User ${socket.userId} disconnected`);
//             }
//         } catch (error) {
//             console.error('Error in disconnect:', error);
//         }
//     });
// });

io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    // Add socket to the io instance
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });

    socket.on('user_login', async (userId) => {
        try {
            console.log(`User login attempt - UserID: ${userId}, SocketID: ${socket.id}`);
            
            // Store userId in socket instance
            socket.userId = userId;
            
            // Add user to Redis
            const success = await redisService.addUserToRedis(userId, socket.id);
            
            if (success) {
                // Join user's personal room
                socket.join(`user:${userId}`);
                
                // Notify all clients of user's status
                io.emit('user_status_change', { userId, status: 'active' });
                
                // Send confirmation to user
                socket.emit('login_success', { userId });
                
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

            // Send to all participants
            const messageToSend = populatedMessage.toObject();
            
            for (const participantId of chatRoom.participants) {
                if (participantId.toString() !== socket.userId) {
                    // Try to deliver message
                    const delivered = await redisService.handleMessage(
                        messageToSend,
                        socket.userId,
                        participantId.toString(),
                        io
                    );
                    
                    console.log(`Message delivery to ${participantId}: ${delivered ? 'success' : 'queued'}`);
                }
            }

            // Send confirmation to sender
            socket.emit('message_sent', {
                message: messageToSend,
                status: 'sent'
            });

        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('disconnect', async () => {
        if (socket.userId) {
            await redisService.removeUserFromRedis(socket.userId, socket.id);
            io.emit('user_status_change', { userId: socket.userId, status: 'inactive' });
            console.log(`User ${socket.userId} disconnected`);
        }
    });
});


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