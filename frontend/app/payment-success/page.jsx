"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/api";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) return;

      try {
        const res = await api.get(`/api/v1/order/session/${sessionId}`);
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          toast.error("Order not found");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  if (!order)
    return <div className="text-center mt-20">Order not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        ✅ Payment Successful!
      </h1>
      <p className="mb-4">Thank you for your purchase, {order.user.name}.</p>
      <p className="mb-4">Order Total: Rs. {order.totalAmount}</p>
      <p className="mb-4">Payment Method: {order.paymentMethod}</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Items:</h2>
      <ul className="list-disc list-inside">
        {order.items.map((item) => (
          <li key={item.product._id}>
            {item.product.name} × {item.quantity} - Rs. {item.price * item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
