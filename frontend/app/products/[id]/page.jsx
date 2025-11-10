"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [formData , setFormData] = useState(null);
  const isAuthenticated = useSelector(state=> state.auth.isAuthenticated);
  const router = useRouter();
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/v1/product/get/${id}`);
        setProduct(res.data.product);
        setMainImage(res.data.product.images[0]?.url || null);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product");
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    else setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if(!isAuthenticated){
      toast.error("Please log in to add items to your cart.");
      router.push("/login");
      return;
    }

    try {
      const res = await api.post("/api/v1/cart/add", {
        productId: product._id,
        quantity,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Added to cart!");
      } else {
        toast.error(res.data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while adding to cart");
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const res = await api.post(`/api/v1/product/review/${id}`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      if (res.data.success) {
        toast.success("Review submitted!");
        setReviewRating(0);
        setReviewComment("");
        // Refresh product reviews
        const updated = await api.get(`/api/v1/product/get/${id}`);
        setProduct(updated.data.product);
      } else {
        toast.error(res.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review");
    }
  };

  const renderStars = (rating, interactive = false, onClick) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starClass = "text-yellow-500 inline cursor-pointer";
      if (i <= Math.floor(rating))
        stars.push(
          <FaStar
            key={i}
            className={interactive ? starClass : "text-yellow-500 inline"}
            onClick={() => onClick && onClick(i)}
          />
        );
      else if (i - rating < 1)
        stars.push(
          <FaStarHalfAlt
            key={i}
            className={interactive ? starClass : "text-yellow-500 inline"}
            onClick={() => onClick && onClick(i)}
          />
        );
      else
        stars.push(
          <FaRegStar
            key={i}
            className={interactive ? starClass : "text-yellow-500 inline"}
            onClick={() => onClick && onClick(i)}
          />
        );
    }
    return stars;
  };

  if (!product) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-8 bg-white">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left - Images */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="relative w-full h-[400px] border rounded-lg overflow-hidden group">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
            )}
          </div>
          <div className="flex gap-3 justify-center">
            {product.images?.slice(0, 5).map((img, index) => (
              <div
                key={index}
                onClick={() => setMainImage(img.url)}
                className={`w-20 h-20 border rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-500 ${
                  mainImage === img.url ? "ring-2 ring-orange-600" : ""
                }`}
              >
                <Image src={img.url} alt={`thumbnail-${index}`} width={80} height={80} className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 font-medium">Brand: {product.brand}</p>
            <p className="flex items-center gap-2">
              {renderStars(product.avgRating)}
              <span className="text-gray-500">({product.review?.length || 0} reviews)</span>
            </p>
            <p className="text-gray-700">Category: {product.category}</p>
            <p className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              Stock: {product.stock > 0 ? "Available" : "Out of Stock"}
            </p>

            <div className="font-bold mt-2">
              {product.discountedPrice ? (
                <>
                  <span className="text-black text-2xl">Rs. {product.discountedPrice}</span>
                  <span className="line-through ml-2 text-lg text-red-500">Rs. {product.price}</span>
                </>
              ) : (
                <span className="text-gray-800">Rs. {product.price}</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => handleQuantityChange("dec")}
                className="px-3 py-1 bg-gray-200 rounded-md font-bold hover:bg-gray-300 transition"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("inc")}
                className="px-3 py-1 bg-gray-200 rounded-md font-bold hover:bg-gray-300 transition"
              >
                +
              </button>
              <span className="font-semibold text-xl ml-4">
                Total: Rs. {(product.discountedPrice || product.price) * quantity}
              </span>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="mt-4 w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300"
            >
              Add to Cart
            </button>

            {/* Shop Info */}
            {product.shop && (
              <div className="mt-4 flex items-center gap-3 border-t pt-4">
                <Image
                  src={product.shop.images?.[0]?.url || "/placeholder.png"}
                  alt={product.shop.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{product.shop.name}</p>
                  <Link href={`/shop/${product.shop._id}`} className="text-sm text-blue-600 hover:underline">
                    Visit Shop
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section - Description & Reviews */}
      <div className="flex flex-col gap-6">
        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Product Description</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>

        {/* Reviews List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
          {product.review?.length > 0 ? (
            product.review.map((rev, i) => (
              <div key={i} className="border-b py-3">
                <p className="text-sm text-gray-700">
                  Rating: <span className="font-medium">{rev.rating}/5</span>
                </p>
                <p className="text-gray-600 italic">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No reviews yet.</p>
          )}
        </div>

        {/* Submit Review */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
          <div className="flex items-center gap-2 mb-2">
            {renderStars(reviewRating, true, setReviewRating)}
            <span className="text-gray-500">{reviewRating}/5</span>
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={4}
            placeholder="Write your review here..."
            className="w-full border rounded-md p-2 outline-none"
          />
          <button
            onClick={handleReviewSubmit}
            className="mt-3 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors duration-300"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
