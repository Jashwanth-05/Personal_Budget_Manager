import React from 'react'
import { Link } from 'react-router-dom'
import "../Styles/Login.css"
import HomeIcon from '@mui/icons-material/Home';
const Login = () => {
  return (
    <div>
    <header className='login-header'>
        <h1>Personal Budget Manager</h1>
        <nav className='login-nav'>
            <ul>
                <li><HomeIcon /><Link to='/'>Home</Link></li>
            </ul>
        </nav>
    </header>
    <main className='login-main'>
        <div className='login-container'>
            <form action="" className='form-box'>
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