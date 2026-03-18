
// "use client";

// type Product = {
//   id: number;
//   name: string;
//   image: string;
//   description: string;
//   category?: string;
//   mrp?: string;
//   effective_price?: string;
//   discount_percent?: string;
// };

// type ShippingAddress = {
//   street: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country?: string;
//   landmark?: string;
// };

// type Item = {
//   id: number;
//   quantity: number;
//   price_at_order: string;
//   subtotal: string;
//   taxes?: string;
//   discount?: string;
//   paid_amount?: string;
//   product: Product;
//   shipping_address: ShippingAddress;
//   status?: string;
// };

// type PaymentTransaction = {
//   id: number;
//   gateway_txn_id: string;
//   status: string;
//   payment_gateway: string;
//   amount: string;
// };

// type Order = {
//   id: number;
//   order_date: string;
//   status: string;
//   total_amount: string;
//   currency: string;
//   total_mrp?: string;
//   offer_discount?: string;
//   mhc_points?: string;
//   notes?: string;
//   payment_transaction?: PaymentTransaction;
//   items: Item[];
// };

// export default function OrderDetails({ order }: { order: Order }) {
//   const item = order.items?.[0];
//   const product = item?.product;
//   const address = item?.shipping_address;
//   console.log(order)

//   return (
//     <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

//       {/* ORDER HEADER */}
//       <div className="mb-8 border-b pb-6">
//         <h1 className="text-3xl font-bold mb-2">
//           Order #{order.id}
//         </h1>

//         <div className="flex flex-wrap gap-6 text-gray-600">
//           <p>
//             <strong>Status:</strong> {order.status}
//           </p>

//           <p>
//             <strong>Date:</strong>{" "}
//             {new Date(order.order_date).toLocaleDateString()}
//           </p>

//         </div>
//       </div>

//       {/* MAIN GRID */}
//       <div className="grid md:grid-cols-2 gap-12">

//         {/* LEFT SIDE IMAGE (Sticky) */}
//         <div className="relative">

//           <div className="md:sticky md:top-28">

//             {product?.image && (
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full max-h-[450px] object-contain rounded-lg border"
//               />
//             )}

//           </div>

//         </div>

//         {/* RIGHT SIDE CONTENT */}
//         <div className="space-y-8">

//           {/* PRODUCT INFO */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-3">
//               {product?.name}
//             </h2>

//             {product?.category && (
//               <p className="text-gray-500 mb-2">
//                 Category: {product.category}
//               </p>
//             )}

//             {product?.description && (
//               <p className="text-gray-700 whitespace-pre-line">
//                 {product.description}
//               </p>
//             )}
//           </div>

//           {/* PRICE INFO */}
//           <div className="border-t pt-6 space-y-2">

//             <h3 className="text-xl font-semibold">
//               Pricing
//             </h3>

//             {product?.mrp && (
//               <p>
//                 MRP: ₹{product.mrp}
//               </p>
//             )}

//             {product?.effective_price && (
//               <p>
//                 Effective Price: ₹{product.effective_price}
//               </p>
//             )}

//             {product?.discount_percent && (
//               <p>
//                 Discount: {product.discount_percent}%
//               </p>
//             )}

//             <p>
//               Quantity: {item?.quantity}
//             </p>

//             <p>
//               Price at Order: ₹{item?.price_at_order}
//             </p>

//             {item?.subtotal && (
//               <p>
//                 Subtotal: ₹{item.subtotal}
//               </p>
//             )}

//             {item?.taxes && (
//               <p>
//                 Taxes: ₹{item.taxes}
//               </p>
//             )}

//             {item?.paid_amount && (
//               <p className="font-semibold">
//                 Paid Amount: ₹{item.paid_amount}
//               </p>
//             )}

//           </div>

//           {/* SHIPPING ADDRESS */}
//           {address && (
//             <div className="border-t pt-6">

//               <h3 className="text-xl font-semibold mb-2">
//                 Shipping Address
//               </h3>

//               <p>{address.street}</p>

//               {address.landmark && (
//                 <p>{address.landmark}</p>
//               )}

//               <p>
//                 {address.city}, {address.state}
//               </p>

//               <p>{address.postal_code}</p>

//               {address.country && (
//                 <p>{address.country}</p>
//               )}

//             </div>
//           )}

          

//           {/* ORDER SUMMARY */}
//           <div className="border-t pt-6 space-y-2">

//             <h3 className="text-xl font-semibold">
//               Order Summary
//             </h3>

//             {order.total_mrp && (
//               <p>Total MRP: ₹{order.total_mrp}</p>
//             )}

//             {order.offer_discount && (
//               <p>
//                 Offer Discount: ₹{order.offer_discount}
//               </p>
//             )}

//             <p className="font-bold text-lg">
//               Total Paid: ₹{order.total_amount}{" "}
//               {order.currency}
//             </p>

//             {order.mhc_points && (
//               <p>MHC Points: {order.mhc_points}</p>
//             )}

//             {order.notes && (
//               <p className="text-gray-600">
//                 Notes: {order.notes}
//               </p>
//             )}

//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useState } from "react";

// type Product = {
//   id: number;
//   name: string;
//   image: string;
//   description: string;
//   category?: string;
//   mrp?: string;
//   effective_price?: string;
//   discount_percent?: string;
// };

// type ShippingAddress = {
//   street: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country?: string;
//   landmark?: string;
// };

// type ReviewImage = {
//   url: string;
//   public_id: string;
// };

// type Review = {
//   id: number | null;
//   rating: number | null;
//   review_text: string | null;
//   images?: ReviewImage[];
// };

// type Item = {
//   id: number;
//   quantity: number;
//   price_at_order: string;
//   subtotal: string;
//   taxes?: string;
//   discount?: string;
//   paid_amount?: string;
//   product: Product;
//   shipping_address: ShippingAddress;
//   status?: string;
//   reviews?: Review;
// };

// type PaymentTransaction = {
//   id: number;
//   gateway_txn_id: string;
//   status: string;
//   payment_gateway: string;
//   amount: string;
// };

// type Order = {
//   id: number;
//   order_date: string;
//   status: string;
//   total_amount: string;
//   currency: string;
//   total_mrp?: string;
//   offer_discount?: string;
//   mhc_points?: string;
//   notes?: string;
//   payment_transaction?: PaymentTransaction;
//   items: Item[];
// };

// export default function OrderDetails({ order }: { order: Order }) {
//   const item = order.items?.[0];
//   const product = item?.product;
//   const address = item?.shipping_address;
//   const review = item?.reviews;

//   const [showReviewForm, setShowReviewForm] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");
//   const [images, setImages] = useState<ReviewImage[]>([]);
//   const [uploading, setUploading] = useState(false);


