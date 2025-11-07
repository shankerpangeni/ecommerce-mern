'use client';
import "./globals.css";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/app/store";
import GlobalAlert from "@/components/AlertMessage";
import NavbarWrapper from "@/components/NavbarWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavbarWrapper />
            <GlobalAlert />
            {children}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
