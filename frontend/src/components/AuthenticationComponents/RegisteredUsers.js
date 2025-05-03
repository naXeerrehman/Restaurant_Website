import React, { useEffect, useState } from "react";
import axios from "axios";
import { GiChickenOven } from "react-icons/gi";
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Fetch users from the backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Error fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user details
  const updateUser = async (userId) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/${userId}`, {
        email: updatedEmail,
        name: updatedName,
      });
      setMessage(response.data.message);
      setEditingUser(null);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage("Error updating user");
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/users/${userId}`);
      setMessage(response.data.message);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Error deleting user");
    }
  };

  // Toggle admin status
  const toggleAdminStatus = async (userId) => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/admin/users/toggle-admin`,
        {
          userId: userId,
        }
      );
      setMessage(response.data.message);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error toggling admin status:", error);
      setMessage("Error toggling admin status");
    }
  };

  // Automatically clear the message after 2 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000); // Clear message after 2 seconds

      return () => clearTimeout(timer); // Cleanup the timer when the component unmounts or message changes
    }
  }, [message]);

  return (
    <div className="border-2 border-white px-1 mx-auto mt-5 rounded-md md:text-2xl">
      <h2 className="text-white text-center py-2 mx-auto mb-3 mt-[15px] rounded-md font-bold text-2xl md:text-3xl">
        Registered Users
      </h2>
      <ul>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center mt-5 text-white">
            <GiChickenOven className="animate-zoomInOut text-5xl" />
            <div className="font-bold ml-2 mt-2 md:text-3xl">Loading...</div>
          </div>
        ) : (
          <div className="">
            {users.length > 0 ? (
              users.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center mx-auto border-b-2 mb-2"
                >
                  {editingUser === user._id ? (
                    <div className="flex flex-col gap-y-1 -mt-[20px]">
                      <input
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        placeholder="Enter new name"
                        className="p-1 text-xl rounded-md"
                      />
                      <input
                        type="email"
                        value={updatedEmail}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                        placeholder="Enter new email"
                        className="p-1 text-xl rounded-md"
                      />
                    </div>
                  ) : (
                    <span className="text-white font-bold mb-4 px-1 text-sm md:text-2xl">
                      {user.name} || {user.email}
                    </span>
                  )}
                  <div className="flex flex-col md:flex-row lg:flex-row mt-[30px]">
                    {editingUser === user._id ? (
                      // Save and cancel button
                      <>
                        <button
                          onClick={() => updateUser(user._id)}
                          className="border px-2 py-1 rounded-md text-white flex-1 w-[80px] md:w-[100px] text-sm bg-green-500 mb-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="border px-2 py-1 rounded-md text-white flex-1 w-[80px] text-sm mb-2 bg-red-600 text-center ml-1"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingUser(user._id);
                          setUpdatedEmail(user.email);
                          setUpdatedName(user.name);
                        }}
                        className="border px-2 py-1 rounded-md text-white flex-1 w-[80px] text-sm mb-2  bg-yellow-500"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="border px-2 py-1 rounded-md text-white flex-1 w-[80px] text-sm mb-2 bg-red-600 md:ml-1"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => toggleAdminStatus(user._id, user.isAdmin)}
                      className={`border px-1 py-1 rounded-md text-white flex-1 w-[120px] md:w-[200px] -ml-[42px] md:ml-1 text-sm mb-2 sm:mb-2 ${
                        user.isAdmin ? "bg-red-600" : "bg-green-500"
                      }`}
                    >
                      {user.isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-red-500">No users found.</li>
            )}
          </div>
        )}
      </ul>

      {message && (
        <p className="text-center mt-5 bg-red-600 text-white mb-2 mx-auto w-[300px]">
          {message}
        </p>
      )}
    </div>
  );
};

export default UsersList;
