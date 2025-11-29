import {
  ClipboardList,
  Home,
  LineChart,
  Menu,
  MessageSquare,
  Users,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", isCollapsed);
  }, [isCollapsed]);

  const menuItems = [
    ["Dashboard", Home, "/admin-dashboard"],
    ["Orders", ClipboardList, "/orders"],
    ["Customers", Users, "/customers"],
    ["Menu", Utensils, "/menu"],
    ["Feedback", MessageSquare, "/feedback"],
    ["Announcements", ClipboardList, "/announcements"],
    ["Analytics", LineChart, "/analytics"],
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-full bg-[#0E2244] text-white flex flex-col justify-between z-50 transition-all duration-500 ease-in-out overflow-hidden"
      style={{ width: isCollapsed ? "80px" : "256px" }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded hover:bg-white/10 transition duration-300"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 64 64"
              className="w-10 h-10 cursor-pointer"
            >
              <path
                fill="#000000"
                d="M30.456 20.765c0 2.024-1.844 4.19-4.235 4.19v34.164c0 4.851-6.61 4.851-6.61 0V24.955c-2.328 0-4.355-1.793-4.355-4.479V1.674c0-1.636 2.364-1.698 2.364.064v13.898h1.98V1.61c0-1.503 2.278-1.599 2.278.064v13.963h2.046V1.63c0-1.572 2.21-1.635 2.21.062v13.945h2.013V1.63c0-1.556 2.309-1.617 2.309.062v19.074zm17.633-14.72v53.059c0 4.743-6.624 4.673-6.624 0V38.051h-3.526V6.045c0-7.451 10.151-7.451 10.151 0z"
              />
            </svg>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto p-4">
          {menuItems.map(([label, Icon, path], i) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={i}
                onClick={() => navigate(path)}
                className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <div className="flex-shrink-0 w-6 flex justify-center">
                  <Icon size={20} color={isActive ? "#FFD700" : "#FFFFFF"} />
                </div>
                {!isCollapsed && (
                  <span className="ml-3 whitespace-nowrap">{label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="text-center text-gray-300 text-sm mt-6 border-t border-white/20 pt-4">
            &copy; {new Date().getFullYear()} Agot's Express. All rights
            reserved.
          </div>
        )}
      </div>
    </aside>
  );
};
