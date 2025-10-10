"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { formatCategoryName, convertCategoryNameToURLFriendly } from "../../../../utils/categoryFormating";
import apiClient from "@/lib/api";
import { Edit3, Trash2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    apiClient
      .get("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  };

  /** Add New Category */
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error("Enter a category name");
      return;
    }

    const name = convertCategoryNameToURLFriendly(newCategory.name);

    apiClient
      .post("/api/categories", { name })
      .then(res => {
        if (res.status === 201) return res.json();
        throw new Error("Failed to create category");
      })
      .then(() => {
        toast.success("Category added successfully");
        setNewCategory({ name: "" });
        setShowForm(false);
        fetchCategories();
      })
      .catch(() => toast.error("Error creating category"));
  };

  /** Start Editing */
  const startEdit = (category: Category) => {
    setEditId(category.id);
    setEditName(category.name);
  };

  /** Cancel Editing */
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  /** Update Category */
  const handleUpdateCategory = (id: string) => {
    if (!editName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    const name = convertCategoryNameToURLFriendly(editName);

    apiClient
      .put(`/api/categories/${id}`, { name })
      .then(res => {
        if (res.status === 200) return res.json();
        throw new Error("Failed to update category");
      })
      .then(() => {
        toast.success("Category updated successfully");
        cancelEdit();
        fetchCategories();
      })
      .catch(() => toast.error("Error updating category"));
  };

  /** Delete Category */
  const handleDeleteCategory = (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    apiClient
      .delete(`/api/categories/${id}`)
      .then(res => {
        if (res.status === 204) {
          toast.success("Category deleted successfully");
          fetchCategories();
        } else {
          throw new Error("Failed to delete category");
        }
      })
      .catch(() => toast.error("Error deleting category. Make sure it has no products."));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex max-w-screen-2xl mx-auto max-xl:flex-col">
      {/* Sidebar */}
      {/* <DashboardSidebar /> */}

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Categories</h1>
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Category"}
          </button>
        </div>

        {/* Inline Add Category Form */}
        {showForm && (
          <div className="mb-8 bg-white p-6 rounded-lg border space-y-4 max-w-md">
            <input
              type="text"
              placeholder="Category name"
              className="border rounded px-3 py-2 w-full"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ name: e.target.value })}
            />
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={handleAddCategory}
            >
              Create Category
            </button>
          </div>
        )}

        {/* Category List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((category: Category) => (
              <div
                key={category.id}
                className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition-shadow relative flex flex-col"
              >
                <div className="flex items-center space-x-4 mb-4">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-16 w-16 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold border">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    {editId === category.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                      />
                    ) : (
                      <h2 className="text-lg font-bold text-gray-800">
                        {formatCategoryName(category.name)}
                      </h2>
                    )}
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center">
                  {/* View Details button */}
                  <Link
                    href={`/dashboard/admin/categories/${category.id}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    View Details
                  </Link>

                  {editId === category.id ? (
                    <div className="flex space-x-2">
                      <button
                        className="flex items-center text-sm text-green-600 hover:text-green-800 font-medium"
                        onClick={() => handleUpdateCategory(category.id)}
                      >
                        <Check size={16} className="mr-1" /> Save
                      </button>
                      <button
                        className="flex items-center text-sm text-red-600 hover:text-red-800 font-medium"
                        onClick={cancelEdit}
                      >
                        <X size={16} className="mr-1" /> Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        className="flex items-center text-sm text-green-600 hover:text-green-800 font-medium"
                        onClick={() => startEdit(category)}
                      >
                        <Edit3 size={16} className="mr-1" /> Edit
                      </button>
                      <button
                        className="flex items-center text-sm text-red-600 hover:text-red-800 font-medium"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </button>
                    </div>
                  )}
                </div>

                {category.createdAt && (
                  <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 px-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">No Categories Found</h3>
              <p className="text-gray-500 mt-2">Add a new category to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCategory;
