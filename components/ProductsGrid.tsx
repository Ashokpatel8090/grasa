
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
//                 onClick={() => router.push(`/products/${product.id}`)}
//                 className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer"
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

//                   <div
//                     className="flex gap-4 pt-2"
//                     onClick={(e) => e.stopPropagation()}
//                   >
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
//   nutritional_info_json?: {
//     Ingredients?: string[];
//     "What You'll Feel"?: string[];
//     [key: string]: any;
//   };
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
//         <h2 className="text-3xl font-semibold mb-10">Millet Products</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {products.map((product) => {
//             const cartItem = getCartItem(product.id);
//             const nutrition = product.nutritional_info_json;
//             const feelsList = nutrition?.["What You'll Feel"] || [];
//             const ingredientsList = nutrition?.Ingredients || [];

//             return (
//               <div
//                 key={product.id}
//                 onClick={() => router.push(`/products/${product.id}`)}
//                 className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer flex flex-col"
//               >
//                 <div className="w-full h-[230px] overflow-hidden shrink-0">
//                   <img
//                     src={product.image_url}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="p-4 flex flex-col flex-grow">
//                   <h3 className="text-xl font-semibold line-clamp-1 mb-1">
//                     {product.name}
//                   </h3>

//                   <div className="flex items-center gap-3 mb-1">
//                     <span className="text-gray-500 line-through text-sm">
//                       ₹{product.price}
//                     </span>
//                     <span className="text-green-700 text-md font-semibold">
//                       {product.discount_percent.toFixed(1)}% OFF
//                     </span>
//                   </div>

//                   <div className="text-2xl font-bold text-green-900 mb-5">
//                     ₹{product.effective_price}
//                   </div>

//                   {/* Tags Section formatted like the screenshot */}
//                   <div className="flex-grow mb-6 flex flex-col gap-4">
                    
//                     {/* What You'll Feel Section */}
//                     {feelsList.length > 0 && (
//                       <div>
//                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
//                           What You'll Feel
//                         </h4>
//                         <div className="flex flex-wrap gap-2">
//                           {feelsList.map((feel: string, idx: number) => (
//                             <span
//                               key={idx}
//                               className="bg-[#f2fceb] border border-[#c3e6b1] text-[#3b6b21] px-3 py-1 rounded-full text-[12px] font-medium"
//                             >
//                               {feel}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Divider Line */}
//                     {feelsList.length > 0 && ingredientsList.length > 0 && (
//                       <hr className="border-gray-200" />
//                     )}

//                     {/* Key Ingredients Section */}
//                     {ingredientsList.length > 0 && (
//                       <div>
//                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
//                           Key Ingredients
//                         </h4>
//                         <div className="flex flex-wrap gap-2">
//                           {ingredientsList.map((ingredient: string, idx: number) => (
//                             <span
//                               key={idx}
//                               className="bg-[#fafafa] border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-[12px] font-medium"
//                             >
//                               {ingredient}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                   </div>

//                   <div
//                     className="flex gap-4 pt-2 mt-auto"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <button
//                       onClick={() => router.push(`/products/${product.id}`)}
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
//                           handleAddToCart(product.id, product.name)
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
//                             handleDecrement(product.id, product.name)
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
//                             handleIncrement(product.id, product.name)
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
//   nutritional_info_json?: {
//     Ingredients?: string[];
//     "What You'll Feel"?: string[];
//     [key: string]: any;
//   };
// };

// // --- NEW COMPONENT: Handles the Expand/Collapse logic for tags ---
// const ExpandableTagList = ({ items, tagClassName }: { items: string[]; tagClassName: string }) => {
//   const [expanded, setExpanded] = useState(false);
//   const limit = 3;

//   if (!items || items.length === 0) return null;

//   const visibleItems = expanded ? items : items.slice(0, limit);
//   const remainingCount = items.length - limit;

