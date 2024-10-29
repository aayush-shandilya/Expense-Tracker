const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        maxlength:20,
    },
    amount:{
        type:Number,
        trim:true,
        required:true,
        maxlength:5,
    },
    date:{
        type:Date,
        trim:true,
        required:true,
    },
    description:{
        type:String,
        trim:true,
        required:true,
        maxlength:100,
    }
})