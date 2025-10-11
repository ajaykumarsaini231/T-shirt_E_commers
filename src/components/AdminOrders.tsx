"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import toast from "react-hot-toast"; 
import Image from "next/image";

/* -------------------------
   Types
   ------------------------- */
type Order = {
  id: string;
  name: string;
  country?: string;
  status: string;
  total: number;
  dateTime: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

interface Address {
  id?: string;
  name: string;
  lastname: string;
  address: string;
  apartment: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  company?: string; 
  orderNotice: string;
}


type Product = {
  id: string;
  title: string;
  price: number;
  mainImage?: string;
  inStock?: number;
};

/* -------------------------
   CreateOrderModal Component
   ------------------------- */
const CreateOrderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreated: (createdOrder: any) => void;
}> = ({ isOpen, onClose, onCreated }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string>(""); // address id or "new"
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const [addressForm, setAddressForm] = useState<Address>({
  name: "",
  lastname: "",
  address: "",
  apartment: "",
  city: "",
  country: "",
  postalCode: "",
  phone: "",
  company: "",
  orderNotice: " "
  });



  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );
  const [productSearch, setProductSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // fetch users & products when modal opens
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        setIsLoadingUsers(true);
        setIsLoadingProducts(true);

        const [uRes, pRes] = await Promise.all([
          apiClient.get("/api/admin/users"),
          apiClient.get("/api/products/list"),
        ]);

        // apiClient returns fetch Response — parse JSON
        const uJson = uRes.ok ? await uRes.json() : null;
        const pJson = pRes.ok ? await pRes.json() : null;

        // support both { users: [...] } and raw arrays
        const fetchedUsers: User[] =
          (uJson && (uJson.users || uJson)) || [];

        const fetchedProducts: Product[] =
          (pJson && (pJson.products || pJson)) || [];

        setUsers(fetchedUsers);
        setProducts(fetchedProducts);
      } catch (err: any) {
        console.error("Failed to load users/products:", err);
        toast.error("Failed to load users or products");
      } finally {
        setIsLoadingUsers(false);
        setIsLoadingProducts(false);
      }
    })();
  }, [isOpen]);

  // fetch addresses when user changes
  useEffect(() => {
    if (!selectedUserId) {
      setAddresses([]);
      setSelectedAddressId("");
      return;
    }

    (async () => {
      try {
        setIsLoadingAddresses(true);
        // Your address router: GET /api/user/addresses/:userId
        const res = await apiClient.get(`/api/user/addresses/${selectedUserId}`);
        if (!res.ok) {
          // backend might return 404 or empty array
          const errJson = await res.json().catch(() => ({}));
          console.warn("Failed addresses:", errJson);
          setAddresses([]);
          return;
        }
        const json = await res.json();
        const fetched: Address[] = json.addresses || json || [];
        setAddresses(fetched);
        // default to existing address if any
        if (fetched.length > 0) {
          setSelectedAddressId(fetched[0].id || "");
          setAddressForm({
            ...(fetched[0] as Address),
          });
        } else {
          setSelectedAddressId("new");
          setAddressForm({
            name: "",
            lastname: "",
            address: "",
            apartment: "",
            city: "",
            country: "",
            postalCode: "",
            phone: "",
            company:  "",
            orderNotice: " "
          });
        }
      } catch (err) {
        console.error("Failed to load addresses:", err);
        setAddresses([]);
      } finally {
        setIsLoadingAddresses(false);
      }
    })();
  }, [selectedUserId]);

  // helper: add product to cart
  const addProductToCart = (p: Product) => {
    setCart((prev) => {
      const ex = prev.find((it) => it.product.id === p.id);
      if (ex) {
        return prev.map((it) =>
          it.product.id === p.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [...prev, { product: p, quantity: 1 }];
    });
    setProductSearch("");
  };

  const updateQuantity = (productId: string, qty: number) =>
    setCart((prev) =>
      prev.map((it) =>
        it.product.id === productId ? { ...it, quantity: Math.max(1, qty) } : it
      )
    );

  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((it) => it.product.id !== productId));

  const total = useMemo(
    () => cart.reduce((s, it) => s + it.product.price * it.quantity, 0),
    [cart]
  );

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) &&
      !cart.some((c) => c.product.id === p.id)
  );

  // create order: first create customer_order, then create order-product rows
  const handleCreate = async () => {
    // basic validation
    if (!selectedUserId) return toast.error("Please select a user");
    if (cart.length === 0) return toast.error("Please add at least one product");
    // ensure required address fields exist
    const finalAddress =
      selectedAddressId && selectedAddressId !== "new"
        ? addresses.find((a) => a.id === selectedAddressId)
        : addressForm;

    if (!finalAddress || !finalAddress.address || !finalAddress.city || !finalAddress.country || !finalAddress.postalCode) {
      return toast.error("Please provide a shipping address");
    }

    setIsSubmitting(true);

    try {
      // Build order payload required by createCustomerOrder in backend.
      // Based on your validation, backend expects: name, lastname, phone, email, company, adress, apartment, postalCode, status, city, country, orderNotice, total
      // We fill from addressForm / selected user
      // Attempt to prefill name/email from users list
      const user = users.find((u) => u.id === selectedUserId);
// helper: ensures at least 5 characters are sent
const safe = (val: any, fallback: string) => {
  if (val && val.trim().length >= 5) return val.trim();
  if (val && val.trim().length > 0) return (val.trim() + "xxxxx").slice(0, 5);
  return fallback;
};

const orderPayload: any = {
  userId: selectedUserId,
  name: safe(finalAddress.name, "Guest"),
  lastname: safe(finalAddress.lastname, "UserX"),
  phone: safe(finalAddress.phone, "00000"),
  email: safe(user?.email || "", "email@x.com"),
  company: safe(finalAddress.company, "CompX"),
  address: safe(finalAddress.address, "Addrr"),
  apartment: safe(finalAddress.apartment, "Apart"),
  postalCode: safe(finalAddress.postalCode, "00000"),
  city: safe(finalAddress.city, "CityX"),
  country: safe(finalAddress.country, "Cntry"),
  orderNotice: safe(finalAddress.orderNotice, "Notex"),
  status: "processing",
  total: Math.round(total * 100) / 100,
  dateTime: new Date().toISOString(),
};
  

console.log(orderPayload)

      // 1) Create the customer order
      const createRes = await apiClient.post("/api/orders", orderPayload);

      if (!createRes.ok) {
        // try to parse error body
        const errBody = await createRes.json().catch(() => null);
        console.error("Create order failed", errBody);
        const message = errBody?.error || errBody?.message || `Create order failed (${createRes.status})`;
        throw new Error(message);
      }

      const created = await createRes.json();
      // backend earlier showed it returns { id: corder.id, message: "...", orderNumber: corder.id }
      const createdOrderId = created.id || created.orderNumber || created.order?.id || created.orderId;
      if (!createdOrderId) {
        // fallback: if backend returns the created order object
        const possibleId = created.id || (created.order && created.order.id);
        if (!possibleId) {
          console.warn("Could not determine new order id from response:", created);
        }
      }

      // 2) For each cart item, create customer_order_product entry
      // endpoint: POST /api/order-product expects { customerOrderId, productId, quantity } and requires identifier middleware (token)
      for (const item of cart) {
        const opayload = {
          customerOrderId: createdOrderId,
          productId: item.product.id,
          quantity: Number(item.quantity),
        };
        const productRes = await apiClient.post("/api/order-product", opayload);
        if (!productRes.ok) {
          const errBody = await productRes.json().catch(() => null);
          console.error("Order-product create failed", errBody);
          // continue but warn (you may choose to rollback in production)
          toast.error("Some products could not be added to the order");
        }
      }

      toast.success("Order created");
      onCreated({ id: createdOrderId, ...created });
      onClose();
    } catch (err: any) {
      console.error("Failed to create order:", err);
      toast.error(err.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Create Order</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* user + address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select User</label>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">-- choose user --</option>
                {isLoadingUsers ? (
                  <option>Loading...</option>
                ) : (
                  users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.email}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Saved Addresses</label>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={selectedAddressId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedAddressId(id);
                  if (id === "new") {
                    setAddressForm({
                      name: "",
                      lastname: "",
                      address: "",
                      apartment: "",
                      city: "",
                      country: "",
                      postalCode: "",
                      phone: "",
                      company:  "",
                      orderNotice: ""
                    });
                  } else {
                    const found = addresses.find((a) => a.id === id);
                    if (found) {
                      setAddressForm({
                        name: found.name,
                        lastname: found.lastname,
                        address: found.address,
                        apartment: found.apartment,
                        city: found.city,
                        country: found.country,
                        postalCode: found.postalCode,
                        phone: found.phone,
                        company: found.company || "",
                        orderNotice: found.orderNotice || "Good order pls be on time"
                      });
                    }
                  }
                }}
                disabled={!selectedUserId || isLoadingAddresses}
              >
                <option value="">-- choose saved address / new --</option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.address}, {a.city}, {a.country}
                  </option>
                ))}
                <option value="new">➕ Use a new address</option>
              </select>
            </div>
          </div>

          {/* address form */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  <input
    placeholder="First name"
    required
    value={addressForm.name || ""}
    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
    className="border rounded px-3 py-2"
  />
  <input
    placeholder="Last name"
    required
    value={addressForm.lastname || ""}
    onChange={(e) => setAddressForm({ ...addressForm, lastname: e.target.value })}
    className="border rounded px-3 py-2"
  />
  <input
    placeholder="Phone"
    required
    value={addressForm.phone || ""}
    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
    className="border rounded px-3 py-2"
  />

  {/* Company is optional now */}
  <input
    placeholder="Company (optional)"
    value={(addressForm as any).company || ""}
    onChange={(e) => setAddressForm({ ...(addressForm as any), company: e.target.value })}
    className="border rounded px-3 py-2"
  />

  <input
    placeholder="Address"
    required
    value={addressForm.address || ""}
    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
    className="border rounded px-3 py-2 md:col-span-2"
  />

  {/* Apartment is optional now */}
  <input
    placeholder="Apartment / suite (optional)"
    value={addressForm.apartment || ""}
    onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
    className="border rounded px-3 py-2"
  />

  <input
    placeholder="City"
    required
    value={addressForm.city || ""}
    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
    className="border rounded px-3 py-2"
  />
  <input
    placeholder="Country"
    required
    value={addressForm.country || ""}
    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
    className="border rounded px-3 py-2"
  />
  <input
    placeholder="Postal code"
    required
    value={addressForm.postalCode || ""}
    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
    className="border rounded px-3 py-2"
  />

  <input
    placeholder="Order notice (optional)"
    value={addressForm.orderNotice || ""}
    onChange={(e) => setAddressForm({ ...addressForm, orderNotice: e.target.value })}
    className="border rounded px-3 py-4 md:col-span-2"
  />
</div>


          {/* products list & search */}
          <div>
            <label className="block text-sm font-medium mb-2">Add Products</label>
            <input
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />

            <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
              {isLoadingProducts ? (
                <div>Loading products...</div>
              ) : (
                filteredProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      {p.mainImage ? (
                        <Image src={`${p.mainImage}`} alt={p.title} width={48} height={48} className="rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded" />
                      )}
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-gray-500">₹{p.price.toFixed(2)}</div>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => addProductToCart(p)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* cart */}
          <div>
            <h4 className="font-semibold mb-2">Cart</h4>
            {cart.length === 0 ? (
              <div className="text-sm text-gray-500">No products yet</div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{item.product.title}</div>
                      <div className="text-xs text-gray-500">₹{item.product.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value || "1"))}
                        className="w-20 border rounded px-2 py-1 text-center"
                      />
                      <div className="w-24 text-right font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-red-500">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div>
            <div className="text-sm text-gray-500">Subtotal</div>
            <div className="text-xl font-semibold">₹{total.toFixed(2)}</div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------
   AdminOrders page (uses modal)
   ------------------------- */
const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // fetch admin orders (GET /api/admin/orders)
    (async () => {
      try {
        const res = await apiClient.get("/api/admin/orders");
        if (!res.ok) {
          console.error("Failed to fetch admin orders");
          setOrders([]);
          return;
        }
        const json = await res.json();
        const list: Order[] = json.orders || json || [];
        setOrders(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreated = (created: any) => {
    // created contains id — navigate to detail page and optionally prepend to UI list
    const id = created?.id || created?.orderNumber || created?.order?.id;
    if (id) {
      router.push(`/dashboard/admin/orders/${id}`);
    } else {
      // fallback: refresh list
      setIsModalOpen(false);
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Orders</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Order
          </button>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-gray-500">No orders found</td></tr>
              )}
              {orders.map((o, i) => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">#{o.id}</td>
                  <td className="px-4 py-3">{o.name}</td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3">₹{Number(o.total || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">{new Date(o.dateTime).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/admin/orders/${o.id}`} className="text-indigo-600">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={handleCreated} />
    </>
  );
};

export default AdminOrdersPage;
