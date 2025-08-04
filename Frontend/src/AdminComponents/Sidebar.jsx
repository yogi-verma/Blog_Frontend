import {
  FiHome,
  FiUsers,
  FiSettings,
  FiPieChart,
  FiLogOut,
  FiX,
  FiChevronRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { TfiComments } from "react-icons/tfi";


const Sidebar = ({
  user,
  activeItem,
  setActiveItem,
  sidebarOpen,
  setSidebarOpen,
  onLogout
}) => {
  const navItems = [
    { name: 'Dashboard', icon: FiHome },
    { name: 'Insights', icon: FiPieChart },
    { name: 'Users', icon: FiUsers },
    {name: 'Comments', icon: TfiComments},
    { name: 'Settings', icon: FiSettings }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 z-50 w-64 bg-white shadow-md transition duration-200 ease-in-out flex flex-col`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 my-1.5">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>

          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveItem(item.name);
                  setSidebarOpen(false);
                }}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md w-full ${
                  activeItem === item.name
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`flex-shrink-0 h-5 w-5 ${
                    activeItem === item.name ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                <span className="ml-3">{item.name}</span>
                {activeItem === item.name && (
                  <FiChevronRight className="ml-auto h-4 w-4 text-blue-500" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <FiLogOut className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            <span className="ml-3">Logout</span>
          </button>

          
        </div>
      </div>
    </>
  );
};

export default Sidebar;