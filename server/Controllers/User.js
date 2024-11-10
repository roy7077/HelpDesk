const User = require('../Models/User');

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id; // The ID of the user to update, from the request parameters
        const requestUserId = req.user.id; // The ID of the logged-in user making the request
        const accountType = req.user.accountType; // Account type of the logged-in user
        
        // Only allow updates to certain fields
        const { userName, 
                email,
                phoneNumber } = req.body;

        //console.log(requestUserId);
       // console.log(req.user);
       //console.log(userId);
       
        // Check if the requesting user is the same as the user to be updated or an Admin
        if (requestUserId !== userId && accountType !== 'Admin') 
        {
            return res.status(403).json({
                success: false,
                message: "Access denied: Only the user or an Admin can update this profile"
            });
        }

        // Validate that the user exists
        const user = await User.findById(userId);
        if (!user) 
        {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update fields if they are provided in the request body
        if (userName) 
        user.userName = userName;

        if (email) 
        user.email = email;

        if (phoneNumber) 
        user.phoneNumber = phoneNumber;

        // Save the updated user profile
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: {
                userName: user.userName,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the profile",
            error: error.message
        });
    }
};


/*---------------fetch all customers------------*/

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ accountType: 'Customer' });  // Fetch users with role 'Customer'
    
    if (!customers) {
      return res.status(404).json({ message: 'No customers found' });
    }
    
    return res.status(200).json({ customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

