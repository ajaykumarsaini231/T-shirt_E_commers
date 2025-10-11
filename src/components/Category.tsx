"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/app/_zustand/store";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

// --- Mock Backend Data (fallback ke liye) ---
interface Category {
  id: string;
  name: string;
}


interface Category {
  id: string;
  name: string;
}

interface CategoryPillProps {
  category: Category;
  isSelected: boolean;
  onClick: (id: string) => void;
}


const CategoryPill: React.FC<CategoryPillProps> = ({ category, isSelected, onClick }) => {
  const baseClasses =
    "px-4 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ease-in-out cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  const selectedClasses = "bg-indigo-600 text-white shadow-lg scale-105";
  const unselectedClasses =
    "bg-white text-gray-700 hover:bg-gray-100 ring-1 ring-inset ring-gray-200";

  return (
    <button
      onClick={() => onClick(category.id)}
      className={`${baseClasses} ${
        isSelected ? selectedClasses : unselectedClasses
      }`}
    >
      {category.name}
    </button>
  );
};



interface Product {
  _id?: string;
  id?: string;
  title: string;
  name?: string;
  description?: string;
  price: number;
  manufacturer: string;
  size: string;
  rating?: number;
  inStock?: number;
  categoryId?: string;
  mainImage: string;
}
//  Define props type for your ProductCard component
type ProductCardProps = {
  product: Product;
};


const mockCategories: Category[] = [
  { id: "all", name: "All Products" },
  { id: "1", name: "Electronics" },
  { id: "2", name: "Clothing" },
];

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Smartphone",
    manufacturer: "TechCorp",
    size: "6.1 inch",
    price: 799,
    rating: 4.5,
    inStock: 12,
    categoryId: "1",
    mainImage: "/phone.jpg",
  },
];

/* 🔹 ProductCard component (inline in same file) */
const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const { addToCart } = useProductStore();
  const { addToWishlist } = useWishlistStore();

  //  JWT token aur userId localStorage se
  const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const user =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

const userId = user?.id || null;

const isLoggedIn = !!token;

console.log("Sending cart request:", { userId, productId: product._id || product.id });

  const imageUrl = `${product.mainImage}`;
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
      console.error("Cart API error:", res.status, errorText);
      toast.error(" Failed to add product to cart");
      return;
    }

    const data = await res.json();

    addToCart({
      id: (product._id || product.id || "").toString(),
      title: product.title,
      price: product.price,
      image: product.mainImage,
      amount: 1,
    });

    toast.success(" Product added to cart!");
    
    // Trigger Header Update
    window.dispatchEvent(new Event("cartUpdated"));

  } catch (err) {
    console.error(" Error adding to cart:", err);
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        productId: product._id || product.id,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let message = "Something went wrong!";
      if (res.status === 409) {
        message = " Product is already in your wishlist";
      }
      toast.error(message);
      return;
    }

    const data = await res.json();

    addToWishlist({
      id: (product._id || product.id || "").toString(),
      title: product.title,
      price: product.price,
      image: product.mainImage,
    });

    toast.success("Product added to wishlist!");
    
    // Trigger Header Update
    window.dispatchEvent(new Event("wishlistUpdated"));

  } catch (err) {
    console.error(" Error adding to wishlist:", err);
    toast.error("Something went wrong, please try again!");
  }
};



  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col">
      <img
        className="w-full h-48 object-cover cursor-pointer"
        src={imageUrl}
        alt={product.title}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            "https://placehold.co/600x400/cccccc/ffffff?text=Image+Error";
        }}
        onClick={() => router.push(`/product/${product._id || product.id}`)}
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3
          className="text-xl font-bold text-gray-800 mb-2 cursor-pointer"
          onClick={() => router.push(`/product/${product._id || product.id}`)}
        >
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <p className="text-2xl font-black text-indigo-600">
            ₹{(product.price || 0).toFixed(2)}
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleAddToWishlist}
              className="p-2 rounded-lg border border-gray-200 hover:bg-pink-100 transition cursor-pointer"
            >
              <Heart className="w-5 h-5 text-pink-500" />
            </button>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1 bg-indigo-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition-colors duration-200 cursor-pointer"
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


// --- Main Page ---
const CategoryPage = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const VISIBLE_CATEGORIES_COUNT = 5;

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true); 
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`),
        ]);

        if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
        if (!productsResponse.ok) throw new Error("Failed to fetch products");

        const categoriesData = await categoriesResponse.json();
        const productsData = await productsResponse.json();

        setCategories([{ id: "all", name: "All Products" }, ...categoriesData]);
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("API call failed, fallback to mock data:", error);
        setCategories(mockCategories);
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleCategorySelect = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setFilteredProducts(products);
    } else {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${categoryId}`
        );
        if (!res.ok) throw new Error("Failed to fetch products by category");
        const categoryProducts = await res.json();
        setFilteredProducts(categoryProducts);
      } catch (err) {
        console.error(" Error fetching products by category:", err);
        setFilteredProducts(products.filter((p) => p.categoryId === categoryId));
      }
    }
  };

  const handleDropdownCategorySelect = (categoryId: string) => {
    handleCategorySelect(categoryId);
    setIsDropdownOpen(false);
  };

  const visibleCategories = categories.slice(0, VISIBLE_CATEGORIES_COUNT + 1);
  const hiddenCategories = categories.slice(VISIBLE_CATEGORIES_COUNT + 1);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
            Our Product Catalog
          </h1>
          <p className="text-lg text-gray-500">
            Find the best products from our curated collections.
          </p>
        </header>

        {/* Category Selector */}
        <nav className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-12">
          {visibleCategories.map((category) => (
            <CategoryPill
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={handleCategorySelect}
            />
          ))}
          {hiddenCategories.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="px-4 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ease-in-out cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 hover:bg-gray-100 ring-1 ring-inset ring-gray-200 flex items-center gap-1"
              >
                More
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 origin-top animate-fade-in-down">
                  <div className="py-1">
                    {hiddenCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleDropdownCategorySelect(category.id)}
                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                          selectedCategory === category.id
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700"
                        } hover:bg-gray-100`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Product Grid */}
        <main>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center col-span-full py-16">
                  <h3 className="text-2xl font-semibold text-gray-700">
                    No Products Found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    There are no products available in this category.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
