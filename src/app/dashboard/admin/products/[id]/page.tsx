"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";
import { nanoid } from "nanoid";
import apiClient from "@/lib/api";

interface DashboardProductDetailsProps {
  params: Promise<{ id: string }>;
}

const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.png";
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_API_URL
    : `http://${process.env.NEXT_PUBLIC_API_URL}`;
  return `${baseUrl}/${path.replace(/^\/+/, "")}`;
};

type Category = { id: string; name: string };
type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  manufacturer: string;
  description: string;
  mainImage?: string;
  categoryId: string;
  inStock: number;
};
type OtherImages = { id: string; productId: string; image: string };

const DashboardProductDetails = ({ params }: DashboardProductDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const router = useRouter();

  // Delete product
  const deleteProduct = async () => {
    try {
      const response = await apiClient.delete(`/api/products/${id}`);
      if (response.status === 204) {
        toast.success("✅ Product deleted successfully");
        router.push("/dashboard/admin/products");
      } else if (response.status === 400) {
        toast.error("⚠️ Cannot delete product due to foreign key constraint");
      } else {
        throw new Error("Unexpected error while deleting product");
      }
    } catch {
      toast.error("❌ There was an error while deleting the product");
    }
  };

  // Update product
  const updateProduct = async () => {
    if (
      !product?.title ||
      !product?.slug ||
      !product?.price?.toString() ||
      !product?.manufacturer ||
      !product?.description
    ) {
      toast.error("⚠️ You need to enter values in all input fields");
      return;
    }
    try {
      const response = await apiClient.put(`/api/products/${id}`, product, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        toast.success("✅ Product updated successfully");
      } else {
        throw new Error("Error updating product");
      }
    } catch {
      toast.error("❌ There was an error while updating the product");
    }
  };

  // Upload main image
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);
    try {
      toast.loading("📤 Uploading file...");
      const response = await apiClient.post("/api/main-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.dismiss();

      if (response.status === 200) {
        const data = await response.json();
        toast.success("✅ File uploaded successfully");
        setProduct((prev) => ({ ...prev!, mainImage: data.filePath }));
      } else {
        toast.error("❌ File upload unsuccessful.");
      }
    } catch {
      toast.dismiss();
      toast.error("⚠️ Error during file upload");
    }
  };

  // Fetch product and categories
  const fetchProductData = async () => {
    try {
      toast.loading("🔄 Loading product details...");
      const res = await apiClient.get(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
      toast.dismiss();

      const imagesRes = await apiClient.get(`/api/images/${id}`);
      const images = await imagesRes.json();
      setOtherImages(images);
    } catch (err) {
      toast.dismiss();
      toast.error("❌ Error fetching product data");
      console.error("Error fetching product data:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get(`/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("⚠️ Error fetching categories");
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  return (
    <div className="bg-gray-50 flex min-h-screen max-w-screen-2xl mx-auto xl:flex-row max-xl:flex-col">
      {/* <DashboardSidebar /> */}

      <div className="flex-1 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Product Details</h1>

        {/* Product Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Title</label>
              <input
                type="text"
                value={product?.title || ""}
                onChange={(e) =>
                  setProduct({ ...product!, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Price</label>
              <input
                type="number"
                value={product?.price || ""}
                onChange={(e) =>
                  setProduct({ ...product!, price: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Manufacturer</label>
              <input
                type="text"
                value={product?.manufacturer || ""}
                onChange={(e) =>
                  setProduct({ ...product!, manufacturer: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                value={product?.categoryId || ""}
                onChange={(e) =>
                  setProduct({ ...product!, categoryId: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {formatCategoryName(c.name)}
                  </option>
                ))}
              </select>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Slug</label>
              <input
                type="text"
                value={product?.slug || ""}
                onChange={(e) =>
                  setProduct({
                    ...product!,
                    slug: convertSlugToURLFriendly(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">In Stock</label>
              <select
                value={product?.inStock ?? 1}
                onChange={(e) =>
                  setProduct({ ...product!, inStock: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium mb-2">Main Image</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file);
              }}
              className="file-input file-input-bordered w-full max-w-xs"
            />
            {product?.mainImage && (
              <Image
                src={product.mainImage}
                alt={product?.title || "Product image"}
                width={150}
                height={150}
                className="rounded-lg border mt-2"
              />
            )}

            <label className="block text-gray-700 font-medium mb-2">Other Images</label>
            <div className="flex flex-wrap gap-2">
              {otherImages?.map((img) => (
                <Image
                  key={nanoid()}
                  src={img.image}
                  alt="Product image"
                  width={100}
                  height={100}
                  className="rounded-lg border"
                />
              ))}
            </div>
          </div>


          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              value={product?.description || ""}
              onChange={(e) =>
                setProduct({ ...product!, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 flex-wrap">
            <button
              onClick={updateProduct}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Update Product
            </button>
            <button
              onClick={deleteProduct}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Delete Product
            </button>
          </div>

          <p className="text-sm text-red-500 mt-2">
            ⚠️ To delete the product, you must first remove all its records from orders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
