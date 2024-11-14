// const express = require('express');
// const cors = require('cors');
// const { db } = require('./db/db');
// const { protect } = require('./middleware/auth');
// const multer = require('multer');
// const { MongoClient } = require('mongodb');
// const { GridFSBucket } = require('mongodb');

// const app = express();

// require('dotenv').config();

// const PORT = process.env.PORT;

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.use(express.json());
// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     credentials: true
// }));

// let bucket;
// const connectDB = async () => {
//     try {
//         const client = await MongoClient.connect(process.env.MONGO_URL);
//         const db = client.db();
        
//         bucket = new GridFSBucket(db, {
//             bucketName: 'uploads'
//         });
        
//         const testStream = bucket.openUploadStream('test');
//         testStream.end();
//         await new Promise((resolve, reject) => {
//             testStream.on('finish', resolve);
//             testStream.on('error', reject);
//         });
        
//         console.log('GridFS bucket initialized and tested successfully');
//         return db;
//     } catch (error) {
//         console.error('MongoDB/GridFS initialization error:', error);
//         throw error;
//     }
// };

// app.use((req, res, next) => {
//     if (!bucket) {
//         console.error('GridFS bucket not initialized');
//         return res.status(500).json({
//             success: false,
//             error: 'File storage system not available'
//         });
//     }
//     req.bucket = bucket;
//     next();
// });

// app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/transactions', protect, require('./routes/transaction'));

// app.use((err, req, res, next) => {
//     console.error('Error details:', {
//         message: err.message,
//         stack: err.stack,
//         code: err.code
//     });

//     if (err.code === 'GRIDFS_ERROR') {
//         return res.status(500).json({
//             success: false,
//             error: 'File storage operation failed'
//         });
//     }

//     if (err instanceof multer.MulterError) {
//         return res.status(400).json({
//             success: false,
//             error: 'File upload error: ' + err.message
//         });
//     }

//     res.status(500).json({
//         success: false,
//         error: 'Something went wrong!'
//     });
// });

// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         error: 'Route not found'
//     });
// });

// const server = async () => {
//     try {
//         await connectDB();
        
//         await db();
        
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error('Server initialization failed:', error);
//         process.exit(1);
//     }
// };

// server();

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
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a chat room
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Leave a chat room
    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room: ${roomId}`);
    });

    // Handle new message
    socket.on('send_message', async (messageData) => {
        try {
            const { chatRoomId, content, userId } = messageData;
            
            // Broadcast message to room
            io.to(chatRoomId).emit('receive_message', {
                chatRoomId,
                content,
                sender: userId,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Error sending message' });
        }
    });

    // Handle typing status
    socket.on('typing', (data) => {
        socket.to(data.chatRoomId).emit('user_typing', {
            userId: data.userId,
            chatRoomId: data.chatRoomId
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/transactions', protect, require('./routes/transaction'));
app.use('/api/v1/chat', protect, require('./routes/chatRoutes')); // New chat routes

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