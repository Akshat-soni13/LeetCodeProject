const express= require("express");
const app = express();
require('dotenv').config();
const main = require("./config.js/db")
const cookieparser= require('cookie-parser');

// req.body se json format me aata hai isliye convert karneke liye
app.use(express.json());
// cookie bhi json me ati hai usko parce karne ke liye 
app.use(cookieparser());
main()
.then(async ()=>{

    app.listen(process.env.PORT,()=>{
    console.log("Server is running on port "+process.env.PORT);
})})
.catch(err => console.log(err.message))