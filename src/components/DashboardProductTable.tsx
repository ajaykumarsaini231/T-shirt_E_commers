"use client";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import slugify from "slugify";

interface Product {
  id?: string;
  slug?: string;
  title: string;
  description?: string;
  price: number;
  manufacturer?: string;
  inStock?: number;
  categoryId?: string;
  mainImage: string;
  size?: string; // ✅ Add this
  images?: { imageID: string; image: string }[];
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (product: Product) => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [productData, setProductData] = useState<Partial<Product>>({
    title: "",
    price: 0,
    description: "",
    manufacturer: "",
    inStock: 0,
    categoryId: "",
    mainImage: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories when modal opens
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`); // fetch instead of
        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load categories");
      }
    })();
  }, [isOpen]);

  // Handle image selection & preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setImageFiles(files);

    const previews = files.map((f) => URL.createObjectURL(f));
    setPreviewImages(previews);
  };

  // console.log(productData);
  // Create product submission
  const handleCreate = async () => {
    if (!productData.title || !productData.price || !productData.categoryId) {
      return toast.error("Title, price, and category are required");
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: productData.title,
        slug: slugify(productData.title!, { lower: true }),
        price: productData.price,
        description: productData.description || "",
        manufacturer: productData.manufacturer || "",
        inStock: productData.inStock || 0,
        categoryId: productData.categoryId,
        mainImage:
          productData.mainImage || productData.images?.[0]?.image || "",
        images: productData.images?.map((img) => ({ image: img.image })) || [],
      };

      console.log(payload);
      const token = localStorage.getItem("token"); // example
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to create product");
      }

      // const createdProduct = await res.json();

      console.log(payload);

      const createdProduct = await res.json();
      toast.success("Product created successfully");
      onCreated(createdProduct);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Create Product</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <input
            type="text"
            placeholder="Title"
            value={productData.title || ""}
            onChange={(e) =>
              setProductData({ ...productData, title: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="number"
            placeholder="Price"
            value={productData.price || ""}
            onChange={(e) =>
              setProductData({ ...productData, price: Number(e.target.value) })
            }
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="text"
            placeholder="Manufacturer"
            value={productData.manufacturer || ""}
            onChange={(e) =>
              setProductData({ ...productData, manufacturer: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="text"
            placeholder="Size"
            value={productData.size || ""}
            onChange={(e) =>
              setProductData({ ...productData, size: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="number"
            placeholder="In Stock"
            value={productData.inStock || 0}
            onChange={(e) =>
              setProductData({
                ...productData,
                inStock: Number(e.target.value),
              })
            }
            className="w-full border rounded px-3 py-2"
          />

          <select
            value={productData.categoryId || ""}
            onChange={(e) =>
              setProductData({ ...productData, categoryId: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            value={productData.description || ""}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-1">Images</label>
            {productData.images?.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={img.image}
                  onChange={(e) => {
                    const newImages = [...(productData.images || [])];
                    newImages[idx].image = e.target.value;
                    setProductData({ ...productData, images: newImages });
                  }}
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = [...(productData.images || [])];
                    newImages.splice(idx, 1);
                    setProductData({ ...productData, images: newImages });
                  }}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newImages = [
                  ...(productData.images || []),
                  { imageID: "", image: "" },
                ];
                setProductData({ ...productData, images: newImages });
              }}
              className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Add Image URL
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 rounded border mr-3">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?mode=admin`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setProducts([]); // fallback if request fails
    }
  };

  fetchProducts();
}, []);


  return (
    <div className="w-full p-6">
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={(newProduct) => setProducts([newProduct, ...products])}
      />{" "}
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">All Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>
      {/* Table Container */}
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
        {/* Fixed Header */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Manufacturer</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Body */}
        <div className="max-h-[65vh] overflow-y-auto overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-400 italic"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={nanoid()}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          width={48}
                          height={48}
                          src={
                            product?.mainImage
                              ? `${product.mainImage}`
                              : "/product_placeholder.jpg"
                          }
                          alt={sanitize(product?.title) || "Product image"}
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {sanitize(product?.title)}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                          {sanitize(product?.description || "")}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {sanitize(product?.manufacturer)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {product?.inStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ₹{product?.price?.toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/dashboard/admin/products/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductTable;
