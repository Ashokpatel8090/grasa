

// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useCart } from "@/components/grasa/CartContext";
// import { FiPlus, FiMinus } from "react-icons/fi";
// import ProductReviews from "@/components/grasa/ProductReviews";

// // ---------------- TYPES ----------------
// interface NutritionalFacts {
//   "Per 100g": Record<string, string | number>;
// }

// interface NutritionInfo {
//   Ingredients?: string[];
//   "Storage Instructions"?: string[];
//   "Best Before"?: string;
//   "Allergen Information"?: string;
//   "FSSAI Reg No"?: string;
//   "What You'll Feel"?: string[];
//   "Nutritional Facts"?: NutritionalFacts;
// }

// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   effective_price: number;
//   discount_percent: number;
//   stock_quantity: number;
//   image_url: string;
//   nutritional_info_json?: NutritionInfo;
// }

// type Props = {
//   params: Promise<{
//     id: string;
//   }>;
// };

// export default function ProductDetails({ params }: Props) {
//   // Swapped `any` for our new `Product` type
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [adding, setAdding] = useState(false);

//   const { cart, addToCart, updateQuantity } = useCart();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const resolvedParams = await params;
//         const res = await fetch(
//           `https://medicaps.cloud/millets/products/${resolvedParams.id}`
//         );
//         const data = await res.json();
//         setProduct(data);
//       } catch (error) {
//         console.error("Failed to fetch product", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [params]);

//   if (loading) return <div className="text-center py-20">Loading Product...</div>;
//   if (!product) return <div className="text-center py-20">Product not found.</div>;

//   const nutrition = product.nutritional_info_json;
//   const cartItem = cart.find((item) => item.product_id === product.id);

//   const handleAddToCart = async () => {
//     setAdding(true);
//     await addToCart({
//       product_id: product.id,
//       quantity: 1,
//     });
//     setAdding(false);
//   };

//   return (
//     <div className="bg-[#f3f3f3] py-16">
//       <div className="w-[85%] mx-auto">
        
//         {/* Product Section */}
//         <div className="grid md:grid-cols-2 gap-10 mb-12">
          
//           {/* Product Image */}
//           <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center">
//             <Image
//               src={product.image_url}
//               alt={product.name}
//               width={500}
//               height={500}
//               className="max-h-[500px] object-contain"
//             />
//           </div>

//           {/* Product Info */}
//           <div className="space-y-4">
//             <h1 className="text-3xl font-bold">{product.name}</h1>

//             {/* PRICE SECTION */}
//             <div className="space-y-1">
//               <div className="flex items-end gap-3">
//                 {/* Discount */}
//                 <span className="text-red-500 text-3xl font-semibold">
//                   -{product.discount_percent}%
//                 </span>

//                 {/* Effective Price */}
//                 <span className="text-4xl font-semibold text-gray-800">
//                   ₹{product.effective_price.toLocaleString()}
//                 </span>
//               </div>

//               {/* MRP */}
//               <div className="text-gray-500 text-lg">
//                 M.R.P.:{" "}
//                 <span className="line-through">
//                   ₹{product.price.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* CART ACTION BUTTONS */}
//             <div className="w-full md:w-64 pt-4">
//               {!cartItem ? (
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={product.stock_quantity === 0 || adding}
//                   className={`w-full py-3 rounded-lg font-medium transition ${
//                     product.stock_quantity === 0
//                       ? "bg-gray-300 cursor-not-allowed"
//                       : "bg-[#C5D82D] text-gray-900 font-bold hover:bg-[#b8cc28]"
//                   }`}
//                 >
//                   {adding
//                     ? "Adding..."
//                     : product.stock_quantity === 0
//                     ? "Out of Stock"
//                     : "Add to Cart"}
//                 </button>
//               ) : (
//                 <div className="flex items-center justify-between bg-[#C5D82D] rounded-lg p-1 border border-black/5">
//                   <button
//                     onClick={() => updateQuantity(product.id, "decrement")}
//                     className="p-2 hover:bg-black/10 rounded-lg transition"
//                   >
//                     <FiMinus size={20} />
//                   </button>

