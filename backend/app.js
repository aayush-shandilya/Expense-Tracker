// app.js
const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const { protect } = require('./middleware/auth');

const app = express();

require('dotenv').config();

const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// Mount routes
app.use('/api/v1/auth', require('./routes/auth'));

// Protected routes
readdirSync('./routes').map((route) => {
    if (route !== 'auth.js') {
        // Apply protection middleware to all non-auth routes
        app.use('/api/v1', protect, require('./routes/' + route));
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

const server = () => {
    db()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error('Failed to start server:', error);
            process.exit(1);
        });
};

server();



//i think this is the last thing i need to make changes in the backend