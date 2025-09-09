import React, { useState, useEffect } from "react";
import { FaSearch, FaBell, FaUserCircle, FaMicrophone, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);
  const [isListening, setIsListening] = useState(false);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setSearchValue("Voice search result...");
        setIsListening(false);
      }, 2000);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearchFocused(false);
  };

  const handleSignOut = () => {
    // clear auth tokens or user data
    localStorage.removeItem("user"); 
    // navigate to login page
    navigate("/login");
  };

  return (
    <div className="h-20 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl flex items-center justify-between px-8 relative overflow-visible">
      {/* Logo + Search */}
      <div className="flex items-center gap-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-all duration-300 shadow-lg">
            <span className="text-white font-bold text-lg"></span>
          </div>
          <span className="text-white font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Hotel CRM
          </span>
        </div>
        {/* Search Bar */}
        {/* <div className={`relative transition-all duration-500 ${searchFocused ? "w-96" : "w-80"}`}>
          <div
            className={`relative bg-white/10 backdrop-blur-xl rounded-2xl border transition-all duration-300 ${
              searchFocused
                ? "border-pink-400 shadow-lg shadow-pink-500/20 bg-white/20"
                : "border-white/20 hover:border-white/40"
            }`}
          >
            <input
              type="text"
              placeholder="Search anything..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full bg-transparent text-white placeholder-gray-300 px-6 py-4 pl-14 pr-20 focus:outline-none rounded-2xl"
            />

            <FaSearch
              className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                searchFocused ? "text-pink-400 scale-110" : "text-gray-300"
              }`}
            />

            <button
              onClick={handleVoiceSearch}
              className={`absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-gray-300 hover:text-pink-400 hover:bg-white/10"
              }`}
            >
              <FaMicrophone />
            </button>

            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-400 transition-colors"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div> */}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 z-10">
        {/* Clock */}
        <div className="text-white/80 text-sm font-mono bg-white/10 px-4 py-2 rounded-lg backdrop-blur">
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>

        {/* Notifications */}
        <div className="relative group">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-110">
            <FaBell className="text-white text-xl" />
            {notificationCount > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                {notificationCount}
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="relative group">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/10 backdrop-blur hover:bg-white/20 transition-all duration-300 cursor-pointer">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                JD
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="text-white">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-300">Admin</p>
            </div>
          </div>

          <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  JD
                </div>
                <div>
                  <p className="font-semibold text-gray-800">John Doe</p>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
              </div>
              <div className="space-y-2">
                {/* <div className="px-4 py-2 hover:bg-purple-50 rounded-lg cursor-pointer text-gray-700">Profile</div>
                <div className="px-4 py-2 hover:bg-purple-50 rounded-lg cursor-pointer text-gray-700">Settings</div>
                <div className="px-4 py-2 hover:bg-purple-50 rounded-lg cursor-pointer text-gray-700">Help</div> */}
                <div
                  onClick={handleSignOut}
                  className="px-4 py-2 hover:bg-red-50 rounded-lg cursor-pointer text-red-600 font-semibold"
                >
                  Sign Out
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-60">
        <div className="h-full w-1/3 bg-white/50 animate-pulse rounded-full transform -translate-x-full animate-[slide_3s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

export default Topbar;
