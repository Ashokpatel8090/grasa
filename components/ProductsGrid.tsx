"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/grasa/CartContext";
import { FiPlus, FiMinus } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import Script from "next/script";
import { BASE_URL } from "@/components/config/api";

// ---------------- TYPES ----------------
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  effective_price: number;
  discount_percent: number;
  stock_quantity: number;
  image_url: string;
  nutritional_info_json?: {
    Ingredients?: string[];
    "What You'll Feel"?: string[];
    [key: string]: any;
  };
};

// --- HELPER COMPONENT: Handles Expand/Collapse with Unique Colors ---
const ExpandableTagList = ({ items, tagClassName }: { items: string[]; tagClassName: string }) => {
  const [expanded, setExpanded] = useState(false);
  const limit = 3;

  if (!items || items.length === 0) return null;

  const hasMore = items.length > limit;
  const visibleItems = expanded ? items : items.slice(0, limit);
  const remainingCount = items.length - limit;

  // Unique styling for the toggle button
  const toggleBtnClass = "bg-[#f4f4f2] border-[#d6d1c4] text-[#5c5c5c] hover:bg-[#ebecdf] hover:text-[#1b1b1b] border-dashed font-bold shadow-sm";

  return (
    <div className="flex flex-wrap gap-2 transition-all duration-300">
      {visibleItems.map((item, idx) => (
        <span key={idx} className={tagClassName}>
          {item}
        </span>
      ))}
      
      {hasMore && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents navigating to product page
            setExpanded(!expanded);
          }}
          className={`px-3 py-1 rounded-full text-[12px] transition-colors cursor-pointer border ${toggleBtnClass}`}
        >
          {expanded ? "− Show less" : `+${remainingCount} more`}
        </button>
      )}
    </div>
  );
};

