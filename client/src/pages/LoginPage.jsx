import React, { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import axios from "axios";
import { UserContext } from "../UserContext";


export default function LoginPage(){
    
    const [email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const [redirect,setRedirect]=useState(false);
    const {setUser} =useContext(UserContext);
    
  async function handelLoginSubmit(ev){
    ev.preventDefault();
    try{
      const {data}=await axios.post('/login',{email,password})
      if(data ==="user not found"){
        alert('login failed');
      }
      else{
      alert('login successful');
      setUser(data);
      setRedirect(true);
      }
    }
    catch(e){
      alert('login failed');
      console.log(e);
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }

    return (
        <div className=" mt-4 grow flex items-center justify-around">
          <div className="mb-64">
            <h1 className="text-4xl mb-4 text-center ">Login</h1>
            <form className="mx-auto  max-w-md" onSubmit={handelLoginSubmit}>
                <input type="email" placeholder="your@email.com " value={email} onChange={ev => setEmail(ev.target.value)}/>
                <input type="password" placeholder="password" value={password} onChange={ev => setPassword(ev.target.value)}/>
                <button className="primary">Login</button>
                <div className="text-center py-2 text-gray-500 ">Don't have account yet ?  <Link className="underline text-black" to={'/register'}>Register</Link>
                </div>
            </form>
          </div>
        </div>
    ) 
}