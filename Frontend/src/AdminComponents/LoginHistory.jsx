
const getDeviceType = (userAgent) => {
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet/i.test(userAgent)) return "Tablet";
  if (/Macintosh|Windows/i.test(userAgent)) return "Desktop";
  return "Unknown";
};

const LoginHistory = ({ sessions = [] }) => {
  if (!sessions.length) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Recent Login History
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No login history available.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Recent Login History
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 border rounded-lg shadow">
          <thead>
            <tr className="text-left border-b dark:border-gray-700">
              <th className="p-3 text-sm text-gray-600 dark:text-gray-300">
                Date & Time
              </th>
              <th className="p-3 text-sm text-gray-600 dark:text-gray-300">
                IP Address
              </th>
              <th className="p-3 text-sm text-gray-600 dark:text-gray-300">
                Device
              </th>
              <th className="p-3 text-sm text-gray-600 dark:text-gray-300">
                Browser
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.slice(0, 5).map((session, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="p-3 text-sm text-gray-800 dark:text-gray-200">
                  {new Date(session.lastUsed).toLocaleString()}
                </td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-200">
                  {session.ip}
                </td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-200">
                  {getDeviceType(session.userAgent)}
                </td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-200">
                  {session.userAgent.split(") ")[0].replace("(", "")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginHistory;
