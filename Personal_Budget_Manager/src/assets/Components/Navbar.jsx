import React from 'react'
import "../Styles/Navbar.css"
import { Link } from 'react-router-dom';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PaidIcon from '@mui/icons-material/Paid';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalculateIcon from '@mui/icons-material/Calculate';
import HomeIcon from '@mui/icons-material/Home';
const Navbar = () => {
  return (
    <div>
        <header  className='navbar-header'>
          <div className='navbar-icon'>
          <Link to="/"><HomeIcon style={{fontSize:"30px"}} /></Link>
          </div>
        <div className='navbar-title'>
            <h1 className='title' style={{margin:"0"}}><span style={{color:"#0F9D58",fontFamily: '"Bebas Neue", serif'}}>P</span><span style={{color:"#F4B400",fontFamily: '"Bebas Neue", serif'}}>B</span><span style={{color:"#DB4437",fontFamily: '"Bebas Neue", serif'}}>M</span></h1>
            </div>
        </header>
        <main className='navbar-main'>
          <nav>
            <ul>
              <li><TextSnippetIcon /><span>Budgets</span></li>
              <li><PaidIcon/><span>Transactions</span></li>
              <li><DashboardIcon /><span>Dashboard</span></li>
              <li><CalculateIcon /><span>Tax Calculation</span></li>
            </ul>
          </nav>
        </main>
    </div>
  )
}

export default Navbar