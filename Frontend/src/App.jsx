import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginAdmin from "./components/LoginAdmin";
import Admin from "./components/Admin";
import BlogPost from "./components/BlogPosts";
import CreateBlog from "./AdminComponents/CreateBlog";
import SpecificBlog from "./components/SpecificBlog";
import { setAuthToken, verifyAuth } from "./utils/api"; // ✅ Add verifyAuth import

import Developer from "./components/Developer";
import Contact from "./components/Contact";

import JoinForm from "./components/JoinForm";

import UserLogin from "./components/UserLogin";
import UserDashboard from "./components/UserDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsUserAuthenticated(!!token);
  }, []);

  const handleUserLogin = (token) => {
    localStorage.setItem("userToken", token);
    setIsUserAuthenticated(true);
  };

  const handleUserLogout = () => {
    localStorage.removeItem("userToken");
    setIsUserAuthenticated(false);
  };


    


  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        setAuthToken(token); // Ensure token is stored
        await verifyAuth(); // Check token validity with backend
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth verification failed:", error.message);
        setAuthToken(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
  };



  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<BlogPost />} />
        <Route path="/post/:id" element={<SpecificBlog />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/join" element={<JoinForm />} />

        {/* <Route path="/request-user/login" element={<UserLogin />} /> */}

         <Route
          path="/request-user/login"
          element={
            isUserAuthenticated ? (
              <Navigate to="/request-user/dashboard" />
            ) : (
              <UserLogin onLogin={handleUserLogin} />
            )
          }
        />

        <Route
          path="/request-user/dashboard"
          element={
            isUserAuthenticated ? (
              <UserDashboard onLogout={handleUserLogout} />
            ) : (
              <Navigate to="/request-user/login" />
            )
          }
        />

      

        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <LoginAdmin onLogin={handleLogin} />
            )
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <Admin onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace state={{ from: "/admin" }} />
            )
          }
        />

        {/* Create Blog */}
        <Route
          path="/admin/create-blog"
          element={
            isAuthenticated ? (
              <CreateBlog />
            ) : (
              <Navigate
                to="/login"
                replace
                state={{ from: "/admin/create-blog" }}
              />
            )
          }
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