//                   <span className="font-bold text-xl">{cartItem.quantity}</span>

//                   <button
//                     onClick={() => updateQuantity(product.id, "increment")}
//                     className="p-2 hover:bg-black/10 rounded-lg transition"
//                   >
//                     <FiPlus size={20} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="mt-6">
//               <h2 className="text-xl font-semibold mb-2">Product Details</h2>
//               <p className="text-gray-700 whitespace-pre-line leading-relaxed">
//                 {product.description}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Information Section */}
//         {nutrition && (
//           <div className="space-y-2 text-[17px] mb-10">
//             {nutrition.Ingredients && (
//               <p>
//                 <span className="font-bold">Ingredients:</span>{" "}
//                 {nutrition.Ingredients.join(", ")}
//               </p>
//             )}

//             {nutrition["What You'll Feel"] && (
//   <p>
//     <span className="font-bold">What You'll Feel:</span>{" "}
//     {nutrition["What You'll Feel"].join(", ")}
//   </p>
// )}

//             {nutrition["Storage Instructions"] && (
//               <p>
//                 <span className="font-bold">Storage Instructions:</span>{" "}
//                 {nutrition["Storage Instructions"].join(" ")}
//               </p>
//             )}

//             {nutrition["Best Before"] && (
//               <p>
//                 <span className="font-bold">Best Before:</span>{" "}
//                 {nutrition["Best Before"]}
//               </p>
//             )}

//             {nutrition["Allergen Information"] && (
//               <p>
//                 <span className="font-bold">Allergen Information:</span>{" "}
//                 {nutrition["Allergen Information"]}
//               </p>
//             )}

//             {nutrition["FSSAI Reg No"] && (
//               <p>
//                 <span className="font-bold">FSSAI Reg No:</span>{" "}
//                 {nutrition["FSSAI Reg No"]}
//               </p>
//             )}
//           </div>
//         )}

//         {/* Nutritional Facts */}
//         {nutrition?.["Nutritional Facts"]?.["Per 100g"] && (
//           <div>
//             <h2 className="text-3xl font-bold mb-4">Nutritional Facts</h2>

//             <div className="bg-white border rounded-xl shadow-sm p-6">
//               <h3 className="font-semibold text-lg mb-4">Per 100g</h3>

//               <table className="w-full">
//                 <tbody>
//                   {Object.entries(
//                     nutrition["Nutritional Facts"]["Per 100g"]
//                   ).map(([key, value]) => (
//                     <tr
//                       key={key}
//                       className="border-t border-gray-300"
//                     >
//                       <td className="py-1 font-medium">{key}</td>

//                       {/* Cast value to String to guarantee React compatibility */}
//                       <td className="py-1 text-right">{String(value)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         <ProductReviews productId={product.id} />
//       </div>
//     </div>
//   );
// }





// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useCart } from "@/components/grasa/CartContext";
// import { FiPlus, FiMinus } from "react-icons/fi";
// import ProductReviews from "@/components/grasa/ProductReviews";
// import toast, { Toaster } from "react-hot-toast";

// // ---------------- TYPES ----------------
// interface NutritionalFacts {
//   "Per 100g": Record<string, string | number>;
// }

// interface NutritionInfo {
//   Ingredients?: string[];
//   "Storage Instructions"?: string[];
//   "Best Before"?: string;
//   "Allergen Information"?: string;
//   "FSSAI Reg No"?: string;
//   "What You'll Feel"?: string[];
//   "Nutritional Facts"?: NutritionalFacts;
// }

// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   effective_price: number;
//   discount_percent: number;
//   stock_quantity: number;
//   image_url: string;
//   nutritional_info_json?: NutritionInfo;
// }

// type Props = {
//   params: Promise<{
//     id: string;
//   }>;
// };

// export default function ProductDetails({ params }: Props) {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [adding, setAdding] = useState(false);

//   const { cart, addToCart, updateQuantity, token } = useCart();

  

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const resolvedParams = await params;
//         const res = await fetch(
//           `https://medicaps.cloud/millets/products/${resolvedParams.id}`
//         );
//         const data = await res.json();
//         setProduct(data);
//       } catch (error) {
//         console.error("Failed to fetch product", error);
//         toast.error("Failed to load product data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [params]);

