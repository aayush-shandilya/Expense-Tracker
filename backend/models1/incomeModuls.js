const mongoose = require('mongoose')

const incomeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true,
        maxLength:20
    },
    amount:{
        type:Number,
        required:true,
        trim: true,
    },
    date:{
        type:Date,
        required:true,
        trim: true,
    },
    category:{
        type:String,
        required:true,
        trim: true,
        maxLength:20
    },
    description:{
        type:String,
        required:true,
        trim: true,
        maxLength:200
    }
},{timestamps:true})

module.exports = mongoose.model('income', incomeSchema)