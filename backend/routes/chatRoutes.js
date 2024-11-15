// backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

// Chat routes
router.post('/private', chatController.createPrivateChat);
router.get('/user-chats', chatController.getUserChats);
router.get('/messages/:chatId', chatController.getChatMessages);
router.post('/messages', chatController.sendMessage);
router.post('/send-message', chatController.sendMessage);

// Add these new routes along with your existing ones
router.post('/group', chatController.createGroupChat);
router.post('/group/:groupId/participant', chatController.addGroupParticipants);
router.delete('/group/:groupId/participant/:userId', chatController.removeGroupParticipant);
router.put('/group/:groupId', chatController.updateGroupChat);
router.get('/users/search', chatController.searchUsers);  // Add this line
router.get('/chat/group/:chatId', chatController.getChatById);

router.post('/messages', chatController.sendMessage);
router.get('/messages/:messageId/files/:fileId', chatController.downloadFile);


module.exports = router;