//   return (
//     <div className="flex flex-wrap gap-2">
//       {visibleItems.map((item, idx) => (
//         <span key={idx} className={tagClassName}>
//           {item}
//         </span>
//       ))}
      
//       {!expanded && remainingCount > 0 && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation(); // Prevents the card's router.push from firing
//             setExpanded(true);
//           }}
//           className={`${tagClassName} cursor-pointer hover:bg-gray-100 transition-colors shadow-sm`}
//         >
//           +{remainingCount} more
//         </button>
//       )}
//     </div>
//   );
// };
// // -----------------------------------------------------------------

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
//         <h2 className="text-3xl font-semibold mb-10">Millet Products</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {products.map((product) => {
//             const cartItem = getCartItem(product.id);
//             const nutrition = product.nutritional_info_json;
//             const feelsList = nutrition?.["What You'll Feel"] || [];
//             const ingredientsList = nutrition?.Ingredients || [];

//             return (
//               <div
//                 key={product.id}
//                 onClick={() => router.push(`/products/${product.id}`)}
//                 className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer flex flex-col"
//               >
//                 <div className="w-full h-[230px] overflow-hidden shrink-0">
//                   <img
//                     src={product.image_url}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="p-4 flex flex-col flex-grow">
//                   <h3 className="text-xl font-semibold line-clamp-1 mb-1">
//                     {product.name}
//                   </h3>

//                   <div className="flex items-center gap-3 mb-1">
//                     <span className="text-gray-500 line-through text-sm">
//                       ₹{product.price}
//                     </span>
//                     <span className="text-green-700 text-md font-semibold">
//                       {product.discount_percent.toFixed(1)}% OFF
//                     </span>
//                   </div>

//                   <div className="text-2xl font-bold text-green-900 mb-2">
//                     ₹{product.effective_price}
//                   </div>

//                   {/* Tags Section formatted like the screenshot */}
//                   <div className="flex-grow mb-2 flex flex-col gap-2">
                    
//                     {/* What You'll Feel Section */}
//                     {feelsList.length > 0 && (
//                       <div>
//                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
//                           What You'll Feel
//                         </h4>
//                         <ExpandableTagList 
//                           items={feelsList} 
//                           tagClassName="bg-[#f2fceb] border border-[#c3e6b1] text-[#3b6b21] px-3 py-1 rounded-full text-[12px] font-medium"
//                         />
//                       </div>
//                     )}

//                     {/* Divider Line */}
//                     {feelsList.length > 0 && ingredientsList.length > 0 && (
//                       <hr className="border-gray-200" />
//                     )}

//                     {/* Key Ingredients Section */}
//                     {ingredientsList.length > 0 && (
//                       <div>
//                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
//                           Key Ingredients
//                         </h4>
//                         <ExpandableTagList 
//                           items={ingredientsList} 
//                           tagClassName="bg-[#fafafa] border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-[12px] font-medium"
//                         />
//                       </div>
//                     )}

//                   </div>

//                   <div
//                     className="flex gap-4 pt-2 mt-auto"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <button
//                       onClick={() => router.push(`/products/${product.id}`)}
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
//                           handleAddToCart(product.id, product.name)
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
//                             handleDecrement(product.id, product.name)
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
//                             handleIncrement(product.id, product.name)
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
//   nutritional_info_json?: {
//     Ingredients?: string[];
//     "What You'll Feel"?: string[];
//     [key: string]: any;
//   };
// };

// // --- UPDATED COMPONENT: Handles Expand & Collapse logic ---
// // const ExpandableTagList = ({ items, tagClassName }: { items: string[]; tagClassName: string }) => {
// //   const [expanded, setExpanded] = useState(false);
// //   const limit = 3;

// //   if (!items || items.length === 0) return null;

// //   const hasMore = items.length > limit;
// //   const visibleItems = expanded ? items : items.slice(0, limit);
// //   const remainingCount = items.length - limit;

