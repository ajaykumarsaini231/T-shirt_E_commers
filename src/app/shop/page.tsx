"use client";
import React from "react";
import { ChevronDown, X, Menu, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/app/_zustand/store";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { toast } from "react-hot-toast";
import { SlidersHorizontal, Heart, ShoppingCart } from "lucide-react";

// ---------------- Product Skeleton ----------------
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow animate-pulse p-4 flex flex-col">
    <div className="h-44 bg-gray-200 rounded-md mb-4" />
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-full mb-6" />
    <div className="mt-auto flex justify-between items-center">
      <div className="h-6 bg-gray-200 rounded w-20" />
      <div className="h-8 bg-gray-200 rounded w-24" />
    </div>
  </div>
);

// ---------------- Filter Sidebar ---------------

const FilterSidebar = ({
  filters,
  onFilterChange,
  categories,
  collapsedOnMobile,
  onToggleCollapse,
}) => {
  const [open, setOpen] = React.useState({
    brand: true,
    size: false,
    category: true,
    price: false,
    rating: false,
  });

  const toggle = (section) =>
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));

  return (
    <aside
      className={`w-full md:w-64 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm h-fit sticky top-24 transition-transform duration-300 z-10 ${
        collapsedOnMobile
          ? "-translate-x-full md:translate-x-0"
          : "translate-x-0"
      }`}
    >
      {/* Mobile Header */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Filters</h3>
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <h3 className="hidden md:block text-lg font-bold mb-4">Filter By</h3>

      {/* Brand */}
      {/* <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => toggle("brand")}
          className="flex justify-between w-full font-semibold text-gray-800"
        >
          Brand
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open.brand ? "rotate-180" : ""
            }`}
          />
        </button>
        {open.brand && (
          <div className="mt-3 space-y-2">
            {["Hush", "Levi's", "AG", "French Connection"].map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.brand?.includes(brand)}
                  onChange={(e) =>
                    onFilterChange("brand", brand, e.target.checked)
                  }
                />
                {brand}
              </label>
            ))}
          </div>
        )}
      </div> */}

      {/* Category - Single Select (Radio) */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => toggle("category")}
          className="flex justify-between w-full font-semibold text-gray-800"
        >
          Category
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open.category ? "rotate-180" : ""
            }`}
          />
        </button>
        {open.category && (
          <div className="mt-3 space-y-2">
            {categories?.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category?.includes(cat.id)}
                  onChange={(e) =>
                    onFilterChange("category", cat.id, e.target.checked)
                  }
                />
                {cat.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => toggle("size")}
          className="flex justify-between w-full font-semibold text-gray-800"
        >
          Size
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open.size ? "rotate-180" : ""
            }`}
          />
        </button>
        {open.size && (
          <div className="mt-3 space-y-2">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <label key={size} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.size?.includes(size)}
                  onChange={(e) =>
                    onFilterChange("size", size, e.target.checked)
                  }
                />
                {size}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <button
          onClick={() => toggle("price")}
          className="flex justify-between w-full font-semibold text-gray-800"
        >
          Price
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open.price ? "rotate-180" : ""
            }`}
          />
        </button>
        {open.price && (
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={filters.price ?? 2000}
              onChange={(e) =>
                onFilterChange("price", Number(e.target.value), null)
              }
              className="w-full accent-indigo-600"
            />
            <p className="text-sm mt-1 text-gray-600">Up to ₹{filters.price}</p>
          </div>
        )}
      </div>

      {/* Rating */}
      <div>
        <button
          onClick={() => toggle("rating")}
          className="flex justify-between w-full font-semibold text-gray-800"
        >
          Avg. Review Rating
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open.rating ? "rotate-180" : ""
            }`}
          />
        </button>
        {open.rating && (
          <div className="mt-3 space-y-2">
            {[5, 4, 3].map((r) => (
              <label key={r} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === r}
                  onChange={() =>
                    onFilterChange(
                      "rating",
                      null,
                      filters.rating === r ? null : r
                    )
                  }
                />
                <span className="flex text-yellow-400">
                  {Array.from({ length: r }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                  ))}
                </span>
                <span className="text-gray-600 ml-1">& up</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => onFilterChange("__reset", null, null)}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
};

// ---------------- Product Card ----------------

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useProductStore();
  const { addToWishlist } = useWishlistStore();

  // ✅ Auth Info
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const userId = user?.id || null;
  const isLoggedIn = !!token;

  const imageUrl =
    product.mainImage ||
    "https://placehold.co/600x400/cccccc/ffffff?text=No+Image";

  // --- Add to Cart ---
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          productId: product._id || product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Cart API error:", res.status, errorText);
        toast.error("⚠️ Failed to add product to cart");
        return;
      }

      addToCart({
        id: product._id || product.id,
        title: product.title,
        price: product.price,
        image: product.mainImage,
        amount: 1,
      });

      toast.success("🛒 Product added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      toast.error("Something went wrong, please try again!");
    }
  };

  // --- Add to Wishlist ---
  const handleAddToWishlist = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            productId: product._id || product.id,
          }),
        }
      );

      if (!res.ok) {
        let message = "Something went wrong!";
        if (res.status === 409) message = "⚠️ Already in your wishlist";
        toast.error(message);
        return;
      }

      addToWishlist({
        id: product._id || product.id,
        title: product.title,
        price: product.price,
        image: product.mainImage,
      });

      toast.success("❤️ Added to wishlist!");
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error("❌ Error adding to wishlist:", err);
      toast.error("Something went wrong, please try again!");
    }
  };

  // --- Rating Stars ---
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-gray-100">
      <div
        className="relative cursor-pointer"
        onClick={() => router.push(`/product/${product._id || product.id}`)}
      >
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-60 object-cover rounded-t-2xl"
          onError={(e) =>
            (e.currentTarget.src =
              "https://placehold.co/600x400/cccccc/ffffff?text=Image+Error")
          }
        />
      </div>

      <div className="flex flex-col flex-grow p-4">
        <h3
          className="text-lg font-semibold text-gray-800 mb-1 cursor-pointer line-clamp-1"
          onClick={() => router.push(`/product/${product._id || product.id}`)}
        >
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {renderStars(product.rating || 0)}
          <span className="text-xs text-gray-500">
            ({product.rating?.toFixed(1) || "0"})
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <p className="text-xl font-bold text-indigo-600">
            ₹{(product.price || 0).toFixed(2)}
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleAddToWishlist}
              className="p-2 rounded-lg border border-gray-200 hover:bg-pink-50"
            >
              <Heart className="w-5 h-5 text-pink-500" />
            </button>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1 bg-indigo-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ---------------- Main Shop Page ----------------


