import React from 'react'
import { Link } from 'react-router-dom'
import "../Styles/Login.css"
import HomeIcon from '@mui/icons-material/Home';
const Login = () => {
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
                <input type="email" id='Email'/>
                <label htmlFor="Password">Password:</label>
                <input type="password" id='Password'/>
                <div className='login-bt'>
                    <button>Login</button>
                </div>
                <div className='login-redirect'>
                    <span>Create new account?<Link to="/signup" className='nav-link'>Signup</Link></span>
                </div>
            </form>
        </div>
    </main>
</div>
  )
}

export default Login