// //   return (
// //     <div className="flex flex-wrap gap-2 transition-all duration-300">
// //       {visibleItems.map((item, idx) => (
// //         <span key={idx} className={tagClassName}>
// //           {item}
// //         </span>
// //       ))}
      
// //       {hasMore && (
// //         <button
// //           onClick={(e) => {
// //             e.stopPropagation(); // Prevents clicking the tag from navigating to the product page
// //             setExpanded(!expanded);
// //           }}
// //           className={`${tagClassName} cursor-pointer  hover:bg-gray-100  border-dashed font-bold transition-colors shadow-sm`}
// //         >
// //           {expanded ? "Show less" : `+${remainingCount} more`}
// //         </button>
// //       )}
// //     </div>
// //   );
// // };



// const ExpandableTagList = ({ items, tagClassName }: { items: string[]; tagClassName: string }) => {
//   const [expanded, setExpanded] = useState(false);
//   const limit = 3;

//   if (!items || items.length === 0) return null;

//   const hasMore = items.length > limit;
//   const visibleItems = expanded ? items : items.slice(0, limit);
//   const remainingCount = items.length - limit;

//   // Unique styling for the toggle button
//   const toggleBtnClass = "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 border-dashed font-bold shadow-sm";

//   return (
//     <div className="flex flex-wrap gap-2 transition-all duration-300">
//       {visibleItems.map((item, idx) => (
//         <span key={idx} className={tagClassName}>
//           {item}
//         </span>
//       ))}
      
//       {hasMore && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation(); 
//             setExpanded(!expanded);
//           }}
//           // We combine the base tag layout (padding/radius) with our unique Indigo colors
//           className={`px-3 py-1 rounded-full text-[12px] transition-colors cursor-pointer border ${toggleBtnClass}`}
//         >
//           {expanded ? "− Show less" : `+${remainingCount} more`}
//         </button>
//       )}
//     </div>
//   );
// };
// // -----------------------------------------------------------------

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
//         <h2 className="text-3xl font-semibold mb-10">Millet Products</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {products.map((product) => {
//             const cartItem = getCartItem(product.id);
//             const nutrition = product.nutritional_info_json;
//             const feelsList = nutrition?.["What You'll Feel"] || [];
//             const ingredientsList = nutrition?.Ingredients || [];

//             return (
//               <div
//                 key={product.id}
//                 onClick={() => router.push(`/products/${product.id}`)}
//                 className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer flex flex-col"
//               >
//                 <div className="w-full h-[230px] overflow-hidden shrink-0">
//                   <img
//                     src={product.image_url}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="p-4 flex flex-col flex-grow">
//                   <h3 className="text-xl font-semibold line-clamp-1 mb-1">
//                     {product.name}
//                   </h3>

//                   <div className="flex items-center gap-3 mb-1">
//                     <span className="text-gray-500 line-through text-sm">
//                       ₹{product.price}
//                     </span>
//                     <span className="text-green-700 text-md font-semibold">
//                       {product.discount_percent.toFixed(1)}% OFF
//                     </span>
//                   </div>

//                   <div className="text-2xl font-bold text-green-900 mb-2">
//                     ₹{product.effective_price}
//                   </div>

//                   {/* Tags Section */}
//                   <div className="flex-grow mb-2 flex flex-col gap-2">
                    
//                     {/* What You'll Feel Section */}
//                     {feelsList.length > 0 && (
//                       <div>
//                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
//                           What You'll Feel
//                         </h4>
//                         <ExpandableTagList 
//                           items={feelsList} 
//                           tagClassName="bg-[#f2fceb] border border-[#c3e6b1] text-[#3b6b21] px-3 py-1 rounded-full text-[12px] font-medium"
//                         />
//                       </div>
//                     )}

//                     {/* Divider Line */}
//                     {feelsList.length > 0 && ingredientsList.length > 0 && (
//                       <hr className="border-gray-200" />
//                     )}

