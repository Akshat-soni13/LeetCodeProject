const validator= require("validator");


const validating = (data)=>{

const mandatoryField=["FirstName","Email","Password"];

const isAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k))

if(!isAllowed){
    throw new Error("Field is Missing")
}

if(validator.isStrongPassword(data.password))
{
    throw new Error("Enter some Strong Password")
}
if(validator.isEmail(data.email))
{
    throw new Error("Enter some valid Email") 
}
if(validator.isNumeric(data.age))
{
    throw new Error("Enter some valid Age")
}
if(validator.isAlpha(data.FirstName))
{
    throw new Error("Enter some valid First Name")
}
if(validator.isAlpha(data.LastName))
{
    throw new Error("Enter some valid Last Name")       
}



}

module.exports = validating;