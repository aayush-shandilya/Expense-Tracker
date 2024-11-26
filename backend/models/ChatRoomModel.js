//ChatRoomModel.js
const mongoose = require('mongoose');

// const chatRoomSchema = new mongoose.Schema({
//     type: {
//         type: String,
//         required: true,
//         enum: ['private', 'group','customer_service']
//     },
//     name: {
//         type: String,
//         required: function() { 
//             return this.type === 'group';
//         }
//     },
const chatRoomSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['private', 'group', 'customer_service']
    },
    name: {
        type: String,
        required: function() {
            return this.type === 'group' || this.type === 'customer_service';
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    botId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() {
            return this.type === 'customer_service';
        }
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: String,
        default: ''
    },
    lastMessageTime: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);