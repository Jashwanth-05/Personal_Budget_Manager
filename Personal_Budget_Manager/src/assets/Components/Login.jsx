import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "../Styles/Login.css"
import API from "../../axiosInstance";
import { useBudget } from "./Contexts/BudgetContext"; 
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
const Login = () => {
    const [form,setForm]=useState({email:"",password:""})
    const [error, setError] = useState("");
    const { setUser } = useBudget();
    const navigate=useNavigate()
    const handleChange=(e)=>{
        const cur=e.target.name
        const val=e.target.value
        setForm((old)=>{
            return {...old,[cur]:val}
        })
        console.log(form)
    }
    const handleLogin=async(e)=>{
        e.preventDefault()
        setError("");
        try {
            const res = await API.post("/login",form );
            
            if (res.data.token) {
              localStorage.setItem("token", res.data.token);
              setUser(res.data.user);
              localStorage.setItem("user", JSON.stringify(res.data.user));
              navigate("/dashboard");
            }
          } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            alert(err.response.data.message)
          };
    }
  return (
    <div>
    <header className='login-header'>
    <div>
    <h1 className='title' style={{}}><span style={{color:"#0F9D58",fontFamily: '"Bebas Neue", serif'}}>P</span><span style={{color:"#F4B400",fontFamily: '"Bebas Neue", serif'}}>B</span><span style={{color:"#DB4437",fontFamily: '"Bebas Neue", serif'}}>M</span></h1>
    </div>
    <h1><span style={{color:"#0F9D58"}}>P</span>ersonal <span style={{color:"#F4B400"}}>B</span>udget <span style={{color:"#DB4437"}}>M</span>anager</h1>
    <nav className='login-nav'>
            <ul>
                <li><HomeIcon /><Link to='/'>Home</Link></li>
            </ul>
        </nav>
    </header>
    <main className='login-main'>
        <div className='login-container'>
            <form action="" className='form-box'>
                <div className='form-title'>
                    <span>Log in</span>
                </div>
                <label htmlFor="Email">Email:</label>
                <input name="email" type="email" id='Email' onChange={(e)=>{handleChange(e)}}/>
                <label htmlFor="Password">Password:</label>
                <input name='password' type="password" id='Password' onChange={(e)=>{handleChange(e)}}/>
                <div className='login-bt'>
                    <button onClick={handleLogin}>Login</button>
                </div>
                <div className='login-redirect'>
                    <span>Create new account?<Link to="/signup" className='nav-link'>Signup</Link></span>
                </div>
                <div className='login-redirect1'>
                    <span><Link to="/reset" className='nav-link'>Forget Password?</Link></span>
                </div>
            </form>
        </div>
    </main>
</div>
  )
}

export default Login