import { useEffect, useState } from "react";
import { getAllUsers } from "../utils/userRequestApi";
import { CheckCircle, XCircle, MoreVertical, X, Mail, BookOpen } from "lucide-react";
import { FaSpinner } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchUniqueUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        
        if (Array.isArray(response)) {
          // Remove duplicate emails
          const uniqueByEmail = [];
          const seenEmails = new Set();

          for (const user of response) {
            if (!seenEmails.has(user.email)) {
              uniqueByEmail.push(user);
              seenEmails.add(user.email);
            }
          }

          setUsers(uniqueByEmail);
          setFilteredUsers(uniqueByEmail);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniqueUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const toggleDropdown = (userId) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  const handleReadReason = (user) => {
    setSelectedUser(user);
    setShowReasonModal(true);
    setDropdownOpen(null);
  };

  const handleSendMessage = (email) => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
    setDropdownOpen(null);
  };

  const closeReasonModal = () => {
    setShowReasonModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-500 text-2xl" />
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[calc(100vh-200px)]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600">
                            {user.fullName?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Member
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isVerified ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <button
                        onClick={() => toggleDropdown(user._id || index)}
                        className="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                      >
                        <MoreVertical size={20} />
                      </button>
                       {dropdownOpen === (user._id || index) && (
                      <div className="absolute right-6 z-20 mt-1 w-48 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-gray-200 focus:outline-none overflow-hidden">
                        <div className="py-1">
                          <button
                            onClick={() => handleReadReason(user)}
                            className="flex items-center hover:cursor-pointer px-4 py-3 text-sm text-gray-700 hover:bg-green-50 w-full text-left transition-colors group"
                          >
                            <BookOpen className="mr-3 h-5 w-5 text-green-600 group-hover:text-green-700" />
                            <span className="text-green-700 font-medium">Read Reason</span>
                          </button>
                          <button
                            onClick={() => handleSendMessage(user.email)}
                            className="flex items-center px-4 hover:cursor-pointer py-3 text-sm text-gray-700 hover:bg-blue-50 w-full text-left transition-colors group"
                          >
                            <Mail className="mr-3 h-5 w-5 text-blue-600 group-hover:text-blue-700" />
                            <span className="text-blue-700 font-medium">Send Message</span>
                          </button>
                        </div>
                      </div>
                    )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Reason Modal */}
      {showReasonModal && selectedUser && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fadeIn">
    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl max-w-md w-full p-6 relative transform transition-all duration-300 animate-scaleIn">
      <button
        onClick={closeReasonModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        <X size={24} className="hover:scale-110 hover:cursor-pointer transition-transform" />
      </button>
      
      <div className="flex items-start space-x-3">
        <div className="bg-blue-100 p-3 rounded-full">
          <span className="text-2xl">📝</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {selectedUser.fullName || "User"}'s Story ✨
          </h3>
          <p className="text-sm text-gray-500">Why they wanted to join</p>
        </div>
      </div>
      
      <div className="mt-5 bg-gradient-to-br from-blue-50 to-gray-50 p-5 rounded-lg border border-gray-200/70">
        <div className="min-h-[100px] flex items-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            {selectedUser.reason ? (
              <>
                <span className="text-2xl mr-2">💭</span>
                {selectedUser.reason}
              </>
            ) : (
              <span className="text-gray-400 italic">No reason provided 🤷‍♂️</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={closeReasonModal}
          className="px-5 py-2.5 bg-gradient-to-r hover:cursor-pointer from-blue-500 to-blue-600 text-white hover:scale-105 transition-transform rounded-lg font-medium hover:shadow-md duration-200 flex items-center"
        >
          Got it! <span className="ml-1">👍</span>
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Users;