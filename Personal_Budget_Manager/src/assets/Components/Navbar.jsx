import React, { useState } from 'react'
import "../Styles/Navbar.css"
import { Link } from 'react-router-dom';
import { useBudget } from "./Contexts/BudgetContext";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PaidIcon from '@mui/icons-material/Paid';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import CalculateIcon from '@mui/icons-material/Calculate';
import HomeIcon from '@mui/icons-material/Home';
import Profile from './Profile';
const Navbar = () => {
  const [showProfile,setShowProfile]=useState(false);
    const { setBudgets,setTransactions,setIncomes } = useBudget();
  const navigate=useNavigate();
  const handleShowProfile=()=>{
    setShowProfile(true);
  }
  const handleSignout=()=>{

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setBudgets([])
    setTransactions([])
    setIncomes([])
      navigate('/');
  }

  return (
    <div>
        <header  className='navbar-header'>
          <div className='navbar-icon'>
          <Link to="/"><HomeIcon style={{fontSize:"30px"}} /></Link>
          </div>
        <div className='navbar-title'>
            <h1 className='title' style={{margin:"0"}}><span style={{color:"#0F9D58",fontFamily: '"Bebas Neue", serif'}}>P</span><span style={{color:"#F4B400",fontFamily: '"Bebas Neue", serif'}}>B</span><span style={{color:"#DB4437",fontFamily: '"Bebas Neue", serif'}}>M</span></h1>
            </div>
        <div className='navbar-profile'>
          <span onClick={showProfile==false?handleShowProfile:()=>setShowProfile(false)}><PersonIcon style={{fontSize:"30px"}}  /></span>
        </div>
        </header>
        <main className='navbar-main'>
          <nav>
            <ul>
              <Link to='/dashboard'><li><DashboardIcon /><span>Dashboard</span></li></Link>
              <Link to='/budgets'><li><TextSnippetIcon /><span>Budgets</span></li></Link>
              <Link to='/transactions'><li><PaidIcon/><span>Transactions</span></li></Link>
              <Link to='/taxcalc'><li><CalculateIcon /><span>Tax Calculation</span></li></Link>
            </ul>
          </nav>
         
        </main>
        <div className='profile-container'>
            {showProfile && <Profile onClose={()=>{setShowProfile(false)}} handleSignout={handleSignout} />}
          </div>
    </div>
  )
}

export default Navbar