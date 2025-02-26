import React from 'react'
import { Link } from 'react-router-dom'
import "../Styles/Home.css"
import PersonIcon from '@mui/icons-material/Person';
const Home = () => {
  return (
    <div>
        <header className='home-header'>
            <div>
            <h1 className='title' style={{}}><span style={{color:"#0F9D58",fontFamily: '"Bebas Neue", serif'}}>P</span><span style={{color:"#F4B400",fontFamily: '"Bebas Neue", serif'}}>B</span><span style={{color:"#DB4437",fontFamily: '"Bebas Neue", serif'}}>M</span></h1>
            </div>
            <h1><span style={{color:"#0F9D58"}}>P</span>ersonal <span style={{color:"#F4B400"}}>B</span>udget <span style={{color:"#DB4437"}}>M</span>anager</h1>
            <nav className='home-nav'>
                <ul>
                    <li><PersonIcon/><Link to='/login'>Login</Link></li>
                </ul>
            </nav>
        </header>
        <main className='home-main'>
          <div className='home-quote'>
            <h3>
              &quot;Budgeting only has one rule;<br />&nbsp;Do not go over budget. <br /> <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-Leslie Tayne&quot;
            </h3>
          </div>
          <div className='home-content1'>
            <p style={{textAlign:"justify",margin:"0"}}>
            <strong>Welcome to Personal Budget Manager..</strong>  <br /> <br />
            &nbsp;&nbsp;&nbsp;Take control of your finances with Personal Budget Manager, a smart and intuitive tool designed to help you plan, track, and manage your budgets efficiently. Set your monthly, weekly, or custom budgets, categorize expenses, and get real-time insights into your spending habits.
            </p>
          </div>
          <div className='home-content2'>
            <p style={{marginBottom:"8px",fontSize:"larger"}}><strong>Features:</strong></p>
            <table cellSpacing="0" cellPadding="4">
            <tr>
              <td><strong>Budget Management</strong></td>
              <td>Create, update, and delete monthly, weekly, or custom budgets.</td>
            </tr>
            <tr>
              <td><strong>Expense Tracking</strong></td>
              <td>Manually add and categorize expenses (Food, Rent, Travel, Shopping, Bills, etc.).</td>
            </tr>
            <tr>
              <td><strong>Graphical Insights</strong></td>
              <td>Get visual reports and progress indicators for your budgets.</td>
            </tr>
            <tr>
              <td><strong>Transaction Management</strong></td>
              <td>Easily log and manage your income and expenses.</td>
            </tr>
            <tr>
              <td><strong>Low Budget Alerts</strong></td>
              <td>Get warnings when spending exceeds your budget.</td>
            </tr>
            <tr>
              <td><strong>Tax Calculation</strong></td>
              <td>Automated tax estimation based on expenses.</td>
            </tr>
          </table>

          </div>
        </main>
    </div>
  )
}

export default Home