//                     {/* Key Ingredients Section */}
//                     {ingredientsList.length > 0 && (
//                       <div>
//                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
//                           Key Ingredients
//                         </h4>
//                         <ExpandableTagList 
//                           items={ingredientsList} 
//                           tagClassName="bg-[#fafafa] border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-[12px] font-medium"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div
//                     className="flex gap-4 pt-2 mt-auto"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <button
//                       onClick={() => router.push(`/products/${product.id}`)}
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
//                           handleAddToCart(product.id, product.name)
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
//                             handleDecrement(product.id, product.name)
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
//                             handleIncrement(product.id, product.name)
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







// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/components/grasa/CartContext";
// import { FiPlus, FiMinus } from "react-icons/fi";
// import toast, { Toaster } from "react-hot-toast";

// // ---------------- TYPES ----------------
// type Product = {
//   id: number;
//   name: string;
//   description: string;
//   price: string;
//   effective_price: number;
//   discount_percent: number;
//   stock_quantity: number;
//   image_url: string;
//   nutritional_info_json?: {
//     Ingredients?: string[];
//     "What You'll Feel"?: string[];
//     [key: string]: any;
//   };
// };

// // --- HELPER COMPONENT: Handles Expand/Collapse with Unique Colors ---
// const ExpandableTagList = ({ items, tagClassName }: { items: string[]; tagClassName: string }) => {
//   const [expanded, setExpanded] = useState(false);
//   const limit = 3;

//   if (!items || items.length === 0) return null;

//   const hasMore = items.length > limit;
//   const visibleItems = expanded ? items : items.slice(0, limit);
//   const remainingCount = items.length - limit;

//   // Unique styling for the indigo toggle button
//   const toggleBtnClass = "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 border-dashed font-bold shadow-sm";

//   return (
//     <div className="flex flex-wrap gap-2 transition-all duration-300">
//       {visibleItems.map((item, idx) => (
//         <span key={idx} className={tagClassName}>
//           {item}
//         </span>
//       ))}
      
//       {hasMore && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation(); // Prevents navigating to product page
//             setExpanded(!expanded);
//           }}
//           className={`px-3 py-1 rounded-full text-[12px] transition-colors cursor-pointer border ${toggleBtnClass}`}
//         >
//           {expanded ? "− Show less" : `+${remainingCount} more`}
//         </button>
//       )}
//     </div>
//   );
// };

// // ---------------- MAIN COMPONENT ----------------
// export default function ProductsGrid() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [addingId, setAddingId] = useState<number | null>(null);

//   const router = useRouter();
//   const { cart, addToCart, updateQuantity, token } = useCart();

//   const API_URL = "https://medicaps.cloud/millets/products?sort=-price";

//   // Fetch Products on Mount
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

//   // Handle Add to Cart with Login Redirect
//   const handleAddToCart = async (productId: number, name: string) => {
//     if (!token) {
//       toast.error("Please login first to add items");
//       router.push("/login");
//       return;
//     }

//     setAddingId(productId);
//     const success = await addToCart({
//       product_id: productId,
//       quantity: 1,
//     });

//     if (success) {
//       toast.success(`${name} added to cart`);
//     } else {
//       toast.error("Failed to add product to cart");
//     }
//     setAddingId(null);
//   };

//   // Handle Increment with Login Redirect
//   const handleIncrement = async (productId: number, name: string) => {
//     if (!token) {
//       router.push("/login");
//       return;
//     }
//     await updateQuantity(productId, "increment");
//     toast.success(`${name} quantity increased`);
//   };

//   // Handle Decrement with Login Redirect
//   const handleDecrement = async (productId: number, name: string) => {
//     if (!token) {
//       router.push("/login");
//       return;
//     }
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
//         <h2 className="text-3xl font-semibold mb-10">Millet Products</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {products.map((product) => {
//             const cartItem = getCartItem(product.id);
//             const nutrition = product.nutritional_info_json;
//             const feelsList = nutrition?.["What You'll Feel"] || [];
//             const ingredientsList = nutrition?.Ingredients || [];

