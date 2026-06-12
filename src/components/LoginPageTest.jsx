import React, { useEffect, useState } from "react";

export default function Login({setIsAuthenticated}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authNow, setAuthNow] = useState("");
  

    const setHandleSubmit = async (e)=>{
      e.preventDefault();
      
      const response = await fetch("http://localhost:3000/users/login");
      const data = await response.json();
      if(username === data.username && password === data.password){
        setIsAuthenticated("dashboard")
      }else{
        alert("Wrong user pass")
      }
      
    }

    // useEffect(()=>{
    //     async function users(){
          
    //       return fetcher
    //     }
    //     users();
    // }, [authNow])
  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={setHandleSubmit}>
        <h2>Login</h2>
        <input
          type="username"
          placeholder="Username"
          style={styles.input}
          onChange={(e)=> setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange = { (e)=> setPassword(e.target.value)}
          required
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  form: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
};