//   console.log(order)
//   /* IMAGE UPLOAD */
//   const handleImageUpload = async (file: File) => {
//     setUploading(true);

//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await fetch(
//       "https://medicaps.cloud/product-reviews/upload",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();

//     setImages((prev) => [...prev, data]);
//     setUploading(false);
//   };

//   /* SUBMIT REVIEW */
//   const submitReview = async () => {
//     const payload = {
//       rating,
//       review_text: reviewText,
//       order_item_id: item?.id,
//       images,
//     };

//     await fetch(
//       `https://medicaps.cloud/product-reviews/products/${product?.id}/reviews`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     alert("Review submitted!");
//     location.reload();
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

//       {/* HEADER */}
//       <div className="mb-8 border-b pb-6">
//         <h1 className="text-3xl font-bold mb-2">
//           Order #{order.id}
//         </h1>

//         <div className="flex gap-6 text-gray-600">
//           <p><strong>Status:</strong> {order.status}</p>
//           <p>
//             <strong>Date:</strong>{" "}
//             {new Date(order.order_date).toLocaleDateString()}
//           </p>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-12">

//         {/* PRODUCT IMAGE */}
//         <div className="md:sticky md:top-28">
//           {product?.image && (
//             <img
//               src={product.image}
//               alt={product.name}
//               className="w-full max-h-[450px] object-contain border rounded-lg"
//             />
//           )}
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="space-y-8">

//           {/* PRODUCT INFO */}
//           <div>
//             <h2 className="text-2xl font-semibold mb-2">
//               {product?.name}
//             </h2>

//             {product?.description && (
//               <p className="text-gray-700 whitespace-pre-line">
//                 {product.description}
//               </p>
//             )}
//           </div>

//           {/* PRICING */}
//           <div className="border-t pt-6 space-y-1">
//             <h3 className="text-xl font-semibold">Pricing</h3>

//             <p>MRP: ₹{product?.mrp}</p>
//             <p>Effective Price: ₹{product?.effective_price}</p>
//             <p>Quantity: {item?.quantity}</p>
//             <p>Subtotal: ₹{item?.subtotal}</p>
//             <p className="font-semibold">
//               Paid Amount: ₹{item?.paid_amount}
//             </p>
//           </div>

//           {/* SHIPPING */}
//           {address && (
//             <div className="border-t pt-6">
//               <h3 className="text-xl font-semibold mb-2">
//                 Shipping Address
//               </h3>

//               <p>{address.street}</p>
//               <p>{address.city}, {address.state}</p>
//               <p>{address.postal_code}</p>
//             </div>
//           )}

//           {/* ORDER SUMMARY */}
//           <div className="border-t pt-6 space-y-1">
//             <h3 className="text-xl font-semibold">
//               Order Summary
//             </h3>

//             <p>Total MRP: ₹{order.total_mrp}</p>
//             <p>Discount: ₹{order.offer_discount}</p>

//             <p className="font-bold text-lg">
//               Total Paid: ₹{order.total_amount} {order.currency}
//             </p>
//           </div>

//           {/* REVIEW SECTION */}

//           <div className="border-t pt-6">

//             <h3 className="text-xl font-semibold mb-3">
//               Product Review
//             </h3>

//             {/* REVIEW EXISTS */}

//             {review && review.rating !== null ? (
//               <div className="bg-gray-50 p-4 rounded-lg">

//                 <p className="font-semibold">
//                   Rating: ⭐ {review.rating}/5
//                 </p>

//                 <p className="mt-2 text-gray-700">
//                   {review.review_text}
//                 </p>

//                 {review.images?.length > 0 && (
//                   <div className="flex gap-3 mt-3">
//                     {review.images.map((img, i) => (
//                       <img
//                         key={i}
//                         src={img.url}
//                         className="w-20 h-20 object-cover rounded"
//                       />
//                     ))}
//                   </div>
//                 )}

//               </div>
//             ) : order.status === "Delivered" ? (

//               <button
//                 onClick={() => setShowReviewForm(true)}
//                 className="bg-black text-white px-5 py-2 rounded-lg"
//               >
//                 Add Review / Feedback
//               </button>

//             ) : (
//               <p className="text-gray-500">
//                 Review available after delivery.
//               </p>
//             )}

//             {/* REVIEW FORM */}

//             {showReviewForm && (

//               <div className="mt-6 space-y-4 border p-4 rounded-lg">

//                 <h4 className="font-semibold">
//                   Write your review
//                 </h4>

//                 {/* RATING */}

//                 <select
//                   className="border p-2 rounded w-full"
//                   value={rating}
//                   onChange={(e) =>
//                     setRating(Number(e.target.value))
//                   }
//                 >
//                   <option value={0}>Select Rating</option>
//                   <option value={5}>⭐⭐⭐⭐⭐</option>
//                   <option value={4}>⭐⭐⭐⭐</option>
//                   <option value={3}>⭐⭐⭐</option>
//                   <option value={2}>⭐⭐</option>
//                   <option value={1}>⭐</option>
//                 </select>

//                 {/* TEXT */}

//                 <textarea
//                   placeholder="Write your feedback..."
//                   className="border p-3 rounded w-full"
//                   value={reviewText}
//                   onChange={(e) =>
//                     setReviewText(e.target.value)
//                   }
//                 />

//                 {/* IMAGE UPLOAD */}

//                 <input
//                   type="file"
//                   onChange={(e) =>
//                     e.target.files &&
//                     handleImageUpload(e.target.files[0])
//                   }
//                 />

//                 {uploading && <p>Uploading...</p>}

//                 {/* PREVIEW */}

//                 <div className="flex gap-2">
//                   {images.map((img, i) => (
//                     <img
//                       key={i}
//                       src={img.url}
//                       className="w-16 h-16 rounded"
//                     />
//                   ))}
//                 </div>

//                 {/* SUBMIT */}

//                 <button
//                   onClick={submitReview}
//                   className="bg-green-600 text-white px-6 py-2 rounded-lg"
//                 >
//                   Submit Review
//                 </button>

//               </div>

//             )}

//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useState } from "react";
// import {
//   Package,
//   Truck,
//   MapPin,
//   Receipt,
//   Star,
//   UploadCloud,
//   CheckCircle2,
//   CalendarDays,
//   CreditCard,
// } from "lucide-react";

// // --- TYPES ---
// type Product = {
//   id: number;
//   name: string;
//   image: string;
//   description: string;
//   category?: string;
//   mrp?: string;
//   effective_price?: string;
//   discount_percent?: string;
// };

// type ShippingAddress = {
//   street: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country?: string;
//   landmark?: string;
// };