//   if (loading) return <div className="text-center py-20">Loading Product...</div>;
//   if (!product) return <div className="text-center py-20">Product not found.</div>;

//   const nutrition = product.nutritional_info_json;
//   const cartItem = cart.find((item) => item.product_id === product.id);

//   const handleAddToCart = async () => {
//     if (!token) {
//       toast.error("Please login to add items to your cart");
//       return;
//     }

//     setAdding(true);
//     const success = await addToCart({
//       product_id: product.id,
//       quantity: 1,
//     });

//     if (success) {
//       toast.success("Added to cart!");
//     } else {
//       toast.error("Failed to add to cart. Try again.");
//     }
//     setAdding(false);
//   };

//   const handleUpdateQuantity = async (id: number, action: "increment" | "decrement") => {
//     try {
//       await updateQuantity(id, action);
//       toast.success(action === "increment" ? "Quantity increased" : "Quantity decreased");
//     } catch (err) {
//       toast.error("Could not update quantity");
//     }
//   }

//   return (
//     <div className="bg-[#f3f3f3] py-16">
//       <Toaster position="bottom-center" />
//       <div className="w-[85%] mx-auto">
        
//         {/* Product Section */}
//         <div className="grid md:grid-cols-2 gap-10 mb-12">
          
//           {/* Product Image */}
//           <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center">
//             <Image
//               src={product.image_url}
//               alt={product.name}
//               width={500}
//               height={500}
//               className="max-h-[500px] object-contain"
//             />
//           </div>

//           {/* Product Info */}
//           <div className="space-y-4">
//             <h1 className="text-3xl font-bold">{product.name}</h1>

//             {/* PRICE SECTION */}
//             <div className="space-y-1">
//               <div className="flex items-end gap-3">
//                 <span className="text-red-500 text-3xl font-semibold">
//                   -{product.discount_percent}%
//                 </span>
//                 <span className="text-4xl font-semibold text-gray-800">
//                   ₹{product.effective_price.toLocaleString()}
//                 </span>
//               </div>
//               <div className="text-gray-500 text-lg">
//                 M.R.P.:{" "}
//                 <span className="line-through">
//                   ₹{product.price.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* CART ACTION BUTTONS */}
//             <div className="w-full md:w-64 pt-4">
//               {!cartItem ? (
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={product.stock_quantity === 0 || adding}
//                   className={`w-full py-3 rounded-lg font-medium transition ${
//                     product.stock_quantity === 0
//                       ? "bg-gray-300 cursor-not-allowed"
//                       : "bg-[#C5D82D] text-gray-900 font-bold hover:bg-[#b8cc28]"
//                   }`}
//                 >
//                   {adding
//                     ? "Adding..."
//                     : product.stock_quantity === 0
//                     ? "Out of Stock"
//                     : "Add to Cart"}
//                 </button>
//               ) : (
//                 <div className="flex items-center justify-between bg-[#C5D82D] rounded-lg p-1 border border-black/5">
//                   <button
//                     onClick={() => handleUpdateQuantity(product.id, "decrement")}
//                     className="p-2 hover:bg-black/10 rounded-lg transition"
//                   >
//                     <FiMinus size={20} />
//                   </button>

//                   <span className="font-bold text-xl">{cartItem.quantity}</span>

//                   <button
//                     onClick={() => handleUpdateQuantity(product.id, "increment")}
//                     className="p-2 hover:bg-black/10 rounded-lg transition"
//                   >
//                     <FiPlus size={20} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="mt-6">
//               <h2 className="text-xl font-semibold mb-2">Product Details</h2>
//               <p className="text-gray-700 whitespace-pre-line leading-relaxed">
//                 {product.description}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Information Section */}
//         {nutrition && (
//           <div className="space-y-2 text-[17px] mb-10">
//             {nutrition.Ingredients && (
//               <p>
//                 <span className="font-bold">Ingredients:</span>{" "}
//                 {nutrition.Ingredients.join(", ")}
//               </p>
//             )}

