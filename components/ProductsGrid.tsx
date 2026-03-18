// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/components/grasa/CartContext";
// import { FiPlus, FiMinus } from "react-icons/fi";

// type Product = {
//   id: number;
//   name: string;
//   description: string;
//   price: string;
//   effective_price: number;
//   discount_percent: number;
//   stock_quantity: number;
//   image_url: string;
// };

// export default function ProductsGrid() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [addingId, setAddingId] = useState<number | null>(null);

//   const router = useRouter();

//   const { cart, addToCart, updateQuantity } = useCart();

//   const API_URL = "https://medicaps.cloud/millets/products?sort=-price";

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(API_URL);
//         const data = await res.json();
//         setProducts(data.items || []);
//       } catch (error) {
//         console.error("Failed to fetch products", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleAddToCart = async (productId: number) => {
//     setAddingId(productId);

//     await addToCart({
//       product_id: productId,
//       quantity: 1,
//     });

//     setAddingId(null);
//   };

//   const getCartItem = (productId: number) => {
//     return cart.find((item) => item.product_id === productId);
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-20 text-lg font-medium">
//         Loading Products...
//       </div>
//     );
//   }

//   return (
//     <section className="bg-[#f5f5f5] py-16">
//       <div className="w-[90%] mx-auto">
//         <h2 className="text-3xl font-semibold mb-10">Millet Products</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {products.map((product) => {
//             const cartItem = getCartItem(product.id);

//             return (
//               <div
//                 key={product.id}
//                 className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-lg transition overflow-hidden"
//               >
//                 <div className="w-full h-[230px] overflow-hidden">
//                   <img
//                     src={product.image_url}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="p-4 space-y-1">
//                   <h3 className="text-xl font-semibold line-clamp-1">
//                     {product.name}
//                   </h3>

//                   <div className="flex items-center gap-3">
//                     <span className="text-gray-500 line-through text-sm">
//                       ₹{product.price}
//                     </span>

//                     <span className="text-green-700 text-md font-semibold">
//                       {product.discount_percent.toFixed(1)}% OFF
//                     </span>
//                   </div>

//                   <div className="text-2xl font-bold text-green-900">
//                     ₹{product.effective_price}
//                   </div>

//                   <p className="text-gray-600 text-sm line-clamp-2">
//                     {product.description}
//                   </p>

//                   <div className="flex gap-4 pt-2">
//                     <button
//                       onClick={() => router.push(`/products/${product.id}`)}
//                       className="flex-1 bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900 transition"
//                     >
//                       View Details
//                     </button>

//                     {/* CART ACTION */}
//                     {!cartItem ? (
//                       <button
//                         disabled={
//                           product.stock_quantity === 0 ||
//                           addingId === product.id
//                         }
//                         onClick={() => handleAddToCart(product.id)}
//                         className={`flex-1 py-3 rounded-lg font-medium transition
//                         ${
//                           product.stock_quantity === 0
//                             ? "bg-gray-300 cursor-not-allowed"
//                             : "bg-[#C5D82D] text-gray-900 font-semibold hover:bg-[#b8cc28]"
//                         }`}
//                       >
//                         {addingId === product.id
//                           ? "Adding..."
//                           : product.stock_quantity === 0
//                           ? "Out of Stock"
//                           : "Add to Cart"}
//                       </button>
//                     ) : (
//                       <div className="flex items-center justify-between bg-[#C5D82D] rounded-lg  flex-1">
//                         <button
//                           onClick={() =>
//                             updateQuantity(product.id, "decrement")
//                           }
//                           className="p-1 hover:bg-black/10 rounded"
//                         >
//                           <FiMinus size={18} />
//                         </button>

//                         <span className="font-semibold text-lg">
//                           {cartItem.quantity}
//                         </span>

