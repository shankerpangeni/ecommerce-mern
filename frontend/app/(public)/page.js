"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/v1/recommendation/search");
      if (res.data.success) setProducts(res.data.products);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<FaStar key={i} className="text-yellow-500 inline" />);
      else if (i - rating < 1) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500 inline" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-500 inline" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-700 text-lg font-medium">
        Loading products...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Featured Products</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p._id}
            onClick={() => router.push(`/products/${p._id}`)}
            className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col"
          >
            {/* Shop badge */}
            {p.shop && (
              <div className="absolute top-2 left-2 flex items-center bg-white bg-opacity-80 px-2 py-1 rounded-full shadow">
                <img
                  src={p.shop.images?.[0]?.url || "/shop-placeholder.png"}
                  alt={p.shop.name}
                  className="w-6 h-6 rounded-full object-cover mr-2"
                />
                <span className="text-sm font-medium text-gray-800 truncate max-w-[100px]">
                  {p.shop.name}
                </span>
              </div>
            )}

            {/* Product Image */}
            <img
              src={p.images?.[0]?.url || "/placeholder.png"}
              alt={p.name}
              className="w-full h-52 object-cover"
            />

            {/* Product info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">{p.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Brand: {p.brand}</p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {/* Rating */}
                <div className="flex items-center gap-1 text-sm">
                  {renderStars(p.avgRating)}
                  <span className="text-gray-500">({p.review?.length || 0})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  {p.discountedPrice ? (
                    <>
                      <span className="text-gray-900 font-bold text-lg line-through">
                        ${p.price.toFixed(2)}
                      </span>
                      <span className="text-green-600 font-bold text-xl">
                        ${p.discountedPrice.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-900 font-bold text-xl">${p.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center text-gray-500 mt-10 text-lg font-medium">
          No products available.
        </div>
      )}
    </div>
  );
}
