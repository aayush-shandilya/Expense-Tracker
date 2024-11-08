// // app.js
// const express = require('express');
// const cors = require('cors');
// const { db } = require('./db/db');
// const { readdirSync } = require('fs');
// const { protect } = require('./middleware/auth');
// const multer = require('multer');
// const { GridFsStorage } = require('multer-gridfs-storage');

// const app = express();

// require('dotenv').config();


// // Configure GridFS storage
// const storage = new GridFsStorage({
//     url: process.env.MONGO_URL,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//         return {
//             bucketName: 'uploads',
//             filename: `${Date.now()}-${file.originalname}`
//         };
//     }
// });

// const upload = multer({ storage });

// const PORT = process.env.PORT;

// // Middleware
// app.use(express.json());
// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     credentials: true
// }));

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         success: false,
//         error: 'Something went wrong!'
//     });
// });

// // Mount routes
// app.use('/api/v1/auth', require('./routes/auth'));

// // Protected routes
// readdirSync('./routes').map((route) => {
//     if (route !== 'auth.js') {
//         // Apply protection middleware to all non-auth routes
//         app.use('/api/v1', protect, require('./routes/' + route));
//     }
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         error: 'Route not found'
//     });
// });

// const server = () => {
//     db()
//         .then(() => {
//             app.listen(PORT, () => {
//                 console.log(`Server is running on port ${PORT}`);
//             });
//         })
//         .catch((error) => {
//             console.error('Failed to start server:', error);
//             process.exit(1);
//         });
// };

// server();



// //i think this is the last thing i need to make changes in the backend



// app.js
const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { protect } = require('./middleware/auth');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const { GridFSBucket } = require('mongodb');

const app = express();

require('dotenv').config();

const PORT = process.env.PORT;

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Store MongoDB connection and GridFS bucket
let bucket;
const connectDB = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URL);
        const db = client.db();
        bucket = new GridFSBucket(db, {
            bucketName: 'uploads'
        });
        console.log('GridFS bucket initialized');
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Make bucket available to routes
app.use((req, res, next) => {
    req.bucket = bucket;
    next();
});

// Mount routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/transactions', protect, require('./routes/transaction'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
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

const server = async () => {
    try {
        await connectDB();
        await db();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

server();