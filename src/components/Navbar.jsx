import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartCount = getTotalItems();
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-gray-900 text-center py-2 text-xs md:text-sm">
        <p>🎉 Free shipping on orders over Rs. 5000 | Shop Everything You Need</p>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
            <img src="/logo.png" alt="Virexo" className="w-10 h-10 rounded-full" />
            <span>VIREXO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="hover:text-blue-400 transition">Home</Link>
            <Link to="/shop" className="hover:text-blue-400 transition">Shop</Link>
            <Link to="/categories" className="hover:text-blue-400 transition">Categories</Link>
            <Link to="/shop?filter=new" className="hover:text-blue-400 transition">New Arrivals</Link>
            <Link to="/shop?filter=deals" className="hover:text-blue-400 transition">Deals</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="hover:text-blue-400 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative hover:text-blue-400 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative hover:text-blue-400 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:text-blue-400 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a3 3 0 110 6 3 3 0 010-6zm0 6a7 7 0 11-7 7 7 7 0 017-7z" />
                  </svg>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded shadow-lg">
                    <p className="px-4 py-2 text-sm border-b border-gray-700">{user.name}</p>
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-800 text-sm">
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-gray-800 text-sm text-yellow-400">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-800 text-sm text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden hover:text-blue-400 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4 space-y-3 text-sm">
            <Link to="/" className="block hover:text-blue-400 transition">Home</Link>
            <Link to="/shop" className="block hover:text-blue-400 transition">Shop</Link>
            <Link to="/categories" className="block hover:text-blue-400 transition">Categories</Link>
            <Link to="/" className="block hover:text-blue-400 transition">New Arrivals</Link>
            <Link to="/" className="block hover:text-blue-400 transition">Deals</Link>
          </div>
        )}
      </div>
    </nav>
  );
}