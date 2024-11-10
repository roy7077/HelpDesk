const express=require('express');
const router=express.Router();
const { updateUserProfile,getAllCustomers } = require('../Controllers/User');
const { authz } = require('../Middlewares/Authz');

router.put('/updateprofile/:id', authz,updateUserProfile);
router.get('/customers', getAllCustomers);

module.exports=router;