// type ReviewImage = {
//   url: string;
//   public_id: string;
// };

// type Review = {
//   id: number | null;
//   rating: number | null;
//   review_text: string | null;
//   images?: ReviewImage[];
// };

// type Item = {
//   id: number;
//   quantity: number;
//   price_at_order: string;
//   subtotal: string;
//   taxes?: string;
//   discount?: string;
//   paid_amount?: string;
//   product: Product;
//   shipping_address: ShippingAddress;
//   status?: string;
//   reviews?: Review;
// };

// type PaymentTransaction = {
//   id: number;
//   gateway_txn_id: string;
//   status: string;
//   payment_gateway: string;
//   amount: string;
// };

// type Order = {
//   id: number;
//   order_date: string;
//   status: string;
//   total_amount: string;
//   currency: string;
//   total_mrp?: string;
//   offer_discount?: string;
//   mhc_points?: string;
//   notes?: string;
//   payment_transaction?: PaymentTransaction;
//   items: Item[];
// };

// // --- HELPER COMPONENT: Interactive Star Rating ---
// const StarRating = ({
//   rating,
//   setRating,
// }: {
//   rating: number;
//   setRating: (r: number) => void;
// }) => {
//   const [hover, setHover] = useState(0);
//   return (
//     <div className="flex gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <button
//           key={star}
//           type="button"
//           onClick={() => setRating(star)}
//           onMouseEnter={() => setHover(star)}
//           onMouseLeave={() => setHover(0)}
//           className="focus:outline-none transition-colors duration-200"
//         >
//           <Star
//             className={`w-8 h-8 ${
//               star <= (hover || rating)
//                 ? "fill-yellow-400 text-yellow-400"
//                 : "text-gray-300"
//             }`}
//           />
//         </button>
//       ))}
//     </div>
//   );
// };

// // --- MAIN COMPONENT ---
// export default function OrderDetails({ order }: { order: Order }) {
//   const item = order.items?.[0];
//   const product = item?.product;
//   const address = item?.shipping_address;
//   const review = item?.reviews;

//   const [showReviewForm, setShowReviewForm] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");
//   const [images, setImages] = useState<ReviewImage[]>([]);
//   const [uploading, setUploading] = useState(false);
//   console.log(order)

//   /* IMAGE UPLOAD */
//   const handleImageUpload = async (file: File) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("https://medicaps.cloud/product-reviews/upload", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       setImages((prev) => [...prev, data]);
//     } catch (error) {
//       console.error("Upload failed", error);
//       alert("Failed to upload image. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   /* SUBMIT REVIEW */
//   const submitReview = async () => {
//     if (rating === 0) {
//       alert("Please select a rating before submitting.");
//       return;
//     }

//     const payload = {
//       rating,
//       review_text: reviewText,
//       order_item_id: item?.id,
//       images,
//     };

//     try {
//       await fetch(
//         `https://medicaps.cloud/product-reviews/products/${product?.id}/reviews`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );
//       alert("Review submitted successfully!");
//       location.reload();
//     } catch (error) {
//       console.error("Review submission failed", error);
//       alert("Failed to submit review.");
//     }
//   };

//   // Status Color Helper
//   const getStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case "delivered":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "shipped":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "cancelled":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
//       <div className="max-w-6xl mx-auto space-y-6">
        
//         {/* --- HEADER --- */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
//               <Package className="w-8 h-8 text-indigo-600" />
//               Order #{order.id}
//             </h1>
//             <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
//               <div className="flex items-center gap-1.5">
//                 <CalendarDays className="w-4 h-4" />
//                 {new Date(order.order_date).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}
//               </div>
//               <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300" />
//               <div className="flex items-center gap-1.5">
//                 <CreditCard className="w-4 h-4" />
//                 {order.payment_transaction?.payment_gateway || "Standard Checkout"}
//               </div>
//             </div>
//           </div>
//           <div
//             className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
//               order.status
//             )} flex items-center gap-2 max-w-max`}
//           >
//             {order.status === "Delivered" && <CheckCircle2 className="w-4 h-4" />}
//             {order.status}
//           </div>
//         </div>

//         {/* --- MAIN GRID --- */}
//         <div className="grid lg:grid-cols-12 gap-6">
          
//           {/* LEFT COLUMN: PRODUCT IMAGE (Sticky) */}
//           <div className="lg:col-span-5">
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
//               {product?.image ? (
//                 <div className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center p-4">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="max-w-full max-h-full object-contain mix-blend-multiply"
//                   />
//                 </div>
//               ) : (
//                 <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
//                   <Package className="w-20 h-20 text-gray-300" />
//                 </div>
//               )}
//               <div className="mt-6">
//                 <h2 className="text-xl font-bold text-gray-900 leading-tight">
//                   {product?.name}
//                 </h2>
//                 {product?.category && (
//                   <p className="text-sm text-indigo-600 font-medium mt-1">
//                     {product.category}
//                   </p>
//                 )}
//                 {product?.description && (
//                   <p className="mt-4 text-sm text-gray-600 line-clamp-3">
//                     {product.description}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: DETAILS */}
//           <div className="lg:col-span-7 space-y-6">
            
//             {/* PRICING & SUMMARY CARDS GRID */}
//             <div className="grid sm:grid-cols-2 gap-6">
//               {/* Pricing Details */}
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-2 mb-4 text-gray-900">
//                   <Receipt className="w-5 h-5 text-indigo-600" />
//                   <h3 className="font-bold text-lg">Item Pricing</h3>
//                 </div>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between text-gray-600">
//                     <span>MRP (Unit)</span>
//                     <span className="line-through">₹{product?.mrp}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Effective Price</span>
//                     <span>₹{product?.effective_price}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Quantity</span>
//                     <span className="font-medium text-gray-900">
//                       x {item?.quantity}
//                     </span>
//                   </div>
//                   <div className="pt-3 border-t border-gray-100 flex justify-between font-semibold text-base">
//                     <span>Item Subtotal</span>
//                     <span>₹{item?.subtotal}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Summary */}
//               <div className="bg-indigo-50 rounded-2xl p-6 shadow-sm border border-indigo-100">
//                 <h3 className="font-bold text-lg mb-4 text-indigo-900">
//                   Order Summary
//                 </h3>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between text-indigo-800/80">
//                     <span>Total MRP</span>
//                     <span>₹{order.total_mrp}</span>
//                   </div>
//                   <div className="flex justify-between text-green-700">
//                     <span>Total Discount</span>
//                     <span>- ₹{order.offer_discount}</span>
//                   </div>
//                   <div className="pt-3 border-t border-indigo-200/60 flex justify-between font-bold text-xl text-indigo-900">
//                     <span>Total Paid</span>
//                     <span>
//                       ₹{order.total_amount} {order.currency}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* SHIPPING ADDRESS */}
//             {address && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Truck className="w-5 h-5 text-indigo-600" />
//                   <h3 className="font-bold text-lg">Shipping Details</h3>
//                 </div>
//                 <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
//                   <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
//                   <div className="text-sm text-gray-700 leading-relaxed">
//                     <p className="font-medium text-gray-900 mb-1">Delivery Address</p>
//                     <p>{address.street}</p>
//                     {address.landmark && <p>Landmark: {address.landmark}</p>}
//                     <p>
//                       {address.city}, {address.state} - {address.postal_code}
//                     </p>
//                     {address.country && <p>{address.country}</p>}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* REVIEWS SECTION */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//               <div className="flex items-center gap-2 mb-6">
//                 <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
//                 <h3 className="font-bold text-lg">Product Rating & Review</h3>
//               </div>

