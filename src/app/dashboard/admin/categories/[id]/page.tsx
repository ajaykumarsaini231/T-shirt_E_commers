"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { nanoid } from "nanoid";
import axios from "axios";
import toast from "react-hot-toast";

function CategoryProductsManager({ categoryId }: { categoryId: string }) {
  const [inCategory, setInCategory] = useState<any[]>([]);
  const [notInCategory, setNotInCategory] = useState<any[]>([]);
  const [selectedInCategory, setSelectedInCategory] = useState<Set<string>>(
    new Set()
  );
  const [selectedNotInCategory, setSelectedNotInCategory] = useState<
    Set<string>
  >(new Set());
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({ in: true, out: false });

  const toggleFAQ = (key: "in" | "out") =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  // Fetch products split by category
  useEffect(() => {
    fetchSplitProducts();
  }, [categoryId]);

  const fetchSplitProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/split/${categoryId}`
      );
      setInCategory(res.data.inCategory || []);
      setNotInCategory(res.data.notInCategory || []);
    } catch {
      toast.error("Failed to load products");
    }
  };

  const toggleSelect = (
    id: string,
    setFn: React.Dispatch<React.SetStateAction<Set<string>>>,
    selectedSet: Set<string>
  ) => {
    const updated = new Set(selectedSet);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setFn(updated);
  };

  //  Move products (add/remove)
  const moveProducts = async (type: "remove" | "add") => {
    setLoading(true);
    try {
      const ids =
        type === "remove"
          ? Array.from(selectedInCategory)
          : Array.from(selectedNotInCategory);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No token found");
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/move-products`,
        {
          productIds: ids,
          categoryId: type === "remove" ? null : categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Must send token
          },
        }
      );

      toast.success(
        type === "remove"
          ? "Products removed from category"
          : "Products added successfully"
      );

      await fetchSplitProducts();
      setSelectedInCategory(new Set());
      setSelectedNotInCategory(new Set());
    } catch {
      toast.error("Failed to update products");
    } finally {
      setLoading(false);
    }
  };

  // Inner reusable table
  const ProductTable = ({
    products,
    selectedSet,
    toggleFn,
  }: {
    products: any[];
    selectedSet: Set<string>;
    toggleFn: (id: string) => void;
  }) => (
    <table className="min-w-full border border-gray-200 rounded-lg text-sm">
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td className="text-center py-6 text-gray-400 italic">
              No products found.
            </td>
          </tr>
        ) : (
          products.map((product) => {
            const selected = selectedSet.has(product.id);
            return (
              <tr
                key={nanoid()}
                className={`hover:bg-gray-50 transition-colors ${
                  selected ? "bg-green-50" : ""
                }`}
              >
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleFn(product.id)}
                    className="relative flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full hover:border-blue-500"
                  >
                    {selected && (
                      <CheckCircle2 className="text-blue-500 absolute w-6 h-6" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <Image
                    src={product.mainImage || "/product_placeholder.jpg"}
                    alt={product.title}
                    width={48}
                    height={48}
                    className="object-cover rounded-md"
                  />
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">
                      {product.description}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">{product.manufacturer}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  ₹{product.price?.toFixed(2)}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-6 mt-6">
      {/* Section 1: Products in Category */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleFAQ("in")}
          className="w-full flex justify-between items-center px-5 py-3 bg-gray-100 font-semibold"
        >
          <span>Products in this Category ({inCategory.length})</span>
          <span>{expanded.in ? "−" : "+"}</span>
        </button>

        {expanded.in && (
          <div className="p-4">
            <div className="max-h-96 overflow-y-auto">
              {" "}
              {/* Limit height and enable vertical scroll */}
              <ProductTable
                products={inCategory}
                selectedSet={selectedInCategory}
                toggleFn={(id) =>
                  toggleSelect(id, setSelectedInCategory, selectedInCategory)
                }
              />
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => moveProducts("remove")}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Remove from Category"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/*  Section 2: Other Products */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleFAQ("out")}
          className="w-full flex justify-between items-center px-5 py-3 bg-gray-100 font-semibold"
        >
          <span>Other Products ({notInCategory.length})</span>
          <span>{expanded.out ? "−" : "+"}</span>
        </button>

        {expanded.out && (
          <div className="p-4">
            <div className="max-h-96 overflow-y-auto">
              <ProductTable
                products={notInCategory}
                selectedSet={selectedNotInCategory}
                toggleFn={(id) =>
                  toggleSelect(
                    id,
                    setSelectedNotInCategory,
                    selectedNotInCategory
                  )
                }
              />
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => moveProducts("add")}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Add to Category"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DashboardSingleCategoryProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleCategory = ({ params }: DashboardSingleCategoryProps) => {
  const { id: categoryId } = use(params);
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Fetch category info
  useEffect(() => {
    const token = localStorage.getItem("token");

    apiClient
      .get(`/api/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      })
      .then((res) => res.json())
      .then((data) => setCategoryName(data.name))
      .catch(() => toast.error("Failed to load category"));
  }, [categoryId]);

  //  Update category name
  const updateCategoryName = async () => {
    if (!categoryName.trim()) return toast.error("Category name required");
    setIsUpdatingName(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiClient.put(
        `/api/categories/${categoryId}`,
        { name: categoryName }, 
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );
      if (res.status === 200) toast.success("Category name updated");
      else throw new Error();
    } catch {
      toast.error("Failed to update category name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  //  Delete category
  const deleteCategory = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiClient.put(`/api/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        toast.success("Category deleted");
        router.push("/admin/categories");
      } else throw new Error();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Category</h1>

        {/* Category Name Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button
            onClick={updateCategoryName}
            disabled={isUpdatingName}
            className={`px-6 py-3 rounded-lg text-white transition ${
              isUpdatingName
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isUpdatingName ? "Updating..." : "Update Name"}
          </button>
          <button
            onClick={deleteCategory}
            disabled={isDeleting}
            className={`px-6 py-3 rounded-lg text-white transition ${
              isDeleting
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete Category"}
          </button>
        </div>

        {/*Products Management Component */}
        <CategoryProductsManager categoryId={categoryId} />
      </div>
    </div>
  );
};

export default DashboardSingleCategory;
