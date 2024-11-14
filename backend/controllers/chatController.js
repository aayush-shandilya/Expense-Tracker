const ChatRoom = require('../models/ChatRoomModel');
const Message = require('../models/MessageModel');
const User = require('../models/UserModel');

const chatController = {
    getUserChats: async (req, res) => {
        try {
            const userId = req.user.id;

            const chats = await ChatRoom.find({
                participants: userId
            })
            .populate('participants', 'name email')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

 
            res.status(200).json({
                success: true,
                data: chats 
            });
        } catch (error) {
            console.error('Get user chats error:', error);
            res.status(500).json({
                success: false,
                error: 'Error fetching chats'
            });
        }
    },

    createPrivateChat: async (req, res) => {
        try {
            const { participantId } = req.body;
            const userId = req.user.id;

            const participant = await User.findById(participantId);
            if (!participant) {
                return res.status(404).json({
                    success: false,
                    error: 'Participant not found'
                });
            }

            const existingChat = await ChatRoom.findOne({
                type: 'private',
                participants: {
                    $all: [userId, participantId],
                    $size: 2
                }
            }).populate('participants', 'name email');

            if (existingChat) {
                return res.status(200).json({
                    success: true,
                    data: existingChat
                });
            }

            const newChat = await ChatRoom.create({
                type: 'private',
                participants: [userId, participantId],
                createdBy: userId
            });

            const populatedChat = await ChatRoom.findById(newChat._id)
                .populate('participants', 'name email');

            res.status(201).json({
                success: true,
                data: populatedChat
            });

        } catch (error) {
            console.error('Create private chat error:', error);
            res.status(500).json({
                success: false,
                error: 'Error creating chat room'
            });
        }
    },
    getChatMessages: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user.id;

            const chat = await ChatRoom.findOne({
                _id: chatId,
                participants: userId
            });

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    error: 'Chat not found or unauthorized'
                });
            }

            const messages = await Message.find({ chatRoom: chatId })
                .populate('sender', 'name email')
                .sort({ createdAt: 1 }) 
                .limit(100);

            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            console.error('Get chat messages error:', error);
            res.status(500).json({
                success: false,
                error: 'Error fetching messages'
            });
        }
    },
sendMessage: async (req, res) => {
    try {
        const { chatRoomId, content } = req.body;
        const userId = req.user.id;

        if (!chatRoomId || !content) {
            return res.status(400).json({
                success: false,
                error: 'ChatRoomId and content are required'
            });
        }

        const chatRoom = await ChatRoom.findOne({
            _id: chatRoomId,
            participants: userId
        });

        if (!chatRoom) {
            return res.status(404).json({
                success: false,
                error: 'Chat room not found or unauthorized'
            });
        }

        const newMessage = new Message({
            chatRoom: chatRoomId,
            sender: userId,
            content: content,
            timestamp: new Date(),
            readBy: [{ user: userId }]
        });

        await newMessage.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name email');

        await ChatRoom.findByIdAndUpdate(chatRoomId, {
            lastMessage: content,
            lastMessageTime: new Date()
        });

        const messageToSend = {
            ...populatedMessage.toObject(),
            chatRoomId
        };

        res.status(201).json({
            success: true,
            data: messageToSend
        });

    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            error: 'Error sending message'
        });
    }
    }
};
module.exports = chatController;