//               {/* Existing Review */}
//               {review && review.rating !== null ? (
//                 <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
//                   <div className="flex items-center gap-1 mb-3">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`w-5 h-5 ${
//                           i < (review.rating || 0)
//                             ? "fill-yellow-400 text-yellow-400"
//                             : "fill-gray-200 text-gray-200"
//                         }`}
//                       />
//                     ))}
//                     <span className="ml-2 font-medium text-sm text-gray-600">
//                       {review.rating}/5
//                     </span>
//                   </div>
//                   <p className="text-gray-700 text-sm leading-relaxed mb-4">
//                     "{review.review_text}"
//                   </p>
//                   {review.images && review.images.length > 0 && (
//                     <div className="flex flex-wrap gap-3">
//                       {review.images.map((img, i) => (
//                         <div
//                           key={i}
//                           className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
//                         >
//                           <img
//                             src={img.url}
//                             alt="Review upload"
//                             className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : order.status === "Delivered" ? (
//                 /* Add Review Trigger */
//                 !showReviewForm ? (
//                   <button
//                     onClick={() => setShowReviewForm(true)}
//                     className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm"
//                   >
//                     Write a Product Review
//                   </button>
//                 ) : (
//                   /* Review Form */
//                   <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6 bg-gray-50 border border-gray-100 p-6 rounded-xl">
//                     <h4 className="font-semibold text-gray-900">
//                       Share your experience
//                     </h4>

//                     {/* Interactive Star Rating */}
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">
//                         Rate this product
//                       </label>
//                       <StarRating rating={rating} setRating={setRating} />
//                     </div>

//                     {/* Review Text */}
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">
//                         Detailed Review
//                       </label>
//                       <textarea
//                         placeholder="What did you like or dislike? What should other shoppers know?"
//                         className="w-full min-h-[120px] p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none resize-y text-sm"
//                         value={reviewText}
//                         onChange={(e) => setReviewText(e.target.value)}
//                       />
//                     </div>

//                     {/* Custom Image Upload */}
//                     <div className="space-y-3">
//                       <label className="text-sm font-medium text-gray-700">
//                         Attach Photos (Optional)
//                       </label>
                      
//                       <div className="flex flex-wrap items-center gap-4">
//                         {/* Custom Upload Button */}
//                         <div className="relative">
//                           <input
//                             type="file"
//                             id="file-upload"
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
//                             disabled={uploading}
//                             onChange={(e) =>
//                               e.target.files && handleImageUpload(e.target.files[0])
//                             }
//                           />
//                           <div className="w-24 h-24 border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center bg-white transition-colors duration-200">
//                             {uploading ? (
//                               <span className="text-xs font-medium text-gray-500 animate-pulse">
//                                 Uploading...
//                               </span>
//                             ) : (
//                               <>
//                                 <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
//                                 <span className="text-xs font-medium text-gray-500">
//                                   Add Photo
//                                 </span>
//                               </>
//                             )}
//                           </div>
//                         </div>

//                         {/* Image Previews */}
//                         {images.map((img, i) => (
//                           <div
//                             key={i}
//                             className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden relative group"
//                           >
//                             <img
//                               src={img.url}
//                               className="w-full h-full object-cover"
//                               alt="Preview"
//                             />
//                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                               <CheckCircle2 className="text-white w-6 h-6" />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
//                       <button
//                         onClick={() => setShowReviewForm(false)}
//                         className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={submitReview}
//                         className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
//                       >
//                         Submit Review
//                       </button>
//                     </div>
//                   </div>
//                 )
//               ) : (
//                 <div className="bg-gray-50 rounded-xl p-4 text-center">
//                   <p className="text-gray-500 text-sm">
//                     You can review this product once it has been delivered.
//                   </p>
//                 </div>
//               )}
//             </div>
            
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// "use client";

// import { useState, useEffect } from "react";
// import {
//   Package,
//   Truck,
//   MapPin,
//   Receipt,
//   Star,
//   UploadCloud,
//   CheckCircle2,
//   CalendarDays,
//   CreditCard,
//   XCircle,
//   AlertTriangle,
// } from "lucide-react";

// // --- TYPES ---
// type Product = {
//   id: number;
//   name: string;
//   image?: string;
//   description: string;
//   category?: string;
//   mrp?: string;
//   effective_price?: string;
//   discount_percent?: string;
// };

// type ShippingAddress = {
//   id?: number;
//   street: string;
//   city: string;
//   state: string;
//   postal_code?: string;
//   country?: string;
//   landmark?: string;
// };

// type ReviewImage = {
//   url: string;
//   public_id: string;
// };

// type Review = {
//   id: number | null;
//   product_id?: number | null;
//   user_id?: number | null;
//   order_id?: number | null;
//   rating: number | null;
//   review_text?: string | null;
//   images?: ReviewImage[];
// };

// type CancellationReason = {
//   id: number | null;
//   code: string | null;
//   description: string | null;
// };

// type CancelReasonOption = {
//   id: number;
//   code: string;
//   description: string;
// };

// type Item = {
//   id: number;
//   order_id?: number;
//   quantity: number;
//   price_at_order: string;
//   subtotal: string;
//   taxes?: string;
//   discount?: string;
//   paid_amount?: string;
//   product: Product;
//   shipping_address?: ShippingAddress;
//   status?: string;
//   reviews?: Review;
//   cancellation_reason?: CancellationReason;
// };

// type PaymentTransaction = {
//   id: number;
//   gateway_txn_id: string;
//   status: string;
//   payment_gateway: string;
//   amount: string;
// };

// type Order = {
//   id: number;
//   user_id?: number;
//   order_date: string;
//   status: string;
//   total_amount: string;
//   currency: string;
//   total_mrp?: string;
//   offer_discount?: string;
//   discount_amount?: string;
//   mhc_points?: string;
//   notes?: string;
//   payment_transaction?: PaymentTransaction;
//   items: Item[];
// };

