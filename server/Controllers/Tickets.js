const Tickets = require('../Models/Tickets');
const User = require('../Models/User');
const Notes=require('../Models/Notes');

/*--------------------Creating New Ticket-----------------------*/
exports.createNewTicket = async (req, res) => {
    try {
        // Get data from request body

        const CustomerID=req.user.id;

        const { title, 
                status } = req.body;

        //console.log("cutomer id ",CustomerID);

        // Validation
        if (!title || !status || !CustomerID) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user exists with this ID
        const getUser = await User.findById(CustomerID);
        if (!getUser) 
        {
            return res.status(400).json({
                success: false,
                message: "User does not exist with this ID"
            });
        }

        // Check if the user is a customer
        if (getUser.accountType !== "Customer") 
        {  
            return res.status(400).json({
                success: false,
                message: "User is not a Customer"
            });
        }

        // Create new ticket
        const newTicket = await Tickets.create({
            title,
            status,
            CustomerID
        });

        // Push the ticket ID to user's 'tickets' array
        getUser.tickets.push(newTicket._id);
        await getUser.save();

        return res.status(200).json({
            success: true,
            message: "Ticket created successfully",
            data: newTicket
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the ticket",
            error: error.message
        });
    }
};


exports.showTickets = async (req, res) => {
    try {
        // Get user ID from the authenticated user (req.user.id)
        const userId = req.user.id;

        //console.log("show -> ",userId);
        // Validate user ID
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        //console.log("86");

        // Find tickets associated with the given user ID and select necessary fields
        const tickets = await Tickets.find({ CustomerID: userId })
            .populate({
                path: 'CustomerID', 
                select: 'userName' // Retrieve only the userName field of the customer
            })
            .select('title status lastUpdateOn') // Select only the required fields
            .sort({ lastUpdateOn: -1 }); // Sort by lastUpdateOn in descending order

            //console.log("95");

        // Check if tickets exist
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No tickets found for this user"
            });
        }

        //console.log("103");

        // Format the tickets data with the required information
        const formattedTickets = tickets.map(ticket => ({
            ticketID: ticket._id,  // Ticket ID
            title: ticket.title,   // Ticket title
            status: ticket.status, // Ticket status
            customerName: ticket.CustomerID ? ticket.CustomerID.userName : 'N/A', // Customer name
            lastUpdatedOn: ticket.lastUpdateOn // Last updated date
        }));

        // console.log("112");
        // console.log(formattedTickets);
        // Return the list of formatted tickets
        return res.status(200).json({
            success: true,
            message: "Tickets retrieved successfully",
            data: formattedTickets
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving tickets",
            error: error.message
        });
    }
};

/*------------------Access to view all tickets from all customers in a list--------*/
exports.viewAllTickets = async (req, res) => {
    try {
        //console.log("yes");
        // Retrieve user ID from request and check authorization
        const userId = req.user.id;
        const userData = await User.findById(userId);

        // Check if user exists
        if (!userData) 
        {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Restrict access if the user is a customer
        if (userData.accountType === "Customer") 
        {
            return res.status(403).json({
                success: false,
                message: "Access denied: Customers are not authorized to view all tickets"
            });
        }

        // Find all tickets, populate CustomerID with only the name, and sort by lastUpdateOn in descending order
        const tickets = await Tickets.find()
            .populate({
                path: 'CustomerID',
                select: 'userName' // Only retrieve the customer's name
            })
            .select('title status lastUpdateOn') // Select only the necessary fields
            .sort({ lastUpdateOn: -1 }); // Sort by last updated date in descending order

        // Check if there are any tickets
        if (!tickets || tickets.length === 0) 
        {
            return res.status(404).json({
                success: false,
                message: "No tickets found"
            });
        }

        // Format and return the ticket list
        const formattedTickets = tickets.map(ticket => ({
            ticketID: ticket._id,
            title: ticket.title,
            status: ticket.status,
            customerName: ticket.CustomerID ? ticket.CustomerID.userName : "N/A",
            lastUpdatedOn: ticket.lastUpdateOn
        }));

        return res.status(200).json({
            success: true,
            message: "All tickets retrieved successfully",
            data: formattedTickets
        });
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving tickets",
            error: error.message
        });
    }
};

/*---------------------Update the status of any tickets----------------*/
// Update the status of a ticket
exports.updateTicketStatus = async (req, res) => {
    try {

        //console.log("no no");
        const { ticketId, newStatus } = req.body;
        const userId = req.user.id;  // Assumes user info is set in `req.user` from middleware
        
        // console.log("user id -> ",userId);
        // console.log("ticket id -> ",ticketId);
        // console.log("new status -> ",newStatus);

        // Validate inputs
        if (!ticketId || !newStatus) {
            return res.status(400).json({
                success: false,
                message: "Ticket ID and new status are required"
            });
        }

        // Check if the new status is valid
        const validStatuses = ["Active", "Pending", "Closed"];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        // Find user and validate their role
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        //console.log("Update -> ",236)
        // Check if the user is authorized (only Service Agents and Admins can update status)
        if (userData.accountType !== "Service Agent" && userData.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied: Only Service Agents and Admins can update ticket status"
            });
        }
        //console.log("Update -> ",244)
        // Find the ticket and update its status
        const ticket = await Tickets.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Update the ticket status
        ticket.status = newStatus;
        ticket.lastUpdateOn = Date.now();
        await ticket.save();

        //console.log("Update -> ",259)
        return res.status(200).json({
            success: true,
            message: "Ticket status updated successfully",
            data: {
                ticketID: ticket._id,
                title: ticket.title,
                status: ticket.status,
                customerName: ticket.CustomerID ? ticket.CustomerID.userName : "N/A",
                lastUpdatedOn: ticket.lastUpdateOn
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating ticket status",
            error: error.message
        });
    }
};
