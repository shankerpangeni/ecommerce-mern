"use client";

import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNavigation({ open, setOpenSidebar }) {
  const router = useRouter();

  // Sidebar items with their paths
  const navItems = [
    { name: "Home", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Shop", path: "/admin/shops" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <>
      {/* ✅ Sidebar for large screens */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-blue-900 text-white shadow-lg">
        <nav className="flex flex-col mt-12 space-y-4 px-4">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className="hover:bg-blue-700 p-2 rounded cursor-pointer"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ✅ Sidebar Popup for mobile/tablet */}
      <aside
        className={`lg:hidden fixed top-0 h-full w-52 bg-blue-900 text-white p-4 shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0 left-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-2xl"
          onClick={() => setOpenSidebar(false)}
        >
          <IoClose />
        </button>

        <nav className="flex flex-col mt-14 space-y-4 px-3">
          {navItems.map((item, i) => (
            <button
              key={i}
              className="hover:bg-blue-700 p-2 rounded text-left w-full"
              onClick={() => {
                router.push(item.path);
                setOpenSidebar(false); // close sidebar on mobile
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
