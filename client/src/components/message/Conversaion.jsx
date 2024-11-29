import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Conversaion({conversation,currentUser}) {
  const [user,setUser]=useState(null)
  useEffect(()=>{
    const friends= conversation.members.find(m=>m !== currentUser?._id)
    const getUser = async () => {
      try {
        const res = await axios("http://localhost:8000/api/user?userId=" + friends);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  },[currentUser, conversation])
  return (
    <div className='flex items-center gap-4 mb-3 hover:bg-[#3f3f3f] cursor-pointer'>
        <img className='h-[50px] w-[50px] rounded-[50%]' src={user?.profileImage !="" ? user?.profileImage : "https://tse4.mm.bing.net/th?id=OIP.4M7zCNj1Pt994WFYpARgkgHaFj&pid=Api&P=0&h=220"} alt="" />
        <span className='textCon'>{user?.userName}</span>
    </div>
  )
}
