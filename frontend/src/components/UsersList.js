import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateUser from "./UpdateUser";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null); // User to be edited
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const [deleteMessage, setDeleteMessage] = useState(""); // State for delete messages

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      setDeleteMessage("User deleted successfully!"); // Set delete success message
      setTimeout(() => setDeleteMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle edit click
  const handleEditClick = (user) => {
    setEditUser(user); // Set the user to be edited
  };

  // Callback to set the success message
  const handleUpdateSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000); // Clear the message after 3 seconds
  };

  return (
    <div>
      <h1>User List</h1>
      {successMessage && (
        <p className="text-green-500">{successMessage}</p>
      )}{" "}
      {/* Display update success message */}
      {deleteMessage && <p className="text-red-500">{deleteMessage}</p>}{" "}
      {/* Display delete success message */}
      {editUser ? (
        <UpdateUser
          user={editUser}
          setEditUser={setEditUser}
          setUsers={setUsers}
          setSuccessMessage={handleUpdateSuccess} // Pass the success message handler
        />
      ) : null}
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className="border border-black p-2 mb-2">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <button
                className="bg-blue-500 text-white px-2 py-1 mr-2"
                onClick={() => handleEditClick(user)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1"
                onClick={() => deleteUser(user._id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  );
};

export default UsersList;
