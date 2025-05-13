// src/components/layout/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const userName = localStorage.getItem("userName") || "User";
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    }
    if (showMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMenu]);

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="w-12 h-12 mt-2 object-contain rounded"
            />
            <Link to="/" className="text-2xl font-bold text-primary tracking-tight font-merriweather">
              Key Accounts Management
            </Link>
          </div>
          {/* Navigation Links */}
          {!isLoginPage && (
            <nav className="hidden md:flex space-x-8 text-sm font-medium font-open-sans">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-150">Accounts</Link>
              <Link to="/projects" className="text-gray-700 hover:text-primary transition-colors duration-150">Projects</Link>
              <Link to="/updates" className="text-gray-700 hover:text-primary transition-colors duration-150">Updates</Link>
            </nav>
          )}
          {/* Right Side: Quick Create, User Name, User Menu */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {!isLoginPage && (
              <div className="relative" ref={menuRef}>
                <button
                  className="p-1.5 sm:p-2 rounded-full text-primary hover:bg-gray-100 transition-colors duration-150"
                  title="Quick Create"
                  onClick={() => setShowMenu((v) => !v)}
                >
                  <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-40 py-2">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => { setShowMenu(false); navigate("/create-account"); }}
                    >
                      + New Account
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => { setShowMenu(false); navigate("/create-project"); }}
                    >
                      + New Project
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => { setShowMenu(false); navigate("/create-update"); }}
                    >
                      + New Update
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* User Name or Login */}
            <span className="hidden sm:inline-block text-gray-700 font-semibold font-open-sans px-2">
              {isLoginPage ? (
                <span className="text-primary font-bold">Login</span>
              ) : (
                userName
              )}
            </span>
            {/* User Menu */}
            {!isLoginPage && (
              <div className="relative group">
                <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-gray-500 cursor-pointer hover:text-primary transition-colors duration-150" />
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20 py-1">
                  <Link
                    to="/profile"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                  >
                    My Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
