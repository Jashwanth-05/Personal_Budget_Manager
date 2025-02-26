import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./assets/Components/Home"
import Signup from './assets/Components/Signup';
import Login from './assets/Components/Login';
import Navbar from './assets/Components/Navbar';
import Budgets from './assets/Components/Budgets';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/navbar' element={<Navbar />}></Route>
          <Route path='/budgets' element={<Budgets />}></Route>
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
