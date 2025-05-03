import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LoginPage";
import LogOutPage from "./pages/LogOutPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import RegisteredUsers from "./components/AuthenticationComponents/RegisteredUsers";
import AdminPanelPage from "./pages/AdminPanelPage";
import EditItemPage from "./pages/EditItemPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ShopPage from "./pages/ShopPage";
import ContactPage from "./pages/ContactPage";
import MenuPage from "./pages/MenuPage";
import EditMenuPage from "./pages/EditMenuPage";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/SignUpPage" element={<SignUpPage />} />
      <Route path="/LogInPage" element={<LogInPage />} />
      <Route path="/LogOutPage" element={<LogOutPage />} />
      <Route path="/ResetPasswordPage" element={<ResetPasswordPage />} />
      <Route path="/NewPasswordPage/:token" element={<NewPasswordPage />} />
      <Route path="/RegisteredUsers" element={<RegisteredUsers />} />
      <Route path="/AdminPanel" element={<AdminPanelPage />} />
      <Route path="/EditItemPage/:itemId" element={<EditItemPage />} />
      <Route path="/About" element={<AboutPage />} />
      <Route path="/Shop" element={<ShopPage />} />
      <Route path="/ContactPage" element={<ContactPage />} />
      <Route path="/Menu" element={<MenuPage />} />
      <Route path="/EditMenu/:id" element={<EditMenuPage />} />
    </Routes>
  );
};

export default App;
