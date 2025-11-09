"use client";
import { useState, useEffect } from "react";
import { IoImages } from "react-icons/io5";
import { toast } from "react-hot-toast";
import api from "@/lib/api"; // Axios instance for JSON
import imageapi from "@/lib/imageapi"; // For file uploads

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  // Toggle forms
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Form states
  const [images, setImages] = useState([]);
  const [updateImages, setUpdateImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [updateData, setUpdateData] = useState({
    _id: "",
    name: "",
    description: "",
    location: "",
    contact: [{ email: "", phoneNumber: "" }],
    images: [],
  });

  // ✅ Fetch all shops
  const fetchAllShops = async () => {
    try {
      const res = await api.get("/api/v1/shop/getall");
      if (res.data.success) setShops(res.data.shops);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllShops();
  }, []);

  // ✅ Create shop
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.description || !formData.location) {
      setLoading(false);
      return toast.error("All fields are required");
    }

    if (images.length === 0) {
      setLoading(false);
      return toast.error("Upload at least one image");
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "contactEmail" && key !== "contactPhone") data.append(key, formData[key]);
    });

    // Contact array
    data.append(
      "contact",
      JSON.stringify([{ email: formData.contactEmail, phoneNumber: formData.contactPhone }])
    );

    images.forEach((img) => data.append("images", img.file));

    try {
      const res = await imageapi.post("/api/v1/shop/create", data);
      if (res.data.success) {
        toast.success("Shop created!");
        setImages([]);
        setFormData({ name: "", description: "", location: "", contactEmail: "", contactPhone: "" });
        setShowCreateForm(false);
        fetchAllShops();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update shop
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    const { _id, images: existingImages, contact, ...rest } = updateData;

    Object.keys(rest).forEach((key) => data.append(key, rest[key]));

    // Contact
    data.append("contact", JSON.stringify(contact));

    // Images
    removeImages.forEach((pid) => data.append("removeImages[]", pid));
    updateImages.forEach((img) => data.append("images", img.file));

    try {
      const res = await imageapi.put(`/api/v1/shop/update/${_id}`, data);
      if (res.data.success) {
        toast.success("Shop updated!");
        setShowUpdateForm(false);
        setUpdateData({
          _id: "",
          name: "",
          description: "",
          location: "",
          contact: [{ email: "", phoneNumber: "" }],
          images: [],
        });
        setUpdateImages([]);
        setRemoveImages([]);
        fetchAllShops();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load shop into update form
  const handleEdit = (shop) => {
    setUpdateData({ ...shop });
    setUpdateImages([]);
    setRemoveImages([]);
    setShowUpdateForm(true);
    setShowCreateForm(false);
  };

  // ✅ Delete shop
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this shop?")) return;
    try {
      const res = await imageapi.delete(`/api/v1/shop/delete/${id}`);
      if (res.data.success) {
        toast.success("Shop deleted");
        fetchAllShops();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ✅ File uploads
  const handleFileUpload = (e, forUpdate = false) => {
    const selected = Array.from(e.target.files);
    if (forUpdate) {
      if (selected.length + updateData.images.length > 5)
        return alert("Max 5 images allowed");
      const mapped = selected.map((file) => ({ file, preview: URL.createObjectURL(file) }));
      setUpdateImages([...updateImages, ...mapped]);
    } else {
      if (selected.length + images.length > 5) return alert("Max 5 images allowed");
      const mapped = selected.map((file) => ({ file, preview: URL.createObjectURL(file) }));
      setImages([...images, ...mapped]);
    }
  };

  const removeImage = (idx, forUpdate = false, public_id = null) => {
    if (forUpdate) {
      if (public_id) setRemoveImages([...removeImages, public_id]);
      setUpdateImages(updateImages.filter((_, i) => i !== idx));
    } else {
      setImages(images.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="sm:p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Shops Dashboard</h2>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Close Add Form" : "Add Shop"}
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

      {/* ✅ Create Shop Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateSubmit}
          className="grid gap-4 md:grid-cols-2 mb-6 border p-4 rounded bg-white shadow"
        >
          {["name", "description", "location"].map((key) => (
            <div key={key}>
              <label>{key}</label>
              <input
                type="text"
                className="border p-2 w-full rounded"
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                required
              />
            </div>
          ))}

          {/* Contact */}
          <div>
            <label>Email</label>
            <input
              type="email"
              className="border p-2 w-full rounded"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData({ ...formData, contactPhone: e.target.value })
              }
              required
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label>Images (Max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img.preview}
                    className="w-24 h-24 rounded object-cover"
                  />
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
            {loading ? "Creating..." : "Create Shop"}
          </button>
        </form>
      )}

      {/* ✅ Update Shop Form */}
      {showUpdateForm && (
        <form
          onSubmit={handleUpdateSubmit}
          className="grid gap-4 md:grid-cols-2 mb-6 border p-4 rounded bg-white shadow"
        >
          {["name", "description", "location"].map((key) => (
            <div key={key}>
              <label>{key}</label>
              <input
                type="text"
                className="border p-2 w-full rounded"
                value={updateData[key]}
                onChange={(e) =>
                  setUpdateData({ ...updateData, [key]: e.target.value })
                }
                required
              />
            </div>
          ))}

          {/* Contact */}
          <div>
            <label>Email</label>
            <input
              type="email"
              className="border p-2 w-full rounded"
              value={updateData.contact[0]?.email || ""}
              onChange={(e) =>
                setUpdateData({
                  ...updateData,
                  contact: [{ ...updateData.contact[0], email: e.target.value }],
                })
              }
              required
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={updateData.contact[0]?.phoneNumber || ""}
              onChange={(e) =>
                setUpdateData({
                  ...updateData,
                  contact: [
                    { ...updateData.contact[0], phoneNumber: e.target.value },
                  ],
                })
              }
              required
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label>Existing Images</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {updateData.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img.url}
                    className="w-24 h-24 rounded object-cover"
                  />
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
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e, true)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {updateImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img.preview}
                    className="w-24 h-24 rounded object-cover"
                  />
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
            {loading ? "Updating..." : "Update Shop"}
          </button>
        </form>
      )}

      {/* ✅ Shops Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shops.map((s) => (
              <tr key={s._id}>
                <td className="px-6 py-4">{s.name}</td>
                <td className="px-6 py-4">{s.location}</td>
                <td className="px-6 py-4">
                  {s.contact?.[0]?.email} / {s.contact?.[0]?.phoneNumber}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(s)}
                  >
                    Update
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
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
