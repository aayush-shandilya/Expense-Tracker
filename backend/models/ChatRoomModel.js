// const mongoose = require('mongoose');

// const chatRoomSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Room name is required"],
//     },
//     type: {
//         type: String,
//         enum: ['private', 'group'],
//         required: true
//     },
//     participants: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     admin: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: function() { return this.type === 'group'; }
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('ChatRoom', chatRoomSchema);

// backend/models/ChatRoomModel.js
const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['private', 'group'],
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: String,
        default: null
    },
    lastMessageTime: {
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);