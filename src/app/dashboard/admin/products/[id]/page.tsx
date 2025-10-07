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

// ✅ Helper function to generate correct image URL (robust + auto http://)
const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.png";

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_API_URL
    : `http://${process.env.NEXT_PUBLIC_API_URL}`;

  return `${baseUrl}/${path.replace(/^\/+/, "")}`;
};

type Category = {
  id: string;
  name: string;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};
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

type OtherImages = {
  id: string;
  productId: string;
  image: string;
};


const DashboardProductDetails = ({ params }: DashboardProductDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
 
  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>();
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const router = useRouter();

  // 🧹 Delete product
  const deleteProduct = async () => {
    try {
      const response = await apiClient.delete(`/api/products/${id}`);

      if (response.status === 204) {
        toast.success("Product deleted successfully");
        router.push("/admin/products");
      } else if (response.status === 400) {
        toast.error("Cannot delete product due to foreign key constraint");
      } else {
        throw new Error("Unexpected error while deleting product");
      }
    } catch {
      toast.error("There was an error while deleting product");
    }
  };

  // ✏️ Update product
  const updateProduct = async () => {
    if (
      !product?.title ||
      !product?.slug ||
      !product?.price?.toString() ||
      !product?.manufacturer ||
      !product?.description
    ) {
      toast.error("You need to enter values in input fields");
      return;
    }

    try {
      const response = await apiClient.put(`/api/products/${id}`, product, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Product successfully updated");
      } else {
        throw new Error("Error updating product");
      }
    } catch {
      toast.error("There was an error while updating product");
    }
  };

  // 📤 Upload main image
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await apiClient.post("/api/main-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        const data = await response.json();
        toast.success("File uploaded successfully");
        setProduct((prev) => ({ ...prev!, mainImage: data.filePath }));
      } else {
        toast.error("File upload unsuccessful.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("There was an error during file upload");
    }
  };

  // 📦 Fetch product data and related images
  const fetchProductData = async () => {
    try {
      const res = await apiClient.get(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);

      const imagesRes = await apiClient.get(`/api/images/${id}`, {
        cache: "no-store",
      });
      const images = await imagesRes.json();
      setOtherImages(images);
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  };

  // 🏷️ Fetch product categories
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get(`/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />

      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5">
        <h1 className="text-3xl font-semibold">Product details</h1>

        {/* Product name */}
        <div>
          <label className="form-control w-full max-w-xs">
            <span className="label-text">Product name:</span>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.title || ""}
              onChange={(e) =>
                setProduct({ ...product!, title: e.target.value })
              }
            />
          </label>
        </div>

        {/* Product price */}
        <div>
          <label className="form-control w-full max-w-xs">
            <span className="label-text">Product price:</span>
            <input
              type="number"
              className="input input-bordered w-full max-w-xs"
              value={product?.price || ""}
              onChange={(e) =>
                setProduct({ ...product!, price: Number(e.target.value) })
              }
            />
          </label>
        </div>

        {/* Manufacturer */}
        <div>
          <label className="form-control w-full max-w-xs">
            <span className="label-text">Manufacturer:</span>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.manufacturer || ""}
              onChange={(e) =>
                setProduct({ ...product!, manufacturer: e.target.value })
              }
            />
          </label>
        </div>

        {/* Slug */}
        <div>
          <label className="form-control w-full max-w-xs">
            <span className="label-text">Slug:</span>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={product?.slug ? convertSlugToURLFriendly(product.slug) : ""}
              onChange={(e) =>
                setProduct({
                  ...product!,
                  slug: convertSlugToURLFriendly(e.target.value),
                })
              }
            />
          </label>
        </div>

        {/* In stock */}
        <div>
          <label className="form-control w-full max-w-xs">
            <span className="label-text">Is product in stock?</span>
            <select
              className="select select-bordered"
              value={product?.inStock ?? 1}
              onChange={(e) =>
                setProduct({ ...product!, inStock: Number(e.target.value) })
              }
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </label>
        </div>

        {/* Category */}
        <div>
          <label className="form-control w-full max-w-xs">
            <span className="label-text">Category:</span>
            <select
              className="select select-bordered"
              value={product?.categoryId || ""}
              onChange={(e) =>
                setProduct({
                  ...product!,
                  categoryId: e.target.value,
                })
              }
            >
              {categories?.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {formatCategoryName(category.name)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Main image upload */}
        <div>
          <input
            type="file"
            className="file-input file-input-bordered file-input-lg w-full max-w-sm"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) uploadFile(selectedFile);
            }}
          />
          {product?.mainImage && (
            <Image
              src={getImageUrl(product.mainImage)}
              alt={product?.title || "Product image"}
              className="w-auto h-auto mt-2"
              width={100}
              height={100}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          )}
        </div>

        {/* Other images */}
        <div className="flex gap-x-1 flex-wrap">
          {otherImages?.map((image) => (
            <Image
              key={nanoid()}
              src={getImageUrl(image.image)}
              alt="product image"
              width={100}
              height={100}
              className="w-auto h-auto rounded-lg border"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          ))}
        </div>

        {/* Description */}
        <div>
          <label className="form-control">
            <span className="label-text">Product description:</span>
            <textarea
              className="textarea textarea-bordered h-24"
              value={product?.description || ""}
              onChange={(e) =>
                setProduct({ ...product!, description: e.target.value })
              }
            ></textarea>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            onClick={updateProduct}
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 focus:ring-2"
          >
            Update product
          </button>

          <button
            type="button"
            onClick={deleteProduct}
            className="uppercase bg-red-600 px-10 py-5 text-lg border border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 focus:ring-2"
          >
            Delete product
          </button>
        </div>

        <p className="text-xl max-sm:text-lg text-error">
          To delete the product you first need to delete all its records in
          orders (customer_order_product table).
        </p>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