// ---------------- MAIN COMPONENT ----------------
export default function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  const router = useRouter();
  const { cart, addToCart, updateQuantity, token } = useCart();

  const API_URL = `${BASE_URL}/millets/products?sort=-price`;

  // Fetch Products on Mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setProducts(data.items || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle Add to Cart with Login Redirect
  const handleAddToCart = async (productId: number, name: string) => {
    if (!token) {
      toast.error("Please login first to add items");
      router.push("/login");
      return;
    }

    setAddingId(productId);
    const success = await addToCart({
      product_id: productId,
      quantity: 1,
    });

    if (success) {
      toast.success(`${name} added to cart`);
    } else {
      toast.error("Failed to add product to cart");
    }
    setAddingId(null);
  };

  // Handle Increment with Login Redirect
  const handleIncrement = async (productId: number, name: string) => {
    if (!token) {
      router.push("/login");
      return;
    }
    await updateQuantity(productId, "increment");
    toast.success(`${name} quantity increased`);
  };

  // Handle Decrement with Login Redirect
  const handleDecrement = async (productId: number, name: string) => {
    if (!token) {
      router.push("/login");
      return;
    }
    await updateQuantity(productId, "decrement");
    toast.success(`${name} quantity decreased`);
  };

  const getCartItem = (productId: number) => {
    return cart.find((item) => item.product_id === productId);
  };

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#C5D82D] mb-4"></div>
        <p className="text-base sm:text-lg font-medium text-zinc-700 text-center">
          Loading ...
        </p>
      </div>
    );
  }

  const productSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Millet Products",
  "itemListElement": products.map((product, index) => ({
    "@type": "Product",
    "position": index + 1,
    "name": product.name,
    "description": product.description,
    "image": product.image_url,
    "sku": product.id.toString(),
    "brand": {
      "@type": "Brand",
      "name": "Grasa"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.effective_price,
      "availability":
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      "url": `https://www.grasamillets.com/products/${product.id}`
    }
  }))
};

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

    <section className="bg-[#f5f5f5] py-10">
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#1b1b1b",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />

      <div className="w-[90%] mx-auto">
        {/* Changed to Serif and applied your dark hex color */}
        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.15] mb-6">Millet Products</h2>
        <p className="text-[#5c5c5c] max-w-2xl mb-10 text-md leading-relaxed">
          Discover our range of wholesome, nutrient-dense millet products designed to support your health and fit seamlessly into your daily lifestyle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const cartItem = getCartItem(product.id);
            const nutrition = product.nutritional_info_json;
            const feelsList = nutrition?.["What You'll Feel"] || [];
            const ingredientsList = nutrition?.Ingredients || [];

            return (
              <div
                key={product.id}
                onClick={() => router.push(`/products/${product.id}`)}
                className="bg-white rounded-xl border border-[#d6d1c4] shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Product Image */}
                <div className="w-full h-[230px] overflow-hidden shrink-0">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  
                   <h3 className="text-xl font-bold text-[#1b1b1b] line-clamp-1 mb-1">
                    {product.name}
                  </h3>

                  {/* Price Section */}
                  {/* <div className="flex items-center gap-3 mb-1">
                    <span className="text-[#5c5c5c] line-through text-sm">
                      ₹{product.price}
                    </span>
                    <span className="text-[#3b6b21] text-md font-semibold">
                      {product.discount_percent.toFixed(1)}% OFF
                    </span>
                  </div> */}

                  {product.discount_percent > 0 && (
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[#5c5c5c] line-through text-sm">
                        ₹{product.price}
                      </span>
                      <span className="text-[#3b6b21] text-md font-semibold">
                        {product.discount_percent.toFixed(1)}% OFF
                      </span>
                    </div>
                  )}

                  <div className="text-2xl font-bold text-[#1b1b1b] ">
                    ₹{product.effective_price}
                  </div>

                  {/* Dynamic Tags Section */}
                  <div className="flex-grow mb-2 flex flex-col gap-3 mt-1">
                    {feelsList.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-bold text-[#5c5c5c] uppercase tracking-wider mb-1">
                          What You'll Feel
                        </h4>
                        <ExpandableTagList 
                          items={feelsList} 
                          tagClassName="bg-[#f2fceb] border border-[#c3e6b1] text-[#3b6b21] px-3 py-1 rounded-full text-[11px] font-medium"
                        />
                      </div>
                    )}

                    {feelsList.length > 0 && ingredientsList.length > 0 && (
                      <hr className="border-[#d6d1c4]" />
                    )}

                    {ingredientsList.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-bold text-[#5c5c5c] uppercase tracking-wider mb-1">
                          Key Ingredients
                        </h4>
                        <ExpandableTagList 
                          items={ingredientsList} 
                          tagClassName="bg-[#f4f4f2] border border-[#d6d1c4] text-[#1b1b1b] px-3 py-1 rounded-full text-[11px] font-medium"
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div
                    className="flex gap-4 pt-2 mt-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="flex-1 bg-[#1b1b1b] text-white py-3 rounded-lg font-medium hover:bg-[#333333] transition"
                    >
                      View Details
                    </button>

                    {!cartItem ? (
                      <button
                        disabled={product.stock_quantity === 0 || addingId === product.id}
                        onClick={() => handleAddToCart(product.id, product.name)}
                        className={`flex-1 py-3 rounded-lg font-medium transition
                        ${
                          product.stock_quantity === 0
                            ? "bg-[#e5e5e5] cursor-not-allowed text-[#5c5c5c]"
                            : "bg-[#C5D82D] text-[#1b1b1b] font-bold hover:bg-[#b8cc28]"
                        }`}
                      >
                        {addingId === product.id
                          ? "Adding..."
                          : product.stock_quantity === 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-[#C5D82D] rounded-lg flex-1 px-1 border border-black/5 text-[#1b1b1b]">
                        <button
                          onClick={() => handleDecrement(product.id, product.name)}
                          className="p-2 hover:bg-black/10 rounded-lg transition"
                        >
                          <FiMinus size={18} />
                        </button>

                        <span className="font-bold text-lg">
                          {cartItem.quantity}
                        </span>

                        <button
                          onClick={() => handleIncrement(product.id, product.name)}
                          className="p-2 hover:bg-black/10 rounded-lg transition"
                        >
                          <FiPlus size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
        </>
  );
}