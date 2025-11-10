"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { showAlert } from "../app/store/slices/alertSlice";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Wait until auth state finishes loading
    if (!loading && !isAuthenticated) {
      dispatch(showAlert({ type: "error", message: "You need to login first!" }));
      router.push("/login");
    }
  }, [isAuthenticated, loading, dispatch, router]);

  // While auth is loading, or redirecting — show nothing or a loader
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If not authenticated, don't render protected content
  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
