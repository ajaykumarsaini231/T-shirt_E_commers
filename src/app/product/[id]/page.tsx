"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProductStore } from "@/app/_zustand/store";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useProductStore();
  const { addToWishlist } = useWishlistStore();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const userId = user?.id || null;
  const isLoggedIn = !!token;

  // 🔹 Fetch Product + Related Products
  useEffect(() => {
    if (params?.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`)
        .then((res) => res.json())
        .then(async (data) => {
          setProduct(data);

          // ✅ Fetch same-category products
          if (data?.categoryId) {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products?categoryId=${data.categoryId}`
              );
              const all = await res.json();
              // exclude current product
              const filtered = all.filter(
                (p: any) => (p._id || p.id) !== (data._id || data.id)
              );
              setRelatedProducts(filtered);
            } catch (err) {
              console.error("❌ Related products fetch error:", err);
            }
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Product fetch error:", err);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) return router.push("/login");

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

      if (!res.ok) throw new Error("Failed to add to cart");

      const data = await res.json();

      addToCart({
        id: product._id || product.id,
        title: product.title,
        price: product.price,
        image: product.mainImage,
        amount: 1,
      });

      console.log("✅ Cart updated:", data);
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) return router.push("/login");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          items: [{ productId: product._id || product.id, quantity: 1 }],
        }),
      });

      if (!res.ok) throw new Error("Checkout failed");

      const { checkoutUrl } = await res.json();
      router.push(checkoutUrl || "/checkout");
    } catch (err) {
      console.error("❌ Error on buy now:", err);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isLoggedIn) return router.push("/login");

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

      if (!res.ok) throw new Error("Failed to add to wishlist");

      const data = await res.json();

      addToWishlist({
        id: product._id || product.id,
        title: product.title,
        price: product.price,
        image: product.mainImage,
      });

      console.log("✅ Wishlist updated:", data);
    } catch (err) {
      console.error("❌ Error adding to wishlist:", err);
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!product)
    return <p className="text-center py-10 text-red-500">Product not found</p>;

  const imageUrl = `${product.mainImage}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative w-full h-[500px] border rounded-lg overflow-hidden group">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-2xl font-bold text-indigo-600 mb-6">
            ₹{(product.price || 0).toFixed(2)}
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
            >
              Buy Now
            </button>
          </div>

          <button
            onClick={handleAddToWishlist}
            className="px-4 py-2 border rounded-lg text-pink-500 border-pink-400 hover:bg-pink-50"
          >
            ♥ Add to Wishlist
          </button>
        </div>
      </div>

      {/* Similar Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2
            className="
    text-2xl md:text-3xl font-extrabold 
    mb-6 text-center 
    text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500
    relative inline-block
    animate-fadeIn
  "
          >
            Similar Products
            <span className="absolute left-1/2 -bottom-1 w-16 h-[3px] bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transform -translate-x-1/2"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id || item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* 🔹 ProductCard component (inline in same file) */
const ProductCard = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useProductStore();
  const { addToWishlist } = useWishlistStore();

  // ✅ JWT token aur userId localStorage se
  const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const user =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

const userId = user?.id || null;

const isLoggedIn = !!token;

console.log("🛒 Sending cart request:", { userId, productId: product._id || product.id });

  const imageUrl = `${product.mainImage}`;

  // --- Add to Cart ---
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

    const data = await res.json();

    addToCart({
      id: product._id || product.id,
      title: product.title,
      price: product.price,
      image: product.mainImage,
      amount: 1,
    });

    toast.success("🛒 Product added to cart!");
    
    // ✅ Trigger Header Update
    window.dispatchEvent(new Event("cartUpdated"));

  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    toast.error("Something went wrong, please try again!");
  }
};




  // --- Add to Wishlist ---
  // --- Add to Wishlist ---
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
        message = "⚠️ Product is already in your wishlist";
      }
      toast.error(message);
      return;
    }

    const data = await res.json();

    addToWishlist({
      id: product._id || product.id,
      title: product.title,
      price: product.price,
      image: product.mainImage,
    });

    toast.success("✅ Product added to wishlist!");
    
    // ✅ Trigger Header Update
    window.dispatchEvent(new Event("wishlistUpdated"));

  } catch (err) {
    console.error("❌ Error adding to wishlist:", err);
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
