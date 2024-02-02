import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import { GoogleLogin } from "react-google-login"
import { gapi } from "gapi-script"
import { useEffect } from 'react'
import { googleAuth, registerUser } from '../apis/auth'
import { useState } from 'react'
// import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs"
import { toast } from 'react-toastify';
import { validUser } from '../apis/auth'
const defaultData = {
  firstname: "",
  lastname: "",
  email: "",
  password: ""
}
function Regsiter() {
  const [formData, setFormData] = useState(defaultData)
  const [isLoading, setIsLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const pageRoute = useNavigate()
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (formData.email.includes("@") && formData.password.length >= 6) {
      const { data } = await registerUser(formData)
      if (data?.token) {
        localStorage.setItem("userToken", data.token)
        toast.success("Succesfully Registered😍")
        setIsLoading(false)
        pageRoute("/chats")

      }
      else {
        setIsLoading(false)
        toast.error("Invalid Credentials!")
      }
    }
    else {
      setIsLoading(false)
      toast.warning("Provide valid Credentials!")
      setFormData({ ...formData, password: "" })
    }

  }

  // const googleSuccess = async (res) => {
  //   if (res?.profileObj) {
  //     setIsLoading(true)
  //     const response = await googleAuth({ tokenId: res.tokenId })
  //     setIsLoading(false)
  //     if (response.data.token) {
  //       localStorage.setItem("userToken", response.data.token)
  //       pageRoute("/chats")
  //     }
  //   }
  // }
  // const googleFailure = (error) => {
  //   toast.error("Something Went Wrong.Try Agian!")
  // }

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
    const isValid = async () => {
      const data = await validUser()
      if (data?.user) {
        window.location.href = "/chats"
      }
    }
    isValid()
  }, [])
  return (
    <div className='bg-[#C3D8F0] w-[100vw] h-[100vh] flex justify-center items-center'>
      <div className='flex justify-center items-center w-[650px] h-[550px] bg-[#f8f8f8]'>
      <div className='w-[400px] h-[530px] bg-[#f8f8f8]'>

        <div className='relative  w-full flex items-center text mt-5'>
            <h3 className='mx-auto text-5xl font-bold tracking-wider text-[#4872B0]'>Register</h3>
        </div>

        <form className='flex flex-col  gap-y-6 mt-[12%]' onSubmit={handleOnSubmit}>
          <div className='flex gap-x-2 w-[100%] flex items-center justify-center'>
              <input onChange={handleOnChange} className='bg-[#D9D9D9] h-[50px] pl-3 text-[#fff] w-[49%] sm:w-[47%] rounded-lg' type="text" name="firstname" placeholder='First Name' value={formData.firstname} required />
              <input onChange={handleOnChange} className='rounded-lg bg-[#D9D9D9] h-[50px] pl-3 text-[#fff] w-[49%] sm:w-[47%]' type="text" name="lastname" placeholder='Last Name' value={formData.lastname} required />
          </div>
          <div className='flex items-center justify-center'>
              <input onChange={handleOnChange} className='bg-[#D9D9D9] h-[50px] pl-3 text-[#fff] w-[100%] sm:w-[96.3%] rounded-lg' type="email" name="email" placeholder="Email" value={formData.email} required />
          </div>
          <div className='relative flex flex-col gap-y-3 flex items-center justify-center'>

              <input onChange={handleOnChange} className='rounded-lg bg-[#D9D9D9] h-[50px] pl-3 text-[#fff] w-[100%] sm:w-[96.3%]' type={showPass ? "text" : "password"} name="password" placeholder="Password" value={formData.password} required />
          </div>

          <div className='relative w-full flex items-center justify-center'>

            <input
              onChange={handleOnChange}
                className='bg-[#D9D9D9] h-[50px] pl-3 text-[#fff] w-[100%] sm:w-[96.3%] rounded-lg'
              type={showPass ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              required
            />

          </div>

          <div className='w-full flex items-center justify-center'>
            <button className='w-[100%]  sm:w-[96.3%] h-[50px] font-bold text-[#fff] tracking-wide text-[17px] bg-[#0D6EC8] relative rounded-lg' type='submit'>
            {/* <div style={{ display: isLoading ? "" : "none" }} className='absolute -top-[53px] left-[29.5%] sm:-top-[53px] sm:left-[87px]'>

              <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json" background="transparent" speed="1" style={{ width: "200px", height: "160px" }} loop autoplay></lottie-player>
            </div> */}
            <p style={{ display: isLoading ? "none" : "block" }} className='test-[#fff]'>Regsiter</p>
          </button>
          </div>


          <div className='px-20'>
            <p className='text-[#000] text-[12px] tracking-wider font-medium  '>Already have an Account? <Link className='text-[rgba(0,195,154,1)] underline' to="/login">Sign in</Link></p></div>
          

        </form>
      </div>
      </div>
    </div>
  )
}

export default Regsiter