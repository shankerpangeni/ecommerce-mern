"use client";
import { useState, useEffect } from "react";
import { IoImages } from "react-icons/io5";
import { toast } from "react-hot-toast";
import api from "@/lib/api"; // Axios instance
import imageapi from "@/lib/imageapi"; // For file uploads

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Toggle forms
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Form states
  const [images, setImages] = useState([]);
  const [updateImages, setUpdateImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);

  const [shops , setAllShops] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    genderSpecific: "",
    stock: "",
    discountedPrice: "",
    shop: "",
  });

  const fetchAllShops = async() => {
    try {
      const res = await imageapi.get('/api/v1/shop/getall');
      if(res.data.success){
        setAllShops(res.data.shops)
        console.log(shops);
      }
      
    } catch (error) {
      console.log(error);
      
    }
  }

  
  

  const [updateData, setUpdateData] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    genderSpecific: "",
    stock: "",
    discountedPrice: "",
    shop: "",
    images: [],
  });

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/v1/product/getall");
      if (res.data.success) setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAllShops();
  }, []);

  // ✅ Add Product
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.brand ||
      !formData.category ||
      !formData.shop
    ) {
      setLoading(false);
      return toast.error("All fields are required");
    }

    if (images.length === 0) {
      setLoading(false);
      return toast.error("Upload at least one image");
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    images.forEach((img) => data.append("images", img.file));

    try {
      const res = await imageapi.post("/api/v1/product/create", data);
      if (res.data.success) {
        toast.success("Product created!");
        setImages([]);
        setFormData({
          name: "",
          description: "",
          price: "",
          brand: "",
          category: "",
          genderSpecific: "",
          stock: "",
          discountedPrice: "",
          shop: "",
        });
        setShowCreateForm(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update Product
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
      const shopId = updateData.shop?._id || updateData.shop;
    const cleanData = { ...updateData, shop: shopId };
    const data = new FormData();
    Object.keys(cleanData).forEach((key) => {
      if (key !== "images" && key !== "_id") data.append(key, cleanData[key]);
    });

    // Images
    removeImages.forEach((pid) => data.append("removeImages[]", pid));
    updateImages.forEach((img) => data.append("images", img.file));

    try {
      const res = await imageapi.put(`/api/v1/product/update/${updateData._id}`, data);
      if (res.data.success) {
        toast.success("Product updated!");
        setShowUpdateForm(false);
        setUpdateData({
          _id: "",
          name: "",
          description: "",
          price: "",
          brand: "",
          category: "",
          genderSpecific: "",
          stock: "",
          discountedPrice: "",
          shop: "",
          images: [],
        });
        setUpdateImages([]);
        setRemoveImages([]);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load product into update form
  const handleEdit = (product) => {
    setUpdateData({ ...product });
    setRemoveImages([]);
    setUpdateImages([]);
    setShowUpdateForm(true);
    setShowCreateForm(false);
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await imageapi.delete(`/api/v1/product/delete/${id}`);
      if (res.data.success) {
        toast.success("Product deleted");
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ✅ File uploads
  const handleFileUpload = (e, forUpdate = false) => {
    const selected = Array.from(e.target.files);
    if (forUpdate) {
      if (selected.length + updateData.images.length > 5) return alert("Max 5 images allowed");
      const mapped = selected.map((file) => ({ file, preview: URL.createObjectURL(file) }));
      setUpdateImages([...updateImages, ...mapped]);
    } else {
      if (selected.length + images.length > 5) return alert("Max 5 images allowed");
      const mapped = selected.map((file) => ({ file, preview: URL.createObjectURL(file) }));
      setImages([...images, ...mapped]);
    }
  };

  // ✅ Remove image
  const removeImage = (idx, forUpdate = false, public_id = null) => {
    if (forUpdate) {
      if (public_id) setRemoveImages([...removeImages, public_id]);
      setUpdateImages(updateImages.filter((_, i) => i !== idx));
    } else {
      setImages(images.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className=" sm:p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Products Dashboard</h2>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Close Add Form" : "Add Product"}
        </button>
        {showUpdateForm && (
          <button
            className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setShowUpdateForm(false)}
          >
            Close Update Form
          </button>
        )}
      </div>

      {/* ✅ Create Product Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateSubmit}
          className="grid gap-4 md:grid-cols-2 mb-6 border p-4 rounded bg-white shadow"
        >
          {/* Render inputs dynamically */}
          {["name","brand","price","discountedPrice","stock"].map((key) => (
            <div key={key}>
              <label>{key}</label>
              <input
                type={key.includes("price") || key==="stock" ? "number" : "text"}
                className="border p-2 w-full rounded"
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                required
              />
            </div>
          ))}

          <div>
            <label>Gender</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.genderSpecific}
              onChange={(e) => setFormData({ ...formData, genderSpecific: e.target.value })}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label>Category</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              <option value="kitchen">Kitchen</option>
              <option value="clothes">Clothes</option>
              <option value="gadgets">Gadgets</option>
              <option value="shoes">Shoes</option>
              <option value="jwellery">Jewellery</option>
            </select>
          </div>

          <div>
            <label>Shop</label>
            <select
              className="border p-2 w-full rounded"
              value={formData.shop}
              onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
              required
            >

              <option value="">Select Shop</option>
              { shops.map(shop => {
                  return <option key={shop._id} value={shop._id}>{shop.name}</option>
              })}
              
            </select>
              
          </div>

          <div className="md:col-span-2">
            <label>Description</label>
            <textarea
              rows="4"
              className="border p-2 w-full rounded"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label>Images (Max 5)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e)} />
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img.preview} className="w-24 h-24 rounded object-cover" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded-full text-xs"
                    onClick={() => removeImage(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-blue-900 text-white py-2 rounded"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      )}

      {/* ✅ Update Product Form */}
      {showUpdateForm && (
        <form
          onSubmit={handleUpdateSubmit}
          className="grid gap-4 md:grid-cols-2 mb-6 border p-4 rounded bg-white shadow"
        >
          {["name","brand","price","discountedPrice","stock"].map((key) => (
            <div key={key}>
              <label>{key}</label>
              <input
                type={key.includes("price") || key==="stock" ? "number" : "text"}
                className="border p-2 w-full rounded"
                value={updateData[key]}
                onChange={(e) => setUpdateData({ ...updateData, [key]: e.target.value })}
                required
              />
            </div>
          ))}

          <div>
            <label>Gender</label>
            <select
              className="border p-2 w-full rounded"
              value={updateData.genderSpecific}
              onChange={(e) => setUpdateData({ ...updateData, genderSpecific: e.target.value })}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label>Category</label>
            <select
              className="border p-2 w-full rounded"
              value={updateData.category}
              onChange={(e) => setUpdateData({ ...updateData, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              <option value="kitchen">Kitchen</option>
              <option value="clothes">Clothes</option>
              <option value="gadgets">Gadgets</option>
              <option value="shoes">Shoes</option>
              <option value="jwellery">Jewellery</option>
            </select>
          </div>

          <div>
            <label>Shop</label>
            <select
              className="border p-2 w-full rounded"
              value={updateData.shop?._id || updateData.shop}
              onChange={(e) => setUpdateData({ ...updateData, shop: e.target.value })}
              required
            >
              <option value="">Select Shop</option>
              <option value="690efcc58c32a96d0a7dd992">Fantech</option>
              <option value="677e8f490e7d8f08213b5ae3">Puma Store</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label>Description</label>
            <textarea
              rows="4"
              className="border p-2 w-full rounded"
              value={updateData.description}
              onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
              required
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label>Existing Images</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {updateData.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img.url} className="w-24 h-24 rounded object-cover" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded-full text-xs"
                    onClick={() => removeImage(idx, true, img.public_id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <label className="mt-2 block">Add New Images</label>
            <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
            <div className="flex flex-wrap gap-2 mt-2">
              {updateImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img.preview} className="w-24 h-24 rounded object-cover" />
                   <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded-full text-xs"
                    onClick={() => removeImage(idx, true)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-green-900 text-white py-2 rounded"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      )}

      {/* ✅ Products Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="px-6 py-4">{p.name}</td>
                <td className="px-6 py-4">{p.brand}</td>
                <td className="px-6 py-4">{p.shop?.name || "-"}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(p)}
                  >
                    Update
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => window.location.href = `/admin/products/${p._id}`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
                 