import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    // Check login status
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);

    // Get user data if logged in
    if (loginStatus) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserData(user);
    }
  }, []);

  useEffect(() => {
    // Close profile dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsProfileOpen(false); // Close the profile dropdown
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setShowLogoutModal(false);
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-4 md:px-8 py-4 w-full z-50 bg-black/20 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">MatchMate</span>
            <span className="text-secondary ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#f8b400">
                <path d="M12,4.36c0,0-7.92-3.3-9.92,2.7C0.8,10.18,2.16,17,12,21c9.84-4,11.2-10.82,9.92-13.94C19.92,1.06,12,4.36,12,4.36z M13.8,13.8c-1.06,1.06-2.56,1.56-4.23,1.44c-1.63-0.13-3.17-0.95-4.33-2.31C3.17,10.6,3.96,7.17,6.75,6.17c1.22-0.44,2.57-0.25,3.55,0.5c0.97-0.74,2.33-0.93,3.55-0.5c2.78,1,3.58,4.42,1.76,6.77C14.5,13.97,13.91,13.91,13.8,13.8z"/>
              </svg>
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {isLoggedIn && (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900">{userData?.email}</p>
                  </div>
                  <Link
                    to="/view-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/matches"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Your Matches
                  </Link>
                  <Link
                    to="/create-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between flex-grow ml-10">
          <div className="flex space-x-10">
            <Link 
              to="/" 
              className={`text-white hover:text-secondary transition-colors duration-300 ${
                isActive('/') ? 'text-secondary font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-white hover:text-secondary transition-colors duration-300 ${
                isActive('/about') ? 'text-secondary font-semibold' : ''
              }`}
            >
              About Us
            </Link>
            <Link 
              to="/help" 
              className={`text-white hover:text-secondary transition-colors duration-300 ${
                isActive('/help') ? 'text-secondary font-semibold' : ''
              }`}
            >
              Help
            </Link>
            {isLoggedIn && (
              <Link 
                to="/matches" 
                className={`text-white hover:text-secondary transition-colors duration-300 ${
                  isActive('/matches') ? 'text-secondary font-semibold' : ''
                }`}
              >
                Matches
              </Link>
            )}
            {isLoggedIn && (
              <Link 
                to="/messages" 
                className={`text-white hover:text-secondary transition-colors duration-300 ${
                  isActive('/messages') ? 'text-secondary font-semibold' : ''
                }`}
              >
                Messages
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="text-white">
                  Welcome, {userData?.first_name || 'User'}!
                </div>
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-white hover:text-primary transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900">{userData?.email}</p>
                      </div>
                      <Link
                        to="/view-profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        View Profile
                      </Link>
                      <Link
                        to="/matches"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Your Matches
                      </Link>
                      <Link
                        to="/create-profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`bg-white text-primary px-4 py-2 rounded-lg hover:bg-secondary hover:text-white transition-colors duration-300 ${
                    isActive('/login') ? 'bg-secondary text-white' : ''
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`bg-secondary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors duration-300 ${
                    isActive('/signup') ? 'bg-white text-primary' : ''
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md transition-all duration-300 ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="flex flex-col p-4 space-y-4">
            <Link 
              to="/" 
              className={`text-white hover:text-secondary transition-colors duration-300 ${
                isActive('/') ? 'text-secondary font-semibold' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-white hover:text-secondary transition-colors duration-300 ${
                isActive('/about') ? 'text-secondary font-semibold' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/help" 
              className={`text-white hover:text-secondary transition-colors duration-300 ${
                isActive('/help') ? 'text-secondary font-semibold' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Help
            </Link>
            {isLoggedIn && (
              <Link 
                to="/matches" 
                className={`text-white hover:text-secondary transition-colors duration-300 ${
                  isActive('/matches') ? 'text-secondary font-semibold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Matches
              </Link>
            )}
            {isLoggedIn && (
              <Link 
                to="/messages" 
                className={`text-white hover:text-secondary transition-colors duration-300 ${
                  isActive('/messages') ? 'text-secondary font-semibold' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Messages
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <div className="text-white py-2 border-t border-white/10">
                  Welcome, {userData?.first_name || 'User'}!
                </div>
                <Link
                  to="/view-profile"
                  className="text-white hover:text-secondary transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View Profile
                </Link>
                <Link
                  to="/matches"
                  className="text-white hover:text-secondary transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Matches
                </Link>
                <Link
                  to="/create-profile"
                  className="text-white hover:text-secondary transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="text-red-400 hover:text-red-300 transition-colors duration-300 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-white/10 pt-4">
                  <Link 
                    to="/login" 
                    className={`block w-full text-center bg-white text-primary px-4 py-2 rounded-lg hover:bg-secondary hover:text-white transition-colors duration-300 ${
                      isActive('/login') ? 'bg-secondary text-white' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
                <Link 
                  to="/signup" 
                  className={`block w-full text-center bg-secondary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors duration-300 ${
                    isActive('/signup') ? 'bg-white text-primary' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
            {/* Close button */}
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirm Logout
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to log out? You'll need to log in again to access your account.
              </p>

              {/* Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 