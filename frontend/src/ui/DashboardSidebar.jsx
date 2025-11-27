// DashboardSidebar.jsx
import {
  Calendar,
  ClipboardList,
  Home,
  LineChart,
  Menu,
  MessageSquare,
  Users,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    ["Dashboard", Home, "/admin-dashboard"],
    ["Orders", ClipboardList, "/admin-dashboard"],
    ["Customers", Users, "/admin-dashboard"],
    ["Reservations", Calendar, "/admin-dashboard"],
    ["Menu", Utensils, "/admin-dashboard"],
    ["Feedback", MessageSquare, "/admin-dashboard"],
    ["Announcements", ClipboardList, "/admin-dashboard"],
    ["Analytics", LineChart, "/admin-dashboard"],
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#0E2244] text-white flex flex-col justify-between transition-all duration-500 ease-in-out`}
      style={{ width: isCollapsed ? "80px" : "256px" }}
    >
      {/* Top Section */}
      <div className="flex flex-col p-4">
        {/* Collapse/Expand Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded hover:bg-white/10 transition duration-300 ease-in-out"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 rounded-full p-2 transition-all duration-500 ease-in-out">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 64 64"
              className="w-10 h-10 cursor-pointer transition-all duration-500 ease-in-out hover:animate-pulse"
            >
              <path
                fill="#000000"
                d="M30.456 20.765c0 2.024-1.844 4.19-4.235 4.19v34.164c0 4.851-6.61 4.851-6.61 0V24.955c-2.328 0-4.355-1.793-4.355-4.479V1.674c0-1.636 2.364-1.698 2.364.064v13.898h1.98V1.61c0-1.503 2.278-1.599 2.278.064v13.963h2.046V1.63c0-1.572 2.21-1.635 2.21.062v13.945h2.013V1.63c0-1.556 2.309-1.617 2.309.062v19.074zm17.633-14.72v53.059c0 4.743-6.624 4.673-6.624 0V38.051h-3.526V6.045c0-7.451 10.151-7.451 10.151 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2
          className={`text-2xl font-semibold text-center mb-6 overflow-hidden transition-opacity duration-500 ease-in-out ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          Agot's Admin
        </h2>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2">
          {menuItems.map(([label, Icon, path], i) => (
            <button
              key={i}
              onClick={() => {
                setActive(label);
                navigate(path);
              }}
              className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-500 ease-in-out ${
                active === label ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              {/* Icon container stays fixed */}
              <div className="flex-shrink-0 w-6 flex justify-center">
                <Icon size={20} />
              </div>

              {/* Label */}
              <span
                className={`ml-3 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap ${
                  isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-full"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div
        className={`text-center text-gray-300 text-sm mt-6 border-t border-white/20 pt-4 transition-all duration-500 ease-in-out overflow-hidden ${
          isCollapsed ? "opacity-0 max-h-0" : "opacity-100 max-h-20"
        }`}
      >
        &copy; {new Date().getFullYear()} Agot's Express. All rights reserved.
      </div>
    </aside>
  );
};
