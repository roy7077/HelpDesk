const express=require('express');
const router=express.Router();

const { addNoteToTickets, fetchThreadEntries } = require('../Controllers/Notes');
const { authz } = require('../Middlewares/Authz');


router.post('/addnewnote',authz,addNoteToTickets);
router.post('/getthread/:ticketId',authz,fetchThreadEntries);

module.exports=router;