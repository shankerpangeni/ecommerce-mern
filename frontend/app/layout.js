"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import "./globals.css";
import { usePathname } from "next/navigation";
import GlobalAlert from "@/components/AlertMessage";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const noNavbarPages = ['/signup' , '/login'];
  const showNavbar = !noNavbarPages.includes(pathname);
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          { showNavbar && <Navbar /> }
          <GlobalAlert />
          {children}
        </Provider>
      </body>
    </html>
  );
};
