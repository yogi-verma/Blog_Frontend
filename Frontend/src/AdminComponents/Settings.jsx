import React, { useState} from "react";
import { updatePassword, deleteAccount } from "../utils/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import SessionManager from "./SessionManager";


const Settings = () => {
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);


  const [form, setForm] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePassword(form.username, form.oldPassword, form.newPassword);
      toast.success("Password has been updated successfully");

      setTimeout(() => {
        setShowPasswordModal(false);
        setForm({ username: "", oldPassword: "", newPassword: "" });
      }, 3000);
    } catch (err) {
      toast.error(err.message || "Password update failed");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.message || "Failed to delete account");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h3 className="text-lg font-medium text-gray-900 mb-6">Settings</h3>

      {/* Security Settings */}
      <div className="space-y-8">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Security</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Change Password
              </p>
              <button
                className="text-sm text-blue-600 hover:text-blue-500 hover:cursor-pointer"
                onClick={() => setShowPasswordModal(true)}
              >
                Update password
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Want to delete your account?
              </p>
              <button
                className="text-sm text-red-600 hover:text-red-500 hover:cursor-pointer"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>
          </div>


          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Session Management
              </p>

              <SessionManager />
            </div>
          </div>

          {/* Modal shown only when triggered */}
        </div>
      </div>

      {/* Update Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in border border-gray-200">
            {/* Close button */}
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Header Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c1.1 0 2 .9 2 2v1h-4v-1c0-1.1.9-2 2-2zM17 8v4h1a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h1V8a5 5 0 0110 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Update Your Password
            </h3>

            {/* Subtext */}
            <p className="text-sm text-center text-gray-600 mb-6">
              Make sure your new password is strong and easy to remember.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    placeholder="Enter old password"
                    value={form.oldPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showOldPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in border border-gray-200">
            {/* Close button */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1 8h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              Confirm Account Deletion
            </h3>

            {/* Subtext */}
            <p className="text-sm text-center text-gray-600 mb-6">
              Are you absolutely sure you want to delete your{" "}
              <strong>Admin Account</strong>? <br />
              This action{" "}
              <span className="text-red-600 font-semibold">
                cannot be undone
              </span>
              .
            </p>

            {/* Action buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