// // --- HELPER COMPONENT: Interactive Star Rating ---
// const StarRating = ({
//   rating,
//   setRating,
// }: {
//   rating: number;
//   setRating: (r: number) => void;
// }) => {
//   const [hover, setHover] = useState(0);
//   return (
//     <div className="flex gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <button
//           key={star}
//           type="button"
//           onClick={() => setRating(star)}
//           onMouseEnter={() => setHover(star)}
//           onMouseLeave={() => setHover(0)}
//           className="focus:outline-none transition-colors duration-200"
//         >
//           <Star
//             className={`w-8 h-8 ${
//               star <= (hover || rating)
//                 ? "fill-yellow-400 text-yellow-400"
//                 : "text-gray-300"
//             }`}
//           />
//         </button>
//       ))}
//     </div>
//   );
// };

// // --- MAIN COMPONENT ---
// export default function OrderDetails({ order }: { order: Order }) {
//   const item = order.items?.[0];
//   const product = item?.product;
//   const address = item?.shipping_address;
//   const review = item?.reviews;

//   console.log(order)
  
//   // Check if item is cancelled (id is not null)
//   const isCancelled = item?.cancellation_reason && item.cancellation_reason.id !== null;
//   // Check if item can be cancelled
//   const canCancel = order.status?.toLowerCase() !== "delivered" && !isCancelled;

//   // Review States
//   const [showReviewForm, setShowReviewForm] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");
//   const [images, setImages] = useState<ReviewImage[]>([]);
//   const [uploading, setUploading] = useState(false);

//   // Cancellation States
//   const [showCancelForm, setShowCancelForm] = useState(false);
//   const [cancelReasons, setCancelReasons] = useState<CancelReasonOption[]>([]);
//   const [selectedReasonId, setSelectedReasonId] = useState<number | "">("");
//   const [isCancelling, setIsCancelling] = useState(false);

//   // Helper to get Auth Token from Cookies
//   const getToken = () => {
//     if (typeof document === "undefined") return null;
    
//     // Change "token" below if your cookie name is different (e.g., "access_token")
//     const cookieName = "token"; 
//     const match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    
//     if (match) {
//       return match[2];
//     }
//     return null;
//   };

//   /* FETCH CANCELLATION REASONS */
//   useEffect(() => {
//     if (showCancelForm && cancelReasons.length === 0) {
//       const fetchReasons = async () => {
//         try {
//           const res = await fetch("https://medicaps.cloud/grasa/shop/cancellation-reasons", {
//             headers: {
//               Authorization: `Bearer ${getToken()}`,
//             },
//           });
          
//           const data = await res.json();
          
//           // Defensive check: Ensure we only set the state if it's an array
//           if (res.ok && Array.isArray(data)) {
//             setCancelReasons(data);
//           } else if (res.ok && data && Array.isArray(data.data)) {
//             // Just in case the API wraps it in a "data" object
//             setCancelReasons(data.data);
//           } else {
//             console.error("Unexpected API response or failed request:", data);
//             setCancelReasons([]); // Fallback to empty array to prevent map crashes
//           }
//         } catch (error) {
//           console.error("Failed to fetch cancellation reasons", error);
//           setCancelReasons([]);
//         }
//       };
//       fetchReasons();
//     }
//   }, [showCancelForm, cancelReasons.length]);

//   /* SUBMIT CANCELLATION */
//   const submitCancellation = async () => {
//     if (!selectedReasonId) {
//       alert("Please select a cancellation reason.");
//       return;
//     }

//     setIsCancelling(true);
//     const payload = {
//       cancellation_reason_id: Number(selectedReasonId),
//     };

//     try {
//       const res = await fetch(
//         `https://medicaps.cloud/grasa/shop/admin/orders/${order.id}/items/${item?.id}/cancel`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${getToken()}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("Cancellation failed");

//       alert("Order item cancelled successfully.");
//       window.location.reload();
//     } catch (error) {
//       console.error("Cancellation failed", error);
//       alert("Failed to cancel the order. Please try again.");
//     } finally {
//       setIsCancelling(false);
//     }
//   };

//   /* IMAGE UPLOAD */
//   const handleImageUpload = async (file: File) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("https://medicaps.cloud/product-reviews/upload", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       setImages((prev) => [...prev, data]);
//     } catch (error) {
//       console.error("Upload failed", error);
//       alert("Failed to upload image. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   /* SUBMIT REVIEW */
//   const submitReview = async () => {
//     if (rating === 0) {
//       alert("Please select a rating before submitting.");
//       return;
//     }

//     const payload = {
//       rating,
//       review_text: reviewText,
//       order_item_id: item?.id,
//       images,
//     };

//     try {
//       await fetch(
//         `https://medicaps.cloud/product-reviews/products/${product?.id}/reviews`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );
//       alert("Review submitted successfully!");
//       window.location.reload();
//     } catch (error) {
//       console.error("Review submission failed", error);
//       alert("Failed to submit review.");
//     }
//   };

//   // Status Color Helper
//   const getStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case "delivered":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "shipped":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "cancelled":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
//       <div className="max-w-6xl mx-auto space-y-6">
        
//         {/* --- HEADER --- */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
//               <Package className="w-8 h-8 text-indigo-600" />
//               Order #{order.id}
//             </h1>
//             <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
//               <div className="flex items-center gap-1.5">
//                 <CalendarDays className="w-4 h-4" />
//                 {new Date(order.order_date).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}
//               </div>
//               <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300" />
//               <div className="flex items-center gap-1.5">
//                 <CreditCard className="w-4 h-4" />
//                 {order.payment_transaction?.payment_gateway || "Standard Checkout"}
//               </div>
//             </div>
//           </div>
//           <div
//             className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
//               isCancelled ? "Cancelled" : order.status
//             )} flex items-center gap-2 max-w-max`}
//           >
//             {order.status === "Delivered" && !isCancelled && <CheckCircle2 className="w-4 h-4" />}
//             {isCancelled && <XCircle className="w-4 h-4" />}
//             {isCancelled ? "Cancelled" : order.status}
//           </div>
//         </div>

//         {/* --- MAIN GRID --- */}
//         <div className="grid lg:grid-cols-12 gap-6">
          
