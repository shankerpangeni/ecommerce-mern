"use client"

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { showAlert } from "./../app/store/slices/alertSlice";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(
        showAlert({ type: "error", message: "You need to login first!" })
      );
      router.push("/login");
    }
  }, [isAuthenticated, dispatch, router]);

  // While redirecting, render nothing
  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