//             {nutrition["What You'll Feel"] && (
//               <p>
//                 <span className="font-bold">What You'll Feel:</span>{" "}
//                 {nutrition["What You'll Feel"].join(", ")}
//               </p>
//             )}

//             {nutrition["Storage Instructions"] && (
//               <p>
//                 <span className="font-bold">Storage Instructions:</span>{" "}
//                 {nutrition["Storage Instructions"].join(" ")}
//               </p>
//             )}

//             {nutrition["Best Before"] && (
//               <p>
//                 <span className="font-bold">Best Before:</span>{" "}
//                 {nutrition["Best Before"]}
//               </p>
//             )}

//             {nutrition["Allergen Information"] && (
//               <p>
//                 <span className="font-bold">Allergen Information:</span>{" "}
//                 {nutrition["Allergen Information"]}
//               </p>
//             )}

//             {nutrition["FSSAI Reg No"] && (
//               <p>
//                 <span className="font-bold">FSSAI Reg No:</span>{" "}
//                 {nutrition["FSSAI Reg No"]}
//               </p>
//             )}
//           </div>
//         )}

//         {/* Nutritional Facts */}
//         {nutrition?.["Nutritional Facts"]?.["Per 100g"] && (
//           <div className="mb-10">
//             <h2 className="text-3xl font-bold mb-4">Nutritional Facts</h2>
//             <div className="bg-white border rounded-xl shadow-sm p-6">
//               <h3 className="font-semibold text-lg mb-4">Per 100g</h3>
//               <table className="w-full">
//                 <tbody>
//                   {Object.entries(
//                     nutrition["Nutritional Facts"]["Per 100g"]
//                   ).map(([key, value]) => (
//                     <tr key={key} className="border-t border-gray-300">
//                       <td className="py-2 font-medium">{key}</td>
//                       <td className="py-2 text-right">{String(value)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         <ProductReviews productId={product.id} />
//       </div>
//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Added for redirection
import { useCart } from "@/components/grasa/CartContext";
import { FiPlus, FiMinus } from "react-icons/fi";
import ProductReviews from "@/components/grasa/ProductReviews";
import toast, { Toaster } from "react-hot-toast";

// ---------------- TYPES ----------------
interface NutritionalFacts {
  "Per 100g": Record<string, string | number>;
}