//                         <button
//                           onClick={() =>
//                             updateQuantity(product.id, "increment")
//                           }
//                           className="p-1 hover:bg-black/10 rounded"
//                         >
//                           <FiPlus size={18} />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/components/grasa/CartContext";
// import { FiPlus, FiMinus } from "react-icons/fi";
// import toast, { Toaster } from "react-hot-toast";

// type Product = {
//   id: number;
//   name: string;
//   description: string;
//   price: string;
//   effective_price: number;
//   discount_percent: number;
//   stock_quantity: number;
//   image_url: string;
// };

// export default function ProductsGrid() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [addingId, setAddingId] = useState<number | null>(null);

//   const router = useRouter();
//   const { cart, addToCart, updateQuantity } = useCart();

//   const API_URL = "https://medicaps.cloud/millets/products?sort=-price";

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(API_URL);
//         const data = await res.json();
//         setProducts(data.items || []);
//       } catch (error) {
//         console.error("Failed to fetch products", error);
//         toast.error("Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleAddToCart = async (productId: number, name: string) => {
//     setAddingId(productId);

//     const success = await addToCart({
//       product_id: productId,
//       quantity: 1,
//     });

//     if (success) {
//       toast.success(`${name} added to cart`);
//     } else {
//       toast.error("Please login first");
//     }

//     setAddingId(null);
//   };

//   const handleIncrement = async (productId: number, name: string) => {
//     await updateQuantity(productId, "increment");
//     toast.success(`${name} quantity increased`);
//   };

//   const handleDecrement = async (productId: number, name: string) => {
//     await updateQuantity(productId, "decrement");
//     toast.success(`${name} quantity decreased`);
//   };

//   const getCartItem = (productId: number) => {
//     return cart.find((item) => item.product_id === productId);
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-20 text-lg font-medium">
//         Loading Products...
//       </div>
//     );
//   }

//   return (
//     <section className="bg-[#f5f5f5] py-16">
//       <Toaster
//         position="bottom-center"
//         toastOptions={{
//           duration: 2500,
//           style: {
//             background: "#1f2937",
//             color: "#fff",
//             borderRadius: "10px",
//           },
//         }}
//       />

