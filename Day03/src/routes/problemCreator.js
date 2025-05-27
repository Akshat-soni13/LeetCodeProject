const express = require("express");
const problemRouter = express.Router();


problemRouter.post('/create',problemCreate);
problemRouter.patch("/:id",problemUpdate);
problemRouter.delete("/:id",problemDelete);


problemRouter.get("/",getAllProblem

);
problemRouter.get('/:id',problemFetch);
    problemRouter.get("/user",solvedProblem);
