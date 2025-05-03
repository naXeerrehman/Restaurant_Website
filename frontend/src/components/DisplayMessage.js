import React, { useEffect, useState } from "react";
import axios from "axios";
import { GiChickenOven } from "react-icons/gi";

const DisplayMessages = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(4);
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Fetch all contacts
  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/contacts`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (contactId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/contacts/${contactId}`);
      setContacts(contacts.filter((contact) => contact._id !== contactId));
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete message.");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filtered contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mx-auto mt-5 border-2 border-white rounded-md p-2">
      <h1 className="font-bold text-center mb-5 text-white text-2xl md:text-5xl">
        Client Message
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search message by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-2 rounded w-[280px] md:w-[400px] border-red-600 mx-auto text-sm md:text-2xl lg:text-2xl mb-3 text-center"
        />
      </div>

      {/* Message List */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center mt-5 text-white">
          <GiChickenOven className="animate-zoomInOut text-5xl" />
          <div className="font-bold ml-2 mt-2 md:text-3xl">Loading...</div>
        </div>
      ) : (
        <div>
          {currentContacts.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:text-2xl lg:text-sm">
              {currentContacts.map((contact) => (
                <li
                  key={contact._id}
                  className="p-4 hover:shadow-lg rounded border-2 border-white text-white"
                >
                  <div>
                    <p className="mb-2">
                      <strong>Name:</strong> {contact.name}
                    </p>
                    <p className="mb-2">
                      <strong>Email:</strong> {contact.email}
                    </p>
                    <p className="mb-2">
                      <strong>Message:</strong> {contact.clientMessage}
                    </p>
                    <p className="">
                      <strong>Sent At:</strong>{" "}
                      {new Date(contact.createdAt).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {/* Delete Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => deleteContact(contact._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600 text-2xl text-center">
              No messages found!
            </p>
          )}
        </div>
      )}
      {/* Pagination */}
      {filteredContacts.length > contactsPerPage && (
        <div className="flex justify-center mt-5 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-red-600 rounded disabled:bg-red-400 md:text-2xl"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 
                 md:text-2xl ${
                   currentPage === index + 1
                     ? "bg-white text-black border border-black"
                     : "bg-gray-300"
                 }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-red-600 rounded disabled:bg-red-400 md:text-2xl"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DisplayMessages;
