import React, { useEffect, useState } from "react";
import {
  getSessions,
  logoutSession,
  logoutAllSessions,
} from "../utils/sessionApi";
import {
  MapPin,
  Monitor,
  Smartphone,
  Clock,
  ShieldCheck,
  MoreVertical,
  Loader2,
  Check,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SessionManager = () => {
  const [token, setToken] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loggingOutSessions, setLoggingOutSessions] = useState([]);
  const [loggedOutSessions, setLoggedOutSessions] = useState([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) loadSessions(storedToken);
  }, []);

  const loadSessions = async (storedToken) => {
    try {
      setLoading(true);
      const data = await getSessions(storedToken);
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutSession = async (refreshToken) => {
    setLoggingOutSessions((prev) => [...prev, refreshToken]);
    try {
      await logoutSession(refreshToken, token);
      setLoggedOutSessions((prev) => [...prev, refreshToken]);
      setTimeout(() => {
        setSessions((prev) =>
          prev.filter((session) => session.refreshToken !== refreshToken)
        );
      }, 1000); // slight delay to show check icon
    } catch (error) {
      console.error("Error logging out session:", error);
    } finally {
      setLoggingOutSessions((prev) =>
        prev.filter((token) => token !== refreshToken)
      );
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllSessions(token);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out all sessions:", error);
    }
  };

  const handleLogoutCurrent = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getDeviceType = (userAgent) =>
    /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent) ? "mobile" : "desktop";

  const currentRefreshToken = localStorage.getItem("refreshToken");

  return (
    <div className="p-6">
      
      
      <p className="text-sm text-gray-500 mb-3">
        Total Active Sessions: {sessions.length}
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">🚫 No active sessions found.</p>
          <p className="text-sm text-gray-500 mt-2">
            You're currently logged in from one device.
          </p>
        </div>
      ) : (
        <>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-1">
            {sessions.map((session, index) => {
              const isCurrent = session.refreshToken === currentRefreshToken;
              const deviceType = getDeviceType(session.userAgent);
              const isLoggingOut = loggingOutSessions.includes(session.refreshToken);
              const isLoggedOut = loggedOutSessions.includes(session.refreshToken);

              return (
                <div
                  key={index}
                  className={`relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all`}
                >
                  {isCurrent && (
                    <div className="absolute top-3 left-3 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} /> Current session
                    </div>
                  )}

                  {!isCurrent && (
                    <div className="absolute top-3 right-3">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuIndex(
                              activeMenuIndex === index ? null : index
                            )
                          }
                          className="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenuIndex === index && (
                          <div className="absolute right-0 mt-2 bg-blue-600 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() =>
                                !isLoggingOut && handleLogoutSession(session.refreshToken)
                              }
                              className="w-[149px] hover:cursor-pointer text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-blue-700 hover:rounded-lg"
                            >
                              {isLoggingOut ? (
                                <Loader2 className="animate-spin h-4 w-4 text-red-500" />
                              ) : isLoggedOut ? (
                                <Check className="text-green-600 h-4 w-4" />
                              ) : (
                                <LogOut className="h-4 w-4 text-gray-300" />
                              )}
                              Logout session
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-gray-700 rounded-lg">
                      {deviceType === "mobile" ? (
                        <Smartphone className="text-blue-500" size={20} />
                      ) : (
                        <Monitor className="text-blue-500" size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {deviceType === "mobile" ? "Mobile" : "Desktop"} Device
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.userAgent.split(" ")[0]}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-gray-500 mt-0.5" size={16} />
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          Location
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {session.location || "Unknown"} ({session.ip})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="text-gray-500 mt-0.5" size={16} />
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          Last Activity
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {new Date(session.lastUsed).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            {sessions.length > 1 && (
              <button
                onClick={handleLogoutAll}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition"
              >
                <LogOut size={18} />
                Logout All Sessions
              </button>
            )}
            <button
              onClick={handleLogoutCurrent}
              className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium px-6 py-3 rounded-lg shadow"
            >
              <LogOut size={18} />
              Logout Current Session
            </button>
          </div>
        </>
      )}

      

    </div>
  );
};

export default SessionManager;
