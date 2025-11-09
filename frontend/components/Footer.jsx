"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold text-orange-500">Fantech</span>
          </div>
          <p className="text-gray-400 text-sm">
            Fantech is a globally reputed brand providing top-quality products and services.
          </p>
          <div className="flex gap-3 mt-2">
            <Link href="#" className="hover:text-orange-500 transition">
              <FaFacebookF />
            </Link>
            <Link href="#" className="hover:text-orange-500 transition">
              <FaTwitter />
            </Link>
            <Link href="#" className="hover:text-orange-500 transition">
              <FaInstagram />
            </Link>
            <Link href="#" className="hover:text-orange-500 transition">
              <FaLinkedinIn />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link href="/" className="hover:text-orange-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-orange-500 transition">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-orange-500 transition">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-500 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link href="/category/male" className="hover:text-orange-500 transition">
                Male
              </Link>
            </li>
            <li>
              <Link href="/category/female" className="hover:text-orange-500 transition">
                Female
              </Link>
            </li>
            <li>
              <Link href="/category/unisex" className="hover:text-orange-500 transition">
                Unisex
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <p className="text-gray-400 text-sm">123 Fantech Street</p>
          <p className="text-gray-400 text-sm">Kathmandu, Nepal</p>
          <p className="text-gray-400 text-sm">Email: support@fantech.com</p>
          <p className="text-gray-400 text-sm">Phone: +977 9876543210</p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-6 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Fantech. All rights reserved.
      </div>
    </footer>
  );
}
