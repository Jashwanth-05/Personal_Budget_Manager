import React from 'react'
import "../Styles/Signup.css"
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom'
const Signup = () => {
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
                <form action="" className='form-box'>
                    <div className='form-title'>
                        <span>Sign Up</span>
                    </div>
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