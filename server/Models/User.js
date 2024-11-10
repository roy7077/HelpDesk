const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    image:{
        type:String,
        required:true,
    },
    accountType: {
        type: String,
        enum: ["Customer", "Service Agent", "Admin"],
        required: true
    },
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tickets'
    }]
});

module.exports = mongoose.model("User", UserSchema);
