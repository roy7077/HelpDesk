const Tickets = require('../Models/Tickets');
const User = require('../Models/User');
const Notes = require('../Models/Notes');

exports.addNoteToTickets = async (req, res) => {
    try {

        const userId=req.user.id;

        // Get data from request body
        const { content,ticketId } = req.body;

        // Validation
        if (!content || !userId || !ticketId) 
        {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate Ticket ID
        const ticket = await Tickets.findById(ticketId);
        if (!ticket) 
        {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Validate User ID
        const userData = await User.findById(userId);
        if (!userData) 
        {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // console.log(userData.accountType);

        // Check if user is authorized to add a note (service agent or ticket owner)
        if (userData.accountType !== "Service Agent" && 
            userData.accountType!="Admin" && 
            userData._id.toString() !== ticket.CustomerID.toString()) 
        {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to add note"
            });
        }

        // Create a new note
        const newNote = await Notes.create({
            content,
            userId,
            ticketId
        });

        // Add the note to the ticket's notes array and update last modified date
        ticket.Notes.push(newNote._id);
        ticket.lastUpdateOn = Date.now();
        await ticket.save();

        return res.status(200).json({
            success: true,
            message: "New note added successfully",
            data: newNote
        });
    } 
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the note",
            error: error.message
        });
    }
};


// Fetch thread entries for a specific ticket
exports.fetchThreadEntries = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const user = req.user;

        //console.log("User:", user);
        //console.log("Ticket ID:", ticketId);

        // Fetch the ticket with populated customer info for notes
        const ticket = await Tickets.findById(ticketId)
            .populate('Notes', 'content timestamp') // Make sure to populate timestamp
            .populate('CustomerID', 'userName email'); // For customer details if needed

        //console.log("Ticket:", ticket); // Log the entire ticket object

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        if (user.accountType !== 'Admin' && user.accountType !== 'Service Agent' && !ticket.CustomerID.equals(user.id)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to view this ticket's thread entries"
            });
        }

        // Log raw notes data
        //console.log("Raw Notes:", ticket.Notes);

        // Format the Notes to include content and formatted timestamp
        const notesWithTimestamp = ticket.Notes.map(note => {
            // console.log("Note content:", note.content);
            // console.log("Note createdAt:", note.timestamp); // Check if timestamp exists

            const timestamp = note.timestamp ? note.timestamp.toISOString() : 'N/A'; // Default value if timestamp is missing
            return {
                content: note.content,
                timestamp: timestamp,
            };
        });

       // console.log("Notes with timestamp:", notesWithTimestamp);

        // Return thread entries with timestamp
        return res.status(200).json({
            success: true,
            data: notesWithTimestamp
        });
    } catch (error) {
        console.error("Error fetching thread entries:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch thread entries",
            error: error.message
        });
    }
};
