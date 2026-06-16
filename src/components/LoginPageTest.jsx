import React, { useState } from "react";
import axios from 'axios';

export default function Login({setIsAuthenticated}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const setHandleSubmit = async (e)=>{
      e.preventDefault();
      try{
        const response = await axios.post("http://localhost:3000/api/auth/login",
          {
            username: username,
            password: password
          }
        );
        console.log(response)
        if(response.status === 200){
          setIsAuthenticated("dashboard")
        }else{
          alert("Wrong user pass")
        }
      }
      catch(error){
        if (error.status == 401){
          alert("Wrong Username Or Password")
        }
      }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form className="bg-white p-8 rounded-xl shadow-sm border border-slate-200/60 w-[340px] flex flex-col gap-4" onSubmit={setHandleSubmit}>
        <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400"
          onChange={(e)=> setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400"
          onChange = { (e)=> setPassword(e.target.value)}
          required
        />

        <button type="submit" className="py-2.5 px-4 bg-blue-650 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors duration-200 shadow-sm">
          Login
        </button>
      </form>
    </div>
  );
}