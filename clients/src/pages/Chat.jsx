import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Model from '../components/Model';
import { BsEmojiSmile, BsFillEmojiSmileFill } from "react-icons/bs"
import { fetchMessages, sendMessage } from '../apis/messages';
import { useEffect } from 'react';
import MessageHistory from '../components/MessageHistory';
import io from "socket.io-client"
import "./home.css"
import { fetchChats, setNotifications } from '../redux/chatsSlice';
import Loading from '../components/ui/Loading';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { getChatName } from '../utils/logics';
import Typing from '../components/ui/Typing';
import { validUser } from '../apis/auth';
import { ChromePicker } from 'react-color';

const ENDPOINT = process.env.REACT_APP_SERVER_URL
let socket, selectedChatCompare;

function Chat(props) {
  const { activeChat, notifications } = useSelector((state) => state.chats)
  const dispatch = useDispatch()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPicker, setShowPicker] = useState(false);
  const activeUser = useSelector((state) => state.activeUser)
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (color) => {
    setBackgroundColor(color.hex);
    localStorage.setItem('backgroundColor', color.hex);
  };

  const handleColorPickerToggle = () => {
    setShowColorPicker(!showColorPicker);
  };

  const [backgroundColor, setBackgroundColor] = useState(() => {
    const storedColor = localStorage.getItem('backgroundColor');
    return storedColor || "#ffffff"; // Default color is white
  });



  const keyDownFunction = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && (message)) {
      setMessage("")
      socket.emit("stop typing", activeChat._id)
      const data = await sendMessage({ chatId: activeChat._id, message })
      socket.emit("new message", data)
      setMessages([...messages, data])
      dispatch(fetchChats())
    }
  }


  useEffect(() => {
    socket = io(ENDPOINT)
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))
  }, [])

  useEffect(() => {
    socket.emit("setup", activeUser)
    socket.on("connected", () => {
      setSocketConnected(true)
    })
  }, [messages, activeUser])
  useEffect(() => {
    const fetchMessagesFunc = async () => {
      if (activeChat) {
        setLoading(true)
        const data = await fetchMessages(activeChat._id)
        setMessages(data)
        socket.emit("join room", activeChat._id)
        setLoading(false)

      }
      return
    }
    fetchMessagesFunc()
    selectedChatCompare = activeChat

  }, [activeChat])
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if ((!selectedChatCompare || selectedChatCompare._id) !== newMessageRecieved.chatId._id) {
        if (!notifications.includes(newMessageRecieved)) {
          dispatch(setNotifications([newMessageRecieved, ...notifications]))
        }
      }
      else {
        setMessages([...messages, newMessageRecieved])
      }
      dispatch(fetchChats())
    })
  })
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser()
      if (!data?.user) {
        window.location.href = "/login"
      }

    }
    isValid()
  }, [])
  if (loading) {
    return <div className={props.className}>
      <Loading />
    </div>
  }
  return (
    <>
      {
        activeChat ?
          <div className={props.className} style={{ backgroundColor: backgroundColor}}>
            <div className="flex justify-between items-center px-4 w-[100%] bg-[#1F71EC] max-h-[50px] p-3">
              <div className='flex justify-between items-center gap-x-[10px] w-[53%] p-2'>
                <div className='flex items-center'>
                  <h5 className='text-[20px] text-[#2b2e33] font-bold tracking-wide'>{getChatName(activeChat, activeUser)}</h5>
                </div> 
              </div>

              <div>
                <Model />
              </div>
            </div>
            <div className='scrollbar-hide w-[100%] h-[70vh] md:h-[66vh] lg:h-[69vh] flex flex-col overflow-y-scroll p-4'>
              <div className='ml-auto absolute top-23 right-4'>
                <button onClick={handleColorPickerToggle}>
                  {showColorPicker ? <img className='h-[25px] w-[25px]' src="Image/close.png" alt="" /> : <img className='h-[25px] w-[25px]' src="Image/mdi_color.png" alt="" />}
                </button>
              </div>
              {showColorPicker && (
                <div className="absolute top-18 right-12 z-10">
                  <ChromePicker color={backgroundColor} onChange={handleColorChange} />
                </div>
              )}
              
              <MessageHistory typing={isTyping} messages={messages} />
              <div className='ml-7 -mb-10'>
                {
                  isTyping ?
                    <Typing width="100" height="100" /> : ""
                }

              </div>
            </div>
            <div className='absolute left-[10%] bottom-[5%] bg-[#fff] rounded-lg border border-black'>
              {
                showPicker && <Picker data={data} onEmojiSelect={(e) => setMessage(message + e.native)} />
              }
              <div className='border-[1px] border-[#aabac8] px-3 py-3 w-[360px] sm:w-[400px] md:w-[350px] h-[50px] lg:w-[820px] rounded-t-lg'>

                <form onKeyDown={(e) => keyDownFunction(e)} onSubmit={(e) => e.preventDefault()}>
                  <input onChange={(e) => {
                    setMessage(e.target.value)
                    if (!socketConnected) return
                    if (!typing) {
                      setTyping(true)
                      socket.emit('typing', activeChat._id)
                    }
                    let lastTime = new Date().getTime()
                    var time = 3000
                    setTimeout(() => {
                      var timeNow = new Date().getTime()
                      var timeDiff = timeNow - lastTime
                      if (timeDiff >= time && typing) {
                        socket.emit("stop typing", activeChat._id)
                        setTyping(false)
                      }
                    }, time)
                  }} className='focus:outline-0 w-[100%]' type="text" name="message" placeholder="Enter message" value={message} />
                </form>

              </div>

              <div className='border-x-[1px] border-b-[1px] border-[#aabac8] px-6 py-3 w-[360px] sm:w-[400px] md:w-[350px] lg:w-[820px] rounded-b-lg h-[50px]'>
                {/* {
                  isTyping ? <div>Loading</div> : ""
                } */}
                <div className='flex justify-between items-start'>

                  <div className='cursor-pointer' onClick={() => setShowPicker(!showPicker)}>

                    {showPicker ? <BsFillEmojiSmileFill className='w-[20px] h-[20px] text-[#ffb02e] border-[black]' /> : <BsEmojiSmile className='w-[20px] h-[20px]' />}
                  </div>
                  <button onClick={(e) => keyDownFunction(e)} className='border-[2px] border-[#d4d4d4] text-[14px] px-2 py-[3px] text-[#9e9e9e] font-medium rounded-[7px] -mt-1'>Send</button>
                </div>
                
              </div>
            </div>
          </div> :
          <div className={props.className}>
            <div className='relative'>
              <div className='absolute top-[40vh] left-[44%] flex flex-col items-center justify-center gap-y-3'>
                <img className='w-[50px] h-[50px] rounded-[25px]' alt="User profile" src={'Image/Profilepic.png'} />
                <h3 className='text-[#111b21] text-[20px] font-medium tracking-wider'>Welcome <span className='text-[#166e48] text-[19px] font-bold'> {activeUser.name}</span></h3>
              </div>
            </div>
          </div>

      }
    </>
  )
}

export default Chat