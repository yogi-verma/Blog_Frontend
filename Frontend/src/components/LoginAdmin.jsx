import { useState } from "react";
import {
  FiUser,
  FiLock,
  FiLogIn,
  FiLoader,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/api";
import { RiAdminFill } from "react-icons/ri";

const LoginAdmin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setLoginError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.username.trim())
      newErrors.username = "Username is required";
    if (!credentials.password) newErrors.password = "Password is required";
    else if (credentials.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setLoginError("");

    try {
      const response = await login(credentials);
      console.log(response);
      const { accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        // Save both token and sessionId
        localStorage.setItem("token", accessToken);
        localStorage.setItem("sessionId", refreshToken);

        onLogin(response.data.accessToken); // optional: if you're lifting token to parent state
        navigate("/admin");
      }
    } catch (error) {
      setLoginError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900
 p-4"
    >
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-18 h-18 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md mb-4">
              <RiAdminFill className="text-white text-4xl" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome Back, Admin👋
            </h1>
            <p className="text-gray-500 mt-2">
              Log in to access your dashboard
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center border border-red-100">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 text-sm border ${
                    errors.username
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200`}
                  placeholder="admin123"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2.5 text-sm border ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex hover:cursor-pointer justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm ${
                  isLoading ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2 h-4 w-4" />
                    Logging In...
                  </>
                ) : (
                  <>
                    <FiLogIn className="mr-2 h-4 w-4" />
                    Log In
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-500 transform transition-transform duration-200 hover:scale-105"
            >
              Go to Blog Website
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="/request-user/login"
              className="text-green-600 hover:text-green-500 transform transition-transform duration-200 hover:scale-105"
            >
              Member Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
