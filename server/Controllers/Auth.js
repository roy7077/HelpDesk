const bcrypt = require("bcrypt");
const User = require("../Models/User"); // Import the User model
const jwt=require('jsonwebtoken');

/*----------------------SignUp---------------------------*/
exports.signUp = async (req, res) => {
    try {
        // Get data from request body
        const { userName, 
                password,
                confirmPassword, 
                email, 
                phoneNumber, 
                accountType } = req.body;

                // console.log(userName);
                // console.log(password);
                // console.log(confirmPassword);
                // console.log(email);
                // console.log(phoneNumber);
                // console.log(accountType);

        // Validation
        if (!userName || !confirmPassword || !password || !email || !phoneNumber || !accountType) {
            return res.status(401).json({
                success: false,
                message: "Some fields are missing",
            });
        }

        // Password and confirmPassword should be the same
        if (password !== confirmPassword) 
        {
            return res.status(400).json({
                success: false,
                message: "Password and confirmPassword values do not match",
            });
        }

        //console.log("signUp 40");

        // Check if user already exists
        if (await User.findOne({ email })) 
        {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        //console.log("signUp 49");

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add new entry in DB
        const newUser = await User.create({
            userName,
            phoneNumber,
            email,
            password: hashedPassword,
            accountType,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${userName}${userName}`
        });

        //console.log("sinup 62");
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error while creating new user",
            error: e.message
        });
    }
};


/*----------------------Login---------------------------*/
exports.login = async (req, res) => {
    try {
        // Fetch data from request body
        const { email, password } = req.body;

        // If fields are absent
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not registered, please sign up first"
            });
        }

        // Password matching
        if (await bcrypt.compare(password, user.password)) {
            const payLoad = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,  // Changed to 'role' from 'accountType'
            };

            const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
                expiresIn: "4h",
            });

            user.token = token;
            user.password = undefined;  // Ensure password is not sent back in the response

            // Create cookies and send
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully"
            });
        } 
        else {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};







