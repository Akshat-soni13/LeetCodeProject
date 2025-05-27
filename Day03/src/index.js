const express = require('express')
const app = express();
require('dotenv').config();
const main =  require('./config/db');
const cookieParser =  require('cookie-parser');
const authRouter= require('./routes/userAuth');
const redisClient = require("./config/reddis")
app.use(express.json());
app.use(cookieParser());
app.use('/user',authRouter);

const InittializedConnection= async ()=>{

    try
    {
        await Promise.all([main(),redisClient.connect()]);
        console.log("Db Connected");
        app.listen(process.env.PORT, ()=>{
        console.log("Server listening at port number: "+ process.env.PORT);
    })

    }catch(err)
    {
        console.log("Error:"+err);
    }
}


InittializedConnection();