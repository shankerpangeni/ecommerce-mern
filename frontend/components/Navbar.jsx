import { useState, useEffect } from "react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUser } from "@/app/store/slices/authSlice";
import api from "@/lib/api";
import toast from "react-hot-toast";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state) => state.auth);

  // ✅ Fetch cart count
  useEffect(() => {
    if (!user) return;

    const fetchCartCount = async () => {
      try {
        const res = await api.get("/api/v1/cart");
        if (res.data.success && res.data.cart?.products) {
          setCartCount(res.data.cart.products.length);
        } else {
          setCartCount(0);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // no cart found yet → count 0
          setCartCount(0);
        } else {
          console.error("Failed to fetch cart count:", err.message);
        }
      }
    };

    fetchCartCount();
  }, [user]);

  const handleLogout = async () => {
    try {
      const res = await api.get("/api/v1/user/logout");
      if (res.data.success) {
        dispatch(clearUser());
        toast.success("Successfully logged out");
        router.push("/login");
      } else {
        toast.error(res.data.message || "Logout failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Internal server error");
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 shadow-md bg-white sticky top-0 z-50">
      {/* Left - Logo */}
      <Link href="/">
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          smart<span className="text-orange-700">Shop</span>
        </h1>
      </Link>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
        <input
          type="search"
          placeholder="Search products..."
          className="flex-1 p-2 px-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <IoSearch className="ml-2 text-blue-950 cursor-pointer hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 relative">
        {/* Cart */}
        <div className="relative">
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs font-semibold bg-orange-600 p-1 px-2 rounded-full text-white">
              {cartCount}
            </span>
          )}
          <Link href="/cart">
            <FiShoppingCart className="text-2xl cursor-pointer hover:scale-110 transition-transform duration-300" />
          </Link>
        </div>

        {/* Profile / Auth */}
        {user ? (
          <div
            className="relative"
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
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