//           {/* LEFT COLUMN: PRODUCT IMAGE (Sticky) */}
//           <div className="lg:col-span-5">
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
//               {product?.image ? (
//                 <div className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center p-4">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="max-w-full max-h-full object-contain mix-blend-multiply"
//                   />
//                 </div>
//               ) : (
//                 <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
//                   <Package className="w-20 h-20 text-gray-300" />
//                 </div>
//               )}
//               <div className="mt-6">
//                 <h2 className="text-xl font-bold text-gray-900 leading-tight">
//                   {product?.name}
//                 </h2>
//                 {product?.category && (
//                   <p className="text-sm text-indigo-600 font-medium mt-1">
//                     {product.category}
//                   </p>
//                 )}
//                 {product?.description && (
//                   <p className="mt-4 text-sm text-gray-600 line-clamp-3">
//                     {product.description}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: DETAILS */}
//           <div className="lg:col-span-7 space-y-6">
            
//             {/* PRICING & SUMMARY CARDS GRID */}
//             <div className="grid sm:grid-cols-2 gap-6">
//               {/* Pricing Details */}
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-2 mb-4 text-gray-900">
//                   <Receipt className="w-5 h-5 text-indigo-600" />
//                   <h3 className="font-bold text-lg">Item Pricing</h3>
//                 </div>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between text-gray-600">
//                     <span>MRP (Unit)</span>
//                     <span className="line-through">₹{product?.mrp}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Effective Price</span>
//                     <span>₹{product?.effective_price}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Quantity</span>
//                     <span className="font-medium text-gray-900">
//                       x {item?.quantity}
//                     </span>
//                   </div>
//                   <div className="pt-3 border-t border-gray-100 flex justify-between font-semibold text-base">
//                     <span>Item Subtotal</span>
//                     <span>₹{item?.subtotal}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Summary */}
//               <div className="bg-indigo-50 rounded-2xl p-6 shadow-sm border border-indigo-100">
//                 <h3 className="font-bold text-lg mb-4 text-indigo-900">
//                   Order Summary
//                 </h3>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between text-indigo-800/80">
//                     <span>Total MRP</span>
//                     <span>₹{order.total_mrp}</span>
//                   </div>
//                   <div className="flex justify-between text-green-700">
//                     <span>Total Discount</span>
//                     <span>- ₹{order.offer_discount}</span>
//                   </div>
//                   <div className="pt-3 border-t border-indigo-200/60 flex justify-between font-bold text-xl text-indigo-900">
//                     <span>Total Paid</span>
//                     <span>
//                       ₹{order.total_amount} {order.currency}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* SHIPPING ADDRESS */}
//             {address && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Truck className="w-5 h-5 text-indigo-600" />
//                   <h3 className="font-bold text-lg">Shipping Details</h3>
//                 </div>
//                 <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
//                   <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
//                   <div className="text-sm text-gray-700 leading-relaxed">
//                     <p className="font-medium text-gray-900 mb-1">Delivery Address</p>
//                     <p>{address.street}</p>
//                     {address.landmark && <p>Landmark: {address.landmark}</p>}
//                     <p>
//                       {address.city}, {address.state}
//                       {address.postal_code ? ` - ${address.postal_code}` : ""}
//                     </p>
//                     {address.country && <p>{address.country}</p>}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* CANCELLATION / ACTIONS SECTION */}
//             {isCancelled ? (
//               <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-100 text-red-900">
//                 <div className="flex items-center gap-2 mb-2">
//                   <XCircle className="w-6 h-6 text-red-600" />
//                   <h3 className="font-bold text-lg text-red-800">Item Cancelled</h3>
//                 </div>
//                 <p className="text-sm text-red-700">
//                   <span className="font-medium">Reason: </span>
//                   {item.cancellation_reason?.description || "Cancelled by user."}
//                 </p>
//               </div>
//             ) : canCancel ? (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-2 mb-6">
//                   <AlertTriangle className="w-5 h-5 text-orange-500" />
//                   <h3 className="font-bold text-lg">Order Actions</h3>
//                 </div>

//                 {!showCancelForm ? (
//                   <button
//                     onClick={() => setShowCancelForm(true)}
//                     className="w-full sm:w-auto bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm"
//                   >
//                     Cancel Order Item
//                   </button>
//                 ) : (
//                   <div className="animate-in fade-in duration-500 space-y-4 bg-red-50/50 border border-red-100 p-6 rounded-xl">
//                     <h4 className="font-semibold text-gray-900">
//                       Why are you cancelling?
//                     </h4>
                    
//                     <select
//                       value={selectedReasonId}
//                       onChange={(e) => setSelectedReasonId(Number(e.target.value))}
//                       className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
//                       disabled={isCancelling}
//                     >
//                       <option value="" disabled>Select a reason</option>
//                       {/* Defensive check added here to prevent .map crashes */}
//                       {Array.isArray(cancelReasons) && cancelReasons.map((reason) => (
//                         <option key={reason.id} value={reason.id}>
//                           {reason.description}
//                         </option>
//                       ))}
//                     </select>

//                     <div className="flex items-center justify-end gap-3 pt-4 border-t border-red-100">
//                       <button
//                         onClick={() => setShowCancelForm(false)}
//                         className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
//                         disabled={isCancelling}
//                       >
//                         Nevermind
//                       </button>
//                       <button
//                         onClick={submitCancellation}
//                         disabled={!selectedReasonId || isCancelling}
//                         className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
//                       >
//                         {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : null}

//             {/* REVIEWS SECTION (Only shown if delivered and not cancelled) */}
//             {order.status === "Delivered" && !isCancelled && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-2 mb-6">
//                   <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
//                   <h3 className="font-bold text-lg">Product Rating & Review</h3>
//                 </div>

//                 {/* Existing Review */}
//                 {review && review.rating !== null ? (
//                   <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
//                     <div className="flex items-center gap-1 mb-3">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-5 h-5 ${
//                             i < (review.rating || 0)
//                               ? "fill-yellow-400 text-yellow-400"
//                               : "fill-gray-200 text-gray-200"
//                           }`}
//                         />
//                       ))}
//                       <span className="ml-2 font-medium text-sm text-gray-600">
//                         {review.rating}/5
//                       </span>
//                     </div>
//                     {review.review_text && (
//                       <p className="text-gray-700 text-sm leading-relaxed mb-4">
//                         "{review.review_text}"
//                       </p>
//                     )}
//                     {review.images && review.images.length > 0 && (
//                       <div className="flex flex-wrap gap-3">
//                         {review.images.map((img, i) => (
//                           <div
//                             key={i}
//                             className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
//                           >
//                             <img
//                               src={img.url}
//                               alt="Review upload"
//                               className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   /* Add Review Trigger */
//                   !showReviewForm ? (
//                     <button
//                       onClick={() => setShowReviewForm(true)}
//                       className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm"
//                     >
//                       Write a Product Review
//                     </button>
//                   ) : (
//                     /* Review Form */
//                     <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6 bg-gray-50 border border-gray-100 p-6 rounded-xl">
//                       <h4 className="font-semibold text-gray-900">
//                         Share your experience
//                       </h4>