export default function ShopPage() {
  const [products, setProducts] = React.useState([]);
  const [filtered, setFiltered] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [filters, setFilters] = React.useState({
    brand: [],
    size: [],
    category: [],
    price: 2000,
    rating: null,
  });
  const [sort, setSort] = React.useState("relevance");
  const [search, setSearch] = React.useState("");
  const [hideOutOfStock, setHideOutOfStock] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [collapsedOnMobile, setCollapsedOnMobile] = React.useState(true);

  // ✅ Fetch products and categories
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
        ]);
        const pData = await pRes.json();
        const cData = await cRes.json();
        setProducts(pData);
        setFiltered(pData);
        setCategories(cData);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Handle filter changes (category fetch)
  const onFilterChange = async (type, value, checked) => {
    setFilters((prev) => {
      if (type === "price") {
        const priceVal = Number(value) || prev.price;
        return { ...prev, price: priceVal };
      }
      if (type === "rating") return { ...prev, rating: checked };
      if (type === "__reset")
        return { brand: [], size: [], category: [], price: 2000, rating: null };
      if (type === "category") return { ...prev, category: checked ? [value] : [] };

      const updated = new Set(prev[type]);
      checked ? updated.add(value) : updated.delete(value);
      return { ...prev, [type]: Array.from(updated) };
    });

    // ✅ Fetch category products dynamically
    if (type === "category") {
      setLoading(true);
      try {
        const res = await fetch(
          checked
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/products?categoryId=${value}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        );
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        console.error("❌ Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ Apply all filters locally (price, rating, brand, size, out-of-stock, search)
  React.useEffect(() => {
    let result = Array.isArray(products) ? [...products] : [];

    // Brand filter
    if (filters.brand?.length)
      result = result.filter((p) => filters.brand.includes(p.manufacturer));

    // Size filter
    if (filters.size?.length)
      result = result.filter((p) => filters.size.includes(p.size));

    // Price filter
    const priceCap = Number(filters.price) || Infinity;
    result = result.filter((p) => Number(p.price ?? 0) <= priceCap);

    // Rating filter
    if (filters.rating != null)
      result = result.filter((p) => (p.rating ?? 0) >= Number(filters.rating));

    // ✅ Hide out of stock
    if (hideOutOfStock)
      result = result.filter((p) => (p.inStock ?? 0) > 0);

    // ✅ Search filter
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.manufacturer?.toLowerCase().includes(query)
      );
    }

    setFiltered(result);
  }, [filters, products, search, hideOutOfStock]);

  // ✅ Sorting logic
  const sortedProducts = React.useMemo(() => {
    if (sort === "priceLow") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [sort, filtered]);

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={onFilterChange}
          categories={categories}
          collapsedOnMobile={collapsedOnMobile}
          onToggleCollapse={() => setCollapsedOnMobile(!collapsedOnMobile)}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* ✅ Top Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
            {/* Mobile filter toggle */}
            <button
              className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow-sm text-sm font-medium"
              onClick={() => setCollapsedOnMobile(!collapsedOnMobile)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Search bar */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />

            {/* Hide out of stock toggle */}
            <label className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hideOutOfStock}
                onChange={(e) => setHideOutOfStock(e.target.checked)}
                className="accent-indigo-500"
              />
              Hide Out of Stock
            </label>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* ✅ Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : sortedProducts.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16">
              No products match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
