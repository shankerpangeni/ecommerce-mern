"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const noNavbarPages = ["/login", "/signup" ,"/admin" ,"/admin/products"];

  if (noNavbarPages.includes(pathname)) return null;

  return <Navbar />;
}