//                       {/* Interactive Star Rating */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">
//                           Rate this product
//                         </label>
//                         <StarRating rating={rating} setRating={setRating} />
//                       </div>

//                       {/* Review Text */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">
//                           Detailed Review
//                         </label>
//                         <textarea
//                           placeholder="What did you like or dislike? What should other shoppers know?"
//                           className="w-full min-h-[120px] p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none resize-y text-sm"
//                           value={reviewText}
//                           onChange={(e) => setReviewText(e.target.value)}
//                         />
//                       </div>

//                       {/* Custom Image Upload */}
//                       <div className="space-y-3">
//                         <label className="text-sm font-medium text-gray-700">
//                           Attach Photos (Optional)
//                         </label>
                        
//                         <div className="flex flex-wrap items-center gap-4">
//                           {/* Custom Upload Button */}
//                           <div className="relative">
//                             <input
//                               type="file"
//                               id="file-upload"
//                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
//                               disabled={uploading}
//                               onChange={(e) =>
//                                 e.target.files && handleImageUpload(e.target.files[0])
//                               }
//                             />
//                             <div className="w-24 h-24 border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center bg-white transition-colors duration-200">
//                               {uploading ? (
//                                 <span className="text-xs font-medium text-gray-500 animate-pulse">
//                                   Uploading...
//                                 </span>
//                               ) : (
//                                 <>
//                                   <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
//                                   <span className="text-xs font-medium text-gray-500">
//                                     Add Photo
//                                   </span>
//                                 </>
//                               )}
//                             </div>
//                           </div>

//                           {/* Image Previews */}
//                           {images.map((img, i) => (
//                             <div
//                               key={i}
//                               className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden relative group"
//                             >
//                               <img
//                                 src={img.url}
//                                 className="w-full h-full object-cover"
//                                 alt="Preview"
//                               />
//                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                                 <CheckCircle2 className="text-white w-6 h-6" />
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
//                         <button
//                           onClick={() => setShowReviewForm(false)}
//                           className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={submitReview}
//                           className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
//                         >
//                           Submit Review
//                         </button>
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             )}
            
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  MapPin,
  Receipt,
  Star,
  UploadCloud,
  CheckCircle2,
  CalendarDays,
  CreditCard,
  XCircle,
  AlertCircle
} from "lucide-react";

// --- HELPERS ---
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

// --- TYPES ---
type Product = {
  id: number;
  name: string;
  image?: string;
  description: string;
  category?: string;
  mrp?: string;
  effective_price?: string;
  discount_percent?: string;
};

type ShippingAddress = {
  id?: number;
  street: string;
  city: string;
  state: string;
  postal_code?: string;
  country?: string;
  landmark?: string;
};

type ReviewImage = {
  url: string;
  public_id: string;
};

type Review = {
  id: number | null;
  rating: number | null;
  review_text: string | null;
  images?: ReviewImage[];
};

type CancellationReason = {
  id: number | null;
  code: string | null;
  description: string | null;
};

type Item = {
  id: number;
  quantity: number;
  price_at_order: string;
  subtotal: string;
  taxes?: string;
  discount?: string;
  paid_amount?: string;
  product: Product;
  shipping_address: ShippingAddress;
  status?: string;
  reviews?: Review;
  cancellation_reason?: CancellationReason;
};

type PaymentTransaction = {
  id: number;
  gateway_txn_id: string;
  status: string;
  payment_gateway: string;
  amount: string;
};

type Order = {
  id: number;
  order_date: string;
  status: string;
  total_amount: string;
  currency: string;
  total_mrp?: string;
  offer_discount?: string;
  mhc_points?: string;
  notes?: string;
  payment_transaction?: PaymentTransaction;
  items: Item[];
};

