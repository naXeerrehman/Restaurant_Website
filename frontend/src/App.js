import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import LogOut from "./components/LogOut";
import ResetPassword from "./components/ResetPassword";
import NewPassword from "./components/NewPassword";
import RegisteredUsers from "./components/RegisteredUsers";
import UpdateUser from "./components/UpdateUser";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/LogIn" element={<LogIn />} />
      <Route path="/LogOut" element={<LogOut />} />
      <Route path="/UpdateUser" element={<UpdateUser />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />
      <Route path="/NewPassword/:token" element={<NewPassword />} />
      <Route path="/RegisteredUsers" element={<RegisteredUsers />} />
    </Routes>
  );
}

export default App;
