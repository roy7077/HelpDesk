const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model("Notes", NotesSchema);
