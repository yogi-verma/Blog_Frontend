import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../utils/api";
import Sidebar from "../AdminComponents/Sidebar";
import Dashboard from "../AdminComponents/Dashboard";
import Insights from "../AdminComponents/Insignts";
import Users from "../AdminComponents/Users";
import Settings from "../AdminComponents/Settings";
import { Link } from "react-router-dom";
import Comments from "../AdminComponents/Comments";


const Admin = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        
        setUser(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard");
        
        onLogout();
        navigate("/login");
      }
    };

    fetchDashboard();
  }, [navigate, onLogout]);


  const renderContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return <Dashboard user={user} />;
      case "Insights":
        return <Insights />;
      case "Users":
        return <Users />;
      case "Settings":
        return <Settings />;
      case "Comments":
        return <Comments />;  
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        comments = {Comments}
        user={user}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="flex-1 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 ml-4 lg:ml-0">
                  {activeItem}
                </h2>
                <div className="flex items-center">
                  <Link
                    to="/"
                    className="group relative inline-flex items-center justify-center w-full px-6 py-2.5 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                  >
                    <svg
                      className="w-5 h-5 mr-1 transition-transform duration-300 group-hover:-translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12h18M3 12l7-7M3 12l7 7"
                      />
                    </svg>
                    <span className="mx-1 tracking-wide">
                      Visit Website
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
