"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUser } from "@/app/store/slices/authSlice";
import api from "@/lib/api";
import toast from "react-hot-toast";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchTimeout = useRef(null);
  const [profileOpen , setProfileOpen] = useState(false)

  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  // Fetch search results live
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await api.get(`/api/v1/recommendation/search?keyword=${encodeURIComponent(searchQuery)}`);
        if (res.data.success) {
          setSearchResults(res.data.products);
          setShowSearchResults(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSearchResults) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && searchResults[activeIndex]) {
        handleResultClick(searchResults[activeIndex]._id);
      }
    }
  };

  const handleResultClick = (id) => {
    router.push(`/product/${id}`);
    setShowSearchResults(false);
    setSearchQuery("");
    setActiveIndex(-1);
  };

  const handleLogout = async () => {
    try {
      const res = await api.get("/api/v1/user/logout");
      if (res.data.success) {
        dispatch(clearUser());
        toast.success("Logged out");
        router.push("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Logout failed");
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 shadow-md bg-white sticky top-0 z-50">
      {/* Logo */}
      <Link href="/">
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          smart<span className="text-orange-700">Shop</span>
        </h1>
      </Link>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-lg mx-4 relative">
        <input
          type="search"
          placeholder="Search products..."
          className="flex-1 p-2 px-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length && setShowSearchResults(true)}
          onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          onKeyDown={handleKeyDown}
        />
        <IoSearch className="ml-2 text-blue-950 cursor-pointer hover:scale-110 transition-transform duration-300" />

        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-64 overflow-y-auto z-50">
            {searchResults.map((p, index) => (
              <div
                key={p._id}
                className={`p-2 px-4 cursor-pointer ${
                  index === activeIndex ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                onClick={() => handleResultClick(p._id)}
              >
                {p.name} - ${p.price.toFixed(2)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-5 relative">
        {/* Cart */}
        <div className="relative">
          {user && user.cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs font-semibold bg-orange-600 p-1 px-2 rounded-full text-white">
              {user.cartCount}
            </span>
          )}
          <Link href="/cart">
            <FiShoppingCart className="text-2xl cursor-pointer hover:scale-110 transition-transform duration-300" />
          </Link>
        </div>

        {/* Profile / Auth */}
        {user ? (
          <div className="relative">
            <FaRegCircleUser
              className="text-2xl cursor-pointer hover:scale-110 transition-transform duration-300"
              onClick={() => setProfileOpen(!profileOpen)}
            />
            <div
              className={`absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-36 transition-all duration-200 ${
                profileOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <ul className="text-sm font-medium">
                <li className="p-2 px-4 hover:bg-gray-100 cursor-pointer">Profile</li>
                <li className="p-2 px-4 hover:bg-gray-100 cursor-pointer">Orders</li>
                <li
                  className="p-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex gap-2">
            <Link href="/signup">
              <button className="px-4 py-2 bg-blue-950 text-white font-semibold rounded hover:bg-blue-800 transition-colors">
                Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button className="px-4 py-2 border border-blue-950 font-semibold rounded hover:bg-blue-50 transition-colors">
                Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
