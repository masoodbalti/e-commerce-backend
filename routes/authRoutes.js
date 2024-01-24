const express = require('express');
const { 
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
    resetPassword} = require('../controller/userController');
const  {authMiddleware, isAdmin} = require('../middlewares/authmiddleware');
const router = express.Router();


router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/password', authMiddleware, updatePassword)
router.post('/login', userLogin);
router.get('/allUsers', getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/:id', authMiddleware, isAdmin, getAUser);
router.delete('/:id', deleteAUser);
// router.put('/:id', updateAUser);
router.put('/edit-user', authMiddleware,  updateAUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);


module.exports = router;