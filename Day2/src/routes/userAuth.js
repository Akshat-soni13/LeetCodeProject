const express = require('express');

const authrouter = express.Router();

authrouter.post("/register",register);
authrouter.post("/login",login);
authrouter.post("/logout",logout);
authrouter.post("/getProfile",getProfile);
authrouter.post("/ResetPassword",RpassWord);
authrouter.post("ChangePAssword",CpassWord);