//             return (
//               <div
//                 key={product.id}
//                 onClick={() => router.push(`/products/${product.id}`)}
//                 className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer flex flex-col"
//               >
//                 {/* Product Image */}
//                 <div className="w-full h-[230px] overflow-hidden shrink-0">
//                   <img
//                     src={product.image_url}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="p-4 flex flex-col flex-grow">
//                   <h3 className="text-xl font-semibold line-clamp-1 mb-1">
//                     {product.name}
//                   </h3>

//                   {/* Price Section */}
//                   <div className="flex items-center gap-3 mb-1">
//                     <span className="text-gray-500 line-through text-sm">
//                       ₹{product.price}
//                     </span>
//                     <span className="text-green-700 text-md font-semibold">
//                       {product.discount_percent.toFixed(1)}% OFF
//                     </span>
//                   </div>

//                   <div className="text-2xl font-bold text-green-900 mb-2">
//                     ₹{product.effective_price}
//                   </div>

//                   {/* Dynamic Tags Section */}
//                   <div className="flex-grow mb-4 flex flex-col gap-3">
//                     {feelsList.length > 0 && (
//                       <div>
//                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
//                           What You'll Feel
//                         </h4>
//                         <ExpandableTagList 
//                           items={feelsList} 
//                           tagClassName="bg-[#f2fceb] border border-[#c3e6b1] text-[#3b6b21] px-3 py-1 rounded-full text-[12px] font-medium"
//                         />
//                       </div>
//                     )}

//                     {feelsList.length > 0 && ingredientsList.length > 0 && (
//                       <hr className="border-gray-200" />
//                     )}

//                     {ingredientsList.length > 0 && (
//                       <div>
//                         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
//                           Key Ingredients
//                         </h4>
//                         <ExpandableTagList 
//                           items={ingredientsList} 
//                           tagClassName="bg-[#fafafa] border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-[12px] font-medium"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div
//                     className="flex gap-4 pt-2 mt-auto"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <button
//                       onClick={() => router.push(`/products/${product.id}`)}
//                       className="flex-1 bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900 transition"
//                     >
//                       View Details
//                     </button>

//                     {!cartItem ? (
//                       <button
//                         disabled={product.stock_quantity === 0 || addingId === product.id}
//                         onClick={() => handleAddToCart(product.id, product.name)}
//                         className={`flex-1 py-3 rounded-lg font-medium transition
//                         ${
//                           product.stock_quantity === 0
//                             ? "bg-gray-300 cursor-not-allowed text-gray-600"
//                             : "bg-[#C5D82D] text-gray-900 font-bold hover:bg-[#b8cc28]"
//                         }`}
//                       >
//                         {addingId === product.id
//                           ? "Adding..."
//                           : product.stock_quantity === 0
//                           ? "Out of Stock"
//                           : "Add to Cart"}
//                       </button>
//                     ) : (
//                       <div className="flex items-center justify-between bg-[#C5D82D] rounded-lg flex-1 px-1 border border-black/5">
//                         <button
//                           onClick={() => handleDecrement(product.id, product.name)}
//                           className="p-2 hover:bg-black/10 rounded-lg transition"
//                         >
//                           <FiMinus size={18} />
//                         </button>

//                         <span className="font-bold text-lg">
//                           {cartItem.quantity}
//                         </span>

//                         <button
//                           onClick={() => handleIncrement(product.id, product.name)}
//                           className="p-2 hover:bg-black/10 rounded-lg transition"
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
import Script from "next/script";

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

  const API_URL = "https://medicaps.cloud/millets/products?sort=-price";

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
      <div className="text-center py-20 text-lg font-medium  text-[#1b1b1b]">
        Loading Products...
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