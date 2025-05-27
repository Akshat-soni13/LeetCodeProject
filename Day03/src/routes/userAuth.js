const express = require('express');
const {register,login,logout,adminRegister}= require("../controllers/userAuthent");
const userMiddleware= require("../middleWare/userMiddleware");
const adminMiddleware= require("../middleWare/adminMiddleware")
const authRouter =  express.Router();

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware,adminRegister);
// authRouter.get('getProfile',getProfile);
// change PAssword
// ResetPassword


module.exports= authRouter
