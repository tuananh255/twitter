import React, { useEffect, useRef, useState } from 'react'
import Conversaion from '../../components/message/Conversaion'
import Message from '../../components/message/Message'
import ChatOnliine from '../../components/message/ChatOnliine'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {io} from "socket.io-client"
export default function Messager() {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const [conversations,setConversation] = useState([])
    const [currentChat,setCurrentChat] = useState(null)
    const [message,setMessage] = useState([])
    const [newMessage,setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const scrollRef = useRef();
    
    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        });
      }, []);
    
    useEffect(() => {
        arrivalMessage &&
          currentChat?.members.includes(arrivalMessage.sender) &&
          setMessage((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage, currentChat]);
    
      useEffect(() => {
        socket.current.emit("addUser", authUser._id);
        socket.current.on("getUsers", (users) => {
          setOnlineUsers(
            authUser?.following?.filter((f) => users.some((u) => u.userId === f))
          );
        });
      }, [authUser]);
      const uniqueConversations = conversations.filter(
        (v, i, a) => a.findIndex(t => t._id === v._id) === i
      );
      
    useEffect(()=>{
        const getConversation = async()=>{
            try {
                const res = await axios.get(`http://localhost:8000/api/conversation/${authUser?._id}`)
                setConversation(res.data)
                console.log("e",res)
            } catch (error) {
                console.log(error)                
            }
        }
        getConversation()
    },[authUser?._id])
    useEffect(()=>{
        const getMessage = async()=>{
            try {
                const res= await axios.get(`http://localhost:8000/api/message/${currentChat?._id}`)
                setMessage(res.data)
                console.log("object",res.data)
            } catch (error) {
                console.log(error)                
            }
        }
        getMessage()
    },[currentChat])

    const handleSubmit= async(e)=>{
        e.preventDefault();
        const messagez = {
          sender: authUser?._id,
          text: newMessage,
          conversationId: currentChat?._id,
        };
    
        const receiverId = currentChat?.members?.find(
          (member) => member !== authUser?._id
        );
    
        socket.current.emit("sendMessage", {
          senderId: authUser._id,
          receiverId,
          text: newMessage,
        });
    
        try {
          const res = await axios.post("http://localhost:8000/api/message", messagez);
          setMessage([...message, res.data]);
          setNewMessage("");
        } catch (err) {
          console.log(err);
        }
    }
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [message]);
      // console.log("Clicked User:", user);
      console.log("Current Chat after Click:", currentChat);
      
  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
    <div className='messager'>
        <div className="chatmenu px-4">
            <div className="chatMenuWrapper">
                {/* <input type="text" placeholder='Tìm kiếm người bạn' className='chatMenuInput'  /> */}
                <h4 className='text-[24px]'>Đoạn chat</h4>
                {uniqueConversations?.map((e, index) => (
                <div onClick={() => setCurrentChat(e)} key={e._id}>
                  <Conversaion currentUser={authUser} conversation={e} />
                </div>
              ))}
            </div>
        </div>
        <div className="chatbox px-4">
            <div className="chatboxwrapperMexx relative">
                {currentChat ? 
                    <>
                        <div className="chattopMexx">
                            {message?.map((m,index) => (
                                <div key={index} ref={scrollRef}>
                                    <Message message={m} own={m.sender === authUser?._id} />
                                </div>
                            ))}
                        </div>
                        <div className="chatbottom mb-10">
                            <textarea className='chatMessageInput' placeholder='Viet noi dung' name="" id="" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)}></textarea>
                            <button className='chatSubmit' onClick={handleSubmit}>Gửi</button>
                        </div>
                    </>
                    : (
                        <span className="">
                          Open a conversation to start a chat.
                        </span>
                    )    
                }
            </div>
        </div>
        <div className="chatonline px-4">
            <h2 className='mb-4 mt-10'>Online</h2>
            <div className="chatOnlineWrapper">
            <ChatOnliine
              onlineUsers={onlineUsers}
              currentId={authUser._id}
              setCurrentChat={setCurrentChat}
            />
            </div>
        </div>
    </div>
    </div>
  )
}
