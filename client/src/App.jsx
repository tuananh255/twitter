import { Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/signup/Signup";
import Login from "./pages/auth/login/Login";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./components/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path='/profile/:username' element={ <ProfilePage />}/>
      </Routes>
      <RightPanel/>
    </div>
  );
}

export default App;
