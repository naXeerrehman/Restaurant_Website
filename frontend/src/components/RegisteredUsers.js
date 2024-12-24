import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [message, setMessage] = useState("");

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user details
  const updateUser = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        {
          email: updatedEmail,
          name: updatedName,
        }
      );
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
      const response = await axios.delete(
        `http://localhost:5000/api/users/${userId}`
      );
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
        `http://localhost:5000/api/users/toggle-admin`,
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
    <div className="border border-black w-[620px] lg:w-[920px] mx-auto mt-5 rounded-md">
      <h2 className="bg-black text-white w-[300px] text-center py-2 mx-auto mb-3 mt-[15px] rounded-md">
        Registered Users
      </h2>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center w-[600px] lg:w-[900px] mx-auto"
            >
              {editingUser === user._id ? (
                <>
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    placeholder="Enter new name"
                    className=""
                  />
                  <input
                    type="email"
                    value={updatedEmail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                    placeholder="Enter new email"
                    className=""
                  />
                </>
              ) : (
                <span>
                  {user.name} || {user.email}
                </span>
              )}

              <div>
                {editingUser === user._id ? (
                  <>
                    <button
                      onClick={() => updateUser(user._id)}
                      className="border px-2 py-1 bg-blue-500 text-white rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="border px-2 py-1 bg-gray-500 text-white ml-2 rounded-md"
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
                    className="border px-2 py-1 bg-yellow-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteUser(user._id)}
                  className="border px-2 py-1 bg-red-500 text-white ml-2 mb-3 rounded-md"
                >
                  Delete
                </button>

                <button
                  onClick={() => toggleAdminStatus(user._id, user.isAdmin)}
                  className={`border px-2 py-1 rounded-md ${
                    user.isAdmin ? "bg-red-500" : "bg-green-500"
                  } text-white ml-2`}
                >
                  {user.isAdmin ? "Remove Admin" : "Make Admin"}
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-red-500">No users found.</li>
        )}
      </ul>

      {message && (
        <p className="text-center mt-5 border border-black mb-2 w-[300px] mx-auto rounded-md">
          {message}
        </p>
      )}
    </div>
  );
};

export default UsersList;