interface NutritionInfo {
  Ingredients?: string[];
  "Storage Instructions"?: string[];
  "Best Before"?: string;
  "Allergen Information"?: string;
  "FSSAI Reg No"?: string;
  "What You'll Feel"?: string[];
  "Nutritional Facts"?: NutritionalFacts;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  effective_price: number;
  discount_percent: number;
  stock_quantity: number;
  image_url: string;
  nutritional_info_json?: NutritionInfo;
}

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function ProductDetails({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const router = useRouter(); // Initialize router
  const { cart, addToCart, updateQuantity, token } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resolvedParams = await params;
        const res = await fetch(
          `https://medicaps.cloud/millets/products/${resolvedParams.id}`
        );
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  if (loading) return <div className="text-center py-20">Loading Product...</div>;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  const nutrition = product.nutritional_info_json;
  const cartItem = cart.find((item) => item.product_id === product.id);

  const handleAddToCart = async () => {
    // REDIRECTION LOGIC
    if (!token) {
      toast.error("Please login to add items to your cart");
      router.push("/login"); 
      return;
    }

    setAdding(true);
    const success = await addToCart({
      product_id: product.id,
      quantity: 1,
    });

    if (success) {
      toast.success("Added to cart!");
    } else {
      toast.error("Failed to add to cart. Try again.");
    }
    setAdding(false);
  };

  const handleUpdateQuantity = async (id: number, action: "increment" | "decrement") => {
    // REDIRECTION LOGIC
    if (!token) {
      toast.error("Please login to manage your cart");
      router.push("/login");
      return;
    }

    try {
      await updateQuantity(id, action);
      toast.success(action === "increment" ? "Quantity increased" : "Quantity decreased");
    } catch (err) {
      toast.error("Could not update quantity");
    }
  }

  return (
    <div className="bg-[#f3f3f3] py-16">
      <Toaster position="bottom-center" />
      <div className="w-[85%] mx-auto">
        
        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center">
            <Image
              src={product.image_url}
              alt={product.name}
              width={500}
              height={500}
              className="max-h-[500px] object-contain"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* PRICE SECTION */}
            {/* <div className="space-y-1">
              <div className="flex items-end gap-3">
                <span className="text-red-500 text-3xl font-semibold">
                  -{product.discount_percent}%
                </span>
                <span className="text-4xl font-semibold text-gray-800">
                  ₹{product.effective_price.toLocaleString()}
                </span>
              </div>
              <div className="text-gray-500 text-lg">
                M.R.P.:{" "}
                <span className="line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
            </div> */}

            <div className="space-y-1">
              <div className="flex items-end gap-3">
                
                {/* Show discount only if > 0 */}
                {product.discount_percent > 0 && (
                  <span className="text-red-500 text-3xl font-semibold">
                    -{product.discount_percent}%
                  </span>
                )}

                {/* Always show effective price */}
                <span className="text-4xl font-semibold text-gray-800">
                  ₹{product.effective_price.toLocaleString()}
                </span>
              </div>

              {/* Show MRP only if discount exists */}
              {product.discount_percent > 0 && (
                <div className="text-gray-500 text-lg">
                  M.R.P.:{" "}
                  <span className="line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* CART ACTION BUTTONS */}
            <div className="w-full md:w-64 pt-4">
              {!cartItem ? (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0 || adding}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    product.stock_quantity === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#C5D82D] text-gray-900 font-bold hover:bg-[#b8cc28]"
                  }`}
                >
                  {adding
                    ? "Adding..."
                    : product.stock_quantity === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
              ) : (
                <div className="flex items-center justify-between bg-[#C5D82D] rounded-lg p-1 border border-black/5">
                  <button
                    onClick={() => handleUpdateQuantity(product.id, "decrement")}
                    className="p-2 hover:bg-black/10 rounded-lg transition"
                  >
                    <FiMinus size={20} />
                  </button>

                  <span className="font-bold text-xl">{cartItem.quantity}</span>

                  <button
                    onClick={() => handleUpdateQuantity(product.id, "increment")}
                    className="p-2 hover:bg-black/10 rounded-lg transition"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Product Details</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Information Section */}
        {nutrition && (
          <div className="space-y-2 text-[17px] mb-10">
            {nutrition.Ingredients && (
              <p>
                <span className="font-bold">Ingredients:</span>{" "}
                {nutrition.Ingredients.join(", ")}
              </p>
            )}

            {nutrition["What You'll Feel"] && (
              <p>
                <span className="font-bold">What You'll Feel:</span>{" "}
                {nutrition["What You'll Feel"].join(", ")}
              </p>
            )}

            {nutrition["Storage Instructions"] && (
              <p>
                <span className="font-bold">Storage Instructions:</span>{" "}
                {nutrition["Storage Instructions"].join(" ")}
              </p>
            )}

            {nutrition["Best Before"] && (
              <p>
                <span className="font-bold">Best Before:</span>{" "}
                {nutrition["Best Before"]}
              </p>
            )}

            {nutrition["Allergen Information"] && (
              <p>
                <span className="font-bold">Allergen Information:</span>{" "}
                {nutrition["Allergen Information"]}
              </p>
            )}

            {nutrition["FSSAI Reg No"] && (
              <p>
                <span className="font-bold">FSSAI Reg No:</span>{" "}
                {nutrition["FSSAI Reg No"]}
              </p>
            )}
          </div>
        )}

        {/* Nutritional Facts */}
        {nutrition?.["Nutritional Facts"]?.["Per 100g"] && (
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4">Nutritional Facts</h2>
            <div className="bg-white border rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Per 100g</h3>
              <table className="w-full">
                <tbody>
                  {Object.entries(
                    nutrition["Nutritional Facts"]["Per 100g"]
                  ).map(([key, value]) => (
                    <tr key={key} className="border-t border-gray-300">
                      <td className="py-2 font-medium">{key}</td>
                      <td className="py-2 text-right">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}