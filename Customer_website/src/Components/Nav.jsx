import React, { useState, useEffect, useRef } from "react";
import { 
  FaShoppingCart, 
  FaSearch, 
  FaBars, 
  FaUser, 
  FaBox, 
  FaMapMarkerAlt, 
  FaSignOutAlt, 
  FaUserCircle,
  FaTimes 
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/feauters/authSlice";
import logo from '../Utiles/logo2.png';
import { useGetCartLengthQuery } from "../redux/services/cartSlice";

const Nav = () => {
  // State
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // New: For mobile search overlay
  const [searchTerm, setSearchTerm] = useState("");
  
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null); // Ref for closing sidebar on outside click
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Cart Data
  const { data: cartLengthData } = useGetCartLengthQuery(undefined, {
    skip: !user, 
  });
  const cartCount = cartLengthData?.length || 0;

  // --- HANDLERS ---

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/account');
    setDropdownVisible(false);
  };

  const handleSearch = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && searchTerm.trim() !== "") {
      e.preventDefault();
      navigate(`/products?search=${searchTerm.trim()}`);
      setIsSearchOpen(false); // Close mobile search after submit
      setSearchTerm("");
    }
  };

  const closeMenus = () => {
    setSidebarVisible(false);
    setDropdownVisible(false);
  };

  // --- EFFECTS ---

  // 1. Handle Window Resize
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 1000);
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // 2. Handle Click Outside (Profile & Sidebar)
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close Profile Dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
      // Close Mobile Sidebar
      if (sidebarVisible && sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest('.hamburger-btn')) {
        setSidebarVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarVisible]);

  return (
    <>
      <nav className="relative flex items-center justify-between bg-white py-4 px-6 border-b border-gray-200 sticky top-0 z-50 h-20">
        
        {/* ==============================
            A. MOBILE SEARCH OVERLAY (Full Width)
        ============================== */}
        {isMobile && isSearchOpen ? (
          <div className="absolute inset-0 bg-white z-50 flex items-center px-4 animate-fade-in">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                placeholder="Search products..."
                className="w-full pl-4 pr-10 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              <FaSearch 
                className="absolute top-3 right-3 text-gray-500 cursor-pointer" 
                onClick={handleSearch}
              />
            </div>
            <button 
              onClick={() => setIsSearchOpen(false)} 
              className="ml-4 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={24} />
            </button>
          </div>
        ) : (
          
        /* ==============================
            B. STANDARD NAVBAR CONTENT
        ============================== */
          <>
            {/* --- LEFT SECTION --- */}
            <div className="flex items-center">
              {/* Mobile: Hamburger */}
              {isMobile && (
                <button 
                  onClick={() => setSidebarVisible(true)} 
                  className="text-2xl mr-4 hamburger-btn focus:outline-none"
                >
                  <FaBars />
                </button>
              )}

              {/* Desktop: Logo (Hidden on Mobile as per request "no company name" for sm) */}
              {!isMobile && (
                <Link to="/" className="flex items-center space-x-2 text-2xl font-bold" style={{ color: '#5A67BA' }}>
                  <img src={logo} alt="StarFashion Logo" className="h-8 w-auto" />
                  <span>StarFashion</span>
                </Link>
              )}
            </div>

            {/* --- CENTER SECTION: Desktop Links --- */}
            {!isMobile && (
              <div className="flex space-x-8 font-medium text-gray-700">
                <Link to="/" className="hover:text-[#5A67BA] transition">Home</Link>
                <Link to="/products" className="hover:text-[#5A67BA] transition">Products</Link>
                <Link to="/contact" className="hover:text-[#5A67BA] transition">Contact Us</Link>
              </div>
            )}

            {/* --- RIGHT SECTION: Icons --- */}
            <div className="flex items-center space-x-5 md:space-x-6">
              
              {/* 1. SEARCH */}
              {!isMobile ? (
                // Desktop Search (Inline)
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-64 lg:w-96 pl-9 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                  />
                  <FaSearch className="absolute top-3 left-3 text-[#5D5FEF]" />
                </div>
              ) : (
                // Mobile Search (Icon Click)
                <button onClick={() => setIsSearchOpen(true)} className="text-gray-700">
                  <FaSearch size={22} />
                </button>
              )}

              {/* 2. CART */}
              <Link to="/cart" className="relative text-gray-700 hover:text-black">
                <FaShoppingCart size={22} />
                {user && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* 3. PROFILE */}
              {user ? (
                <div 
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={() => !isMobile && setDropdownVisible(true)}
                  onMouseLeave={() => !isMobile && setDropdownVisible(false)}
                >
                  <button 
                    onClick={() => setDropdownVisible(!isDropdownVisible)}
                    className="flex items-center focus:outline-none"
                  >
                    <FaUserCircle className="text-gray-700 hover:text-[#5A67BA] transition" size={isMobile ? 24 : 30} />
                  </button>

                  {isDropdownVisible && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border border-gray-100 animate-fade-in-down">
                      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                        <p className="font-semibold truncate text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link to="/profilepage" onClick={() => setDropdownVisible(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaUser className="mr-3 text-gray-400" /> Profile
                        </Link>
                        <Link to="/orders" onClick={() => setDropdownVisible(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaBox className="mr-3 text-gray-400" /> Orders
                        </Link>
                        <Link to="/profilepage/address" onClick={() => setDropdownVisible(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaMapMarkerAlt className="mr-3 text-gray-400" /> Saved Address
                        </Link>
                      </div>
                      <div className="border-t py-1">
                        <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
                          <FaSignOutAlt className="mr-3" /> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/account"
                  className="text-sm font-semibold bg-[#5A67BA] text-white px-4 py-2 rounded-full hover:bg-[#48529e] transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </>
        )}
      </nav>

      {/* ==============================
          MOBILE SIDEBAR DRAWER (Left)
      ============================== */}
      {isMobile && sidebarVisible && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarVisible(false)} />
          
          {/* Drawer Content */}
          <div ref={sidebarRef} className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="p-4 flex justify-between items-center border-b">
              <span className="font-bold text-xl text-[#5A67BA]">Menu</span>
              <button onClick={() => setSidebarVisible(false)} className="text-gray-500">
                <FaTimes size={24} />
              </button>
            </div>
            <div className="flex flex-col p-4 space-y-4">
              <Link to="/" onClick={closeMenus} className="text-lg font-medium text-gray-800 hover:text-[#5A67BA]">Home</Link>
              <Link to="/products" onClick={closeMenus} className="text-lg font-medium text-gray-800 hover:text-[#5A67BA]">Products</Link>
              <Link to="/contact" onClick={closeMenus} className="text-lg font-medium text-gray-800 hover:text-[#5A67BA]">Contact Us</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Nav;