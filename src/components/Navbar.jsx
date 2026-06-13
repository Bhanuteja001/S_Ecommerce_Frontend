import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, User, LogOut, Shield, Search, Menu, X } from 'lucide-react';
import { logout } from '../slices/authSlice';
import { logoutCart } from '../slices/cartSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(logoutCart());
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-lg border-b border-caramel-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-caramel-gold via-cream-light to-caramel-gold bg-clip-text text-transparent uppercase font-sans">
                ChocoLuxe
              </span>
              <span className="hidden sm:inline-block text-[10px] text-caramel-gold/60 uppercase tracking-widest border border-caramel-gold/30 px-1.5 py-0.5 rounded">
                Maison
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative w-72 lg:w-96"
          >
            <input
              type="text"
              placeholder="Search artisanal chocolates..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-chocolate-darker/60 border border-caramel-gold/20 rounded-full py-2 pl-4 pr-10 text-xs text-cream-light focus:outline-none focus:border-caramel-gold focus:ring-1 focus:ring-caramel-gold placeholder-cream-medium/40 transition-all"
            />
            <button type="submit" className="absolute right-3 text-cream-medium/60 hover:text-caramel-gold">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-caramel-gold transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-sm font-medium hover:text-caramel-gold transition-colors">
              Shop Chocolates
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="relative p-2 text-cream-medium hover:text-caramel-gold transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-caramel-gold text-chocolate-darker text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-chocolate-dark">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Profile / Admin Menu */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-caramel-gold focus:outline-none transition-colors"
                >
                  <User className="w-4 h-4 text-caramel-gold" />
                  <span className="truncate max-w-[120px]">{userInfo.name}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 rounded-xl shadow-xl glass-panel-heavy border border-caramel-gold/20 p-1.5 animate-fade-in text-sm text-cream-medium">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-caramel-gold/10 hover:text-caramel-gold transition-all"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>

                    <hr className="my-1.5 border-caramel-gold/10" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-left hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-chocolate-darker bg-caramel-gold hover:bg-caramel-hover px-5 py-2.5 rounded-full transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-cream-medium hover:text-caramel-gold transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-caramel-gold text-chocolate-darker text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-chocolate-dark">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-cream-medium hover:text-caramel-gold focus:outline-none transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-panel-heavy border-t border-caramel-gold/15 p-4 animate-fade-in text-sm">
          {/* Search in Mobile */}
          <form onSubmit={handleSearchSubmit} className="mb-4 relative">
            <input
              type="text"
              placeholder="Search chocolates..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-chocolate-darker/60 border border-caramel-gold/20 rounded-full py-2.5 pl-4 pr-10 text-xs text-cream-light focus:outline-none focus:border-caramel-gold focus:ring-1 focus:ring-caramel-gold placeholder-cream-medium/40 transition-all"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-cream-medium/60 hover:text-caramel-gold">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 rounded-lg hover:bg-caramel-gold/10 hover:text-caramel-gold transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 rounded-lg hover:bg-caramel-gold/10 hover:text-caramel-gold transition-colors"
            >
              Shop Chocolates
            </Link>

            <hr className="border-caramel-gold/10 my-1" />

            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg hover:bg-caramel-gold/10 hover:text-caramel-gold transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-caramel-gold" />
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center font-bold uppercase text-chocolate-darker bg-caramel-gold hover:bg-caramel-hover py-3 rounded-xl transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
