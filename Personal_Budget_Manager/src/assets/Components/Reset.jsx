import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "../Styles/Reset.css"
import API from "../../axiosInstance";
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
const Reset = () => {
  const [form,setForm]=useState({email:"",otp:"",password:"",dpassword:""})
  const [inOtp,setInOtp]=useState(false);
  const [error, setError] = useState("");
  const [passForm,setPassForm]=useState(false);
  const navigate=useNavigate()
  const handleChange=(e)=>{
      const cur=e.target.name
      const val=e.target.value
      setForm((old)=>{
          return {...old,[cur]:val}
      })
      console.log(form)
  }
  const SentOTP=async(e)=>{
      e.preventDefault()
      setError("");
      try {
        setInOtp(true);
          const res = await API.post("/send-otp",{email:form.email} );
          
          if (res) {
           console.log("OTP Sent Successfully");
          }
        } catch (err) {
          setError(err.response?.data?.message);
        };
  }
  const VerifyOTP=async(e)=>{
    e.preventDefault()
    setError("");
    try {
        setPassForm(true);
        const res = await API.post("/verify-otp",{email:form.email,otp:form.otp});
        if (res){
            setPassForm(true);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Login failed");
      };
}
    const UpdatePassword=async(event)=>{
        event.preventDefault();
        setError("");
        console.log(form.password)
        console.log(form.dpassword);
        if(form.password.trim() !== form.dpassword.trim()){
            alert("Password Not Matching..!")
            return;
        }
        try {
            const res = await API.put("/updatepass",{email:form.email,password:form.password});
            if (res){
                console.log("Password Updated Successfully");
                navigate("/login");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        };
    }
  return (
    <div>
    <header className='reset-header'>
    <div>
    <h1 className='title' style={{}}><span style={{color:"#0F9D58",fontFamily: '"Bebas Neue", serif'}}>P</span><span style={{color:"#F4B400",fontFamily: '"Bebas Neue", serif'}}>B</span><span style={{color:"#DB4437",fontFamily: '"Bebas Neue", serif'}}>M</span></h1>
    </div>
    <h1><span style={{color:"#0F9D58"}}>P</span>ersonal <span style={{color:"#F4B400"}}>B</span>udget <span style={{color:"#DB4437"}}>M</span>anager</h1>
    <nav className='reset-nav'>
            <ul>
                <li><HomeIcon /><Link to='/'>Home</Link></li>
            </ul>
        </nav>
    </header>
    <main className='reset-main'>
        <div className='reset-container'>
            {!passForm && <form action="" className='form-box'>
                <div className='form-title'>
                    <span>Password Reset</span>
                </div>
                <label htmlFor="Email">Email:</label>
                <input name="email" type="email" id='Email' onChange={(e)=>{handleChange(e)}}/>
                {inOtp && <><label htmlFor="otp">OTP:</label>
                <input name='otp' type="password" id='otp' onChange={(e)=>{handleChange(e)}}/></>}
                {!inOtp && <div className='reset-bt'>
                    <button onClick={SentOTP}>Get OTP</button>
                </div>}
                {inOtp && <div className='reset-bt'>
                  <button onClick={VerifyOTP}>Verify</button>
                </div>}
                <div className='reset-redirect'>
                    <span>Create new account?<Link to="/signup" className='nav-link'>Signup</Link></span>
                </div>
            </form>}
            {passForm && <form action="" className='form-box'>
                <div className='form-title'>
                    <span>Password Reset</span>
                </div>
                <label htmlFor="Password">Password:</label>
                <input name="password" type="password" id='Password' onChange={(e)=>{handleChange(e)}}/>
                <label htmlFor="password">Re-Enter Password:</label>
                <input name="dpassword" type="text" id='Password' onChange={(e)=>{handleChange(e)}}/>
                <div className='reset-bt'><button onClick={UpdatePassword}>Submit</button></div>
                
                <div className='reset-redirect'>
                    <span>Create new account?<Link to="/signup" className='nav-link'>Signup</Link></span>
                </div>
            </form>}
        </div>
    </main>
</div>
  )
}

export default Reset