//       <div className="w-[90%] mx-auto">
//         <h2 className="text-3xl font-semibold mb-10">
//           Millet Products
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {products.map((product) => {
//             const cartItem = getCartItem(product.id);

//             return (
//               <div
//                 key={product.id}
//                 className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-lg transition overflow-hidden"
//               >
//                 <div className="w-full h-[230px] overflow-hidden">
//                   <img
//                     src={product.image_url}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="p-4 space-y-1">
//                   <h3 className="text-xl font-semibold line-clamp-1">
//                     {product.name}
//                   </h3>

//                   <div className="flex items-center gap-3">
//                     <span className="text-gray-500 line-through text-sm">
//                       ₹{product.price}
//                     </span>

//                     <span className="text-green-700 text-md font-semibold">
//                       {product.discount_percent.toFixed(1)}% OFF
//                     </span>
//                   </div>

//                   <div className="text-2xl font-bold text-green-900">
//                     ₹{product.effective_price}
//                   </div>

//                   <p className="text-gray-600 text-sm line-clamp-2">
//                     {product.description}
//                   </p>

//                   <div className="flex gap-4 pt-2">
//                     <button
//                       onClick={() =>
//                         router.push(`/products/${product.id}`)
//                       }
//                       className="flex-1 bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900 transition"
//                     >
//                       View Details
//                     </button>

//                     {!cartItem ? (
//                       <button
//                         disabled={
//                           product.stock_quantity === 0 ||
//                           addingId === product.id
//                         }
//                         onClick={() =>
//                           handleAddToCart(
//                             product.id,
//                             product.name
//                           )
//                         }
//                         className={`flex-1 py-3 rounded-lg font-medium transition
//                         ${
//                           product.stock_quantity === 0
//                             ? "bg-gray-300 cursor-not-allowed"
//                             : "bg-[#C5D82D] text-gray-900 font-semibold hover:bg-[#b8cc28]"
//                         }`}
//                       >
//                         {addingId === product.id
//                           ? "Adding..."
//                           : product.stock_quantity === 0
//                           ? "Out of Stock"
//                           : "Add to Cart"}
//                       </button>
//                     ) : (
//                       <div className="flex items-center justify-between bg-[#C5D82D] rounded-lg flex-1 px-3">
//                         <button
//                           onClick={() =>
//                             handleDecrement(
//                               product.id,
//                               product.name
//                             )
//                           }
//                           className="p-2 hover:bg-black/10 rounded"
//                         >
//                           <FiMinus size={18} />
//                         </button>

//                         <span className="font-semibold text-lg">
//                           {cartItem.quantity}
//                         </span>

//                         <button
//                           onClick={() =>
//                             handleIncrement(
//                               product.id,
//                               product.name
//                             )
//                           }
//                           className="p-2 hover:bg-black/10 rounded"
//                         >
//                           <FiPlus size={18} />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/grasa/CartContext";
import { FiPlus, FiMinus } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  effective_price: number;
  discount_percent: number;
  stock_quantity: number;
  image_url: string;
};

export default function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();

  const API_URL = "https://medicaps.cloud/millets/products?sort=-price";

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

  const handleAddToCart = async (productId: number, name: string) => {
    setAddingId(productId);

    const success = await addToCart({
      product_id: productId,
      quantity: 1,
    });

    if (success) {
      toast.success(`${name} added to cart`);
    } else {
      toast.error("Please login first");
    }

    setAddingId(null);
  };

  const handleIncrement = async (productId: number, name: string) => {
    await updateQuantity(productId, "increment");
    toast.success(`${name} quantity increased`);
  };

  const handleDecrement = async (productId: number, name: string) => {
    await updateQuantity(productId, "decrement");
    toast.success(`${name} quantity decreased`);
  };

  const getCartItem = (productId: number) => {
    return cart.find((item) => item.product_id === productId);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Loading Products...
      </div>
    );
  }

  return (
    <section className="bg-[#f5f5f5] py-16">
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />

      <div className="w-[90%] mx-auto">
        <h2 className="text-3xl font-semibold mb-10">
          Millet Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const cartItem = getCartItem(product.id);

            return (
              <div
                key={product.id}
                onClick={() => router.push(`/products/${product.id}`)}
                className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer"
              >
                <div className="w-full h-[230px] overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="text-xl font-semibold line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 line-through text-sm">
                      ₹{product.price}
                    </span>

                    <span className="text-green-700 text-md font-semibold">
                      {product.discount_percent.toFixed(1)}% OFF
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-green-900">
                    ₹{product.effective_price}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>

                  <div
                    className="flex gap-4 pt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        router.push(`/products/${product.id}`)
                      }
                      className="flex-1 bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900 transition"
                    >
                      View Details
                    </button>

                    {!cartItem ? (
                      <button
                        disabled={
                          product.stock_quantity === 0 ||
                          addingId === product.id
                        }
                        onClick={() =>
                          handleAddToCart(
                            product.id,
                            product.name
                          )
                        }
                        className={`flex-1 py-3 rounded-lg font-medium transition
                        ${
                          product.stock_quantity === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-[#C5D82D] text-gray-900 font-semibold hover:bg-[#b8cc28]"
                        }`}
                      >
                        {addingId === product.id
                          ? "Adding..."
                          : product.stock_quantity === 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-[#C5D82D] rounded-lg flex-1 px-3">
                        <button
                          onClick={() =>
                            handleDecrement(
                              product.id,
                              product.name
                            )
                          }
                          className="p-2 hover:bg-black/10 rounded"
                        >
                          <FiMinus size={18} />
                        </button>

                        <span className="font-semibold text-lg">
                          {cartItem.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleIncrement(
                              product.id,
                              product.name
                            )
                          }
                          className="p-2 hover:bg-black/10 rounded"
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
  );
}