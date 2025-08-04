import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboard } from '../utils/userApi';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const storedUser = localStorage.getItem('userInfo');

    if (!token || !storedUser) {
      navigate('/request-user/login');
      return;
    }

    setUser(JSON.parse(storedUser));

    const loadDashboard = async () => {
      try {
        const data = await fetchDashboard(token);
        setDashboardData(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    navigate('/request-user/login');
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {user?.username || 'User'}
          </h2>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        <div className="text-gray-700 space-y-2">
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Token (partial):</strong> {localStorage.getItem('userToken')?.slice(0, 20)}...</p>

          {/* You can show more from dashboardData here */}
          {dashboardData && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <p><strong>Dashboard Info:</strong></p>
              <pre className="text-sm mt-2 text-gray-600">{JSON.stringify(dashboardData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
