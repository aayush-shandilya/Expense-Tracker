// // const mongoose = require('mongoose');

// // const chatRoomSchema = new mongoose.Schema({
// //     type: {
// //         type: String,
// //         required: true,
// //         enum: ['private', 'group']
// //     },
// //     participants: [{
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: 'User'
// //     }],
// //     lastMessage: {
// //         type: String,
// //         default: ''
// //     },
// //     lastMessageTime: {
// //         type: Date,
// //         default: Date.now
// //     },
// //     createdBy: {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: 'User',
// //         required: true
// //     }
// // }, {
// //     timestamps: true
// // });

// // module.exports = mongoose.model('ChatRoom', chatRoomSchema);


// // ChatRoomModel.js modifications
// const mongoose = require('mongoose');

// const chatRoomSchema = new mongoose.Schema({
//     type: {
//         type: String,
//         required: true,
//         enum: ['private', 'group']
//     },
//     name: {  // Added for group names
//         type: String,
//         required: function() { return this.type === 'group'; }
//     },
//     participants: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     admins: [{  // Added for group admins
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     lastMessage: {
//         type: String,
//         default: ''
//     },
//     lastMessageTime: {
//         type: Date,
//         default: Date.now
//     },
//     createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('ChatRoom', chatRoomSchema);



const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['private', 'group']
    },
    name: {
        type: String,
        required: function() { 
            return this.type === 'group';
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