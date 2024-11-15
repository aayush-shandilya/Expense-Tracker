//controllers/chatController.js
const ChatRoom = require('../models/ChatRoomModel');
const Message = require('../models/MessageModel');
const User = require('../models/UserModel');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    
            console.log('Getting messages for chat:', chatId, 'user:', userId);
    
            const chat = await ChatRoom.findOne({
                _id: chatId,
                participants: userId
            });
    
            if (!chat) {
                console.log('Chat not found or unauthorized');
                return res.status(404).json({
                    success: false,
                    error: 'Chat not found or unauthorized'
                });
            }
    
            const messages = await Message.find({ chatRoom: chatId })
                .populate('sender', 'name email')
                .sort({ createdAt: 1 });
    
            console.log('Found messages:', messages.length);
    
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
    }
};
const createGroupChat = async (req, res) => {
    try {
        const { name, participantIds } = req.body;
        const userId = req.user.id;

        if (!name || !participantIds || participantIds.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Group name and at least 2 participants are required'
            });
        }

        // Add the creator to the participants if not already included
        const uniqueParticipants = [...new Set([...participantIds, userId])];

        const newGroup = await ChatRoom.create({
            type: 'group',
            name,
            participants: uniqueParticipants,
            admins: [userId], // Creator becomes the first admin
            createdBy: userId,
            lastMessage: '',
            lastMessageTime: new Date()
        });

        // Populate the participants and admins information
        const populatedGroup = await ChatRoom.findById(newGroup._id)
            .populate('participants', 'name email')
            .populate('admins', 'name email');

        res.status(201).json({
            success: true,
            data: populatedGroup
        });
    } catch (error) {
        console.error('Create group chat error:', error);
        res.status(500).json({
            success: false,
            error: 'Error creating group chat'
        });
    }
};

const addGroupParticipants = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { participantIds } = req.body;
        const userId = req.user.id;

        if (!participantIds || !Array.isArray(participantIds)) {
            return res.status(400).json({
                success: false,
                error: 'Participant IDs are required and must be an array'
            });
        }

        const group = await ChatRoom.findOne({
            _id: groupId,
            type: 'group',
            admins: userId
        }).populate('participants', 'name email');

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or unauthorized'
            });
        }

        // Verify all users exist before adding
        const users = await User.find({ _id: { $in: participantIds } });
        if (users.length !== participantIds.length) {
            return res.status(400).json({
                success: false,
                error: 'One or more users not found'
            });
        }

        // Add new participants while avoiding duplicates
        const existingIds = group.participants.map(p => p._id.toString());
        const newParticipantIds = participantIds.filter(id => !existingIds.includes(id.toString()));
        
        if (newParticipantIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'All users are already members of the group'
            });
        }

        group.participants = [...group.participants, ...newParticipantIds];
        await group.save();

        const updatedGroup = await ChatRoom.findById(groupId)
            .populate('participants', 'name email')
            .populate('admins', 'name email');

        res.status(200).json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        console.error('Add participants error:', error);
        res.status(500).json({
            success: false,
            error: 'Error adding participants'
        });
    }
};

const removeGroupParticipant = async (req, res) => {
    try {
        const { groupId, userId: participantId } = req.params;
        const requesterId = req.user.id;

        const group = await ChatRoom.findOne({
            _id: groupId,
            type: 'group',
            admins: requesterId
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or unauthorized'
            });
        }

        // Remove participant
        group.participants = group.participants.filter(
            id => id.toString() !== participantId
        );

        // If participant was an admin, remove from admins too
        group.admins = group.admins.filter(
            id => id.toString() !== participantId
        );

        await group.save();

        const updatedGroup = await ChatRoom.findById(groupId)
            .populate('participants', 'name email')
            .populate('admins', 'name email');

        res.status(200).json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        console.error('Remove participant error:', error);
        res.status(500).json({
            success: false,
            error: 'Error removing participant'
        });
    }
};

const updateGroupChat = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name } = req.body;
        const userId = req.user.id;

        const group = await ChatRoom.findOne({
            _id: groupId,
            type: 'group',
            admins: userId
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'Group not found or unauthorized'
            });
        }

        if (name) {
            group.name = name;
        }

        await group.save();

        const updatedGroup = await ChatRoom.findById(groupId)
            .populate('participants', 'name email')
            .populate('admins', 'name email');

        res.status(200).json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        console.error('Update group error:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating group'
        });
    }
};

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user.id;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }

        // Search for users that match the query in name or email
        // Exclude the current user from results
        const users = await User.find({
            $and: [
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                },
                { _id: { $ne: userId } } // Exclude current user
            ]
        }).select('name email _id');

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            error: 'Error searching users'
        });
    }
};
const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        const chat = await ChatRoom.findOne({
            _id: chatId,
            participants: userId
        })
        .populate('participants', 'name email')
        .populate('admins', 'name email');

        if (!chat) {
            return res.status(404).json({
                success: false,
                error: 'Chat not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            data: chat
        });
    } catch (error) {
        console.error('Get chat by id error:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching chat'
        });
    }
};

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const sendMessage = async (req, res) => {
    try {
        const { chatRoomId, content } = req.body;
        const userId = req.user.id;
        const files = req.files; // Array of uploaded files

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

        // Process file attachments if any
        const attachments = files ? files.map(file => ({
            fileName: file.filename,
            originalName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileUrl: `/uploads/${file.filename}`
        })) : [];

        const newMessage = new Message({
            chatRoom: chatRoomId,
            sender: userId,
            content: content,
            attachments: attachments,
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
};
const downloadFile = async (req, res) => {
    try {
        const { messageId, fileId } = req.params;
        
        // First, find the message and the specific file attachment
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        // Find the specific file attachment
        const fileAttachment = message.attachments.find(
            attachment => attachment._id.toString() === fileId
        );

        if (!fileAttachment) {
            return res.status(404).json({
                success: false,
                error: 'File attachment not found'
            });
        }

        // Construct the file path using the stored filename
        const filePath = path.join(__dirname, '../uploads', fileAttachment.fileName);

        // Check if file exists in the filesystem
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                error: 'File not found on server'
            });
        }

        // Get file stats
        const stats = fs.statSync(filePath);

        // Set appropriate headers
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Type', fileAttachment.fileType || 'application/octet-stream');
        res.setHeader(
            'Content-Disposition', 
            `attachment; filename="${fileAttachment.originalName}"`
        );

        // Create read stream and pipe to response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Handle potential errors during streaming
        fileStream.on('error', (error) => {
            console.error('File stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: 'Error streaming file'
                });
            }
        });

    } catch (error) {
        console.error('Download file error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: 'Error downloading file'
            });
        }
    }
};

module.exports = {
    ...chatController,
    createGroupChat,
    addGroupParticipants,
    removeGroupParticipant,
    updateGroupChat,
    searchUsers,
    getChatById,
    sendMessage: [upload.array('files', 5), sendMessage],
    downloadFile
};