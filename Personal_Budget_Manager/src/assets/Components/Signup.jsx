import React from 'react'
import "../Styles/Signup.css"
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom'
const Signup = () => {
  return (
    <div>
        <header className='signup-header'>
            <h1>Personal Budget Manager</h1>
            <nav className='signup-nav'>
            <ul>
                <li><HomeIcon /><Link to='/'>Home</Link></li>
            </ul>
        </nav>
        </header>
        <main className='signup-main'>
            <div className='signup-container'>
                <form action="" className='form-box'>
                    <label htmlFor="FirstName">FirstName:</label>
                    <input type="text" id='FirstName'/>
                    <label htmlFor="LastName">LastName:</label>
                    <input type="text" id='LastName'/>
                    <label htmlFor="Email">Email:</label>
                    <input type="email" id='Email'/>
                    <label htmlFor="Password">Password:</label>
                    <input type="password" id='Password'/>
                    <div className='signup-bt'>
                        <button>SignUp</button>
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