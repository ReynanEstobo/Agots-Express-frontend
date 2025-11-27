import { Bell, LogOut, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate(); // Hook for programmatic navigation

  const toggleAdminMenu = () => setShowAdminMenu(!showAdminMenu);

  const handleNotificationClick = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLogout = () => {
    // Here you can also clear any auth tokens if needed
    alert("Logged out successfully!");
    navigate("/"); // Redirect to login page
  };

  return (
    <header className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
      <div className="flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search orders, customers, menu items..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-4 relative">
        {/* Notification */}
        <button onClick={handleNotificationClick} className="relative">
          <Bell
            size={20}
            className="text-gray-600 hover:text-gray-900 transition"
          />
          {showNotification && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 text-sm text-gray-700 flex items-center gap-3 z-50">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shadow-sm">
                <ShoppingCart size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold">New Order Alert</p>
                <p>Order #1239 has just been placed!</p>
              </div>
            </div>
          )}
        </button>

        {/* Admin Profile */}
        <div className="relative">
          <button
            onClick={toggleAdminMenu}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-1 transition"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">Admin</p>
              <p className="text-gray-500">Manager</p>
            </div>
          </button>

          {showAdminMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 text-sm z-20">
              <button
                onClick={handleLogout} // Use navigate here
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-gray-900 w-full transition"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
