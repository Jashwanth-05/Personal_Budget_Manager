import React from 'react'
import "../Styles/Signup.css"
import HomeIcon from '@mui/icons-material/Home';
import API from "../../axiosInstance";
import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom'
const Signup = () => {
    const [form,setForm]=useState({FirstName:"",LastName:"",email:"",password:""})
    const [error, setError] = useState("");
    const navigate=useNavigate()
    const handleChange=(e)=>{
        const cur=e.target.name
        const val=e.target.value
        setForm((old)=>{
            return {...old,[cur]:val}
        })
        console.log(form)
    }
    const handleSignup=async(e)=>{
        e.preventDefault()
        setError("");
        try {
            const res = await API.post("/signup",form );
            
            if (res.data.token) {
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("user", JSON.stringify(res.data.user));
              navigate("/dashboard");
            }
          } catch (err) {
            setError(err.response?.data?.message || "Login failed");
          };
        }   
  return (
    <div>
        <header className='signup-header'>
        <div>
        <h1 className='title' style={{}}><span style={{color:"#0F9D58",fontFamily: '"Bebas Neue", serif'}}>P</span><span style={{color:"#F4B400",fontFamily: '"Bebas Neue", serif'}}>B</span><span style={{color:"#DB4437",fontFamily: '"Bebas Neue", serif'}}>M</span></h1>
        </div>
        <h1><span style={{color:"#0F9D58"}}>P</span>ersonal <span style={{color:"#F4B400"}}>B</span>udget <span style={{color:"#DB4437"}}>M</span>anager</h1>
        <nav className='signup-nav'>
            <ul>
                <li><HomeIcon /><Link to='/'>Home</Link></li>
            </ul>
        </nav>
        </header>
        <main className='signup-main'>
            <div className='signup-container'>
                <form action="" onSubmit={handleSignup} className='form-box'>
                    <div className='form-title'>
                        <span>Sign Up</span>
                    </div>
                    <label htmlFor="FirstName">FirstName:</label>
                    <input type="text" id='FirstName' name='FirstName' onChange={(e)=>{handleChange(e)}}/>
                    <label htmlFor="LastName">LastName:</label>
                    <input type="text" id='LastName' name='LastName' onChange={(e)=>{handleChange(e)}}/>
                    <label htmlFor="Email">Email:</label>
                    <input type="email" id='Email' name='email' onChange={(e)=>{handleChange(e)}}/>
                    <label htmlFor="Password">Password:</label>
                    <input type="password" id='Password' name='password' onChange={(e)=>{handleChange(e)}}/>
                    <div className='signup-bt'>
                        <button type='submit'>SignUp</button>
                    </div>
                    <div className='login-redirect'>
                        <span>Already have an account?<Link to="/login" className='nav-link'>Login</Link></span>
                    </div>
                </form>
            </div>
        </main>
    </div>
  )
}

export default Signup