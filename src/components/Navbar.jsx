import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import {
  Menu,
  X,
  Home,
  BookOpen,
  User,
  LogOut,
  PlusCircle,
  Bookmark,
  Shield,
  AlertCircle,
  ChefHat,
  Info,
  Phone,
  Settings
} from "lucide-react";

export default function Navbar({ user1, setUser }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleProtectedClick = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
      setIsMobileMenuOpen(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false); // ✅ FIXED
  };

  return (
    <>
      <nav className="w-full bg-white shadow-sm border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">
                Cook<span className="text-orange-600">Book</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-6">
            {/* Public Links */}
            {!user && (
              <>
                <NavLink to="/" icon={<Home className="h-4 w-4" />}>
                  Home
                </NavLink>
                <NavLink to="/recipe" icon={<BookOpen className="h-4 w-4" />}>
                  All Recipes
                </NavLink>
                <NavLink to="/about" icon={<Info className="h-4 w-4" />}>
                  About
                </NavLink>
                <NavLink to="/contact" icon={<Phone className="h-4 w-4" />}>
                  Contact
                </NavLink>
              </>
            )}

            {/* User Links */}
            {user && user.role === "user" && (
              <>
                <NavLink to="/" icon={<Home className="h-4 w-4" />}>
                  Home
                </NavLink>
                <NavLink to="/recipe" icon={<BookOpen className="h-4 w-4" />}>
                  All Recipes
                </NavLink>
                <NavLink to="/my-recipes" icon={<BookOpen className="h-4 w-4" />}>
                  My Recipes
                </NavLink>
                <NavLink to="/saved-recipes" icon={<Bookmark className="h-4 w-4" />}>
                  Saved
                </NavLink>
                <NavLink to="/about" icon={<Info className="h-4 w-4" />}>
                  About
                </NavLink>
                <NavLink to="/contact" icon={<Phone className="h-4 w-4" />}>
                  Contact
                </NavLink>
              </>
            )}

            {/* Admin Links */}
            {user && user.role === "admin" && (
              <>
                <NavLink to="/admin" icon={<Shield className="h-4 w-4" />}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/pending" icon={<AlertCircle className="h-4 w-4" />}>
                  Pending
                </NavLink>
                <NavLink to="/admin/recipes" icon={<AlertCircle className="h-4 w-4" />}>
                  All Recipes
                </NavLink>
                 <NavLink to="/admin/users" icon={<AlertCircle className="h-4 w-4" />}>
                  All Users
                </NavLink>
                

              </>
            )}
          </div>

          {/* Desktop Navigation - Right */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {/* Add Recipe Button for Users */}
                {user.role === "user" && (
                  <button
                    onClick={() => handleProtectedClick("/add-recipe")}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Recipe
                  </button>
                )}

                {/* Notification Bell */}
                <NotificationBell />

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      {user.name?.split(' ')[0] || "User"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {user.role === "user" && (
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                      >
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Link>
                    )}
                    <button
                      onClick={logoutHandler}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-b-xl"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Signup Button */}
          {!user && (
            <div className="md:hidden">
              <Link
                to="/signup"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-200 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={closeMobileMenu}
      >
        <div
          className={`absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-200 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Cook<span className="text-orange-600">Book</span>
                </h2>
                {user && (
                  <p className="text-sm text-gray-600">
                    Welcome, {user.name?.split(' ')[0] || "User"}
                  </p>
                )}
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Content */}
          <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-160px)]">
            {/* Public Links */}
            {!user && (
              <>
                <MobileNavLink to="/" icon={<Home />} onClick={closeMobileMenu}>
                  Home
                </MobileNavLink>
                <MobileNavLink to="/recipes" icon={<BookOpen />} onClick={closeMobileMenu}>
                  All Recipes
                </MobileNavLink>
                <MobileNavLink to="/about" icon={<Info />} onClick={closeMobileMenu}>
                  About Us
                </MobileNavLink>
                <MobileNavLink to="/contact" icon={<Phone />} onClick={closeMobileMenu}>
                  Contact Us
                </MobileNavLink>
              </>
            )}

            {/* User Links */}
            {user && user.role === "user" && (
              <>
                <MobileNavLink to="/" icon={<Home />} onClick={closeMobileMenu}>
                  Home
                </MobileNavLink>
                <MobileNavLink to="/recipes" icon={<BookOpen />} onClick={closeMobileMenu}>
                  All Recipes
                </MobileNavLink>
                <MobileNavLink to="/my-recipes" icon={<BookOpen />} onClick={closeMobileMenu}>
                  My Recipes
                </MobileNavLink>
                <MobileNavLink to="/saved-recipes" icon={<Bookmark />} onClick={closeMobileMenu}>
                  Saved Recipes
                </MobileNavLink>
                <MobileNavLink to="/about" icon={<Info />} onClick={closeMobileMenu}>
                  About
                </MobileNavLink>
                <MobileNavLink to="/contact" icon={<Phone />} onClick={closeMobileMenu}>
                  Contact
                </MobileNavLink>
                <button
                  onClick={() => handleProtectedClick("/add-recipe")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                >
                  <PlusCircle className="h-5 w-5" />
                  Add Recipe
                </button>
              </>
            )}

            {/* Admin Links */}
            {user && user.role === "admin" && (
              <>
                <MobileNavLink to="/admin" icon={<Shield />} onClick={closeMobileMenu}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/admin/pending" icon={<AlertCircle />} onClick={closeMobileMenu}>
                  Pending Recipes
                </MobileNavLink>
                <MobileNavLink to="/admin/recipe" icon={<AlertCircle />} onClick={closeMobileMenu}>
                  All Recipes
                </MobileNavLink>
                <MobileNavLink to="/admin/users" icon={<AlertCircle />} onClick={closeMobileMenu}>
                  All Users
                </MobileNavLink>
              </>
              
            )}

            {/* Authentication Links */}
            {!user ? (
              <div className="pt-4 border-t border-gray-100 mt-4">
                <MobileNavLink to="/login" icon={<User />} onClick={closeMobileMenu}>
                  Login
                </MobileNavLink>
                <MobileNavLink to="/signup" icon={<PlusCircle />} onClick={closeMobileMenu}>
                  Sign Up
                </MobileNavLink>
              </div>
            ) : (
              <>
                {user.role === "user" && (
                  <MobileNavLink to="/profile" icon={<Settings />} onClick={closeMobileMenu}>
                    Profile Settings
                  </MobileNavLink>
                )}
                <button
                  onClick={() => {
                    logoutHandler();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Desktop NavLink Component
const NavLink = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200"
  >
    {icon}
    {children}
  </Link>
);

// Mobile NavLink Component
const MobileNavLink = ({ to, icon, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
  >
    <span className="text-gray-400">{icon}</span>
    {children}
  </Link>
);