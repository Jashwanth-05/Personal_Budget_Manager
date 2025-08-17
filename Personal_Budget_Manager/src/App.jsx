import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./assets/Components/Home"
import Signup from './assets/Components/Signup';
import Login from './assets/Components/Login';
import Navbar from './assets/Components/Navbar';
import Budgets from './assets/Components/Budgets';
import Transactions from './assets/Components/Transactions';
import { BudgetProvider } from './assets/Components/Contexts/BudgetContext';
import Dashboard from './assets/Components/Dashboard';
import Profile from './assets/Components/Profile';
import ProtectedRoute from './assets/Components/ProtectedComponent';
import TaxCalculator from './assets/Components/TaxCalculations';
import Reset from './assets/Components/Reset';
import Incomes from './assets/Components/Incomes';
function App() {
  return (
    <>
    <BudgetProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/reset' element={<Reset />}></Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/navbar' element={<Navbar />}></Route>
            <Route path='/budgets' element={<Budgets />}></Route>
            <Route path='/transactions' element={<Transactions />}></Route>
            <Route path='/dashboard' element={<Dashboard/>}></Route>
            <Route path='/incomes' element={<Incomes/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
            <Route path='/taxcalc' element={<TaxCalculator/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      </BudgetProvider>
    </>
  )
}

export default App
