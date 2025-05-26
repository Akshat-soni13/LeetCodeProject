const User = require("../models/user")
const validate= require("../utilis/validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const register =  async (req,res)=>{
    try{

        validate(req.body);
        const {firstName, emailId,password} = req.body;
        req.body.password = await bcrypt.hash(password,10);

       const token= jwt.sign({_id:User._id,emailId:emailId},process.env.JWT_KEY,{expiresIn:60*60});

    //    max age will expre the cookie in some time where timw will bw in mille second 
        res.cookie('token',token,{maxAge: 60*60*1000})  
        res.status(201).send("User registerd Succesfully")
       const user= await User.create(req.body);

    }catch(err){            
        res.status(400).send(err.message)
    }   
}

const login= async (req,res)=>{
    try{

        const {emailId,password} = req.body;
        if(!emailId)
            throw new Error("Credential Missing");
        if(!password)
            throw new Error("Credential Missing");
        const user = await User.findOne({emailId});

        const match = bcrypt.compare(password,User.password);

        if(!match)
            throw new Error("Invalid Credential");
         const token= jwt.sign({_id:User._id,emailId:emailId},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge: 60*60*1000})  
        res.status(201).send("User Loggedin  Succesfully")

    }catch(err)
    {
        res.status(400).send(err.message)
    }
}

const logout = async (req,res)=>{
    try{

        

    }catch(err)
    {
        res.send(err.message)
    }
}