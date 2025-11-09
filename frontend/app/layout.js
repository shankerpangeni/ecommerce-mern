"use client";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/app/store";
import GlobalAlert from "@/components/AlertMessage";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-gray-300 min-h-screen flex flex-col ${poppins.className}`}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavbarWrapper />
            <GlobalAlert />

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Toaster */}
            <Toaster position="top-center" reverseOrder={false} />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
