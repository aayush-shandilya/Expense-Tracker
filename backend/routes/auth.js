// import { searchUsers } from '../controllers/auth';
const {searchUsers} = require('../controllers/auth');
const authController = require('../controllers/chatController');

const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe,
    validateToken 
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
// router.post('/logout', authController.logout);
// router.use(protect, authController.updateOnlineStatus);
router.get('/me', protect, getMe);
router.get('/validate-token', validateToken);

router.get('/search', protect, searchUsers);



module.exports = router;