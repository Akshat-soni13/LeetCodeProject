const express = require('express');

const authRouter =  express.Router();
const {register, login,logout, adminRegister,deleteProfile} = require('../controllers/userAuthent')
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware ,adminRegister);
// authRouter.get('/getProfile',getProfile);
authRouter.delete("/deleteProfile",userMiddleware,deleteProfile)
authRouter.get("/check",userMiddleware,(req,res)=>{
    const reply ={
        firstName: req.result.firstName,
        emailId : req.result.emailId,
        _id: req.result._id,    
        role:req.result.role
    }

    res.status(200).json({
        user:reply,
        messsage:"Valid USer"
    })
})

module.exports = authRouter;


// x`
// logout
// GetProfile

