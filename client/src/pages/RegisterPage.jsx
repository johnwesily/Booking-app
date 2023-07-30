import React from "react"
import { Link, Navigate } from "react-router-dom"
import { useState } from "react";
import axios from "axios";


export default function Register(){
     
    const [name,setName] =useState('');
    const [email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const [redirect,setRedirect]=useState(false);

    async function registerUser(ev){
        ev.preventDefault();
        try{
       await axios.post("/register",{
        name,
        email,
        password,
       });
    alert("Registration successfull .now you can login ")
    setName('');
    setEmail('');
    setPassword('');
    setRedirect(true);
    
        }
        catch(e){
            alert("registation failed .please try again later");
        }
    }

   if(redirect){
    return <Navigate to={'/login'}/>
   }
    return (
        <div className=" mt-4 grow flex items-center justify-around">
          <div className="mb-64">
            <h1 className="text-4xl mb-4 text-center ">Register</h1>
            <form className="mx-auto  max-w-md" onSubmit={registerUser}> 
                <input type="text" placeholder="name" value={name} onChange={ev =>{setName(ev.target.value)}}/>
                <input type="email" placeholder="your@email.com " value={email} onChange={ev=>{setEmail(ev.target.value)}}/>
                <input type="password" placeholder="password" value={password} onChange={ev =>{setPassword(ev.target.value)}}/>
                <button className="primary">Register</button>
                <div className="text-center py-2 text-gray-500 ">Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
                </div>
            </form>
          </div>
        </div>
    )  
}