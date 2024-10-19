import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/signup/Signup";
import Login from "./pages/auth/login/Login";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./components/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import {Toaster} from 'react-hot-toast'
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
function App() {
  const {data:authUser,isLoading} =useQuery({
    queryKey:["authUser"],
    queryFn:async()=>{
      try {
        const res=await fetch("/api/auth/me")
        const data = await res.json()
        if(data.error) return null
        if(!res.ok){
          throw new Error(data.error || "Something went wrong")
        }
        console.log("Auth is here: ",data)
        return data
      } catch (error) {
        throw new Error(error)        
      }
    },
    retry: false,
  })
  if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}
  console.log(authUser)
  return (
    <div className="flex max-w-6xl mx-auto">
     {authUser && <Sidebar />}
      <Routes>
        <Route path="/" element={authUser ?<HomePage /> : <Navigate to='/login' />} />
        <Route path="/login" element={!authUser ?<Login />: <Navigate to='/' />} />
        <Route path="/signup" element={!authUser ?<Signup />: <Navigate to='/' />} />
        <Route path="/notifications" element={authUser ? <NotificationPage />:<Navigate to='/login' />} />
        <Route path='/profile/:userName' element={authUser ?  <ProfilePage />:<Navigate to='/login' />}/>
      </Routes>
      {authUser && <RightPanel />}
      <Toaster/>
    </div>
  );
}

export default App;
