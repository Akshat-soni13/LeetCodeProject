const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middleWare/adminMiddleware")

problemRouter.post('/create',createProblem);
problemRouter.patch("/:id",updateProblem);
problemRouter.delete("/:id",deleteProblem);


problemRouter.get("/",getAllProblem);
problemRouter.get('/:id',getProblemById);
problemRouter.get("/user",solvedAllProblembyUser);
     