// --- HELPER COMPONENT: Interactive Star Rating ---
const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (r: number) => void;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-colors duration-200"
        >
          <Star
            className={`w-8 h-8 ${
              star <= (hover || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function OrderDetails({ order }: { order: Order }) {
  const item = order.items?.[0];
  const product = item?.product;
  const address = item?.shipping_address;
  const review = item?.reviews;
  const cancellationReason = item?.cancellation_reason;

  // Review State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState<ReviewImage[]>([]);
  const [uploading, setUploading] = useState(false);

  // Cancellation State
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationReasonsList, setCancellationReasonsList] = useState<CancellationReason[]>([]);
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Time Validation
  const orderDate = new Date(order.order_date).getTime();
  const now = new Date().getTime();
  const hoursSinceOrder = (now - orderDate) / (1000 * 60 * 60);
  const isWithin24Hours = hoursSinceOrder <= 24;
  
  const isCancelled = cancellationReason && cancellationReason.id !== null;
  const canCancel = !isCancelled && order.status?.toLowerCase() !== "delivered" && isWithin24Hours;

  // Review Visibility Logic
  const hasExistingReview = review && review.rating !== null;
  const isDeliveredAndNotCancelled = order.status?.toLowerCase() === "delivered" && !isCancelled;
  const shouldShowReviewSection = hasExistingReview || isDeliveredAndNotCancelled;

  // Fetch Cancellation Reasons
  useEffect(() => {
    if (canCancel) {
      const fetchReasons = async () => {
        const token = getCookie("token"); 
        try {
          const res = await fetch("https://medicaps.cloud/grasa/shop/cancellation-reasons", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (res.ok) {
            const data = await res.json();
            setCancellationReasonsList(data);
          }
        } catch (error) {
          console.error("Failed to fetch cancellation reasons:", error);
        }
      };
      fetchReasons();
    }
  }, [canCancel]);

  /* IMAGE UPLOAD */
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://medicaps.cloud/product-reviews/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* SUBMIT REVIEW */
  const submitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    const payload = {
      rating,
      review_text: reviewText,
      order_item_id: item?.id,
      images,
    };

    try {
      await fetch(
        `https://medicaps.cloud/product-reviews/products/${product?.id}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      alert("Review submitted successfully!");
      location.reload();
    } catch (error) {
      console.error("Review submission failed", error);
      alert("Failed to submit review.");
    }
  };

  /* CANCEL ORDER */
  const handleCancelOrder = async () => {
    if (!selectedReasonId) {
      alert("Please select a reason for cancellation.");
      return;
    }

    setIsCancelling(true);
    const token = getCookie("token");

    try {
      const response = await fetch(
        `https://medicaps.cloud/grasa/shop/admin/orders/${order.id}/items/${item?.id}/cancel`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cancellation_reason_id: selectedReasonId }),
        }
      );

      if (response.ok) {
        alert("Order item cancelled successfully.");
        location.reload();
      } else {
        const errData = await response.json();
        alert(`Failed to cancel order: ${errData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Cancellation failed", error);
      alert("An error occurred while cancelling the order.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Status Color Helper
  const getStatusColor = (status: string, isCancelled: boolean) => {
    if (isCancelled || status?.toLowerCase() === "cancelled") {
      return "bg-red-100 text-red-800 border-red-200";
    }
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" />
              Order #{order.id}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                {new Date(order.order_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
              <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300" />
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                {order.payment_transaction?.payment_gateway || "Standard Checkout"}
              </div>
            </div>
          </div>
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
              order.status, !!isCancelled
            )} flex items-center gap-2 max-w-max`}
          >
            {order.status === "Delivered" && !isCancelled && <CheckCircle2 className="w-4 h-4" />}
            {isCancelled && <XCircle className="w-4 h-4" />}
            {isCancelled ? "Cancelled" : order.status}
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: PRODUCT IMAGE (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
              {product?.image ? (
                <div className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-300" />
                </div>
              )}
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {product?.name}
                </h2>
                {product?.category && (
                  <p className="text-sm text-indigo-600 font-medium mt-1">
                    {product.category}
                  </p>
                )}
                {product?.description && (
                  <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* CANCELLATION SECTION */}
            {isCancelled ? (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-red-800">
                  <XCircle className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Order Cancelled</h3>
                </div>
                <p className="text-red-700 text-sm mb-1">
                  <span className="font-semibold">Reason:</span> {cancellationReason.description || cancellationReason.code || "No reason provided."}
                </p>
              </div>
            ) : canCancel ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {!showCancelForm ? (
                  <div className="flex items-center justify-between flex-wrap gap-4">
                     <div>
                       <h3 className="font-bold text-lg text-gray-900 mb-1">Cancel Order</h3>
                       <p className="text-sm text-gray-500">You can cancel this order within 24 hours of placing it.</p>
                     </div>
                     <button
                        onClick={() => setShowCancelForm(true)}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        Cancel Item
                      </button>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
                    <div className="flex items-center gap-2 text-red-600 mb-4">
                      <AlertCircle className="w-5 h-5" />
                      <h4 className="font-semibold">Why are you cancelling?</h4>
                    </div>
                    
                    <div className="space-y-3">
                      {cancellationReasonsList.length > 0 ? (
                        cancellationReasonsList.map((reason) => (
                          <label key={reason.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="cancel_reason"
                              value={reason.id || ""}
                              checked={selectedReasonId === reason.id}
                              onChange={() => setSelectedReasonId(reason.id)}
                              className="mt-0.5 text-red-600 focus:ring-red-500"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{reason.code?.replace(/_/g, ' ')}</p>
                              <p className="text-xs text-gray-500">{reason.description}</p>
                            </div>
                          </label>
                        ))
                      ) : (
                         <p className="text-sm text-gray-500">Loading cancellation reasons...</p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                      <button
                        onClick={() => setShowCancelForm(false)}
                        disabled={isCancelling}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        Keep Order
                      </button>
                      <button
                        onClick={handleCancelOrder}
                        disabled={isCancelling || !selectedReasonId}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                      >
                        {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* PRICING & SUMMARY CARDS GRID */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Pricing Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-900">
                  <Receipt className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-lg">Item Pricing</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>MRP (Unit)</span>
                    <span className="line-through">₹{product?.mrp}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Effective Price</span>
                    <span>₹{product?.effective_price}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Quantity</span>
                    <span className="font-medium text-gray-900">
                      x {item?.quantity}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between font-semibold text-base">
                    <span>Item Subtotal</span>
                    <span>₹{item?.subtotal}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-indigo-50 rounded-2xl p-6 shadow-sm border border-indigo-100">
                <h3 className="font-bold text-lg mb-4 text-indigo-900">
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-indigo-800/80">
                    <span>Total MRP</span>
                    <span>₹{order.total_mrp}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Total Discount</span>
                    <span>- ₹{order.offer_discount}</span>
                  </div>
                  <div className="pt-3 border-t border-indigo-200/60 flex justify-between font-bold text-xl text-indigo-900">
                    <span>Total Paid</span>
                    <span>
                      ₹{order.total_amount} {order.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SHIPPING ADDRESS */}
            {address && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-lg">Shipping Details</h3>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <p className="font-medium text-gray-900 mb-1">Delivery Address</p>
                    <p>{address.street}</p>
                    {address.landmark && <p>Landmark: {address.landmark}</p>}
                    <p>
                      {address.city}, {address.state} - {address.postal_code}
                    </p>
                    {address.country && <p>{address.country}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS SECTION */}
            {shouldShowReviewSection && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <h3 className="font-bold text-lg">Product Rating & Review</h3>
                </div>

                {/* Existing Review */}
                {hasExistingReview ? (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < (review.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-medium text-sm text-gray-600">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      "{review.review_text}"
                    </p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {review.images.map((img, i) => (
                          <div
                            key={i}
                            className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                          >
                            <img
                              src={img.url}
                              alt="Review upload"
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Add Review Trigger & Form (Only shows if Delivered and Not Cancelled) */
                  !showReviewForm ? (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm"
                    >
                      Write a Product Review
                    </button>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6 bg-gray-50 border border-gray-100 p-6 rounded-xl">
                      <h4 className="font-semibold text-gray-900">
                        Share your experience
                      </h4>

                      {/* Interactive Star Rating */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Rate this product
                        </label>
                        <StarRating rating={rating} setRating={setRating} />
                      </div>

                      {/* Review Text */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Detailed Review
                        </label>
                        <textarea
                          placeholder="What did you like or dislike? What should other shoppers know?"
                          className="w-full min-h-[120px] p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none resize-y text-sm"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                        />
                      </div>

                      {/* Custom Image Upload */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                          Attach Photos (Optional)
                        </label>
                        
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="relative">
                            <input
                              type="file"
                              id="file-upload"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              disabled={uploading}
                              onChange={(e) =>
                                e.target.files && handleImageUpload(e.target.files[0])
                              }
                            />
                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center bg-white transition-colors duration-200">
                              {uploading ? (
                                <span className="text-xs font-medium text-gray-500 animate-pulse">
                                  Uploading...
                                </span>
                              ) : (
                                <>
                                  <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                                  <span className="text-xs font-medium text-gray-500">
                                    Add Photo
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Image Previews */}
                          {images.map((img, i) => (
                            <div
                              key={i}
                              className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden relative group"
                            >
                              <img
                                src={img.url}
                                className="w-full h-full object-cover"
                                alt="Preview"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <CheckCircle2 className="text-white w-6 h-6" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={submitReview}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}