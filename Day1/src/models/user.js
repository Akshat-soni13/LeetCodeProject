const { maxLength } = require('cookieparser');
const mongoose = require('mongoose');
// schema Create karne ke iye use hota hai 
const {Schema} = mongoose;

const userschmea= new Schema
(
{
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
        },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20
    },
    emailId:
    {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        imutable:true
    },
    age:
    {
        type:Number,
        min:6,
        max:80,

    },
    role:{
        type:String,
        enum:['User','Admin'],
        default:"User"

    },
    problemSolved:{
        type:[String]
    }
},{timestamps:true})

const User = mongoose.model("user",userschema);

module.exports=User;