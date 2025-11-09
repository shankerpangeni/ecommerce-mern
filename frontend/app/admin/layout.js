"use client";
import { useState } from "react";
import AdminNavigation from "@/components/AdminNavigation";
import { FaBars, FaRegCircleUser } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import api from '@/lib/api'
import { clearUser } from "../store/slices/authSlice";

export default function AdminLayout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [error , setError] = useState(null)

  const handleLogout = async() => {
    const res = await api.get('/api/v1/user/logout');

    try {
      if(res.data.success){
        dispatch(clearUser());
        router.push('/login')
      }

      else{
        setError(res.data.message || 'Logout Failed')
      }
      
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Internal server error'
      setError(message);
    }

  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar */}
      <AdminNavigation open={openSidebar} setOpenSidebar={setOpenSidebar} />

      {/* ✅ Right content */}
      <div className="flex flex-col flex-1 ml-0 lg:ml-60">
        {/* ✅ Top Navbar */}
        <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
          {/* ✅ Hamburger visible only on small screens */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <FaBars />
          </button>

          <h1 className="text-lg md:text-2xl font-semibold text-blue-900">
            Admin Dashboard
          </h1>

          {/* ✅ Profile w/ Dropdown */}
          <div className="relative">
  {/* Wrapper handles hover state */}
  <div
    className="group cursor-pointer flex items-center"
  >
    <FaRegCircleUser size={28} />

    {/* Dropdown */}
    <div
      className="absolute  right-0 mt-28 bg-white shadow-lg rounded-md py-2 w-36 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200"
    >
      <button className="text-sm px-3 py-2 hover:bg-gray-200 text-left w-full">
        Edit Profile
      </button>
      <button onClick={handleLogout} className="text-sm px-3 py-2 hover:bg-gray-200 text-left text-red-600 w-full">
        Logout
      </button>
    </div>
  </div>
</div>

        </div>

        {/* ✅ Main content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
