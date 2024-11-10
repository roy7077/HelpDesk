const express=require('express');
const router=express.Router();
const { createNewTicket, 
        showTickets, 
        viewAllTickets, 
        updateTicketStatus } = require('../Controllers/Tickets');

const { authz } = require('../Middlewares/Authz');


router.post('/createnewticket', authz ,createNewTicket);
router.post('/showtickets',authz,showTickets);
router.post('/viewalltickets',authz,viewAllTickets);
router.patch('/updateticketstatus',authz,updateTicketStatus);

module.exports=router;