const authController = require('../controllers/chatController');
const redisService = require('../services/redisService'); // Add this import


const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe,
    validateToken,
    searchUsers
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

router.get('/me', protect, getMe);
router.get('/validate-token', validateToken);

router.get('/search', protect, searchUsers);




module.exports = router;