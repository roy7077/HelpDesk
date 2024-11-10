const mongoose = require("mongoose");

const TicketsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Closed", "Pending"],
        default:"Active",
        required: true
    },
    CustomerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    lastUpdateOn: {
        type: Date,
        default:Date.now,
        required: true
    },
    Notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notes"
        }
    ]
});

module.exports = mongoose.model("Ticket", TicketsSchema);
