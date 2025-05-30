import { useEffect , useState } from "react";
import { useForm } from 'react-hook-form';

function Signup()
{
    const {  register, handleSubmit, formState: { errors },} = useForm();
    const Submitdata =(data)=>
    {
        console.log(data);
    }
    return(
        <>
        <form onSubmit={handleSubmit(Submitdata)}>

        <input {...register('firstName')} placeholder="Enter the First Name"></input>
        <input {...register('email')} placeholder="Enter the Email"></input>
        <input {...register('password')} placeholder="Enter the password"></input>

        <button type="submit" className="btn" >Submit </button>
        </form>
        
        </>
    )
}

export default Signup;











// function Signup()
// {

//     const [name,setName]= useState('');
//     const [email,setEmail]= useState('');
//     const [password,setPassword]= useState('');

//     const handleSubmit=(e)=>{
//     //    e.preventDefault();
//     console.log(name,email,password);


//     }
//     return(
//         <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center gap-y-3">

//         <input type="text" value={name} placeholder="Enter Your First Name" onChange={(e)=>setName(e.target.value)}></input>
//         <input type="email" value={email} placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)}></input>
//         <input type="password" value={password} placeholder="Enter Your password" onChange={(e)=>setPassword(e.target.value)}></input>
//         <button type="submit" >Submit</button>
 
//         </form>
//     )
// }