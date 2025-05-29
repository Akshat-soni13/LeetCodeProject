const express= require('express');
const userMiddleware = require('../middleware/userMiddleware');
const SubmitRouter = express.Router();
const submitCode = require("../controllers/userSubmission")

SubmitRouter.post("/submit/:id",userMiddleware,submitCode);

