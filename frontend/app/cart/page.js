"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

function CartContent() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/api/v1/cart");
        if (res.data.success) setCart(res.data.cart);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, change) => {
    setUpdating(true);
    try {
      const item = cart.products.find((p) => p.product._id === productId);
      if (!item) return;

      const newQuantity = item.quantity + change;
      if (newQuantity < 1) return;

      const res = await api.put(`/api/v1/cart/update/${productId}`, { quantity: newQuantity });
      if (res.data.success) setCart(res.data.cart);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await api.delete(`/api/v1/cart/remove/${productId}`);
      if (res.data.success) {
        toast.success("Item removed from cart");
        setCart((prev) => ({
          ...prev,
          products: prev.products.filter((p) => p.product._id !== productId),
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await api.post("/api/v1/payment/checkout");
      if (res.data.success && res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error during checkout");
    }
  };

  const getTotal = () => cart?.products?.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) return <div className="text-center text-gray-500 mt-20">Loading Cart...</div>;

  if (!cart || cart.products.length === 0)
    return (
      <div className="max-w-6xl mx-auto p-8 text-center text-gray-600 bg-white rounded-lg shadow-sm mt-8">
        <p className="text-lg">Your cart is empty 🛒</p>
        <Link
          href="/"
          className="mt-4 inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-sm mt-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Cart items */}
      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Shopping Cart</h1>
        <div className="space-y-6">
          {cart.products.map((item, index) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div
                key={product._id || index}
                className="flex flex-col md:flex-row justify-between items-center border-b pb-6 gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-2/3">
                  <div className="relative w-24 h-24 shrink-0">
                    <Image
                      src={product.images?.[0]?.url || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-contain rounded-md border"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">{product.name}</h2>
                    <p className="text-gray-600 text-sm">Brand: {product.brand}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Image
                        src={product.shop?.images?.[0]?.url || "/placeholder.png"}
                        alt={product.shop?.name || "Shop"}
                        width={25}
                        height={25}
                        className="rounded-full object-cover"
                      />
                      <Link
                        href={`/shop/${product.shop?._id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {product.shop?.name || "Shop"}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(product._id, -1)}
                      disabled={updating || item.quantity <= 1}
                      className="px-3 py-1 font-bold text-lg hover:bg-gray-200 transition"
                    >
                      -
                    </button>
                    <span className="px-4 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product._id, 1)}
                      disabled={updating}
                      className="px-3 py-1 font-bold text-lg hover:bg-gray-200 transition"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-lg font-semibold text-gray-800">
                    Rs. {product.price * item.quantity}
                  </p>

                  <button
                    onClick={() => handleRemove(product._id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order summary */}
      <div className="md:w-1/3 bg-gray-50 border rounded-lg p-6 h-fit">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

        <div className="space-y-3 text-sm text-gray-700">
          {cart.products.map((item, index) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={product._id || index} className="flex justify-between border-b pb-2">
                <span>{product.name} × {item.quantity}</span>
                <span>Rs. {product.price * item.quantity}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between text-lg font-semibold border-t pt-2">
          <span>Total:</span>
          <span>Rs. {getTotal()}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
