const express= require('express');
const userMiddleware = require('../middleware/userMiddleware');
const SubmitRouter = express.Router();
const {runCode,submitCode} = require("../controllers/userSubmission")

SubmitRouter.post("/submit/:id",userMiddleware,submitCode);
SubmitRouter.post("/run/:id",userMiddleware,runCode);

module.exports= SubmitRouter;