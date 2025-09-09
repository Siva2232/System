import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPlus,
  FaList,
  FaChartBar,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaBed,
  FaSignOutAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const [activeLink, setActiveLink] = useState("/crm/dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logged out");
    alert("Logout successful!");
    navigate("/login");
  };

  const links = [
    {
      path: "/crm/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      gradient: "from-blue-500 to-purple-600",
      count: null,
    },
    {
      path: "/crm/rooms",
      label: "Rooms",
      icon: <FaBed />,
      gradient: "from-green-500 to-teal-600",
      count: null,
    },
    {
      path: "/crm/add-booking",
      label: "New Booking",
      icon: <FaPlus />,
      gradient: "from-orange-500 to-red-600",
      count: null,
    },
    {
      path: "/crm/bill",
      label: "Invoice Bill",
      icon: <FaFileInvoiceDollar />,
      gradient: "from-yellow-500 to-amber-600",
      count: null,
    },
    {
      path: "/crm/bookings",
      label: "Bookings",
      icon: <FaList />,
      gradient: "from-purple-500 to-pink-600",
      count: null,
    },
    {
      path: "/crm/reports",
      label: "Reports",
      icon: <FaChartBar />,
      gradient: "from-cyan-500 to-blue-600",
      count: null,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !e.target.closest(".sidebar-container") &&
        !e.target.closest(".mobile-toggle")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
              H
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Hotel CRM
            </h1>
          </div>
          <button
            className="mobile-toggle p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FaTimes size={20} className="text-white" />
            ) : (
              <FaBars size={20} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity" />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-container fixed md:static top-0 left-0 h-screen w-72 md:w-64
          bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900
          backdrop-blur-xl border-r border-white/10
          flex flex-col justify-between
          transform transition-all duration-500 ease-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          shadow-2xl md:shadow-none overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-transparent scrollbar-thumb-rounded-l-md scrollbar-track-rounded-l-md`}
      >
        {/* Sidebar Title (Desktop Only) */}
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
            H
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Hotel CRM
          </h1>
        </div>

        {/* Top Section */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* User Info */}
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <FaUserCircle className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">John Doe</p>
                <p className="text-gray-300 text-sm">Hotel Manager</p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3 flex-1 pr-2">
            {links.map((link, index) => {
              const isActive = activeLink === link.path;
              return (
                <button
                  key={link.path}
                  className={`group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 text-left w-full
                    ${
                      isActive
                        ? `bg-gradient-to-r ${link.gradient} shadow-xl shadow-purple-500/25 border border-white/20`
                        : "hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:border hover:border-white/10"
                    }`}
                  onClick={() => handleLinkClick(link.path)}
                  onMouseEnter={() => setActiveHover(index)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  <div
                    className={`p-3 rounded-xl transition-all duration-500 flex-shrink-0
                      ${
                        isActive
                          ? "bg-white/25 text-white shadow-lg"
                          : "bg-white/10 text-gray-300 group-hover:bg-white/20 group-hover:text-white"
                      }`}
                  >
                    {link.icon}
                  </div>
                  <div className="flex items-center justify-between flex-1">
                    <span
                      className={`font-medium ${
                        isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {link.label}
                    </span>
                    {link.count && (
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          isActive
                            ? "bg-white/25 text-white"
                            : "bg-white/10 text-gray-300 group-hover:bg-white/20 group-hover:text-white"
                        }`}
                      >
                        {link.count}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Button (Pinned at Bottom) */}
        <div className="p-4">
          <button
            className="group w-full p-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl 
              hover:from-red-700 hover:to-pink-700 transition-all duration-500 hover:scale-[1.02]
              shadow-xl text-white font-medium flex items-center justify-center space-x-3 border border-red-500/20"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
