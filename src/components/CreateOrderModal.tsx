"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast";

interface Props {
  onClose: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Address {
  id: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
}

const CreateOrderModal: React.FC<Props> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<
    { productId: string; quantity: number }[]
  >([]);

  const [customAddress, setCustomAddress] = useState<Address>({
    id: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  // Load users + products
  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, productsRes] = await Promise.all([
        apiClient.get("/api/admin/users"),
        apiClient.get("/api/admin/products"),
      ]);

      const usersData = await usersRes.json();
      const productsData = await productsRes.json();

      setUsers(usersData.users || []);
      setProducts(productsData.products || []);
    };

    fetchData();
  }, []);

  // Load addresses when user changes
  useEffect(() => {
    if (!selectedUser) return;
    const fetchAddresses = async () => {
      const res = await apiClient.get(`/api/addresses/${selectedUser}`);
      const data = await res.json();
      setAddresses(data.addresses || []);
    };
    fetchAddresses();
  }, [selectedUser]);

  const handleAddProduct = (id: string) => {
    if (!selectedProducts.find((p) => p.productId === id)) {
      setSelectedProducts([...selectedProducts, { productId: id, quantity: 1 }]);
    }
  };

  const handleCreateOrder = async () => {
    try {
      const addressData =
        selectedAddress === "new" ? customAddress : addresses.find((a) => a.id === selectedAddress);

      const res = await apiClient.post("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          address: addressData?.address,
          city: addressData?.city,
          country: addressData?.country,
          postalCode: addressData?.postalCode,
          products: selectedProducts,
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      toast.success("✅ Order created successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(" Failed to create order");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-5">Create New Order</h2>

        {/* Select User */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">-- Choose User --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* Address Section */}
        {selectedUser && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Select Address</label>
            <select
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">-- Choose Saved Address --</option>
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.address}, {a.city}, {a.country}
                </option>
              ))}
              <option value="new">➕ New Address</option>
            </select>
          </div>
        )}

        {/* New Address Form */}
        {selectedAddress === "new" && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              className="input input-bordered"
              placeholder="Address"
              value={customAddress.address}
              onChange={(e) =>
                setCustomAddress({ ...customAddress, address: e.target.value })
              }
            />
            <input
              className="input input-bordered"
              placeholder="City"
              value={customAddress.city}
              onChange={(e) =>
                setCustomAddress({ ...customAddress, city: e.target.value })
              }
            />
            <input
              className="input input-bordered"
              placeholder="Country"
              value={customAddress.country}
              onChange={(e) =>
                setCustomAddress({ ...customAddress, country: e.target.value })
              }
            />
            <input
              className="input input-bordered"
              placeholder="Postal Code"
              value={customAddress.postalCode}
              onChange={(e) =>
                setCustomAddress({
                  ...customAddress,
                  postalCode: e.target.value,
                })
              }
            />
          </div>
        )}

        {/* Product Selection */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Select Products</label>
          <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-gray-500">${p.price}</p>
                </div>
                <button
                  onClick={() => handleAddProduct(p.id)}
                  className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">🛒 Selected Products</h4>
            {selectedProducts.map((p, idx) => {
              const prod = products.find((x) => x.id === p.productId);
              return (
                <div
                  key={p.productId}
                  className="flex justify-between items-center mb-2"
                >
                  <span>
                    {prod?.title} (${prod?.price})
                  </span>
                  <input
                    type="number"
                    min="1"
                    className="input input-bordered w-20"
                    value={p.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSelectedProducts((prev) =>
                        prev.map((sp, i) =>
                          i === idx ? { ...sp, quantity: val } : sp
                        )
                      );
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn btn-ghost border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateOrder}
            disabled={!selectedUser || selectedProducts.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md"
          >
             Create Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;
