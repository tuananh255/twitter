import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatOnline({ currentId, onlineUsers, setCurrentChat }) {
  const [followers, setFollowers] = useState([]);
  const [onlineFollowers, setOnlineFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/user/followers/${currentId}`);
        setFollowers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFollowers();
  }, [currentId]);

  useEffect(() => {
    // Lọc danh sách người đang theo dõi và đang online
    setOnlineFollowers(followers.filter((f) => onlineUsers.includes(f._id)));
  }, [followers, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/conversation/find/${currentId}/${user?._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chatOnline flex flex-col gap-4 mb-[100px]">
      {onlineFollowers.map((follower) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          key={follower._id}
          onClick={() => handleClick(follower)}
        >
          <div className="imgContainer">
            <img
              className="h-[40px] w-[40px] rounded-full"
              src={follower?.profileImage !=="" ? follower?.profileImage : 'https://img5.thuthuatphanmem.vn/uploads/2022/01/14/avatar-cho-nam-ngau-nhat_023716457.jpg'}
              alt={follower.userName}
            />
            <div className="chatOnLineBadge"></div>
          </div>
          <span className="chatOnlineName">{follower.userName}</span>
        </div>
      ))}
    </div>
  );
}
