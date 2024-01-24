const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const validateMongodbId = require('../utils/validateMongodbId');
const { generateToken } = require('../config/jwtToken');   //from jwtToken
const {generateRefreshToken} = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController');
const crypto = require('crypto');

const createUser = asyncHandler(async(req, res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({
        email: email
    });
    if(!findUser){
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        throw new Error('User Already Exists');
        
    }
});

const userLogin = asyncHandler(async(req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const findUser = await User.findOne({
        email
    });
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        }, {new: true});
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)

        });

    }else{
        throw new Error('Invalid Credential');
    }

});

const handleRefreshToken = asyncHandler(async(req, res)=>{
    const cookie = req.cookies;
    // console.log(cookie);
    if(!cookie?.refreshToken) throw new Error('No Token found in cookies');
    const refreshToken = cookie.refreshToken;
    // console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error('No Refresh Token Found');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded)=>{
        if(err || user.id !== decoded.id){
            throw new Error('Something went Wrong');
        }
        const accessToken = generateToken(user?.id);
        res.json({accessToken});
    });

});
const logout = asyncHandler(async(req, res)=>{
    const cookie = req.cookies;
    // console.log(cookie);
    if(!cookie?.refreshToken) throw new Error('No Token found in cookies');
    const refreshToken = cookie.refreshToken;
    // console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);    //forbidden
    }
    await User.findOneAndUpdate({refreshToken : refreshToken}, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
     res.sendStatus(204);    //forbidden
});

const updateAUser = asyncHandler(async(req, res)=>{
    // console.log(req.user);
    const _id = req.user;

    validateMongodbId(_id);

    try{
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            {
            new: true
            }
            );
        res.json(updatedUser);

    }catch(error){
        throw new Error(error);
    }

});
// const updateAUser = asyncHandler(async(req, res)=>{
//     const id = req.params.id;
//     try{
//         const updatedUser = await User.findByIdAndUpdate(
//             id,
//             {
//                 firstname: req?.body?.firstname,
//                 lastname: req?.body?.lastname,
//                 email: req?.body?.email,
//                 mobile: req?.body?.mobile,
//             },
//             {
//             new: true
//             }
//             );
//         res.json(updatedUser);

//     }catch(error){
//         throw new Error(error);
//     }

// });


//get all the users

const getAllUser = asyncHandler(async(req, res)=>{
    try{
        const getUsers = await User.find();
        res.json(getUsers);

    }catch(error){
        throw new Error(error);
    }

});

const getAUser = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const getAUser = await User.findById(id);
        res.json(getAUser);

    }catch(error){
        throw new Error(error);
    }
});


const deleteAUser = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const deleteUser = await User.findByIdAndDelete(id);
        res.json(deleteUser);

    }catch(error){
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const block = await User.findByIdAndUpdate(id,{
            isBlocked: true,
        },
        {
            new: true,
        }
        );
        res.json({
            message: 'User is Blocked'
        });

    }catch(error){
        throw new Error(error);
    }

});

const unblockUser = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(id,{
            isBlocked: false,
        },
        {
            new: true,
        }
        );
        res.json({
            message: 'User is Unblocked'
        });

    }catch(error){
        throw new Error(error);
    }

});
const updatePassword = asyncHandler(async(req, res)=>{
    const _id = req.user.id;
    const password = req.body.password;
    validateMongodbId (_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } 
    else{
        res.json(user);
    }
});
const forgotPasswordToken = asyncHandler(async(req, res)=>{
    const email = req.body.email;
    const user = await User.findOne({email});
    console.log(req.body.email);
    if(!user) throw new Error('User not Found');
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Hi, Please Follow this link to reset your password. 
        This link is valid for ten minutes 
        <a href = 'http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`
    const data = {
        to: email,
        text: "Hay User",
        subject: "Forgot Password Link",
        htm: resetUrl

    }
    sendEmail(data);
    res.json(token);
    }catch(error){
        throw new Error(error);
    }

});

const resetPassword = asyncHandler(async(req, res)=>{
    const password = req.body.password;
    const token = req.params.token;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()},

    });
    if(!user) throw new Error('Token Expired, Please try again');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
});


module.exports = {
    createUser, 
    userLogin, 
    getAllUser, 
    getAUser, 
    deleteAUser,
    updateAUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword
};