"use client";
import { useSelector, useDispatch } from "react-redux";
import { hideAlert } from "@/app/store/slices/alertSlice";
import { useEffect } from "react";

export default function GlobalAlert() {
  const dispatch = useDispatch();
  const { visible, message, type } = useSelector((state) => state.alert);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => dispatch(hideAlert()), 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-3 rounded-lg  text-white font-semibold text-lg shadow-lg transition-all duration-300 ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
}
