import React from 'react'
import { format } from "timeago.js";
export default function Message({message,own}) {
  return (
    <div className={own?"message own flex flex-col" : "message flex flex-col"}>
        <div className="chattop flex gap-4">
            <img className='h-[30px] w-[30px] rounded-[50%]' src="https://tse4.mm.bing.net/th?id=OIP.4M7zCNj1Pt994WFYpARgkgHaFj&pid=Api&P=0&h=220" alt="" />
            <p className='messText text-[white] bg-[#1877f2] rounded-[20px] p-[10px] max-w-[300px] px-[20px]'>
              {message?.text}
            </p>
        </div>
        <div className=" text-[12px] mb-5">{format(message.createdAt)}</div>
    </div>
  )
}
