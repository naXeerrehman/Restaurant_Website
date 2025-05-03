import React from "react";
import Navbar from "../components/Navbar";
import AdminPanel from "../components/AuthenticationComponents/AdminPanel";

const AdminPanelPage = () => {
  return (
    <div>
      <Navbar />
      <AdminPanel />
    </div>
  );
};

export default AdminPanelPage;
