import React from 'react'
import { useEffect } from 'react'
import { GoogleLogin } from "react-google-login"
import { gapi } from "gapi-script"
import { googleAuth } from '../apis/auth'
import { useState } from 'react'
import { loginUser } from '../apis/auth'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { validUser } from '../apis/auth'

const defaultData = {
  email: "",
  password: ""
}

function Login() {
  const [formData, setFormData] = useState(defaultData)
  const [isLoading, setIsLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const pageRoute = useNavigate()
  // const googleSuccess = async (res) => {
  //   if (res?.profileObj) {
  //     console.log(res.profileObj)
  //     setIsLoading(true)
  //     const response = await googleAuth({ tokenId: res.tokenId })
  //     setIsLoading(false)

  //     console.log("response :" + res)
  //     if (response.data.token) {
  //       localStorage.setItem("userToken", response.data.token)
  //       pageRoute("/chats")

  //     }
  //   }
  // }
  // const googleFailure = (error) => {
  //   toast.error("Something went Wrong.Try Again!")
  // }
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const formSubmit = async (e) => {
    e.preventDefault()
    if (formData.email.includes("@") && formData.password.length > 6) {
      setIsLoading(true)
      const { data } = await loginUser(formData)
      if (data?.token) {
        localStorage.setItem("userToken", data.token)
        toast.success("Succesfully Login!")
        setIsLoading(false)
        pageRoute("/chats")
      }
      else {
        setIsLoading(false)
        toast.error("Invalid Credentials!")
        setFormData({ ...formData, password: "" })
      }
    }
    else {
      setIsLoading(false)
      toast.warning("Provide valid Credentials!")
      setFormData(defaultData)

    }
  }
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
    <>

      <div className='bg-[#C3D8F0] w-[100vw] h-[100vh] flex justify-center items-center'>
        <div className='w-[400px] h-[400px] border border-white bg-[#f8f8f8] '>

          <div className='relative w-full mt-5'>
            <h3 className='mx-auto text-5xl font-bold tracking-wider text-[#4872B0] w-full text-center justify-center'>Login</h3>
          </div>


          <form className='flex flex-col items-center gap-y-6 mt-[12%]' onSubmit={formSubmit}>
            <div className=' w-full flex items-center justify-center'>
              <input className="w-[100%] sm:w-[80%] bg-[#D9D9D9] h-[50px] pl-3 text-[#ffff] rounded-lg" onChange={handleOnChange} name="email" type="text" placeholder='Email' value={formData.email} required />
            </div>

            <div className='relative w-full flex items-center justify-center'>

              <input className='w-[100%] sm:w-[80%] bg-[#D9D9D9] h-[50px] pl-3 text-[#ffff] rounded-lg' onChange={handleOnChange} type={showPass ? "text" : "password"} name="password" placeholder='Password' value={formData.password} required />

            </div>


            {/* style={{ background: "linear-gradient(90deg, rgba(0,195,154,1) 0%, rgba(224,205,115,1) 100%)" }} */}

            <button className='w-[100%]  sm:w-[80%] h-[50px] font-bold text-[#fff] tracking-wide text-[17px] bg-[#0D6EC8] relative rounded-lg' type='submit'>
              {/* <div style={{ display: isLoading ? "" : "none" }} className='absolute -top-[53px] left-[27%] sm:-top-[53px] sm:left-[56px]'>

                <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json" background="transparent" speed="1" style={{ width: "200px", height: "160px" }} loop autoplay></lottie-player>
              </div> */}
              <p style={{ display: isLoading ? "none" : "block" }} className='test-[#fff]'>Login</p>
            </button>
            <div className='px-12'>
              <p className='text-[#000] text-[12px] tracking-wider font-medium'>Don't have an Account ? <Link className='text-[rgba(0,195,154,1)] underline' to="/register">Sign up</Link></p>
              </div>


          </form>
        </div>

      </div>
    </>
  )
}

export default Login