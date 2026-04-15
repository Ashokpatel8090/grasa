// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";
// import toast from "react-hot-toast";
// import { useCart } from "@/components/grasa/CartContext";
// import AddressSection from "../../components/grasa/Address";
// import PaymentSection from "../../components/grasa/Payment";
// import { Button } from "@/components/ui/button";
// import { BASE_URL } from "@/components/config/api";



// const FETCH_CART_URL = `${BASE_URL}/grasa/shop/cart`;
// /* ================= COOKIE UTILITY ================= */
// const getCookie = (name: string): string | null => {
//   if (typeof document === "undefined") return null;
//   const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
//   return match ? decodeURIComponent(match[2]) : null;
// };

// /* ================= DATE HELPERS ================= */
// function nextWeekdayFrom(date: Date, targetWeekday: number) {
//   const d = new Date(date.getTime());
//   const day = d.getDay();
//   let delta = (targetWeekday - day + 7) % 7;
//   if (delta === 0) delta = 7;
//   d.setDate(d.getDate() + delta);
//   d.setHours(0, 0, 0, 0);
//   return d;
// }

// function formatDisplayDate(d: Date) {
//   return d.toLocaleDateString(undefined, {
//     weekday: "long",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }

// /* ================= PAGE ================= */
// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, refreshCart } = useCart();

//   const token = typeof window !== "undefined" ? getCookie("token") : null;

//   /* ================= STATE ================= */
//   const [cartId, setCartId] = useState<number | null>(null);
//   const [apiTotalAmount, setApiTotalAmount] = useState<number>(0);

//   const [loading, setLoading] = useState(true);
//   const [loadingPaymentMeta, setLoadingPaymentMeta] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);
//   const [processing, setProcessing] = useState(false);

//   const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
//   const [appliedMhcPoints, setAppliedMhcPoints] = useState<number>(0);
//   const [basePrice, setBasePrice] = useState<number>(0);




//   /* ================= FETCH CART META ================= */
//   const fetchCartMeta = useCallback(async () => {
//     if (!token) return null;

//     try {
//       const res = await fetch(FETCH_CART_URL, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         console.error("Failed to fetch cart");
//         return null;
//       }

//       const data = await res.json();

//       setAppliedMhcPoints(Number(data?.applied_mhc_points ?? 0));


//       const cid = data?.cart?.id ?? null;
//       const total = Number(data?.cart?.total_price ?? 0);
//       const base = Number(data?.base_price ?? 0);

//       console.log(total)

//       setCartId(cid);
//       setApiTotalAmount(total);
//       setBasePrice(base);


//       return cid;
//     } catch (err) {
//       console.error(err);
//       return null;
//     }
//   }, [token]);

//   /* ================= INIT ================= */
//   useEffect(() => {
//     setLoading(true);
//     (async () => {
//       await fetchCartMeta();
//       setLoading(false);
//     })();
//   }, [fetchCartMeta]);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   /* ================= GUARDS ================= */
//   useEffect(() => {
//     if (orderSuccess) return;

//     if (!token) {
//       toast.error("Login required to checkout");
//       router.push("/login");
//       return;
//     }

//     if (mounted && !loading && !loadingPaymentMeta) {
//       if (!cart || cart.length === 0) {
//         toast.error("Cart is empty");
//         router.push("/cart");
//       }
//     }
//   }, [token, cart, mounted, loading, loadingPaymentMeta, orderSuccess, router]);

//   /* ================= AUTO DELIVERY POPUP ================= */
//   useEffect(() => {
//     let hasStored = false;
//     try {
//       if (typeof window !== "undefined") {
//         hasStored = !!localStorage.getItem("selectedDelivery");
//       }
//     } catch {
//       hasStored = false;
//     }

//     if (hasStored) return;

//     const t = setTimeout(() => setShowDeliveryPopup(true), 2000);
//     return () => clearTimeout(t);
//   }, []);

//   /* ================= ORDER SUCCESS MODAL ================= */
//   const [modalOpen, setModalOpen] = useState(false);
//   const [countdown, setCountdown] = useState(10);
//   const [deliveryOptions, setDeliveryOptions] = useState<
//     { key: "wednesday" | "saturday"; date: Date; display: string }[]
//   >([]);
//   const [selectedOptionKey, setSelectedOptionKey] = useState<
//     "wednesday" | "saturday" | ""
//   >("");

//   useEffect(() => {
//     if (!orderSuccess) return;

//     const today = new Date();
//     const wed = nextWeekdayFrom(today, 3);
//     const sat = nextWeekdayFrom(today, 6);

//     setDeliveryOptions([
//       { key: "wednesday", date: wed, display: formatDisplayDate(wed) },
//       { key: "saturday", date: sat, display: formatDisplayDate(sat) },
//     ]);

//     setSelectedOptionKey("");
//     setModalOpen(true);
//     setCountdown(10);
//   }, [orderSuccess]);

//   useEffect(() => {
//     if (!modalOpen) return;

//     const i = setInterval(() => {
//       setCountdown((c) => {
//         if (c <= 1) {
//           clearInterval(i);
//           return 0;
//         }
//         return c - 1;
//       });
//     }, 1000);

//     return () => clearInterval(i);
//   }, [modalOpen]);

//   useEffect(() => {
//     if (modalOpen && countdown === 0) {
//       setModalOpen(false);
//       router.push("/orders");
//     }
//   }, [countdown, modalOpen, router]);

//   const handleModalSubmit = () => {
//     if (!selectedOptionKey) {
//       toast.error("Please select a delivery date");
//       return;
//     }

//     const opt = deliveryOptions.find((o) => o.key === selectedOptionKey);
//     if (!opt) return;

//     localStorage.setItem(
//       "selectedDelivery",
//       JSON.stringify({
//         day: opt.key,
//         date: opt.date.toISOString(),
//         display: opt.display,
//       })
//     );

//     setModalOpen(false);
//     router.push("/products");
//   };

//   /* ================= LOADING ================= */
//   if (loading)
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
//         <p className="text-lg mt-3 text-gray-600">Loading checkout...</p>
//       </div>
//     );

//   if (!token)
//     return (
//       <div className="text-center py-20">
//         <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
//         <Button onClick={() => router.push("/login")}>Go to Login</Button>
//       </div>
//     );

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen bg-gray-50 pb-24">
//       <div className="max-w-7xl mx-auto py-8 px-4">
//         <div className="flex justify-between mb-6">
//           <h1 className="text-2xl font-bold">
//             Checkout — Address & Delivery Date
//           </h1>
//           {/* <div className="text-sm text-gray-600">
//             Items: {cart.length} • Total: ₹{apiTotalAmount.toFixed(2)}
//           </div> */}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <AddressSection
//               token={token}
//               selectedAddressId={selectedAddressId}
//               setSelectedAddressId={setSelectedAddressId}
//               selectedDate={selectedDate}
//               setSelectedDate={setSelectedDate}
//               showDeliveryPopup={showDeliveryPopup}
//               setShowDeliveryPopup={setShowDeliveryPopup}
//               setLoadingPaymentMeta={setLoadingPaymentMeta}
//             />
//           </div>

//           <PaymentSection
//   token={token}
//   cart={cart}
//   totalAmount={apiTotalAmount}
//   basePrice={basePrice}          // ✅ ADDED
//   appliedMhcPoints={appliedMhcPoints}
//   selectedAddressId={selectedAddressId}
//   selectedDate={selectedDate}
//   cartId={cartId}
//   setCartId={setCartId}
//   setOrderSuccess={setOrderSuccess}
//   clearCart={clearCart}
//   refreshCart={refreshCart}
//   processing={processing}
//   setProcessing={setProcessing}
// />

//         </div>
//       </div>

//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               Order Confirmed 🎉 ({countdown}s)
//             </h2>

//             {deliveryOptions.map((o) => (
//               <label
//                 key={o.key}
//                 className="flex justify-between border p-3 rounded mb-3 cursor-pointer"
//               >
//                 <span>{o.display}</span>
//                 <input
//                   type="radio"
//                   checked={selectedOptionKey === o.key}
//                   onChange={() => setSelectedOptionKey(o.key)}
//                 />
//               </label>
//             ))}

//             <Button className="w-full mt-4" onClick={handleModalSubmit}>
//               Confirm Delivery
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";
// import toast from "react-hot-toast";
// import { useCart } from "@/components/grasa/CartContext";
// import AddressSection from "../../components/grasa/Address";
// import PaymentSection from "../../components/grasa/Payment";
// import { BASE_URL } from "@/components/config/api";

// const FETCH_CART_URL = `${BASE_URL}/grasa/shop/cart`;

// const getCookie = (name: string): string | null => {
//   if (typeof document === "undefined") return null;
//   const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
//   return match ? decodeURIComponent(match[2]) : null;
// };

// function nextWeekdayFrom(date: Date, targetWeekday: number) {
//   const d = new Date(date.getTime());
//   const day = d.getDay();
//   let delta = (targetWeekday - day + 7) % 7;
//   if (delta === 0) delta = 7;
//   d.setDate(d.getDate() + delta);
//   d.setHours(0, 0, 0, 0);
//   return d;
// }

// function formatDisplayDate(d: Date) {
//   return d.toLocaleDateString(undefined, {
//     weekday: "long",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, refreshCart } = useCart();

//   const token = typeof window !== "undefined" ? getCookie("token") : null;

//   const [cartId, setCartId] = useState<number | null>(null);
//   const [apiTotalAmount, setApiTotalAmount] = useState<number>(0);
//   const [basePrice, setBasePrice] = useState<number>(0);
//   const [appliedMhcPoints, setAppliedMhcPoints] = useState<number>(0);

//   const [loading, setLoading] = useState(true);
//   const [loadingPaymentMeta, setLoadingPaymentMeta] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);
//   const [processing, setProcessing] = useState(false);

//   const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);

//   // Post-order modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [countdown, setCountdown] = useState(10);
//   const [deliveryOptions, setDeliveryOptions] = useState<
//     { key: "wednesday" | "saturday"; date: Date; display: string }[]
//   >([]);
//   const [selectedOptionKey, setSelectedOptionKey] = useState<"wednesday" | "saturday" | "">("");

//   const fetchCartMeta = useCallback(async () => {
//     if (!token) return;
//     try {
//       const res = await fetch(FETCH_CART_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) return;
//       const data = await res.json();
//       setAppliedMhcPoints(Number(data?.applied_mhc_points ?? 0));
//       setCartId(data?.cart?.id ?? null);
//       setApiTotalAmount(Number(data?.cart?.total_price ?? 0));
//       setBasePrice(Number(data?.base_price ?? 0));
//     } catch (err) {
//       console.error(err);
//     }
//   }, [token]);

//   useEffect(() => {
//     setLoading(true);
//     fetchCartMeta().finally(() => setLoading(false));
//   }, [fetchCartMeta]);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     if (orderSuccess) return;
//     if (!token) {
//       toast.error("Login required to checkout");
//       router.push("/login");
//       return;
//     }
//     if (mounted && !loading && !loadingPaymentMeta) {
//       if (!cart || cart.length === 0) {
//         toast.error("Cart is empty");
//         router.push("/cart");
//       }
//     }
//   }, [token, cart, mounted, loading, loadingPaymentMeta, orderSuccess, router]);

//   useEffect(() => {
//     let hasStored = false;
//     try {
//       if (typeof window !== "undefined") {
//         hasStored = !!localStorage.getItem("selectedDelivery");
//       }
//     } catch { hasStored = false; }
//     if (hasStored) return;
//     const t = setTimeout(() => setShowDeliveryPopup(true), 2000);
//     return () => clearTimeout(t);
//   }, []);

//   useEffect(() => {
//     if (!orderSuccess) return;
//     const today = new Date();
//     const wed = nextWeekdayFrom(today, 3);
//     const sat = nextWeekdayFrom(today, 6);
//     setDeliveryOptions([
//       { key: "wednesday", date: wed, display: formatDisplayDate(wed) },
//       { key: "saturday", date: sat, display: formatDisplayDate(sat) },
//     ]);
//     setSelectedOptionKey("");
//     setModalOpen(true);
//     setCountdown(10);
//   }, [orderSuccess]);

//   useEffect(() => {
//     if (!modalOpen) return;
//     const i = setInterval(() => {
//       setCountdown((c) => {
//         if (c <= 1) { clearInterval(i); return 0; }
//         return c - 1;
//       });
//     }, 1000);
//     return () => clearInterval(i);
//   }, [modalOpen]);

//   useEffect(() => {
//     if (modalOpen && countdown === 0) {
//       setModalOpen(false);
//       router.push("/orders");
//     }
//   }, [countdown, modalOpen, router]);

//   const handleModalSubmit = () => {
//     if (!selectedOptionKey) { toast.error("Please select a delivery date"); return; }
//     const opt = deliveryOptions.find((o) => o.key === selectedOptionKey);
//     if (!opt) return;
//     localStorage.setItem("selectedDelivery", JSON.stringify({
//       day: opt.key,
//       date: opt.date.toISOString(),
//       display: opt.display,
//     }));
//     setModalOpen(false);
//     router.push("/products");
//   };

//   if (loading) return (
//     <div style={{
//       display: "flex", flexDirection: "column", alignItems: "center",
//       justifyContent: "center", minHeight: "100vh", background: "#f9f8f4"
//     }}>
//       <Loader2 className="h-12 w-12 animate-spin" style={{ color: "#C5D82D" }} />
//       <p style={{ marginTop: 12, color: "#5c5c5c", fontSize: 16 }}>Loading checkout...</p>
//     </div>
//   );

//   if (!token) return (
//     <div style={{ textAlign: "center", padding: "80px 20px" }}>
//       <p style={{ fontSize: 18, color: "#1b1b1b", marginBottom: 16 }}>Please log in to continue</p>
//       <button
//         onClick={() => router.push("/login")}
//         style={{
//           background: "#C5D82D", border: "none", borderRadius: 8,
//           padding: "12px 32px", fontSize: 15, fontWeight: 500, cursor: "pointer"
//         }}
//       >
//         Go to Login
//       </button>
//     </div>
//   );

//   return (
//     <div style={{ minHeight: "100vh", background: "#f9f8f4", paddingBottom: 80 }}>
//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px" }}>

//         {/* Top bar */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
//           <h1 style={{ fontSize: 22, fontWeight: 500 }}>Checkout</h1>
//           <div style={{ fontSize: 13, color: "#888", display: "flex", gap: 6, alignItems: "center" }}>
//             <span style={{ color: "#888" }}>Cart</span>
//             <span style={{ color: "#bbb" }}>›</span>
//             <span style={{ color: "#C5D82D", fontWeight: 500 }}>Address &amp; Payment</span>
//           </div>
//         </div>

//         {/* Main grid */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start" }}>
//           <div>
//             <AddressSection
//               token={token}
//               selectedAddressId={selectedAddressId}
//               setSelectedAddressId={setSelectedAddressId}
//               selectedDate={selectedDate}
//               setSelectedDate={setSelectedDate}
//               showDeliveryPopup={showDeliveryPopup}
//               setShowDeliveryPopup={setShowDeliveryPopup}
//               setLoadingPaymentMeta={setLoadingPaymentMeta}
//             />
//           </div>

//           <PaymentSection
//             token={token}
//             cart={cart}
//             totalAmount={apiTotalAmount}
//             basePrice={basePrice}
//             appliedMhcPoints={appliedMhcPoints}
//             selectedAddressId={selectedAddressId}
//             selectedDate={selectedDate}
//             cartId={cartId}
//             setCartId={setCartId}
//             setOrderSuccess={setOrderSuccess}
//             clearCart={clearCart}
//             refreshCart={refreshCart}
//             processing={processing}
//             setProcessing={setProcessing}
//           />
//         </div>
//       </div>

//       {/* Post-order modal */}
//       {modalOpen && (
//         <div style={{
//           position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
//           display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
//         }}>
//           <div style={{
//             background: "#fff", borderRadius: 16, padding: 28,
//             width: "100%", maxWidth: 420, margin: "0 16px"
//           }}>
//             <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>
//               Order confirmed! 🎉
//             </h2>
//             <p style={{ fontSize: 14, color: "#5c5c5c", marginBottom: 20 }}>
//               Choose your next delivery date. Redirecting in {countdown}s...
//             </p>

//             {deliveryOptions.map((o) => (
//               <label key={o.key} style={{
//                 display: "flex", justifyContent: "space-between", alignItems: "center",
//                 border: `1.5px solid ${selectedOptionKey === o.key ? "#7c9b2a" : "#e5e5e0"}`,
//                 borderRadius: 10, padding: "12px 16px", marginBottom: 10, cursor: "pointer",
//                 background: selectedOptionKey === o.key ? "#f8fce8" : "#fff"
//               }}>
//                 <span style={{ fontSize: 14 }}>{o.display}</span>
//                 <input
//                   type="radio"
//                   checked={selectedOptionKey === o.key}
//                   onChange={() => setSelectedOptionKey(o.key)}
//                 />
//               </label>
//             ))}

//             <button
//               onClick={handleModalSubmit}
//               style={{
//                 width: "100%", background: "#C5D82D", border: "none",
//                 borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 500,
//                 cursor: "pointer", marginTop: 8
//               }}
//             >
//               Confirm &amp; Continue Shopping
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }














// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Loader2, ArrowLeft } from "lucide-react";
// import toast from "react-hot-toast";
// import { useCart } from "@/components/grasa/CartContext";
// import AddressSection from "@/components/grasa/Address";
// import PaymentSection from "@/components/grasa/Payment";
// import { BASE_URL } from "@/components/config/api";

// const FETCH_CART_URL = `${BASE_URL}/grasa/shop/cart`;

// const getCookie = (name: string): string | null => {
//   if (typeof document === "undefined") return null;
//   const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
//   return match ? decodeURIComponent(match[2]) : null;
// };

// function nextWeekdayFrom(date: Date, targetWeekday: number) {
//   const d = new Date(date.getTime());
//   const day = d.getDay();
//   let delta = (targetWeekday - day + 7) % 7;
//   if (delta === 0) delta = 7;
//   d.setDate(d.getDate() + delta);
//   d.setHours(0, 0, 0, 0);
//   return d;
// }

// function formatDisplayDate(d: Date) {
//   return d.toLocaleDateString(undefined, {
//     weekday: "long",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, refreshCart } = useCart();

//   const token = typeof window !== "undefined" ? getCookie("token") : null;

//   const [cartId, setCartId] = useState<number | null>(null);
//   const [apiTotalAmount, setApiTotalAmount] = useState<number>(0);
//   const [basePrice, setBasePrice] = useState<number>(0);
//   const [appliedMhcPoints, setAppliedMhcPoints] = useState<number>(0);

//   const [loading, setLoading] = useState(true);
//   const [loadingPaymentMeta, setLoadingPaymentMeta] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);

//   // Post-order modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [countdown, setCountdown] = useState(10);
//   const [deliveryOptions, setDeliveryOptions] = useState<
//     { key: "wednesday" | "saturday"; date: Date; display: string }[]
//   >([]);
//   const [selectedOptionKey, setSelectedOptionKey] = useState<"wednesday" | "saturday" | "">("");

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   const fetchCartMeta = useCallback(async () => {
//     if (!token) return;
//     try {
//       const res = await fetch(FETCH_CART_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) return;
//       const data = await res.json();
//       setAppliedMhcPoints(Number(data?.applied_mhc_points ?? 0));
//       setCartId(data?.cart?.id ?? null);
//       setApiTotalAmount(Number(data?.cart?.total_price ?? 0));
//       setBasePrice(Number(data?.base_price ?? 0));
//     } catch (err) {
//       console.error(err);
//     }
//   }, [token]);

//   useEffect(() => {
//     setLoading(true);
//     fetchCartMeta().finally(() => setLoading(false));
//   }, [fetchCartMeta]);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     if (orderSuccess) return;
//     if (!token) {
//       toast.error("Login required to checkout");
//       router.push("/login");
//       return;
//     }
//     if (mounted && !loading && !loadingPaymentMeta) {
//       if (!cart || cart.length === 0) {
//         toast.error("Cart is empty");
//         router.push("/cart");
//       }
//     }
//   }, [token, cart, mounted, loading, loadingPaymentMeta, orderSuccess, router]);

//   useEffect(() => {
//     let hasStored = false;
//     try {
//       if (typeof window !== "undefined") {
//         hasStored = !!localStorage.getItem("selectedDelivery");
//       }
//     } catch { hasStored = false; }
//     if (hasStored) return;
//     const t = setTimeout(() => setShowDeliveryPopup(true), 2000);
//     return () => clearTimeout(t);
//   }, []);

//   useEffect(() => {
//     if (!orderSuccess) return;
//     const today = new Date();
//     const wed = nextWeekdayFrom(today, 3);
//     const sat = nextWeekdayFrom(today, 6);
//     setDeliveryOptions([
//       { key: "wednesday", date: wed, display: formatDisplayDate(wed) },
//       { key: "saturday", date: sat, display: formatDisplayDate(sat) },
//     ]);
//     setSelectedOptionKey("");
//     setModalOpen(true);
//     setCountdown(10);
//   }, [orderSuccess]);

//   useEffect(() => {
//     if (!modalOpen) return;
//     const i = setInterval(() => {
//       setCountdown((c) => {
//         if (c <= 1) { clearInterval(i); return 0; }
//         return c - 1;
//       });
//     }, 1000);
//     return () => clearInterval(i);
//   }, [modalOpen]);

//   useEffect(() => {
//     if (modalOpen && countdown === 0) {
//       setModalOpen(false);
//       router.push("/orders");
//     }
//   }, [countdown, modalOpen, router]);

//   const handleModalSubmit = () => {
//     if (!selectedOptionKey) { toast.error("Please select a delivery date"); return; }
//     const opt = deliveryOptions.find((o) => o.key === selectedOptionKey);
//     if (!opt) return;
//     localStorage.setItem("selectedDelivery", JSON.stringify({
//       day: opt.key,
//       date: opt.date.toISOString(),
//       display: opt.display,
//     }));
//     setModalOpen(false);
//     router.push("/products");
//   };

//   if (loading) return (
//     <div style={{
//       display: "flex", flexDirection: "column", alignItems: "center",
//       justifyContent: "center", minHeight: "100vh", background: "#f9f8f4",
//       padding: "20px",
//     }}>
//       <Loader2 className="h-12 w-12 animate-spin" style={{ color: "#C5D82D" }} />
//       <p style={{ marginTop: 12, color: "#5c5c5c", fontSize: isMobile ? 14 : 16 }}>Loading checkout...</p>
//     </div>
//   );

//   if (!token) return (
//     <div style={{
//       textAlign: "center", padding: isMobile ? "40px 20px" : "80px 20px",
//       minHeight: "100vh", background: "#f9f8f4", display: "flex",
//       flexDirection: "column", alignItems: "center", justifyContent: "center",
//     }}>
//       <p style={{ fontSize: isMobile ? 16 : 18, color: "#1b1b1b", marginBottom: 20 }}>Please log in to continue</p>
//       <button
//         onClick={() => router.push("/login")}
//         style={{
//           background: "#C5D82D", border: "none", borderRadius: 8,
//           padding: isMobile ? "12px 24px" : "12px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer",
//           color: "#1b1b1b",
//         }}
//       >
//         Go to Login
//       </button>
//     </div>
//   );

//   return (
//     <div style={{ minHeight: "100vh", background: "#f9f8f4", paddingBottom: isMobile ? 20 : 80 }}>
//       <div style={{
//         maxWidth: 1200, margin: "0 auto", padding: isMobile ? "16px" : "28px 16px",
//       }}>

//         {/* Top bar */}
//         <div style={{
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           marginBottom: isMobile ? "16px" : "24px",
//           flexWrap: "wrap",
//           gap: "12px",
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <button
//               onClick={() => router.push("/cart")}
//               style={{
//                 background: "none", border: "none", cursor: "pointer", padding: 0,
//                 display: isMobile ? "flex" : "none", alignItems: "center",
//               }}
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 600 }}>Checkout</h1>
//           </div>
//           {!isMobile && (
//             <div style={{ fontSize: 13, color: "#888", display: "flex", gap: 6, alignItems: "center" }}>
//               <span style={{ color: "#888" }}>Cart</span>
//               <span style={{ color: "#bbb" }}>›</span>
//               <span style={{ color: "#C5D82D", fontWeight: 600 }}>Address &amp; Payment</span>
//             </div>
//           )}
//         </div>

//         {/* Main grid */}
//         <div style={{
//           display: "grid",
//           gridTemplateColumns: isMobile ? "1fr" : "1fr 380px",
//           gap: isMobile ? "12px" : "20px",
//           alignItems: isMobile ? "stretch" : "start",
//         }}>
//           <div>
//             <AddressSection
//               token={token}
//               selectedAddressId={selectedAddressId}
//               setSelectedAddressId={setSelectedAddressId}
//               selectedDate={selectedDate}
//               setSelectedDate={setSelectedDate}
//               showDeliveryPopup={showDeliveryPopup}
//               setShowDeliveryPopup={setShowDeliveryPopup}
//               setLoadingPaymentMeta={setLoadingPaymentMeta}
//             />
//           </div>

//           <PaymentSection
//             token={token}
//             cart={cart}
//             totalAmount={apiTotalAmount}
//             basePrice={basePrice}
//             appliedMhcPoints={appliedMhcPoints}
//             selectedAddressId={selectedAddressId}
//             selectedDate={selectedDate}
//             cartId={cartId}
//             setCartId={setCartId}
//             setOrderSuccess={setOrderSuccess}
//             clearCart={clearCart}
//             refreshCart={refreshCart}
//             processing={processing}
//             setProcessing={setProcessing}
//           />
//         </div>
//       </div>

//       {/* Post-order modal */}
//       {modalOpen && (
//         <div style={{
//           position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
//           display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center",
//           zIndex: 50, padding: 0, overflowY: "auto",
//         }}>
//           <div style={{
//             background: "#fff", borderRadius: isMobile ? "20px 20px 0 0" : "16px", padding: isMobile ? "20px 16px" : "28px",
//             width: "100%", maxWidth: 420, margin: isMobile ? "0" : "0 16px",
//             maxHeight: isMobile ? "90vh" : "auto",
//             overflowY: isMobile ? "auto" : "visible",
//             animation: isMobile ? "slideUp 0.3s ease-out" : "none",
//           }}>
//             <style>{`
//               @keyframes slideUp {
//                 from { transform: translateY(100%); }
//                 to { transform: translateY(0); }
//               }
//             `}</style>
//             <h2 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 600, marginBottom: 6 }}>
//               Order confirmed! 🎉
//             </h2>
//             <p style={{ fontSize: 14, color: "#5c5c5c", marginBottom: 20, lineHeight: 1.5 }}>
//               Choose your next delivery date. Redirecting in {countdown}s...
//             </p>

//             {deliveryOptions.map((o) => (
//               <label key={o.key} style={{
//                 display: "flex", justifyContent: "space-between", alignItems: "center",
//                 border: `1.5px solid ${selectedOptionKey === o.key ? "#7c9b2a" : "#e5e5e0"}`,
//                 borderRadius: 10, padding: "12px 16px", marginBottom: 10, cursor: "pointer",
//                 background: selectedOptionKey === o.key ? "#f8fce8" : "#fff",
//                 transition: "all 0.15s",
//               }}>
//                 <span style={{ fontSize: 14, fontWeight: 500 }}>{o.display}</span>
//                 <input
//                   type="radio"
//                   checked={selectedOptionKey === o.key}
//                   onChange={() => setSelectedOptionKey(o.key)}
//                   style={{ cursor: "pointer" }}
//                 />
//               </label>
//             ))}

//             <button
//               onClick={handleModalSubmit}
//               style={{
//                 width: "100%", background: "#C5D82D", border: "none",
//                 borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 600,
//                 cursor: "pointer", marginTop: 16, color: "#1b1b1b",
//               }}
//             >
//               Confirm &amp; Continue Shopping
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }










// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Loader2, ArrowLeft, ShieldCheck, Package, CalendarDays,
//   Lock, MapPin, Plus, AlertTriangle, Edit2, Trash2, X,
//   ChevronRight, CheckCircle2, Truck, CreditCard,
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { useCart } from "@/components/grasa/CartContext";
// import { BASE_URL } from "@/components/config/api";

// // ─── API URLs ──────────────────────────────────────────────────────────────────
// const FETCH_CART_URL      = `${BASE_URL}/grasa/shop/cart`;
// const CREATE_ORDER_URL    = `${BASE_URL}/g/payment/products/create-order`;
// const CONFIRM_PAYMENT_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
// const SAVE_ORDER_URL      = `${BASE_URL}/grasa/shop/orders`;
// const API_LOCATIONS       = `${BASE_URL}/api/locations`;

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const safeNumber = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);
// const getCookie  = (name: string): string | null => {
//   if (typeof document === "undefined") return null;
//   const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
//   return m ? decodeURIComponent(m[2]) : null;
// };
// function fmtDate(iso: string) {
//   if (!iso) return null;
//   const d = new Date(iso);
//   if (isNaN(d.getTime())) return iso;
//   return d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
// }
// function nextWeekdayFrom(date: Date, wd: number) {
//   const d = new Date(date.getTime());
//   let delta = (wd - d.getDay() + 7) % 7;
//   if (delta < 5) delta += 7;
//   d.setDate(d.getDate() + delta);
//   d.setHours(0, 0, 0, 0);
//   return d;
// }

// // ─── Types ───────────────────────────────────────────────────────────────────
// interface Address {
//   id: number; street: string; landmark?: string | null;
//   postal_code: string; city: string; state: string; country: string;
//   city_id: number; state_id: number; country_id: number; address_type?: string;
// }
// interface Option { id: number; name: string; }

// // ─── Step Badge ──────────────────────────────────────────────────────────────
// function StepBadge({ n, done }: { n: number; done?: boolean }) {
//   return (
//     <div style={{
//       width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
//       background: done ? "#C5D82D" : "#1b1b1b",
//       border: done ? "none" : "2px solid #C5D82D",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       fontSize: 12, fontWeight: 700, color: done ? "#1b1b1b" : "#C5D82D",
//       transition: "all 0.2s",
//     }}>
//       {done ? <CheckCircle2 size={15} strokeWidth={2.5} /> : n}
//     </div>
//   );
// }

// // ─── Main Page ───────────────────────────────────────────────────────────────
// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, refreshCart } = useCart();
//   const token = typeof window !== "undefined" ? getCookie("token") : null;

//   // Cart meta
//   const [cartId, setCartId]               = useState<number | null>(null);
//   const [apiTotal, setApiTotal]           = useState(0);
//   const [basePrice, setBasePrice]         = useState(0);
//   const [mhcPoints, setMhcPoints]         = useState(0);

//   // UI state
//   const [loading, setLoading]             = useState(true);
//   const [loadingMeta, setLoadingMeta]     = useState(true);
//   const [mounted, setMounted]             = useState(false);
//   const [processing, setProcessing]       = useState(false);
//   const [orderSuccess, setOrderSuccess]   = useState(false);
//   const [isMobile, setIsMobile]           = useState(false);

//   // Checkout state
//   const [selectedAddrId, setSelectedAddrId] = useState<number | null>(null);
//   const [selectedDate, setSelectedDate]     = useState("");

//   // Address list
//   const [addresses, setAddresses]   = useState<Address[]>([]);
//   const [addrLoading, setAddrLoading] = useState(true);
//   const [deleting, setDeleting]     = useState<number | null>(null);
//   const [editing, setEditing]       = useState<number | null>(null);
//   const [showForm, setShowForm]     = useState(false);
//   const [adding, setAdding]         = useState(false);
//   const [pincodeVerifying, setPincodeVerifying] = useState(false);
//   const [countries, setCountries]   = useState<Option[]>([]);
//   const [states, setStates]         = useState<Option[]>([]);
//   const [cities, setCities]         = useState<Option[]>([]);
//   const [form, setForm]             = useState<any>({
//     street: "", landmark: "", postal_code: "",
//     country_id: 0, state_id: 0, city_id: 0, address_type: "home",
//   });

//   // Razorpay
//   const [rzpLoaded, setRzpLoaded] = useState(false);

//   // Post-order modal
//   const [modalOpen, setModalOpen]             = useState(false);
//   const [countdown, setCountdown]             = useState(10);
//   const [deliveryOptions, setDeliveryOptions] = useState<{key:"wednesday"|"saturday";display:string;date:Date}[]>([]);
//   const [selectedOptKey, setSelectedOptKey]   = useState<"wednesday"|"saturday"|"">("");

//   // ── Quick dates (Wed / Sat) ──────────────────────────────────────────────
//   const quickDates = (() => {
//     const today = new Date();
//     return ([3, 6] as const).map((wd) => {
//       const d = nextWeekdayFrom(today, wd);
//       return {
//         label: wd === 3 ? "Wed" : "Sat",
//         fullLabel: wd === 3 ? "Wednesday" : "Saturday",
//         value: d.toISOString().split("T")[0],
//         display: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
//       };
//     });
//   })();

//   const minDate = (() => {
//     const d = new Date(); d.setDate(d.getDate() + 5);
//     return d.toISOString().split("T")[0];
//   })();

//   // ── Mobile detection ─────────────────────────────────────────────────────
//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 768);
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   // ── Razorpay script ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if ((window as any).Razorpay) { setRzpLoaded(true); return; }
//     const s = document.createElement("script");
//     s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.async = true; s.onload = () => setRzpLoaded(true);
//     document.body.appendChild(s);
//   }, []);

//   // ── Fetch cart meta ───────────────────────────────────────────────────────
//   const fetchCartMeta = useCallback(async () => {
//     if (!token) return;
//     try {
//       const res  = await fetch(FETCH_CART_URL, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) return;
//       const data = await res.json();
//       setMhcPoints(Number(data?.applied_mhc_points ?? 0));
//       setCartId(data?.cart?.id ?? null);
//       setApiTotal(Number(data?.cart?.total_price ?? 0));
//       setBasePrice(Number(data?.base_price ?? 0));
//     } catch {}
//   }, [token]);

//   useEffect(() => {
//     setLoading(true);
//     fetchCartMeta().finally(() => setLoading(false));
//   }, [fetchCartMeta]);

//   useEffect(() => { setMounted(true); }, []);

//   // ── Auth + empty cart guard ───────────────────────────────────────────────
//   useEffect(() => {
//     if (orderSuccess) return;
//     if (!token) { toast.error("Login required"); router.push("/login"); return; }
//     if (mounted && !loading && !loadingMeta && (!cart || cart.length === 0)) {
//       toast.error("Cart is empty"); router.push("/cart");
//     }
//   }, [token, cart, mounted, loading, loadingMeta, orderSuccess, router]);

//   // ── Fetch addresses ───────────────────────────────────────────────────────
//   const fetchAddresses = useCallback(async (initial = false) => {
//     if (initial) setAddrLoading(true);
//     try {
//       const res  = await fetch(`${API_LOCATIONS}/addresses`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       const items: Address[] = data.items || [];
//       setAddresses(items);
//       if (!selectedAddrId && items.length > 0) setSelectedAddrId(items[0].id);
//       else {
//         const exists = items.some((a) => a.id === selectedAddrId);
//         if (!exists && items.length > 0) setSelectedAddrId(items[0].id);
//       }
//     } catch { toast.error("Unable to load addresses"); }
//     finally { if (initial) { setAddrLoading(false); setLoadingMeta(false); } }
//   }, [token, selectedAddrId, setSelectedAddrId]);

//   useEffect(() => {
//     (async () => {
//       const res = await fetch(`${API_LOCATIONS}/countrylist`);
//       setCountries(res.ok ? await res.json() : []);
//     })();
//     fetchAddresses(true);
//   }, []);

//   useEffect(() => {
//     if (form.country_id > 0) {
//       fetch(`${API_LOCATIONS}/statelist?country_id=${form.country_id}`)
//         .then(r => r.ok ? r.json() : []).then(setStates);
//     } else setStates([]);
//     setCities([]);
//   }, [form.country_id]);

//   useEffect(() => {
//     if (form.state_id > 0) {
//       fetch(`${API_LOCATIONS}/citylist?state_id=${form.state_id}`)
//         .then(r => r.ok ? r.json() : []).then(setCities);
//     } else setCities([]);
//   }, [form.state_id]);

//   const resetForm = () => {
//     setForm({ street: "", landmark: "", postal_code: "", country_id: 0, state_id: 0, city_id: 0, address_type: "home" });
//     setStates([]); setCities([]); setEditing(null); setShowForm(false);
//   };

//   const handlePostalChange = async (v: string) => {
//     const clean = v.replace(/\D/g, "").slice(0, 6);
//     setForm((p: any) => ({ ...p, postal_code: clean }));
//     if (clean.length !== 6) return;
//     try {
//       setPincodeVerifying(true);
//       const res  = await fetch(`${API_LOCATIONS}/addresses/autofill`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ pincode: clean }),
//       });
//       const data = await res.json();
//       if (!res.ok || data.valid === false) { toast.error("Invalid pincode"); return; }
//       const { country, state, city } = data;
//       if (country?.id) {
//         const r = await fetch(`${API_LOCATIONS}/statelist?country_id=${country.id}`);
//         setStates(r.ok ? await r.json() : []);
//       }
//       if (state?.id) {
//         const r = await fetch(`${API_LOCATIONS}/citylist?state_id=${state.id}`);
//         setCities(r.ok ? await r.json() : []);
//       }
//       setForm((p: any) => ({ ...p, country_id: country?.id ?? 0, state_id: state?.id ?? 0, city_id: city?.id ?? 0 }));
//       toast.success("Address autofilled ✓");
//     } catch { toast.error("Autofill failed"); }
//     finally { setPincodeVerifying(false); }
//   };

//   const handleSave = async () => {
//     if (!form.street || !form.postal_code || !form.country_id || !form.state_id || !form.city_id) {
//       toast.error("Fill all required fields"); return;
//     }
//     try {
//       setAdding(true);
//       const url = editing ? `${API_LOCATIONS}/addresses/${editing}` : `${API_LOCATIONS}/addresses`;
//       const res = await fetch(url, {
//         method: editing ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           street: form.street, landmark: form.landmark || "",
//           postal_code: form.postal_code, city_id: form.city_id,
//           state_id: form.state_id, country_id: form.country_id,
//           address_type: form.address_type,
//         }),
//       });
//       if (!res.ok) throw new Error();
//       toast.success(editing ? "Address updated ✓" : "Address added ✓");
//       resetForm(); fetchAddresses();
//     } catch { toast.error("Failed to save address"); }
//     finally { setAdding(false); }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Delete this address?")) return;
//     try {
//       setDeleting(id);
//       const res = await fetch(`${API_LOCATIONS}/addresses/${id}`, {
//         method: "DELETE",
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (!res.ok) throw new Error();
//       toast.success("Address deleted");
//       const updated = addresses.filter(x => x.id !== id);
//       setAddresses(updated);
//       if (selectedAddrId === id) setSelectedAddrId(updated[0]?.id ?? null);
//     } catch { toast.error("Delete failed"); }
//     finally { setDeleting(null); }
//   };

//   // ── Payment ───────────────────────────────────────────────────────────────
//   const handlePayNow = useCallback(async () => {
//     if (!selectedAddrId) { toast.error("Select a delivery address"); return; }
//     if (!selectedDate)   { toast.error("Select a delivery date");    return; }
//     setProcessing(true);

//     let ph: Window | null = null;
//     try { ph = window.open("", "rzp_ph", "width=100,height=100"); } catch {}

//     try {
//       if (!rzpLoaded) {
//         const ok = await new Promise<boolean>(res => {
//           const s = document.createElement("script");
//           s.src = "https://checkout.razorpay.com/v1/checkout.js";
//           s.onload = () => res(true); s.onerror = () => res(false);
//           document.body.appendChild(s);
//         });
//         if (!ok) { toast.error("Payment SDK failed"); setProcessing(false); ph?.close(); return; }
//       }

//       const items = (cart || []).map((i: any) => ({
//         product_id: i.product_id ?? i.id,
//         quantity:   i.quantity ?? 1,
//       }));

//       const createRes = await fetch(CREATE_ORDER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           items, pay_amount: safeNumber(apiTotal),
//           coupon_code: "", mhc_points: safeNumber(mhcPoints),
//           notes: { delivery_date: selectedDate },
//         }),
//       });

//       const createData = await createRes.json().catch(() => null);
//       if (!createRes.ok || !createData?.order_id) {
//         toast.error("Order creation failed"); setProcessing(false); ph?.close(); return;
//       }

//       const rzp = new (window as any).Razorpay({
//         key: createData.key_id, amount: createData.amount,
//         currency: createData.currency ?? "INR",
//         name: "GRASA", description: "Order Payment",
//         order_id: createData.order_id,
//         handler: async (resp: any) => {
//           setProcessing(true);
//           try {
//             const confirmRes = await fetch(CONFIRM_PAYMENT_URL, {
//               method: "POST",
//               headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//               body: JSON.stringify({
//                 razorpay_order_id:   resp.razorpay_order_id,
//                 razorpay_payment_id: resp.razorpay_payment_id,
//                 razorpay_signature:  resp.razorpay_signature,
//                 paid_amount: createData.amount,
//               }),
//             });
//             const confirmData = await confirmRes.json().catch(() => null);
//             if (!confirmRes.ok || !confirmData?.transaction_id) {
//               toast.error("Transaction save failed"); setProcessing(false); return;
//             }
//             const saveRes = await fetch(SAVE_ORDER_URL, {
//               method: "POST",
//               headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//               body: JSON.stringify({
//                 cart_id: cartId ?? 0, paid_amount: createData.amount,
//                 shipping_address_id: selectedAddrId ?? 0,
//                 coupon_code: "", currency: createData.currency ?? "INR",
//                 notes: `delivery_date:${selectedDate}`,
//                 source: "GRASAFOODS",
//                 payment_transaction_id: confirmData.transaction_id,
//                 items: (cart || []).map((c: any) => ({
//                   product_id:  c.product_id ?? c.id,
//                   quantity:    c.quantity ?? 1,
//                   unit_price:  safeNumber(c.effective_price ?? c.price).toString(),
//                   paid_amount: safeNumber(c.effective_price ?? c.price).toString(),
//                 })),
//               }),
//             });
//             if (!saveRes.ok) { toast.error("Order save failed"); setProcessing(false); return; }
//             setOrderSuccess(true); clearCart();
//             try { await refreshCart(); } catch {}
//           } catch { toast.error("Failed to finalise"); }
//           finally { setProcessing(false); }
//         },
//         modal: {
//           escape: true,
//           ondismiss: () => { toast.error("Payment cancelled"); setProcessing(false); },
//         },
//       });
//       rzp.on?.("payment.failed", () => { toast.error("Payment failed"); setProcessing(false); ph?.close(); });
//       rzp.open();
//       setTimeout(() => { try { if (ph && !ph.closed) ph.close(); } catch {} }, 500);
//     } catch { toast.error("Payment failed"); setProcessing(false); ph?.close(); }
//   }, [cart, apiTotal, mhcPoints, token, selectedAddrId, selectedDate, cartId,
//       setProcessing, clearCart, refreshCart, setOrderSuccess, rzpLoaded]);

//   // ── Post-order modal ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!orderSuccess) return;
//     const today = new Date();
//     setDeliveryOptions([
//       { key: "wednesday", date: nextWeekdayFrom(today, 3), display: nextWeekdayFrom(today, 3).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }) },
//       { key: "saturday",  date: nextWeekdayFrom(today, 6), display: nextWeekdayFrom(today, 6).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }) },
//     ]);
//     setSelectedOptKey(""); setModalOpen(true); setCountdown(10);
//   }, [orderSuccess]);

//   useEffect(() => {
//     if (!modalOpen) return;
//     const i = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(i); return 0; } return c - 1; }), 1000);
//     return () => clearInterval(i);
//   }, [modalOpen]);

//   useEffect(() => {
//     if (modalOpen && countdown === 0) { setModalOpen(false); router.push("/orders"); }
//   }, [countdown, modalOpen, router]);

//   const handleModalSubmit = () => {
//     if (!selectedOptKey) { toast.error("Select a delivery date"); return; }
//     const opt = deliveryOptions.find(o => o.key === selectedOptKey);
//     if (!opt) return;
//     localStorage.setItem("selectedDelivery", JSON.stringify({ day: opt.key, date: opt.date.toISOString(), display: opt.display }));
//     setModalOpen(false); router.push("/products");
//   };

//   // ── Loading screen ────────────────────────────────────────────────────────
//   if (loading) return (
//     <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"#f5f5f0" }}>
//       <Loader2 size={36} style={{ color:"#C5D82D", animation:"spin 1s linear infinite" }} />
//       <p style={{ marginTop:12, color:"#888", fontSize:14 }}>Loading checkout…</p>
//     </div>
//   );
//   if (!token) return (
//     <div style={{ textAlign:"center", padding:"80px 20px", minHeight:"100vh", background:"#f5f5f0" }}>
//       <p style={{ fontSize:16, marginBottom:20 }}>Please log in to continue</p>
//       <button onClick={() => router.push("/login")} style={btnPrimary}>Go to Login</button>
//     </div>
//   );

//   const isReady        = !!selectedAddrId && !!selectedDate && !processing;
//   const selectedAddr   = addresses.find(a => a.id === selectedAddrId);
//   const addrComplete   = !!selectedAddrId;
//   const dateComplete   = !!selectedDate;

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div style={{ minHeight:"100vh", background:"#f5f5f0", fontFamily:"'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         * { box-sizing: border-box; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
//         @keyframes fadeIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: #f0f0e8; }
//         ::-webkit-scrollbar-thumb { background: #C5D82D; border-radius: 4px; }
//       `}</style>

//       <Toaster
//         position={isMobile ? "top-center" : "bottom-right"}
//         toastOptions={{ duration: 2500, style: { background:"#1b1b1b", color:"#fff", borderRadius:10, fontSize:13 } }}
//       />

//       {/* ── Header Bar ─────────────────────────────────────────────────────── */}
//       <div style={{
//         background:"#1b1b1b", borderBottom:"2px solid #C5D82D",
//         padding: isMobile ? "12px 16px" : "0 40px",
//         height: isMobile ? "auto" : 56,
//         display:"flex", alignItems:"center", justifyContent:"space-between",
//       }}>
//         <div style={{ display:"flex", alignItems:"center", gap:12 }}>
//           <button
//             onClick={() => router.push("/cart")}
//             style={{ background:"none", border:"none", cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", gap:6, padding:0 }}
//           >
//             <ArrowLeft size={18} />
//             {!isMobile && <span style={{ fontSize:13, color:"#aaa" }}>Back to cart</span>}
//           </button>
//           {!isMobile && <div style={{ width:1, height:20, background:"#333" }} />}
//           <span style={{ color:"#fff", fontWeight:700, fontSize:16, letterSpacing:-0.3 }}>
//             GRA<span style={{ color:"#C5D82D" }}>SA</span>
//           </span>
//         </div>

//         {/* Breadcrumb */}
//         {!isMobile && (
//           <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}>
//             {["Cart", "Address", "Payment"].map((step, i) => (
//               <React.Fragment key={step}>
//                 {i > 0 && <ChevronRight size={14} style={{ color:"#555" }} />}
//                 <span style={{ color: i === 1 || i === 2 ? "#C5D82D" : "#555", fontWeight: i >= 1 ? 600 : 400 }}>
//                   {step}
//                 </span>
//               </React.Fragment>
//             ))}
//           </div>
//         )}

//         <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#555" }}>
//           <Lock size={12} style={{ color:"#C5D82D" }} />
//           <span>Secure Checkout</span>
//         </div>
//       </div>

//       {/* ── Progress Steps (mobile) ────────────────────────────────────────── */}
//       {isMobile && (
//         <div style={{ background:"#fff", borderBottom:"0.5px solid #eee", padding:"12px 16px" }}>
//           <div style={{ display:"flex", alignItems:"center", gap:0 }}>
//             {[
//               { label: "Address", done: addrComplete },
//               { label: "Date", done: dateComplete },
//               { label: "Payment", done: false },
//             ].map((s, i, arr) => (
//               <React.Fragment key={s.label}>
//                 <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
//                   <div style={{
//                     width:24, height:24, borderRadius:"50%",
//                     background: s.done ? "#C5D82D" : i === 0 ? "#1b1b1b" : "#e5e5e0",
//                     display:"flex", alignItems:"center", justifyContent:"center",
//                     fontSize:11, fontWeight:700,
//                     color: s.done ? "#1b1b1b" : i === 0 ? "#C5D82D" : "#888",
//                   }}>
//                     {s.done ? "✓" : i + 1}
//                   </div>
//                   <span style={{ fontSize:10, color: s.done ? "#3d7a1a" : "#888", fontWeight:500 }}>{s.label}</span>
//                 </div>
//                 {i < arr.length - 1 && (
//                   <div style={{ flex:1, height:2, background: s.done ? "#C5D82D" : "#e5e5e0", margin:"0 6px", marginBottom:14 }} />
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── Main Layout ────────────────────────────────────────────────────── */}
//       <div style={{
//         maxWidth:1100, margin:"0 auto",
//         padding: isMobile ? "12px 12px 32px" : "24px 16px 60px",
//         display:"grid",
//         gridTemplateColumns: isMobile ? "1fr" : "1fr 360px",
//         gap: isMobile ? "10px" : "20px",
//         alignItems:"start",
//       }}>

//         {/* ══ LEFT COLUMN ════════════════════════════════════════════════════ */}
//         <div style={{ display:"flex", flexDirection:"column", gap: isMobile ? "10px" : "14px" }}>

//           {/* ─ Step 1: Delivery Address ─────────────────────────────────── */}
//           <Card>
//             <SectionHeader
//               step={1} done={addrComplete}
//               title="Delivery Address"
//               icon={<MapPin size={16} />}
//               action={
//                 <button onClick={() => { resetForm(); setShowForm(true); }} style={outlineBtn}>
//                   <Plus size={14} /> Add New
//                 </button>
//               }
//             />

//             {addrLoading ? (
//               <div style={{ display:"flex", justifyContent:"center", padding:32 }}>
//                 <Loader2 size={24} style={{ color:"#C5D82D", animation:"spin 1s linear infinite" }} />
//               </div>
//             ) : addresses.length === 0 ? (
//               <EmptyState icon={<AlertTriangle size={28} style={{ color:"#d9820a" }} />} message="No saved addresses. Add one to continue." />
//             ) : (
//               <div style={{
//                 display:"grid",
//                 gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
//                 gap:"10px", marginTop:4,
//               }}>
//                 {addresses.map(a => {
//                   const sel = selectedAddrId === a.id;
//                   return (
//                     <div
//                       key={a.id}
//                       onClick={() => setSelectedAddrId(a.id)}
//                       style={{
//                         border: `2px solid ${sel ? "#C5D82D" : "#e5e5e0"}`,
//                         borderRadius:10, padding:"12px 14px", cursor:"pointer",
//                         background: sel ? "#fdfde8" : "#fff",
//                         position:"relative", transition:"all 0.15s",
//                         animation:"fadeIn 0.2s ease",
//                       }}
//                     >
//                       {sel && (
//                         <div style={{
//                           position:"absolute", top:-1, right:-1,
//                           background:"#C5D82D", borderRadius:"0 8px 0 8px",
//                           padding:"3px 8px", fontSize:10, fontWeight:700, color:"#1b1b1b",
//                         }}>✓ SELECTED</div>
//                       )}
//                       <span style={{
//                         display:"inline-block", fontSize:10, padding:"2px 8px",
//                         borderRadius:20, background: sel ? "#C5D82D22" : "#f0f0e8",
//                         color:"#5c5c3d", fontWeight:600, marginBottom:6,
//                         textTransform:"uppercase", letterSpacing:0.5,
//                       }}>
//                         {a.address_type || "Home"}
//                       </span>
//                       <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{a.street}</div>
//                       {a.landmark && <div style={{ fontSize:12, color:"#888", marginBottom:1 }}>{a.landmark}</div>}
//                       <div style={{ fontSize:12, color:"#888" }}>{a.city}, {a.state}</div>
//                       <div style={{ fontSize:12, color:"#888", marginBottom:8 }}>{a.country} — {a.postal_code}</div>

//                       <div onClick={e => e.stopPropagation()} style={{ display:"flex", gap:6, marginTop:8 }}>
//                         <button
//                           onClick={() => {
//                             setEditing(a.id);
//                             setForm({ street:a.street??"", landmark:a.landmark??"", postal_code:a.postal_code??"",
//                               country_id:a.country_id??0, state_id:a.state_id??0, city_id:a.city_id??0,
//                               address_type:a.address_type??"home" });
//                             setShowForm(true);
//                           }}
//                           style={smallOutlineBtn}
//                         >
//                           <Edit2 size={12} /> Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(a.id)}
//                           disabled={deleting === a.id}
//                           style={{ ...smallOutlineBtn, background:"#fff0f0", color:"#c0392b", border:"none", opacity: deleting===a.id ? 0.5 : 1 }}
//                         >
//                           <Trash2 size={12} /> {deleting===a.id ? "…" : "Delete"}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </Card>

//           {/* ─ Items card (mobile only) ──────────────────────────────────── */}
//           {isMobile && (
//             <Card>
//               <SectionHeader step={2} done={false} title="Order Items" icon={<Package size={16} />} />
//               <ItemList cart={cart} />
//             </Card>
//           )}
//         </div>

//         {/* ══ RIGHT COLUMN: Date → Summary → Pay ═══════════════════════════ */}
//         <div style={{ display:"flex", flexDirection:"column", gap: isMobile ? "10px" : "14px",
//           position: isMobile ? "relative" : "sticky", top:20 }}>

//           {/* ─ Delivery Date — TOP of right panel, high attention ─────────── */}
//           <Card accent>
//             <SectionHeader
//               step={isMobile ? 3 : 2}
//               done={dateComplete}
//               title="Choose Delivery Date"
//               icon={<Truck size={16} />}
//             />
//             <p style={{ fontSize:12, color:"#888", marginBottom:12, lineHeight:1.6 }}>
//               We bake fresh. Delivery is min. 5 days away — pick your bake day:
//             </p>

//             {/* Quick chips */}
//             <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
//               {quickDates.map(qd => (
//                 <div
//                   key={qd.value}
//                   onClick={() => setSelectedDate(qd.value)}
//                   style={{
//                     border: `2px solid ${selectedDate === qd.value ? "#C5D82D" : "#e5e5e0"}`,
//                     borderRadius:10, padding:"10px 12px", cursor:"pointer",
//                     background: selectedDate === qd.value ? "#fdfde8" : "#fff",
//                     transition:"all 0.15s", textAlign:"center", position:"relative",
//                   }}
//                 >
//                   {selectedDate === qd.value && (
//                     <div style={{
//                       position:"absolute", top:-1, left:"50%", transform:"translateX(-50%)",
//                       background:"#C5D82D", borderRadius:"0 0 6px 6px",
//                       padding:"1px 8px", fontSize:9, fontWeight:700, color:"#1b1b1b",
//                     }}>SELECTED</div>
//                   )}
//                   <div style={{ fontSize:10, color:"#888", marginBottom:2, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5 }}>
//                     {qd.fullLabel}
//                   </div>
//                   <div style={{ fontSize:13, fontWeight:700, color:"#1b1b1b" }}>{qd.display}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Custom date */}
//             <div>
//               <label style={{ fontSize:10, color:"#888", fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, display:"block", marginBottom:6 }}>
//                 Or pick a custom date
//               </label>
//               <input
//                 type="date" min={minDate} value={selectedDate}
//                 onChange={e => setSelectedDate(e.target.value)}
//                 style={{
//                   width:"100%", border:`1.5px solid ${!selectedDate ? "#f5a623" : "#e5e5e0"}`,
//                   borderRadius:8, padding:"9px 12px", fontSize:13,
//                   background:"#fff", color:"#1b1b1b", outline:"none",
//                 }}
//               />
//               {!selectedDate && (
//                 <p style={{ fontSize:11, color:"#f5a623", marginTop:4, fontWeight:500 }}>
//                   ⚠ Select a date to enable payment
//                 </p>
//               )}
//             </div>
//           </Card>

//           {/* ─ Price Details + Pay Button ─────────────────────────────────── */}
//           <Card>
//             <SectionHeader step={isMobile ? 4 : 3} done={false} title="Price Details" icon={<CreditCard size={16} />} />

//             {/* Items list (desktop) */}
//             {!isMobile && (
//               <div style={{ marginBottom:12 }}>
//                 <div style={{ fontSize:10, color:"#888", fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>
//                   Items ({(cart||[]).length})
//                 </div>
//                 <ItemList cart={cart} compact />
//               </div>
//             )}

//             {/* Price breakdown */}
//             <div style={{ borderTop:"0.5px solid #f0f0e8", paddingTop:12 }}>
//               <PriceRow label="Price" value={`₹${basePrice.toFixed(2)}`} />
//               <PriceRow label="Delivery" value="Free" valueColor="#3d7a1a" />
//               {mhcPoints > 0 && (
//                 <PriceRow label="MHC Points" value={`-₹${mhcPoints.toFixed(2)}`} valueColor="#3d7a1a" />
//               )}
//               <div style={{ height:1, background:"#e5e5e0", margin:"10px 0" }} />
//               <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:700 }}>
//                 <span>Total Payable</span>
//                 <span style={{ color:"#C5D82D" }}>₹{apiTotal.toFixed(2)}</span>
//               </div>
//               {mhcPoints > 0 && (
//                 <div style={{
//                   background:"#f0fce8", color:"#2d6a0e", borderRadius:8,
//                   fontSize:11, padding:"6px 10px", marginTop:8, fontWeight:600,
//                 }}>
//                   🪙 You save ₹{mhcPoints.toFixed(2)} with MHC points!
//                 </div>
//               )}
//             </div>

//             {/* Delivery date summary chip */}
//             {selectedDate && (
//               <div style={{
//                 background:"#f0fce8", border:"1px solid #C5D82D44",
//                 borderRadius:8, padding:"8px 12px", marginTop:12,
//                 display:"flex", alignItems:"center", gap:8,
//               }}>
//                 <CalendarDays size={14} style={{ color:"#3d7a1a", flexShrink:0 }} />
//                 <div>
//                   <div style={{ fontSize:10, color:"#5c8a1e", fontWeight:600, textTransform:"uppercase", letterSpacing:0.5 }}>Delivery on</div>
//                   <div style={{ fontSize:13, fontWeight:700, color:"#2d4a10" }}>{fmtDate(selectedDate)}</div>
//                 </div>
//               </div>
//             )}

//             {/* Address summary chip */}
//             {selectedAddr && (
//               <div style={{
//                 background:"#f9f8f4", border:"0.5px solid #e5e5e0",
//                 borderRadius:8, padding:"8px 12px", marginTop:8,
//                 display:"flex", gap:8, alignItems:"flex-start",
//               }}>
//                 <MapPin size={14} style={{ color:"#888", flexShrink:0, marginTop:2 }} />
//                 <div style={{ fontSize:12, color:"#5c5c5c", lineHeight:1.5 }}>
//                   <span style={{ fontWeight:600, color:"#1b1b1b" }}>Delivering to: </span>
//                   {selectedAddr.street}, {selectedAddr.city}, {selectedAddr.state}
//                 </div>
//               </div>
//             )}

//             {/* Pay button */}
//             <button
//               onClick={handlePayNow}
//               disabled={!isReady}
//               style={{
//                 width:"100%", marginTop:14,
//                 background: isReady ? "#C5D82D" : "#e5e5e0",
//                 border:"none", borderRadius:10,
//                 padding:"14px", fontSize:15, fontWeight:700,
//                 cursor: isReady ? "pointer" : "not-allowed",
//                 color: isReady ? "#1b1b1b" : "#999",
//                 transition:"all 0.15s", letterSpacing:-0.3,
//               }}
//             >
//               {processing
//                 ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
//                     <Loader2 size={16} style={{ animation:"spin 1s linear infinite" }} /> Processing…
//                   </span>
//                 : `Pay ₹${apiTotal.toFixed(2)}`
//               }
//             </button>

//             {!selectedAddrId && (
//               <p style={{ fontSize:11, color:"#e74c3c", textAlign:"center", marginTop:6 }}>
//                 ← Select a delivery address
//               </p>
//             )}
//             {selectedAddrId && !selectedDate && (
//               <p style={{ fontSize:11, color:"#f5a623", textAlign:"center", marginTop:6 }}>
//                 ↑ Select a delivery date above
//               </p>
//             )}

//             <div style={{ textAlign:"center", fontSize:11, color:"#bbb", marginTop:10, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
//               <Lock size={11} /> Secured by Razorpay · 256-bit SSL
//             </div>
//           </Card>
//         </div>
//       </div>

//       {/* ── Add / Edit Address Modal ─────────────────────────────────────────── */}
//       {showForm && (
//         <div
//           style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex",
//             alignItems: isMobile ? "flex-end" : "center", justifyContent:"center", zIndex:60, overflow:"auto" }}
//           onClick={resetForm}
//         >
//           <div
//             style={{
//               background:"#fff", borderRadius: isMobile ? "20px 20px 0 0" : "16px",
//               padding: isMobile ? "20px 16px" : "28px",
//               width:"100%", maxWidth:500,
//               maxHeight: isMobile ? "90vh" : "auto",
//               overflowY: isMobile ? "auto" : "visible",
//               animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease",
//             }}
//             onClick={e => e.stopPropagation()}
//           >
//             <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
//               <h3 style={{ fontSize:17, fontWeight:700 }}>{editing ? "Edit Address" : "Add New Address"}</h3>
//               <button onClick={resetForm} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
//                 <X size={22} />
//               </button>
//             </div>

//             <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:10 }}>
//               <input style={{ ...inputStyle, gridColumn:"1/-1" }} placeholder="Full address / street *"
//                 value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
//               <input style={{ ...inputStyle, gridColumn:"1/-1" }} placeholder="Landmark (optional)"
//                 value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} />
//               <div style={{ gridColumn:"1/-1" }}>
//                 <input style={inputStyle} placeholder="Pincode *"
//                   value={form.postal_code} onChange={e => handlePostalChange(e.target.value)} />
//                 {pincodeVerifying && <p style={{ fontSize:11, color:"#7c9b2a", marginTop:4 }}>Autofilling…</p>}
//               </div>
//               <select style={inputStyle} value={form.country_id} onChange={e => setForm({ ...form, country_id: Number(e.target.value) })}>
//                 <option value={0}>Country *</option>
//                 {countries.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>
//               <select style={inputStyle} value={form.state_id} onChange={e => setForm({ ...form, state_id: Number(e.target.value) })}>
//                 <option value={0}>State *</option>
//                 {states.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>
//               <select style={inputStyle} value={form.city_id} onChange={e => setForm({ ...form, city_id: Number(e.target.value) })}>
//                 <option value={0}>City *</option>
//                 {cities.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>
//               <select style={inputStyle} value={form.address_type} onChange={e => setForm({ ...form, address_type: e.target.value })}>
//                 <option value="home">Home</option>
//                 <option value="work">Work</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>

//             <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:20, flexDirection: isMobile ? "column-reverse" : "row" }}>
//               <button onClick={resetForm} style={{ ...outlineBtn, flex: isMobile ? 1 : "auto", padding:"10px 20px", justifyContent:"center" }}>Cancel</button>
//               <button onClick={handleSave} disabled={adding} style={{ ...btnPrimary, flex: isMobile ? 1 : "auto", opacity: adding ? 0.7 : 1 }}>
//                 {adding ? "Saving…" : editing ? "Update Address" : "Save Address"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Post-order modal ─────────────────────────────────────────────────── */}
//       {modalOpen && (
//         <div style={{
//           position:"fixed", inset:0, background:"rgba(0,0,0,0.55)",
//           display:"flex", alignItems: isMobile ? "flex-end" : "center", justifyContent:"center",
//           zIndex:70, overflow:"auto",
//         }}>
//           <div style={{
//             background:"#fff", borderRadius: isMobile ? "20px 20px 0 0" : "16px",
//             padding: isMobile ? "24px 16px" : "32px",
//             width:"100%", maxWidth:400,
//             animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease",
//             maxHeight: isMobile ? "90vh" : "auto", overflowY: isMobile ? "auto" : "visible",
//           }}>
//             <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>
//             <h2 style={{ fontSize:20, fontWeight:700, marginBottom:6 }}>Order Confirmed!</h2>
//             <p style={{ fontSize:13, color:"#888", marginBottom:20, lineHeight:1.6 }}>
//               Choose your next delivery date. Auto-redirecting in <strong>{countdown}s</strong>…
//             </p>
//             {deliveryOptions.map(o => (
//               <label key={o.key} style={{
//                 display:"flex", justifyContent:"space-between", alignItems:"center",
//                 border:`2px solid ${selectedOptKey===o.key ? "#C5D82D" : "#e5e5e0"}`,
//                 borderRadius:10, padding:"12px 16px", marginBottom:10, cursor:"pointer",
//                 background: selectedOptKey===o.key ? "#fdfde8" : "#fff",
//                 transition:"all 0.15s",
//               }}>
//                 <span style={{ fontSize:13, fontWeight:600 }}>{o.display}</span>
//                 <input type="radio" checked={selectedOptKey===o.key} onChange={() => setSelectedOptKey(o.key)} style={{ cursor:"pointer" }} />
//               </label>
//             ))}
//             <button onClick={handleModalSubmit} style={{ ...btnPrimary, width:"100%", marginTop:8 }}>
//               Confirm &amp; Continue Shopping
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Sub-components ──────────────────────────────────────────────────────────

// function Card({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
//   return (
//     <div style={{
//       background:"#fff", borderRadius:12,
//       border: accent ? "1.5px solid #C5D82D44" : "0.5px solid #e5e5e0",
//       padding:"18px 16px",
//       boxShadow: accent ? "0 0 0 3px #C5D82D11" : "0 1px 3px rgba(0,0,0,0.04)",
//       animation:"fadeIn 0.25s ease",
//     }}>
//       {children}
//     </div>
//   );
// }

// function SectionHeader({ step, done, title, icon, action }: {
//   step: number; done?: boolean; title: string; icon?: React.ReactNode; action?: React.ReactNode;
// }) {
//   return (
//     <div style={{
//       display:"flex", alignItems:"center", gap:10,
//       marginBottom:14, paddingBottom:12, borderBottom:"0.5px solid #f0f0e8",
//       flexWrap:"wrap",
//     }}>
//       <StepBadge n={step} done={done} />
//       <div style={{ display:"flex", alignItems:"center", gap:6, flex:1 }}>
//         {icon && <span style={{ color: done ? "#3d7a1a" : "#888" }}>{icon}</span>}
//         <span style={{ fontSize:14, fontWeight:700, color:"#1b1b1b", letterSpacing:-0.3 }}>{title}</span>
//       </div>
//       {action}
//     </div>
//   );
// }

// function ItemList({ cart, compact }: { cart: any[]; compact?: boolean }) {
//   return (
//     <div style={{ maxHeight: compact ? 180 : 200, overflowY:"auto" }}>
//       {(cart || []).map((item: any, i: number) => {
//         const name  = item.name ?? item.title ?? item.product_name ?? `Product #${item.id}`;
//         const qty   = item.quantity ?? 1;
//         const price = Number(item.effective_price ?? item.price ?? 0);
//         return (
//           <div key={i} style={{
//             display:"flex", gap:10, alignItems:"flex-start",
//             padding: compact ? "6px 0" : "8px 0",
//             borderBottom:"0.5px solid #f5f5f0",
//           }}>
//             <div style={{
//               width: compact ? 36 : 42, height: compact ? 36 : 42,
//               borderRadius:8, background:"#f5f5f0", flexShrink:0,
//               overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
//             }}>
//               {item.image_url
//                 ? <img src={item.image_url} alt={name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
//                 : <span style={{ fontSize:16 }}>🥗</span>}
//             </div>
//             <div style={{ flex:1, minWidth:0 }}>
//               <div style={{ fontSize: compact ? 12 : 13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name}</div>
//               <div style={{ fontSize:11, color:"#888" }}>Qty: {qty} × ₹{price.toFixed(2)}</div>
//             </div>
//             <div style={{ fontSize: compact ? 12 : 13, fontWeight:700, flexShrink:0 }}>₹{(qty * price).toFixed(2)}</div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function PriceRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
//   return (
//     <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#5c5c5c", marginBottom:6 }}>
//       <span>{label}</span>
//       <span style={{ fontWeight:500, color: valueColor ?? "#1b1b1b" }}>{value}</span>
//     </div>
//   );
// }

// function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
//   return (
//     <div style={{ textAlign:"center", padding:"28px 16px", background:"#f9f8f4", borderRadius:10 }}>
//       <div style={{ marginBottom:8 }}>{icon}</div>
//       <p style={{ fontSize:13, color:"#5c5c5c" }}>{message}</p>
//     </div>
//   );
// }

// // ─── Shared styles ────────────────────────────────────────────────────────────
// const btnPrimary: React.CSSProperties = {
//   background:"#C5D82D", border:"none", borderRadius:8,
//   padding:"11px 20px", fontSize:14, fontWeight:700, cursor:"pointer", color:"#1b1b1b",
// };
// const outlineBtn: React.CSSProperties = {
//   display:"flex", alignItems:"center", gap:5,
//   background:"#f5f5f0", border:"0.5px solid #e0e0d8", borderRadius:7,
//   padding:"7px 12px", fontSize:12, fontWeight:600, cursor:"pointer", color:"#1b1b1b",
// };
// const smallOutlineBtn: React.CSSProperties = {
//   display:"flex", alignItems:"center", gap:4,
//   background:"#f5f5f0", border:"none", borderRadius:6,
//   padding:"5px 10px", fontSize:11, fontWeight:600, cursor:"pointer", color:"#1b1b1b",
// };
// const inputStyle: React.CSSProperties = {
//   border:"1.5px solid #e5e5e0", borderRadius:8, padding:"9px 12px",
//   fontSize:13, width:"100%", background:"#fff", color:"#1b1b1b", outline:"none",
// };








// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Loader2, ArrowLeft, Lock, MapPin, Plus, Edit2, Trash2,
//   X, ChevronRight, CheckCircle, Truck, CalendarDays, Package,
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { useCart } from "@/components/grasa/CartContext";
// import { BASE_URL } from "@/components/config/api";

// // ── API ───────────────────────────────────────────────────────────────────────
// const CART_URL    = `${BASE_URL}/grasa/shop/cart`;
// const ORDER_URL   = `${BASE_URL}/g/payment/products/create-order`;
// const CONFIRM_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
// const SAVE_URL    = `${BASE_URL}/grasa/shop/orders`;
// const LOC_URL     = `${BASE_URL}/api/locations`;

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const safeNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);
// const getCookie = (n: string) => {
//   if (typeof document === "undefined") return null;
//   const m = document.cookie.match(new RegExp(`(^| )${n}=([^;]+)`));
//   return m ? decodeURIComponent(m[2]) : null;
// };
// const fmtDate = (iso: string) => {
//   if (!iso) return "";
//   const d = new Date(iso);
//   return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
// };
// const nextBakeDay = (base: Date, weekday: number) => {
//   const d = new Date(base);
//   let delta = (weekday - d.getDay() + 7) % 7;
//   if (delta < 5) delta += 7;
//   d.setDate(d.getDate() + delta);
//   d.setHours(0, 0, 0, 0);
//   return d;
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface Address {
//   id: number; street: string; landmark?: string | null;
//   postal_code: string; city: string; state: string; country: string;
//   city_id: number; state_id: number; country_id: number; address_type?: string;
// }
// interface Opt { id: number; name: string; }

// // ── Steps ─────────────────────────────────────────────────────────────────────
// // 1 = Address  2 = Order Summary + Date  3 = Payment
// type Step = 1 | 2 | 3;

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, refreshCart } = useCart();
//   const token = typeof window !== "undefined" ? getCookie("token") : null;

//   // Cart meta
//   const [cartId, setCartId]       = useState<number | null>(null);
//   const [total, setTotal]         = useState(0);
//   const [basePrice, setBasePrice] = useState(0);
//   const [mhcPts, setMhcPts]       = useState(0);

//   // Steps
//   const [step, setStep]         = useState<Step>(1);
//   const [loading, setLoading]   = useState(true);
//   const [loadingMeta, setLoadingMeta] = useState(true);
//   const [mounted, setMounted]   = useState(false);
//   const [processing, setProc]   = useState(false);
//   const [orderDone, setOrderDone] = useState(false);
//   const [isMobile, setMobile]   = useState(false);

//   // Address
//   const [addresses, setAddresses]     = useState<Address[]>([]);
//   const [addrLoading, setAddrLoading] = useState(true);
//   const [defaultAddr, setDefaultAddr] = useState<Address | null>(null);
//   const [showAddrPanel, setShowAddrPanel] = useState(false);
//   const [deleting, setDeleting]       = useState<number | null>(null);
//   const [editing, setEditing]         = useState<number | null>(null);
//   const [showForm, setShowForm]       = useState(false);
//   const [adding, setAdding]           = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [countries, setCountries]     = useState<Opt[]>([]);
//   const [states, setStates]           = useState<Opt[]>([]);
//   const [cities, setCities]           = useState<Opt[]>([]);
//   const [form, setForm]               = useState<any>({
//     street: "", landmark: "", postal_code: "",
//     country_id: 0, state_id: 0, city_id: 0, address_type: "home",
//   });

//   // Date
//   const [selDate, setSelDate] = useState("");
//   const today    = new Date();
//   const minDate  = (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split("T")[0]; })();
//   const quickDates = ([3, 6] as const).map(wd => {
//     const d = nextBakeDay(today, wd);
//     return { label: wd === 3 ? "Wednesday" : "Saturday", value: d.toISOString().split("T")[0], display: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) };
//   });

//   // Post-order modal
//   const [modalOpen, setModalOpen]   = useState(false);
//   const [countdown, setCountdown]   = useState(10);
//   const [nextOpts, setNextOpts]     = useState<{ key: string; date: Date; display: string }[]>([]);
//   const [nextSel, setNextSel]       = useState("");

//   // Razorpay
//   const [rzpLoaded, setRzpLoaded] = useState(false);

//   // ── Bootstrap ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     const chk = () => setMobile(window.innerWidth < 768);
//     chk(); window.addEventListener("resize", chk); return () => window.removeEventListener("resize", chk);
//   }, []);

//   useEffect(() => {
//     if ((window as any).Razorpay) { setRzpLoaded(true); return; }
//     const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.async = true; s.onload = () => setRzpLoaded(true); document.body.appendChild(s);
//   }, []);

//   const fetchCartMeta = useCallback(async () => {
//     if (!token) return;
//     try {
//       const r = await fetch(CART_URL, { headers: { Authorization: `Bearer ${token}` } });
//       if (!r.ok) return;
//       const d = await r.json();
//       setMhcPts(safeNum(d?.applied_mhc_points));
//       setCartId(d?.cart?.id ?? null);
//       setTotal(safeNum(d?.cart?.total_price));
//       setBasePrice(safeNum(d?.base_price));
//     } catch {}
//   }, [token]);

//   useEffect(() => { setLoading(true); fetchCartMeta().finally(() => setLoading(false)); }, [fetchCartMeta]);
//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     if (orderDone) return;
//     if (!token) { toast.error("Login required"); router.push("/login"); return; }
//     if (mounted && !loading && !loadingMeta && (!cart || cart.length === 0)) {
//       toast.error("Your cart is empty"); router.push("/cart");
//     }
//   }, [token, cart, mounted, loading, loadingMeta, orderDone, router]);

//   // ── Fetch addresses ──────────────────────────────────────────────────────
//   const fetchAddresses = useCallback(async (initial = false) => {
//     if (initial) setAddrLoading(true);
//     try {
//       const r = await fetch(`${LOC_URL}/addresses`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
//       if (!r.ok) throw new Error();
//       const d = await r.json();
//       const items: Address[] = d.items || [];
//       setAddresses(items);
//       if (items.length > 0 && !defaultAddr) setDefaultAddr(items[0]);
//       else if (items.length > 0 && defaultAddr) {
//         const still = items.find(a => a.id === defaultAddr.id);
//         setDefaultAddr(still ?? items[0]);
//       }
//     } catch { toast.error("Could not load addresses"); }
//     finally { if (initial) { setAddrLoading(false); setLoadingMeta(false); } }
//   }, [token, defaultAddr]);

//   useEffect(() => {
//     (async () => {
//       const r = await fetch(`${LOC_URL}/countrylist`);
//       setCountries(r.ok ? await r.json() : []);
//     })();
//     fetchAddresses(true);
//   }, []);

//   useEffect(() => {
//     if (form.country_id > 0) fetch(`${LOC_URL}/statelist?country_id=${form.country_id}`).then(r => r.ok ? r.json() : []).then(setStates);
//     else setStates([]);
//     setCities([]);
//   }, [form.country_id]);

//   useEffect(() => {
//     if (form.state_id > 0) fetch(`${LOC_URL}/citylist?state_id=${form.state_id}`).then(r => r.ok ? r.json() : []).then(setCities);
//     else setCities([]);
//   }, [form.state_id]);

//   // ── Address helpers ──────────────────────────────────────────────────────
//   const resetForm = () => {
//     setForm({ street: "", landmark: "", postal_code: "", country_id: 0, state_id: 0, city_id: 0, address_type: "home" });
//     setStates([]); setCities([]); setEditing(null); setShowForm(false);
//   };

//   const handlePincode = async (v: string) => {
//     const clean = v.replace(/\D/g, "").slice(0, 6);
//     setForm((p: any) => ({ ...p, postal_code: clean }));
//     if (clean.length !== 6) return;
//     try {
//       setPincodeLoading(true);
//       const r = await fetch(`${LOC_URL}/addresses/autofill`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ pincode: clean }),
//       });
//       const d = await r.json();
//       if (!r.ok || d.valid === false) { toast.error("Invalid pincode"); return; }
//       if (d.country?.id) { const s = await fetch(`${LOC_URL}/statelist?country_id=${d.country.id}`); setStates(s.ok ? await s.json() : []); }
//       if (d.state?.id)   { const s = await fetch(`${LOC_URL}/citylist?state_id=${d.state.id}`);     setCities(s.ok ? await s.json() : []); }
//       setForm((p: any) => ({ ...p, country_id: d.country?.id ?? 0, state_id: d.state?.id ?? 0, city_id: d.city?.id ?? 0 }));
//       toast.success("Autofilled ✓");
//     } catch { toast.error("Autofill failed"); }
//     finally { setPincodeLoading(false); }
//   };

//   const handleSaveAddr = async () => {
//     if (!form.street || !form.postal_code || !form.country_id || !form.state_id || !form.city_id) {
//       toast.error("Fill all required fields"); return;
//     }
//     try {
//       setAdding(true);
//       const url = editing ? `${LOC_URL}/addresses/${editing}` : `${LOC_URL}/addresses`;
//       const r = await fetch(url, {
//         method: editing ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ street: form.street, landmark: form.landmark || "", postal_code: form.postal_code, city_id: form.city_id, state_id: form.state_id, country_id: form.country_id, address_type: form.address_type }),
//       });
//       if (!r.ok) throw new Error();
//       toast.success(editing ? "Updated ✓" : "Added ✓");
//       resetForm(); await fetchAddresses();
//     } catch { toast.error("Failed to save"); }
//     finally { setAdding(false); }
//   };

//   const handleDeleteAddr = async (id: number) => {
//     if (!confirm("Delete this address?")) return;
//     try {
//       setDeleting(id);
//       const r = await fetch(`${LOC_URL}/addresses/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
//       if (!r.ok) throw new Error();
//       toast.success("Deleted");
//       const updated = addresses.filter(a => a.id !== id);
//       setAddresses(updated);
//       if (defaultAddr?.id === id) setDefaultAddr(updated[0] ?? null);
//     } catch { toast.error("Failed"); }
//     finally { setDeleting(null); }
//   };

//   // ── Payment ──────────────────────────────────────────────────────────────
//   const handlePay = useCallback(async () => {
//     if (!defaultAddr) { toast.error("Select a delivery address"); return; }
//     if (!selDate)     { toast.error("Choose a delivery date"); return; }
//     setProc(true);

//     let ph: Window | null = null;
//     try { ph = window.open("", "rzp_ph", "width=100,height=100"); } catch {}

//     try {
//       const createRes = await fetch(ORDER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           items: (cart || []).map((i: any) => ({ product_id: i.product_id ?? i.id, quantity: i.quantity ?? 1 })),
//           pay_amount: safeNum(total), coupon_code: "", mhc_points: safeNum(mhcPts),
//           notes: { delivery_date: selDate },
//         }),
//       });
//       const cd = await createRes.json().catch(() => null);
//       if (!createRes.ok || !cd?.order_id) { toast.error("Order creation failed"); setProc(false); ph?.close(); return; }

//       const rzp = new (window as any).Razorpay({
//         key: cd.key_id, amount: cd.amount, currency: cd.currency ?? "INR",
//         name: "GRASA", description: "Order Payment", order_id: cd.order_id,
//         handler: async (resp: any) => {
//           setProc(true);
//           try {
//             const cfRes = await fetch(CONFIRM_URL, {
//               method: "POST",
//               headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//               body: JSON.stringify({ razorpay_order_id: resp.razorpay_order_id, razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature, paid_amount: cd.amount }),
//             });
//             const cfd = await cfRes.json().catch(() => null);
//             if (!cfRes.ok || !cfd?.transaction_id) { toast.error("Payment confirmed but save failed"); setProc(false); return; }

//             const svRes = await fetch(SAVE_URL, {
//               method: "POST",
//               headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//               body: JSON.stringify({
//                 cart_id: cartId ?? 0, paid_amount: cd.amount,
//                 shipping_address_id: defaultAddr?.id ?? 0,
//                 coupon_code: "", currency: cd.currency ?? "INR",
//                 notes: `delivery_date:${selDate}`, source: "GRASAFOODS",
//                 payment_transaction_id: cfd.transaction_id,
//                 items: (cart || []).map((c: any) => ({ product_id: c.product_id ?? c.id, quantity: c.quantity ?? 1, unit_price: safeNum(c.effective_price ?? c.price).toString(), paid_amount: safeNum(c.effective_price ?? c.price).toString() })),
//               }),
//             });
//             if (!svRes.ok) { toast.error("Payment OK but order save failed"); setProc(false); return; }
//             setOrderDone(true); clearCart(); try { await refreshCart(); } catch {}
//           } catch { toast.error("Failed to finalise order"); }
//           finally { setProc(false); }
//         },
//         modal: { escape: true, ondismiss: () => { toast.error("Payment cancelled"); setProc(false); } },
//       });
//       rzp.on?.("payment.failed", () => { toast.error("Payment failed"); setProc(false); ph?.close(); });
//       rzp.open();
//       setTimeout(() => { try { if (ph && !ph.closed) ph.close(); } catch {} }, 500);
//     } catch { toast.error("Payment failed"); setProc(false); ph?.close(); }
//   }, [cart, total, mhcPts, token, defaultAddr, selDate, cartId, setProc, clearCart, refreshCart, setOrderDone, rzpLoaded]);

//   // ── Post-order modal ─────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!orderDone) return;
//     const t = new Date();
//     setNextOpts([
//       { key: "wed", date: nextBakeDay(t, 3), display: nextBakeDay(t, 3).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) },
//       { key: "sat", date: nextBakeDay(t, 6), display: nextBakeDay(t, 6).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) },
//     ]);
//     setNextSel(""); setModalOpen(true); setCountdown(10);
//   }, [orderDone]);

//   useEffect(() => {
//     if (!modalOpen) return;
//     const i = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(i); return 0; } return c - 1; }), 1000);
//     return () => clearInterval(i);
//   }, [modalOpen]);

//   useEffect(() => { if (modalOpen && countdown === 0) { setModalOpen(false); router.push("/orders"); } }, [countdown, modalOpen]);

//   // ── Loading ──────────────────────────────────────────────────────────────
//   if (loading) return (
//     <div style={loadingScreen}>
//       <Loader2 size={32} style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }} />
//       <p style={{ marginTop: 10, color: "#888", fontSize: 13 }}>Loading checkout…</p>
//     </div>
//   );
//   if (!token) return (
//     <div style={loadingScreen}>
//       <p style={{ fontSize: 15, marginBottom: 16, color: "#1b1b1b" }}>Please log in to continue</p>
//       <button onClick={() => router.push("/login")} style={primaryBtn}>Go to Login</button>
//     </div>
//   );

//   const totalItems = (cart || []).reduce((s: number, i: any) => s + (i.quantity ?? 1), 0);

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
//         button { font-family: inherit; }
//         input, select { font-family: inherit; }
//       `}</style>

//       <Toaster position={isMobile ? "top-center" : "bottom-right"}
//         toastOptions={{ duration: 2500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} />

//       {/* ── Top nav ──────────────────────────────────────────────────────── */}
//       <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <button onClick={() => router.push("/cart")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13, padding: "6px 0" }}>
//             <ArrowLeft size={17} />
//             {!isMobile && <span>Cart</span>}
//           </button>
//           <span style={{ color: "#e0e0e0" }}>|</span>
//           <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: -0.4, color: "#1b1b1b" }}>
//             GRA<span style={{ color: "#C5D82D" }}>SA</span>
//           </span>
//         </div>

//         {/* Step breadcrumb */}
//         <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
//           {(["Address", "Order Summary", "Payment"] as const).map((label, i) => {
//             const s = (i + 1) as Step;
//             const active = step === s;
//             const done   = step > s;
//             return (
//               <React.Fragment key={label}>
//                 {i > 0 && <div style={{ width: isMobile ? 20 : 40, height: 1, background: done ? "#C5D82D" : "#ddd" }} />}
//                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
//                   <div style={{
//                     width: 26, height: 26, borderRadius: "50%",
//                     background: done ? "#C5D82D" : active ? "#1b1b1b" : "#e5e5e0",
//                     border: active ? "2px solid #C5D82D" : "none",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: 11, fontWeight: 700,
//                     color: done ? "#1b1b1b" : active ? "#C5D82D" : "#999",
//                     transition: "all 0.2s",
//                   }}>
//                     {done ? <CheckCircle size={14} strokeWidth={3} /> : i + 1}
//                   </div>
//                   {!isMobile && (
//                     <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#1b1b1b" : done ? "#3d7a1a" : "#999", whiteSpace: "nowrap" }}>
//                       {label}
//                     </span>
//                   )}
//                 </div>
//               </React.Fragment>
//             );
//           })}
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#aaa" }}>
//           <Lock size={11} style={{ color: "#C5D82D" }} />
//           <span>Secure</span>
//         </div>
//       </div>

//       {/* ── Main layout ───────────────────────────────────────────────────── */}
//       <div style={{
//         maxWidth: 1060, margin: "0 auto", padding: isMobile ? "12px 10px 40px" : "20px 16px 60px",
//         display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
//         gap: isMobile ? 10 : 18, alignItems: "start",
//       }}>

//         {/* ═══ LEFT ════════════════════════════════════════════════════════ */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

//           {/* ── STEP 1: Address ──────────────────────────────────────────── */}
//           <StepShell
//             stepNum={1} label="ADDRESS" currentStep={step}
//             completedSummary={defaultAddr ? (
//               <span style={{ fontSize: 13, color: "#555" }}>
//                 <strong style={{ color: "#1b1b1b" }}>{defaultAddr.address_type?.toUpperCase() || "HOME"}</strong>
//                 &nbsp;{defaultAddr.street}, {defaultAddr.city} — {defaultAddr.postal_code}
//               </span>
//             ) : null}
//             onEdit={() => setStep(1)}
//           >
//             {addrLoading ? (
//               <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
//                 <Loader2 size={22} style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }} />
//               </div>
//             ) : (
//               <div style={{ animation: "fadeIn 0.2s ease" }}>
//                 {/* Default address display */}
//                 {defaultAddr ? (
//                   <div style={{ marginBottom: 16 }}>
//                     <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
//                           <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 3, background: "#f0f0e8", color: "#5c5c3d", textTransform: "uppercase", letterSpacing: 0.5 }}>
//                             {defaultAddr.address_type || "Home"}
//                           </span>
//                           <span style={{ fontSize: 13, fontWeight: 600, color: "#1b1b1b" }}>Deliver to:</span>
//                         </div>
//                         <div style={{ fontSize: 14, color: "#1b1b1b", lineHeight: 1.6 }}>
//                           {defaultAddr.street}
//                           {defaultAddr.landmark ? `, ${defaultAddr.landmark}` : ""}
//                         </div>
//                         <div style={{ fontSize: 13, color: "#555" }}>
//                           {defaultAddr.city}, {defaultAddr.state} — {defaultAddr.postal_code}
//                         </div>
//                         <div style={{ fontSize: 12, color: "#888" }}>{defaultAddr.country}</div>
//                       </div>
//                       <button onClick={() => setShowAddrPanel(v => !v)} style={changeBtnStyle}>
//                         {showAddrPanel ? "Cancel" : "Change"}
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div style={{ padding: "16px", background: "#fff8f0", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#c0392b" }}>
//                     No address saved. Add one below.
//                   </div>
//                 )}

//                 {/* Address list panel (shown on "Change") */}
//                 {showAddrPanel && (
//                   <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, overflow: "hidden", marginBottom: 14, animation: "fadeIn 0.15s ease" }}>
//                     {addresses.map((a, idx) => {
//                       const sel = defaultAddr?.id === a.id;
//                       return (
//                         <div key={a.id} style={{ borderBottom: idx < addresses.length - 1 ? "1px solid #f0f0e8" : "none", padding: "12px 14px", background: sel ? "#fdfde8" : "#fff", display: "flex", alignItems: "flex-start", gap: 10 }}>
//                           <div
//                             onClick={() => { setDefaultAddr(a); setShowAddrPanel(false); }}
//                             style={{ flex: 1, cursor: "pointer" }}
//                           >
//                             <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
//                               <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${sel ? "#C5D82D" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                                 {sel && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C5D82D" }} />}
//                               </div>
//                               <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#777" }}>{a.address_type || "Home"}</span>
//                             </div>
//                             <div style={{ fontSize: 13, color: "#1b1b1b", paddingLeft: 22 }}>{a.street}{a.landmark ? `, ${a.landmark}` : ""}</div>
//                             <div style={{ fontSize: 12, color: "#666", paddingLeft: 22 }}>{a.city}, {a.state} — {a.postal_code}</div>
//                           </div>
//                           <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
//                             <button onClick={() => { setEditing(a.id); setForm({ street: a.street ?? "", landmark: a.landmark ?? "", postal_code: a.postal_code ?? "", country_id: a.country_id ?? 0, state_id: a.state_id ?? 0, city_id: a.city_id ?? 0, address_type: a.address_type ?? "home" }); setShowForm(true); }} style={iconBtn}><Edit2 size={13} /></button>
//                             <button onClick={() => handleDeleteAddr(a.id)} disabled={deleting === a.id} style={{ ...iconBtn, color: "#c0392b", opacity: deleting === a.id ? 0.5 : 1 }}>{deleting === a.id ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={13} />}</button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     {/* Add new inside panel */}
//                     <div
//                       onClick={() => { resetForm(); setShowForm(true); }}
//                       style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#2874f0", fontSize: 13, fontWeight: 600, background: "#f9f9ff" }}
//                     >
//                       <Plus size={15} /> Add new address
//                     </div>
//                   </div>
//                 )}

//                 {/* Continue to step 2 */}
//                 {!showAddrPanel && defaultAddr && (
//                   <button
//                     onClick={() => setStep(2)}
//                     style={{ ...primaryBtn, width: "100%", marginTop: 4 }}
//                   >
//                     Deliver here
//                   </button>
//                 )}

//                 {/* Quick add if no address */}
//                 {!defaultAddr && !showAddrPanel && (
//                   <button onClick={() => { resetForm(); setShowForm(true); }} style={{ ...primaryBtn, display: "flex", alignItems: "center", gap: 6 }}>
//                     <Plus size={15} /> Add address
//                   </button>
//                 )}
//               </div>
//             )}
//           </StepShell>

//           {/* ── STEP 2: Order Summary + Delivery Date ────────────────────── */}
//           <StepShell
//             stepNum={2} label="ORDER SUMMARY" currentStep={step}
//             completedSummary={
//               <span style={{ fontSize: 13, color: "#555" }}>
//                 {totalItems} item{totalItems !== 1 ? "s" : ""} &nbsp;·&nbsp; <strong style={{ color: "#1b1b1b" }}>₹{total.toFixed(2)}</strong>
//                 {selDate ? <>&nbsp;·&nbsp; <span style={{ color: "#3d7a1a" }}>{fmtDate(selDate)}</span></> : ""}
//               </span>
//             }
//             onEdit={() => setStep(2)}
//           >
//             <div style={{ animation: "fadeIn 0.2s ease" }}>
//               {/* Item list */}
//               <div style={{ marginBottom: 20 }}>
//                 {(cart || []).map((item: any, i: number) => {
//                   const name  = item.name ?? item.title ?? item.product_name ?? `Item #${item.id}`;
//                   const qty   = item.quantity ?? 1;
//                   const price = safeNum(item.effective_price ?? item.price);
//                   return (
//                     <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < (cart?.length ?? 0) - 1 ? "1px solid #f0f0e8" : "none" }}>
//                       <div style={{ width: 64, height: 64, borderRadius: 8, background: "#f5f5f0", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                         {item.image_url ? <img src={item.image_url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>🥗</span>}
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ fontSize: 14, fontWeight: 600, color: "#1b1b1b", marginBottom: 3, lineHeight: 1.4 }}>{name}</div>
//                         <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Qty: {qty}</div>
//                         <div style={{ fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>₹{(qty * price).toFixed(2)}</div>
//                         {price !== (item.mrp ?? price) && (
//                           <div style={{ fontSize: 12, color: "#888", textDecoration: "line-through" }}>₹{safeNum(item.mrp).toFixed(2)}</div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Delivery date — inline, prominent */}
//               <div style={{ background: "#fafce8", border: "1.5px solid #C5D82D66", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
//                   <Truck size={15} style={{ color: "#5c8a1e" }} />
//                   <span style={{ fontSize: 13, fontWeight: 700, color: "#3d5c10", textTransform: "uppercase", letterSpacing: 0.4 }}>Choose Delivery Date</span>
//                 </div>
//                 <p style={{ fontSize: 12, color: "#6b8a3a", marginBottom: 12, lineHeight: 1.5 }}>
//                   We bake fresh! Minimum 5 days from today. Pick your bake day:
//                 </p>
//                 {/* Quick picks */}
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
//                   {quickDates.map(qd => (
//                     <div key={qd.value} onClick={() => setSelDate(qd.value)} style={{
//                       border: `2px solid ${selDate === qd.value ? "#C5D82D" : "#dde8a0"}`,
//                       borderRadius: 8, padding: "10px", cursor: "pointer", textAlign: "center",
//                       background: selDate === qd.value ? "#fff" : "#f5f8e4",
//                       boxShadow: selDate === qd.value ? "0 0 0 3px #C5D82D33" : "none",
//                       transition: "all 0.15s",
//                       position: "relative",
//                     }}>
//                       {selDate === qd.value && (
//                         <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: "#C5D82D", borderRadius: 20, padding: "1px 8px", fontSize: 9, fontWeight: 700, color: "#1b1b1b", whiteSpace: "nowrap" }}>
//                           ✓ SELECTED
//                         </div>
//                       )}
//                       <div style={{ fontSize: 11, color: "#6b8a3a", fontWeight: 600, marginBottom: 2 }}>{qd.label}</div>
//                       <div style={{ fontSize: 13, fontWeight: 700, color: "#1b1b1b" }}>{qd.display}</div>
//                     </div>
//                   ))}
//                 </div>
//                 {/* Custom */}
//                 <div>
//                   <div style={{ fontSize: 11, color: "#6b8a3a", fontWeight: 600, marginBottom: 5 }}>OR PICK A CUSTOM DATE</div>
//                   <input type="date" min={minDate} value={selDate} onChange={e => setSelDate(e.target.value)}
//                     style={{ width: "100%", border: `1.5px solid ${!selDate ? "#f5a623" : "#dde8a0"}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, background: "#fff", color: "#1b1b1b", outline: "none" }} />
//                   {!selDate && <p style={{ fontSize: 11, color: "#f5a623", marginTop: 4, fontWeight: 500 }}>⚠ Select a date to proceed</p>}
//                 </div>
//               </div>

//               <button
//                 onClick={() => { if (!selDate) { toast.error("Pick a delivery date"); return; } setStep(3); }}
//                 style={{ ...primaryBtn, width: "100%" }}
//               >
//                 Continue
//               </button>
//             </div>
//           </StepShell>

//           {/* ── STEP 3: Payment ───────────────────────────────────────────── */}
//           <StepShell stepNum={3} label="PAYMENT" currentStep={step}>
//             <div style={{ animation: "fadeIn 0.2s ease" }}>
//               {/* Delivery summary */}
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <CalendarDays size={15} style={{ color: "#5c8a1e", flexShrink: 0, marginTop: 2 }} />
//                 <div>
//                   <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 1 }}>Delivery on</div>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>{fmtDate(selDate)}</div>
//                 </div>
//               </div>
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 18, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <MapPin size={15} style={{ color: "#888", flexShrink: 0, marginTop: 2 }} />
//                 <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
//                   <strong style={{ color: "#1b1b1b" }}>Delivering to:</strong> {defaultAddr?.street}, {defaultAddr?.city}, {defaultAddr?.state} — {defaultAddr?.postal_code}
//                 </div>
//               </div>

//               <button
//                 onClick={handlePay}
//                 disabled={processing}
//                 style={{
//                   width: "100%", background: processing ? "#e0e0d0" : "#C5D82D",
//                   border: "none", borderRadius: 8, padding: "14px",
//                   fontSize: 15, fontWeight: 700, cursor: processing ? "not-allowed" : "pointer",
//                   color: "#1b1b1b", letterSpacing: -0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                 }}
//               >
//                 {processing && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
//                 {processing ? "Processing…" : `Pay ₹${total.toFixed(2)}`}
//               </button>

//               <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
//                 <Lock size={11} /> Secured by Razorpay · 256-bit SSL
//               </div>
//             </div>
//           </StepShell>

//         </div>

//         {/* ═══ RIGHT: Price Summary ════════════════════════════════════════ */}
//         <div style={{ position: isMobile ? "relative" : "sticky", top: 72, display: "flex", flexDirection: "column", gap: 10 }}>
//           <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
//             {/* Header */}
//             <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//               <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
//                 Price Details
//               </span>
//             </div>
//             <div style={{ padding: "16px" }}>
//               <PriceRow label={`Price (${totalItems} item${totalItems !== 1 ? "s" : ""})`} value={`₹${basePrice.toFixed(2)}`} />
//               <PriceRow label="Delivery charges" value="FREE" valueColor="#3d7a1a" />
//               {mhcPts > 0 && <PriceRow label="MHC Points discount" value={`-₹${mhcPts.toFixed(2)}`} valueColor="#3d7a1a" />}
//               <div style={{ height: 1, background: "#e5e5e0", margin: "12px 0" }} />
//               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>
//                 <span>Total Amount</span>
//                 <span>₹{total.toFixed(2)}</span>
//               </div>
//               {mhcPts > 0 && (
//                 <div style={{ marginTop: 10, fontSize: 12, color: "#3d7a1a", fontWeight: 600 }}>
//                   🪙 You save ₹{mhcPts.toFixed(2)} on this order
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Place order / continue CTA (mirrors left step) */}
//           <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", padding: "14px 16px" }}>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
//               <div>
//                 <div style={{ fontSize: 16, fontWeight: 700, color: "#1b1b1b" }}>₹{total.toFixed(2)}</div>
//                 {selDate && <div style={{ fontSize: 11, color: "#3d7a1a", fontWeight: 500, marginTop: 2 }}>{fmtDate(selDate)}</div>}
//               </div>
//               <button
//                 onClick={() => {
//                   if (step === 1) { if (!defaultAddr) { toast.error("Select an address"); return; } setStep(2); }
//                   else if (step === 2) { if (!selDate) { toast.error("Pick a delivery date"); return; } setStep(3); }
//                   else handlePay();
//                 }}
//                 disabled={processing}
//                 style={{ ...primaryBtn, flexShrink: 0, opacity: processing ? 0.7 : 1 }}
//               >
//                 {step === 3 ? (processing ? "Processing…" : `Pay ₹${total.toFixed(2)}`) : "Continue"}
//               </button>
//             </div>
//           </div>

//           {/* Trust badge */}
//           <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//               <Lock size={15} style={{ color: "#C5D82D" }} />
//             </div>
//             <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
//               Safe and secure payments. Easy returns. 100% Authentic products.
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Address form modal ────────────────────────────────────────────── */}
//       {showForm && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 60, overflow: "auto" }}
//           onClick={resetForm}
//         >
//           <div style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : "12px", padding: isMobile ? "20px 16px" : "28px", width: "100%", maxWidth: 500, maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto", animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease" }}
//             onClick={e => e.stopPropagation()}
//           >
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//               <h3 style={{ fontSize: 16, fontWeight: 700 }}>{editing ? "Edit Address" : "Add New Address"}</h3>
//               <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
//               <input style={{ ...inputSt, gridColumn: "1/-1" }} placeholder="Full address / street *" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
//               <input style={{ ...inputSt, gridColumn: "1/-1" }} placeholder="Landmark (optional)" value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} />
//               <div style={{ gridColumn: "1/-1" }}>
//                 <input style={inputSt} placeholder="Pincode *" value={form.postal_code} onChange={e => handlePincode(e.target.value)} />
//                 {pincodeLoading && <p style={{ fontSize: 11, color: "#7c9b2a", marginTop: 3 }}>Autofilling…</p>}
//               </div>
//               <select style={inputSt} value={form.country_id} onChange={e => setForm({ ...form, country_id: Number(e.target.value) })}>
//                 <option value={0}>Country *</option>
//                 {countries.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>
//               <select style={inputSt} value={form.state_id} onChange={e => setForm({ ...form, state_id: Number(e.target.value) })}>
//                 <option value={0}>State *</option>
//                 {states.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>
//               <select style={inputSt} value={form.city_id} onChange={e => setForm({ ...form, city_id: Number(e.target.value) })}>
//                 <option value={0}>City *</option>
//                 {cities.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>
//               <select style={inputSt} value={form.address_type} onChange={e => setForm({ ...form, address_type: e.target.value })}>
//                 <option value="home">Home</option>
//                 <option value="work">Work</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//             <div style={{ display: "flex", gap: 10, marginTop: 20, flexDirection: isMobile ? "column-reverse" : "row", justifyContent: "flex-end" }}>
//               <button onClick={resetForm} style={{ padding: "10px 20px", background: "#f5f5f0", border: "0.5px solid #ddd", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
//               <button onClick={handleSaveAddr} disabled={adding} style={{ ...primaryBtn, opacity: adding ? 0.7 : 1 }}>
//                 {adding ? "Saving…" : editing ? "Update" : "Save Address"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Post-order modal ──────────────────────────────────────────────── */}
//       {modalOpen && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 70, overflow: "auto" }}>
//           <div style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : "12px", padding: isMobile ? "24px 16px" : "32px", width: "100%", maxWidth: 400, animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease", maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto" }}>
//             <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
//             <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Order Confirmed!</h2>
//             <p style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>
//               Choose your <strong>next delivery date</strong>. Redirecting to orders in <strong>{countdown}s</strong>…
//             </p>
//             {nextOpts.map(o => (
//               <label key={o.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `2px solid ${nextSel === o.key ? "#C5D82D" : "#e5e5e0"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 10, cursor: "pointer", background: nextSel === o.key ? "#fdfde8" : "#fff", transition: "all 0.15s" }}>
//                 <span style={{ fontSize: 14, fontWeight: 600 }}>{o.display}</span>
//                 <input type="radio" checked={nextSel === o.key} onChange={() => setNextSel(o.key)} style={{ cursor: "pointer" }} />
//               </label>
//             ))}
//             <button onClick={() => {
//               if (!nextSel) { toast.error("Pick a date"); return; }
//               const opt = nextOpts.find(o => o.key === nextSel);
//               if (!opt) return;
//               localStorage.setItem("selectedDelivery", JSON.stringify({ day: opt.key, date: opt.date.toISOString(), display: opt.display }));
//               setModalOpen(false); router.push("/products");
//             }} style={{ ...primaryBtn, width: "100%", marginTop: 8 }}>
//               Confirm &amp; Continue Shopping
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── StepShell ─────────────────────────────────────────────────────────────────
// function StepShell({ stepNum, label, currentStep, children, completedSummary, onEdit }: {
//   stepNum: number; label: string; currentStep: number;
//   children?: React.ReactNode;
//   completedSummary?: React.ReactNode;
//   onEdit?: () => void;
// }) {
//   const active    = currentStep === stepNum;
//   const completed = currentStep > stepNum;
//   const locked    = currentStep < stepNum;

//   return (
//     <div style={{
//       background: "#fff", border: "1px solid #e0e0e0",
//       borderTop: active ? "2px solid #C5D82D" : "1px solid #e0e0e0",
//       marginBottom: 0, borderBottom: "none",
//       opacity: locked ? 0.5 : 1,
//       transition: "opacity 0.2s",
//     }}>
//       {/* Step header */}
//       <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
//         {/* Circle */}
//         <div style={{
//           width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
//           background: completed ? "#C5D82D" : active ? "#1b1b1b" : "#e5e5e0",
//           border: active ? "2px solid #C5D82D" : "none",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontSize: 11, fontWeight: 700,
//           color: completed ? "#1b1b1b" : active ? "#C5D82D" : "#999",
//         }}>
//           {completed ? <CheckCircle size={13} strokeWidth={3} /> : stepNum}
//         </div>

//         <div style={{ flex: 1 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <span style={{ fontSize: 13, fontWeight: 700, color: completed ? "#888" : "#1b1b1b", textTransform: "uppercase", letterSpacing: 0.6 }}>
//               {label}
//             </span>
//             {completed && onEdit && (
//               <button onClick={onEdit} style={{ fontSize: 12, fontWeight: 600, color: "#2874f0", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
//                 CHANGE
//               </button>
//             )}
//           </div>
//           {completed && completedSummary && (
//             <div style={{ marginTop: 2 }}>{completedSummary}</div>
//           )}
//         </div>
//       </div>

//       {/* Body */}
//       {active && (
//         <div style={{ padding: "0 20px 20px" }}>
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── PriceRow ──────────────────────────────────────────────────────────────────
// function PriceRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 8 }}>
//       <span>{label}</span>
//       <span style={{ fontWeight: 500, color: valueColor ?? "#1b1b1b" }}>{value}</span>
//     </div>
//   );
// }

// // ── Shared styles ─────────────────────────────────────────────────────────────
// const loadingScreen: React.CSSProperties = {
//   display: "flex", flexDirection: "column", alignItems: "center",
//   justifyContent: "center", minHeight: "100vh", background: "#f1f3f6",
// };
// const primaryBtn: React.CSSProperties = {
//   background: "#C5D82D", border: "none", borderRadius: 4,
//   padding: "11px 24px", fontSize: 14, fontWeight: 700,
//   cursor: "pointer", color: "#1b1b1b", letterSpacing: -0.2,
// };
// const changeBtnStyle: React.CSSProperties = {
//   fontSize: 13, fontWeight: 600, color: "#2874f0",
//   background: "none", border: "1px solid #2874f0",
//   borderRadius: 4, padding: "5px 12px", cursor: "pointer", flexShrink: 0,
// };
// const iconBtn: React.CSSProperties = {
//   background: "#f5f5f0", border: "none", borderRadius: 5,
//   padding: "5px 7px", cursor: "pointer", display: "flex",
//   alignItems: "center", justifyContent: "center", color: "#555",
// };
// const inputSt: React.CSSProperties = {
//   border: "1.5px solid #e5e5e0", borderRadius: 7, padding: "9px 12px",
//   fontSize: 13, width: "100%", background: "#fff", color: "#1b1b1b", outline: "none",
// };











// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Loader2, ArrowLeft, Lock, MapPin, Plus, Edit2, Trash2,
//   X, ChevronRight, CheckCircle, Truck, CalendarDays, Package,
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { useCart } from "@/components/grasa/CartContext";
// import { BASE_URL } from "@/components/config/api";

// // ── API ───────────────────────────────────────────────────────────────────────
// const CART_URL    = `${BASE_URL}/grasa/shop/cart`;
// const ORDER_URL   = `${BASE_URL}/g/payment/products/create-order`;
// const CONFIRM_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
// const SAVE_URL    = `${BASE_URL}/grasa/shop/orders`;
// const LOC_URL     = `${BASE_URL}/api/locations`;

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const safeNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);
// const getCookie = (n: string) => {
//   if (typeof document === "undefined") return null;
//   const m = document.cookie.match(new RegExp(`(^| )${n}=([^;]+)`));
//   return m ? decodeURIComponent(m[2]) : null;
// };
// const fmtDate = (iso: string) => {
//   if (!iso) return "";
//   const d = new Date(iso);
//   return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
// };
// const nextBakeDay = (base: Date, weekday: number) => {
//   const d = new Date(base);
//   let delta = (weekday - d.getDay() + 7) % 7;
//   if (delta < 5) delta += 7;
//   d.setDate(d.getDate() + delta);
//   d.setHours(0, 0, 0, 0);
//   return d;
// };

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface Address {
//   id: number; street: string; landmark?: string | null;
//   postal_code: string; city: string; state: string; country: string;
//   city_id: number; state_id: number; country_id: number; address_type?: string;
// }
// interface Opt { id: number; name: string; }

// // ── Steps ─────────────────────────────────────────────────────────────────────
// // 1 = Address  2 = Order Summary + Date  3 = Payment
// type Step = 1 | 2 | 3;

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, refreshCart } = useCart();
//   const token = typeof window !== "undefined" ? getCookie("token") : null;

//   // Cart meta
//   const [cartId, setCartId]       = useState<number | null>(null);
//   const [total, setTotal]         = useState(0);
//   const [basePrice, setBasePrice] = useState(0);
//   const [mhcPts, setMhcPts]       = useState(0);

//   // Steps
//   const [step, setStep]         = useState<Step>(1);
//   const [loading, setLoading]   = useState(true);
//   const [loadingMeta, setLoadingMeta] = useState(true);
//   const [mounted, setMounted]   = useState(false);
//   const [processing, setProc]   = useState(false);
//   const [orderDone, setOrderDone] = useState(false);
//   const [isMobile, setMobile]   = useState(false);

//   // Address
//   const [addresses, setAddresses]     = useState<Address[]>([]);
//   const [addrLoading, setAddrLoading] = useState(true);
//   const [defaultAddr, setDefaultAddr] = useState<Address | null>(null);
//   const [showAddrPanel, setShowAddrPanel] = useState(false);
//   const [deleting, setDeleting]       = useState<number | null>(null);
//   const [editing, setEditing]         = useState<number | null>(null);
//   const [showForm, setShowForm]       = useState(false);
//   const [adding, setAdding]           = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [countries, setCountries]     = useState<Opt[]>([]);
//   const [states, setStates]           = useState<Opt[]>([]);
//   const [cities, setCities]           = useState<Opt[]>([]);
//   const [form, setForm]               = useState<any>({
//     street: "", landmark: "", postal_code: "",
//     country_id: 0, state_id: 0, city_id: 0, address_type: "home",
//   });

//   // Date
//   const [selDate, setSelDate] = useState("");
//   const today    = new Date();
//   const minDate  = (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split("T")[0]; })();
//   const quickDates = ([3, 6] as const).map(wd => {
//     const d = nextBakeDay(today, wd);
//     return { label: wd === 3 ? "Wednesday" : "Saturday", value: d.toISOString().split("T")[0], display: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) };
//   });

//   // Post-order modal
//   const [modalOpen, setModalOpen]   = useState(false);
//   const [countdown, setCountdown]   = useState(10);
//   const [nextOpts, setNextOpts]     = useState<{ key: string; date: Date; display: string }[]>([]);
//   const [nextSel, setNextSel]       = useState("");

//   // Razorpay
//   const [rzpLoaded, setRzpLoaded] = useState(false);

//   // ── Bootstrap ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     const chk = () => setMobile(window.innerWidth < 768);
//     chk(); window.addEventListener("resize", chk); return () => window.removeEventListener("resize", chk);
//   }, []);

//   useEffect(() => {
//     if ((window as any).Razorpay) { setRzpLoaded(true); return; }
//     const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.async = true; s.onload = () => setRzpLoaded(true); document.body.appendChild(s);
//   }, []);

//   const fetchCartMeta = useCallback(async () => {
//     if (!token) return;
//     try {
//       const r = await fetch(CART_URL, { headers: { Authorization: `Bearer ${token}` } });
//       if (!r.ok) return;
//       const d = await r.json();
//       setMhcPts(safeNum(d?.applied_mhc_points));
//       setCartId(d?.cart?.id ?? null);
//       setTotal(safeNum(d?.cart?.total_price));
//       setBasePrice(safeNum(d?.base_price));
//     } catch {}
//   }, [token]);

//   useEffect(() => { setLoading(true); fetchCartMeta().finally(() => setLoading(false)); }, [fetchCartMeta]);
//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     if (orderDone) return;
//     if (!token) { toast.error("Login required"); router.push("/login"); return; }
//     if (mounted && !loading && !loadingMeta && (!cart || cart.length === 0)) {
//       toast.error("Your cart is empty"); router.push("/cart");
//     }
//   }, [token, cart, mounted, loading, loadingMeta, orderDone, router]);

//   // ── Fetch addresses ──────────────────────────────────────────────────────
//   const fetchAddresses = useCallback(async (initial = false) => {
//     if (initial) setAddrLoading(true);
//     try {
//       const r = await fetch(`${LOC_URL}/addresses`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
//       if (!r.ok) throw new Error();
//       const d = await r.json();
//       const items: Address[] = d.items || [];
//       setAddresses(items);
//       if (items.length > 0 && !defaultAddr) setDefaultAddr(items[0]);
//       else if (items.length > 0 && defaultAddr) {
//         const still = items.find(a => a.id === defaultAddr.id);
//         setDefaultAddr(still ?? items[0]);
//       }
//     } catch { toast.error("Could not load addresses"); }
//     finally { if (initial) { setAddrLoading(false); setLoadingMeta(false); } }
//   }, [token, defaultAddr]);

//   useEffect(() => {
//     (async () => {
//       const r = await fetch(`${LOC_URL}/countrylist`);
//       setCountries(r.ok ? await r.json() : []);
//     })();
//     fetchAddresses(true);
//   }, []);

//   useEffect(() => {
//     if (form.country_id > 0) fetch(`${LOC_URL}/statelist?country_id=${form.country_id}`).then(r => r.ok ? r.json() : []).then(setStates);
//     else setStates([]);
//     setCities([]);
//   }, [form.country_id]);

//   useEffect(() => {
//     if (form.state_id > 0) fetch(`${LOC_URL}/citylist?state_id=${form.state_id}`).then(r => r.ok ? r.json() : []).then(setCities);
//     else setCities([]);
//   }, [form.state_id]);

//   // ── Address helpers ──────────────────────────────────────────────────────
//   const resetForm = () => {
//     setForm({ street: "", landmark: "", postal_code: "", country_id: 0, state_id: 0, city_id: 0, address_type: "home" });
//     setStates([]); setCities([]); setEditing(null); setShowForm(false);
//   };

//   const handlePincode = async (v: string) => {
//     const clean = v.replace(/\D/g, "").slice(0, 6);
//     setForm((p: any) => ({ ...p, postal_code: clean }));
//     if (clean.length !== 6) return;
//     try {
//       setPincodeLoading(true);
//       const r = await fetch(`${LOC_URL}/addresses/autofill`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ pincode: clean }),
//       });
//       const d = await r.json();
//       if (!r.ok || d.valid === false) { toast.error("Invalid pincode"); return; }
//       if (d.country?.id) { const s = await fetch(`${LOC_URL}/statelist?country_id=${d.country.id}`); setStates(s.ok ? await s.json() : []); }
//       if (d.state?.id)   { const s = await fetch(`${LOC_URL}/citylist?state_id=${d.state.id}`);     setCities(s.ok ? await s.json() : []); }
//       setForm((p: any) => ({ ...p, country_id: d.country?.id ?? 0, state_id: d.state?.id ?? 0, city_id: d.city?.id ?? 0 }));
//       toast.success("Autofilled ✓");
//     } catch { toast.error("Autofill failed"); }
//     finally { setPincodeLoading(false); }
//   };

//   const handleSaveAddr = async () => {
//     if (!form.street || !form.postal_code || !form.country_id || !form.state_id || !form.city_id) {
//       toast.error("Fill all required fields"); return;
//     }
//     try {
//       setAdding(true);
//       const url = editing ? `${LOC_URL}/addresses/${editing}` : `${LOC_URL}/addresses`;
//       const r = await fetch(url, {
//         method: editing ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ street: form.street, landmark: form.landmark || "", postal_code: form.postal_code, city_id: form.city_id, state_id: form.state_id, country_id: form.country_id, address_type: form.address_type }),
//       });
//       if (!r.ok) throw new Error();
//       toast.success(editing ? "Updated ✓" : "Added ✓");
//       resetForm(); await fetchAddresses();
//     } catch { toast.error("Failed to save"); }
//     finally { setAdding(false); }
//   };

//   const handleDeleteAddr = async (id: number) => {
//     if (!confirm("Delete this address?")) return;
//     try {
//       setDeleting(id);
//       const r = await fetch(`${LOC_URL}/addresses/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
//       if (!r.ok) throw new Error();
//       toast.success("Deleted");
//       const updated = addresses.filter(a => a.id !== id);
//       setAddresses(updated);
//       if (defaultAddr?.id === id) setDefaultAddr(updated[0] ?? null);
//     } catch { toast.error("Failed"); }
//     finally { setDeleting(null); }
//   };

//   // Auto-advance to step 2 when address is selected
//   useEffect(() => {
//     if (step === 1 && defaultAddr && addresses.length > 0 && !showAddrPanel && !showForm) {
//       const timer = setTimeout(() => setStep(2), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [step, defaultAddr, showAddrPanel, showForm, addresses.length]);

//   // Auto-advance to step 3 when delivery date is selected
//   useEffect(() => {
//     if (step === 2 && selDate) {
//       const timer = setTimeout(() => setStep(3), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [step, selDate]);

//   // ── Payment ──────────────────────────────────────────────────────────────
//   const handlePay = useCallback(async () => {
//     if (!defaultAddr) { toast.error("Select a delivery address"); return; }
//     if (!selDate)     { toast.error("Choose a delivery date"); return; }
//     setProc(true);

//     let ph: Window | null = null;
//     try { ph = window.open("", "rzp_ph", "width=100,height=100"); } catch {}

//     try {
//       const createRes = await fetch(ORDER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           items: (cart || []).map((i: any) => ({ product_id: i.product_id ?? i.id, quantity: i.quantity ?? 1 })),
//           pay_amount: safeNum(total), coupon_code: "", mhc_points: safeNum(mhcPts),
//           notes: { delivery_date: selDate },
//         }),
//       });
//       const cd = await createRes.json().catch(() => null);
//       if (!createRes.ok || !cd?.order_id) { toast.error("Order creation failed"); setProc(false); ph?.close(); return; }

//       const rzp = new (window as any).Razorpay({
//         key: cd.key_id, amount: cd.amount, currency: cd.currency ?? "INR",
//         name: "GRASA", description: "Order Payment", order_id: cd.order_id,
//         handler: async (resp: any) => {
//           setProc(true);
//           try {
//             const cfRes = await fetch(CONFIRM_URL, {
//               method: "POST",
//               headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//               body: JSON.stringify({ razorpay_order_id: resp.razorpay_order_id, razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature, paid_amount: cd.amount }),
//             });
//             const cfd = await cfRes.json().catch(() => null);
//             if (!cfRes.ok || !cfd?.transaction_id) { toast.error("Payment confirmed but save failed"); setProc(false); return; }

//             const svRes = await fetch(SAVE_URL, {
//               method: "POST",
//               headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//               body: JSON.stringify({
//                 cart_id: cartId ?? 0, paid_amount: cd.amount,
//                 shipping_address_id: defaultAddr?.id ?? 0,
//                 coupon_code: "", currency: cd.currency ?? "INR",
//                 notes: `delivery_date:${selDate}`, source: "GRASAFOODS",
//                 payment_transaction_id: cfd.transaction_id,
//                 items: (cart || []).map((c: any) => ({ product_id: c.product_id ?? c.id, quantity: c.quantity ?? 1, unit_price: safeNum(c.effective_price ?? c.price).toString(), paid_amount: safeNum(c.effective_price ?? c.price).toString() })),
//               }),
//             });
//             if (!svRes.ok) { toast.error("Payment OK but order save failed"); setProc(false); return; }
//             setOrderDone(true); clearCart(); try { await refreshCart(); } catch {}
//           } catch { toast.error("Failed to finalise order"); }
//           finally { setProc(false); }
//         },
//         modal: { escape: true, ondismiss: () => { toast.error("Payment cancelled"); setProc(false); } },
//       });
//       rzp.on?.("payment.failed", () => { toast.error("Payment failed"); setProc(false); ph?.close(); });
//       rzp.open();
//       setTimeout(() => { try { if (ph && !ph.closed) ph.close(); } catch {} }, 500);
//     } catch { toast.error("Payment failed"); setProc(false); ph?.close(); }
//   }, [cart, total, mhcPts, token, defaultAddr, selDate, cartId, setProc, clearCart, refreshCart, setOrderDone, rzpLoaded]);

//   // ── Post-order modal ─────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!orderDone) return;
//     const t = new Date();
//     setNextOpts([
//       { key: "wed", date: nextBakeDay(t, 3), display: nextBakeDay(t, 3).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) },
//       { key: "sat", date: nextBakeDay(t, 6), display: nextBakeDay(t, 6).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) },
//     ]);
//     setNextSel(""); setModalOpen(true); setCountdown(10);
//   }, [orderDone]);

//   useEffect(() => {
//     if (!modalOpen) return;
//     const i = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(i); return 0; } return c - 1; }), 1000);
//     return () => clearInterval(i);
//   }, [modalOpen]);

//   useEffect(() => { if (modalOpen && countdown === 0) { setModalOpen(false); router.push("/orders"); } }, [countdown, modalOpen]);

//   // ── Loading ──────────────────────────────────────────────────────────────
//   if (loading) return (
//     <div style={loadingScreen}>
//       <Loader2 size={32} style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }} />
//       <p style={{ marginTop: 10, color: "#888", fontSize: 13 }}>Loading checkout…</p>
//     </div>
//   );
//   if (!token) return (
//     <div style={loadingScreen}>
//       <p style={{ fontSize: 15, marginBottom: 16, color: "#1b1b1b" }}>Please log in to continue</p>
//       <button onClick={() => router.push("/login")} style={primaryBtn}>Go to Login</button>
//     </div>
//   );

//   const totalItems = (cart || []).reduce((s: number, i: any) => s + (i.quantity ?? 1), 0);

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
//         button { font-family: inherit; }
//         input, select { font-family: inherit; }
//       `}</style>

//       <Toaster position={isMobile ? "top-center" : "bottom-right"}
//         toastOptions={{ duration: 2500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} />

//       {/* ── Top nav ──────────────────────────────────────────────────────── */}
//       <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <button onClick={() => router.push("/cart")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13, padding: "6px 0" }}>
//             <ArrowLeft size={17} />
//             {!isMobile && <span>Cart</span>}
//           </button>
//           <span style={{ color: "#e0e0e0" }}>|</span>
//           <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: -0.4, color: "#1b1b1b" }}>
//             GRA<span style={{ color: "#C5D82D" }}>SA</span>
//           </span>
//         </div>

//         {/* Step breadcrumb */}
//         <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
//           {(["Address", "Order Summary", "Payment"] as const).map((label, i) => {
//             const s = (i + 1) as Step;
//             const active = step === s;
//             const done   = step > s;
//             return (
//               <React.Fragment key={label}>
//                 {i > 0 && <div style={{ width: isMobile ? 20 : 40, height: 1, background: done ? "#C5D82D" : "#ddd" }} />}
//                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
//                   <div style={{
//                     width: 26, height: 26, borderRadius: "50%",
//                     background: done ? "#C5D82D" : active ? "#1b1b1b" : "#e5e5e0",
//                     border: active ? "2px solid #C5D82D" : "none",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: 11, fontWeight: 700,
//                     color: done ? "#1b1b1b" : active ? "#C5D82D" : "#999",
//                     transition: "all 0.2s",
//                   }}>
//                     {done ? <CheckCircle size={14} strokeWidth={3} /> : i + 1}
//                   </div>
//                   {!isMobile && (
//                     <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#1b1b1b" : done ? "#3d7a1a" : "#999", whiteSpace: "nowrap" }}>
//                       {label}
//                     </span>
//                   )}
//                 </div>
//               </React.Fragment>
//             );
//           })}
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#aaa" }}>
//           <Lock size={11} style={{ color: "#C5D82D" }} />
//           <span>Secure</span>
//         </div>
//       </div>

//       {/* ── Main layout ───────────────────────────────────────────────────── */}
//       <div style={{
//         maxWidth: 1060, margin: "0 auto", padding: isMobile ? "12px 10px 40px" : "20px 16px 60px",
//         display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
//         gap: isMobile ? 10 : 18, alignItems: "start",
//       }}>

//         {/* ═══ LEFT ════════════════════════════════════════════════════════ */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

//           {/* ── STEP 1: Address ──────────────────────────────────────────── */}
//           <StepShell
//             stepNum={1} label="ADDRESS" currentStep={step}
//             completedSummary={defaultAddr ? (
//               <span style={{ fontSize: 13, color: "#555" }}>
//                 <strong style={{ color: "#1b1b1b" }}>{defaultAddr.address_type?.toUpperCase() || "HOME"}</strong>
//                 &nbsp;{defaultAddr.street}, {defaultAddr.city} — {defaultAddr.postal_code}
//               </span>
//             ) : null}
//             onEdit={() => { setStep(1); setShowAddrPanel(true); }}
//           >
//             {addrLoading ? (
//               <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
//                 <Loader2 size={22} style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }} />
//               </div>
//             ) : (
//               <div style={{ animation: "fadeIn 0.2s ease" }}>
//                 {/* Default address display */}
//                 {defaultAddr ? (
//                   <div style={{ marginBottom: 16 }}>
//                     <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
//                           <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 3, background: "#f0f0e8", color: "#5c5c3d", textTransform: "uppercase", letterSpacing: 0.5 }}>
//                             {defaultAddr.address_type || "Home"}
//                           </span>
//                           <span style={{ fontSize: 13, fontWeight: 600, color: "#1b1b1b" }}>Deliver to:</span>
//                         </div>
//                         <div style={{ fontSize: 14, color: "#1b1b1b", lineHeight: 1.6 }}>
//                           {defaultAddr.street}
//                           {defaultAddr.landmark ? `, ${defaultAddr.landmark}` : ""}
//                         </div>
//                         <div style={{ fontSize: 13, color: "#555" }}>
//                           {defaultAddr.city}, {defaultAddr.state} — {defaultAddr.postal_code}
//                         </div>
//                         <div style={{ fontSize: 12, color: "#888" }}>{defaultAddr.country}</div>
//                       </div>
//                       <button onClick={() => setShowAddrPanel(v => !v)} style={changeBtnStyle}>
//                         {showAddrPanel ? "Close" : "Change"}
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div style={{ padding: "16px", background: "#fff8f0", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#c0392b" }}>
//                     No address saved. Add one below.
//                   </div>
//                 )}

//                 {/* Address list panel (shown on "Change") */}
//                 {showAddrPanel && (
//                   <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, overflow: "hidden", marginBottom: 14, animation: "fadeIn 0.15s ease" }}>
//                     {addresses.map((a, idx) => {
//                       const sel = defaultAddr?.id === a.id;
//                       return (
//                         <div key={a.id} style={{ borderBottom: idx < addresses.length - 1 ? "1px solid #f0f0e8" : "none", padding: "12px 14px", background: sel ? "#fdfde8" : "#fff", display: "flex", alignItems: "flex-start", gap: 10 }}>
//                           <div
//                             onClick={() => { setDefaultAddr(a); setShowAddrPanel(false); }}
//                             style={{ flex: 1, cursor: "pointer" }}
//                           >
//                             <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
//                               <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${sel ? "#C5D82D" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                                 {sel && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C5D82D" }} />}
//                               </div>
//                               <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#777" }}>{a.address_type || "Home"}</span>
//                             </div>
//                             <div style={{ fontSize: 13, color: "#1b1b1b", paddingLeft: 22 }}>{a.street}{a.landmark ? `, ${a.landmark}` : ""}</div>
//                             <div style={{ fontSize: 12, color: "#666", paddingLeft: 22 }}>{a.city}, {a.state} — {a.postal_code}</div>
//                           </div>
//                           <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
//                             <button onClick={() => { setEditing(a.id); setForm({ street: a.street ?? "", landmark: a.landmark ?? "", postal_code: a.postal_code ?? "", country_id: a.country_id ?? 0, state_id: a.state_id ?? 0, city_id: a.city_id ?? 0, address_type: a.address_type ?? "home" }); setShowForm(true); }} style={iconBtn}><Edit2 size={13} /></button>
//                             <button onClick={() => handleDeleteAddr(a.id)} disabled={deleting === a.id} style={{ ...iconBtn, color: "#c0392b", opacity: deleting === a.id ? 0.5 : 1 }}>{deleting === a.id ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={13} />}</button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     {/* Add new inside panel */}
//                     <div
//                       onClick={() => { resetForm(); setShowForm(true); }}
//                       style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#2874f0", fontSize: 13, fontWeight: 600, background: "#f9f9ff" }}
//                     >
//                       <Plus size={15} /> Add new address
//                     </div>
//                   </div>
//                 )}

//                 {/* Quick add if no address */}
//                 {!defaultAddr && !showAddrPanel && (
//                   <button onClick={() => { resetForm(); setShowForm(true); }} style={{ ...primaryBtn, display: "flex", alignItems: "center", gap: 6 }}>
//                     <Plus size={15} /> Add address
//                   </button>
//                 )}
//               </div>
//             )}
//           </StepShell>

//           {/* ── STEP 2: Order Summary + Delivery Date ────────────────────── */}
//           <StepShell
//             stepNum={2} label="ORDER SUMMARY" currentStep={step}
//             completedSummary={
//               <span style={{ fontSize: 13, color: "#555" }}>
//                 {totalItems} item{totalItems !== 1 ? "s" : ""} &nbsp;·&nbsp; <strong style={{ color: "#1b1b1b" }}>₹{total.toFixed(2)}</strong>
//                 {selDate ? <>&nbsp;·&nbsp; <span style={{ color: "#3d7a1a" }}>{fmtDate(selDate)}</span></> : ""}
//               </span>
//             }
//             onEdit={() => setStep(2)}
//           >
//             <div style={{ animation: "fadeIn 0.2s ease" }}>
//               {/* Item list */}
//               <div style={{ marginBottom: 20 }}>
//                 {(cart || []).map((item: any, i: number) => {
//                   const name  = item.name ?? item.title ?? item.product_name ?? `Item #${item.id}`;
//                   const qty   = item.quantity ?? 1;
//                   const price = safeNum(item.effective_price ?? item.price);
//                   return (
//                     <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < (cart?.length ?? 0) - 1 ? "1px solid #f0f0e8" : "none" }}>
//                       <div style={{ width: 64, height: 64, borderRadius: 8, background: "#f5f5f0", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                         {item.image_url ? <img src={item.image_url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>🥗</span>}
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ fontSize: 14, fontWeight: 600, color: "#1b1b1b", marginBottom: 3, lineHeight: 1.4 }}>{name}</div>
//                         <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Qty: {qty}</div>
//                         <div style={{ fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>₹{(qty * price).toFixed(2)}</div>
//                         {price !== (item.mrp ?? price) && (
//                           <div style={{ fontSize: 12, color: "#888", textDecoration: "line-through" }}>₹{safeNum(item.mrp).toFixed(2)}</div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Delivery date — inline, prominent */}
//               <div style={{ background: "#fafce8", border: "1.5px solid #C5D82D66", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
//                   <Truck size={15} style={{ color: "#5c8a1e" }} />
//                   <span style={{ fontSize: 13, fontWeight: 700, color: "#3d5c10", textTransform: "uppercase", letterSpacing: 0.4 }}>Choose Delivery Date</span>
//                 </div>
//                 <p style={{ fontSize: 12, color: "#6b8a3a", marginBottom: 12, lineHeight: 1.5 }}>
//                   We bake fresh! Minimum 5 days from today. Pick your bake day:
//                 </p>
//                 {/* Quick picks */}
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
//                   {quickDates.map(qd => (
//                     <div key={qd.value} onClick={() => setSelDate(qd.value)} style={{
//                       border: `2px solid ${selDate === qd.value ? "#C5D82D" : "#dde8a0"}`,
//                       borderRadius: 8, padding: "10px", cursor: "pointer", textAlign: "center",
//                       background: selDate === qd.value ? "#fff" : "#f5f8e4",
//                       boxShadow: selDate === qd.value ? "0 0 0 3px #C5D82D33" : "none",
//                       transition: "all 0.15s",
//                       position: "relative",
//                     }}>
//                       {selDate === qd.value && (
//                         <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: "#C5D82D", borderRadius: 20, padding: "1px 8px", fontSize: 9, fontWeight: 700, color: "#1b1b1b", whiteSpace: "nowrap" }}>
//                           ✓ SELECTED
//                         </div>
//                       )}
//                       <div style={{ fontSize: 11, color: "#6b8a3a", fontWeight: 600, marginBottom: 2 }}>{qd.label}</div>
//                       <div style={{ fontSize: 13, fontWeight: 700, color: "#1b1b1b" }}>{qd.display}</div>
//                     </div>
//                   ))}
//                 </div>
//                 {/* Custom */}
//                 <div>
//                   <div style={{ fontSize: 11, color: "#6b8a3a", fontWeight: 600, marginBottom: 5 }}>OR PICK A CUSTOM DATE</div>
//                   <input type="date" min={minDate} value={selDate} onChange={e => setSelDate(e.target.value)}
//                     style={{ width: "100%", border: `1.5px solid ${!selDate ? "#f5a623" : "#dde8a0"}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, background: "#fff", color: "#1b1b1b", outline: "none" }} />
//                   {!selDate && <p style={{ fontSize: 11, color: "#f5a623", marginTop: 4, fontWeight: 500 }}>⚠ Select a date to proceed</p>}
//                 </div>
//               </div>
//             </div>
//           </StepShell>

//           {/* ── STEP 3: Payment ───────────────────────────────────────────── */}
//           <StepShell stepNum={3} label="PAYMENT" currentStep={step}>
//             <div style={{ animation: "fadeIn 0.2s ease" }}>
//               {/* Delivery summary */}
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <CalendarDays size={15} style={{ color: "#5c8a1e", flexShrink: 0, marginTop: 2 }} />
//                 <div>
//                   <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 1 }}>Delivery on</div>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>{fmtDate(selDate)}</div>
//                 </div>
//               </div>
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 18, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <MapPin size={15} style={{ color: "#888", flexShrink: 0, marginTop: 2 }} />
//                 <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
//                   <strong style={{ color: "#1b1b1b" }}>Delivering to:</strong> {defaultAddr?.street}, {defaultAddr?.city}, {defaultAddr?.state} — {defaultAddr?.postal_code}
//                 </div>
//               </div>

//               <button
//                 onClick={handlePay}
//                 disabled={processing}
//                 style={{
//                   width: "100%", background: processing ? "#e0e0d0" : "#C5D82D",
//                   border: "none", borderRadius: 8, padding: "14px",
//                   fontSize: 15, fontWeight: 700, cursor: processing ? "not-allowed" : "pointer",
//                   color: "#1b1b1b", letterSpacing: -0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                 }}
//               >
//                 {processing && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
//                 {processing ? "Processing…" : `Pay ₹${total.toFixed(2)}`}
//               </button>

//               <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
//                 <Lock size={11} /> Secured by Razorpay · 256-bit SSL
//               </div>
//             </div>
//           </StepShell>

//         </div>

//         {/* ═══ RIGHT: Price Summary ════════════════════════════════════════ */}
//         <div style={{ position: isMobile ? "relative" : "sticky", top: 72, display: "flex", flexDirection: "column", gap: 10 }}>
//           <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
//             {/* Header */}
//             <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//               <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
//                 Price Details
//               </span>
//             </div>
//             <div style={{ padding: "16px" }}>
//               <PriceRow label={`Price (${totalItems} item${totalItems !== 1 ? "s" : ""})`} value={`₹${basePrice.toFixed(2)}`} />
//               <PriceRow label="Delivery charges" value="FREE" valueColor="#3d7a1a" />
//               {mhcPts > 0 && <PriceRow label="MHC Points discount" value={`-₹${mhcPts.toFixed(2)}`} valueColor="#3d7a1a" />}
//               <div style={{ height: 1, background: "#e5e5e0", margin: "12px 0" }} />
//               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>
//                 <span>Total Amount</span>
//                 <span>₹{total.toFixed(2)}</span>
//               </div>
//               {mhcPts > 0 && (
//                 <div style={{ marginTop: 10, fontSize: 12, color: "#3d7a1a", fontWeight: 600 }}>
//                   🪙 You save ₹{mhcPts.toFixed(2)} on this order
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Trust badge */}
//           <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//               <Lock size={15} style={{ color: "#C5D82D" }} />
//             </div>
//             <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
//               Safe and secure payments. Easy returns. 100% Authentic products.
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Address form modal ────────────────────────────────────────────── */}
//       {showForm && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 60, overflow: "auto" }}
//           onClick={resetForm}
//         >
//           <div style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : "12px", padding: isMobile ? "20px 16px" : "28px", width: "100%", maxWidth: 500, maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto", animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease" }}
//             onClick={e => e.stopPropagation()}
//           >
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//               <h3 style={{ fontSize: 16, fontWeight: 700 }}>{editing ? "Edit Address" : "Add New Address"}</h3>
//               <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
//               <input style={{ ...inputSt, gridColumn: "1/-1" }} placeholder="Full address / street *" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
//               <input style={{ ...inputSt, gridColumn: "1/-1" }} placeholder="Landmark (optional)" value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} />
//               <div style={{ gridColumn: "1/-1" }}>
//                 <input style={inputSt} placeholder="Pincode *" value={form.postal_code} onChange={e => handlePincode(e.target.value)} />
//                 {pincodeLoading && <p style={{ fontSize: 11, color: "#7c9b2a", marginTop: 3 }}>Autofilling…</p>}
//               </div>
//               <select style={inputSt} value={form.country_id} onChange={e => setForm({ ...form, country_id: Number(e.target.value) })}>
//                 <option value={0}>Country *</option>
//                 {countries.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>
//               <select style={inputSt} value={form.state_id} onChange={e => setForm({ ...form, state_id: Number(e.target.value) })}>
//                 <option value={0}>State *</option>
//                 {states.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>
//               <select style={inputSt} value={form.city_id} onChange={e => setForm({ ...form, city_id: Number(e.target.value) })}>
//                 <option value={0}>City *</option>
//                 {cities.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
//               </select>
//               <select style={inputSt} value={form.address_type} onChange={e => setForm({ ...form, address_type: e.target.value })}>
//                 <option value="home">Home</option>
//                 <option value="work">Work</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//             <div style={{ display: "flex", gap: 10, marginTop: 20, flexDirection: isMobile ? "column-reverse" : "row", justifyContent: "flex-end" }}>
//               <button onClick={resetForm} style={{ padding: "10px 20px", background: "#f5f5f0", border: "0.5px solid #ddd", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
//               <button onClick={handleSaveAddr} disabled={adding} style={{ ...primaryBtn, opacity: adding ? 0.7 : 1 }}>
//                 {adding ? "Saving…" : editing ? "Update" : "Save Address"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Post-order modal ──────────────────────────────────────────────── */}
//       {modalOpen && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 70, overflow: "auto" }}>
//           <div style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : "12px", padding: isMobile ? "24px 16px" : "32px", width: "100%", maxWidth: 400, animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease", maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto" }}>
//             <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
//             <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Order Confirmed!</h2>
//             <p style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>
//               Choose your <strong>next delivery date</strong>. Redirecting to orders in <strong>{countdown}s</strong>…
//             </p>
//             {nextOpts.map(o => (
//               <label key={o.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `2px solid ${nextSel === o.key ? "#C5D82D" : "#e5e5e0"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 10, cursor: "pointer", background: nextSel === o.key ? "#fdfde8" : "#fff", transition: "all 0.15s" }}>
//                 <span style={{ fontSize: 14, fontWeight: 600 }}>{o.display}</span>
//                 <input type="radio" checked={nextSel === o.key} onChange={() => setNextSel(o.key)} style={{ cursor: "pointer" }} />
//               </label>
//             ))}
//             <button onClick={() => {
//               if (!nextSel) { toast.error("Pick a date"); return; }
//               const opt = nextOpts.find(o => o.key === nextSel);
//               if (!opt) return;
//               localStorage.setItem("selectedDelivery", JSON.stringify({ day: opt.key, date: opt.date.toISOString(), display: opt.display }));
//               setModalOpen(false); router.push("/products");
//             }} style={{ ...primaryBtn, width: "100%", marginTop: 8 }}>
//               Confirm &amp; Continue Shopping
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── StepShell ─────────────────────────────────────────────────────────────────
// function StepShell({ stepNum, label, currentStep, children, completedSummary, onEdit }: {
//   stepNum: number; label: string; currentStep: number;
//   children?: React.ReactNode;
//   completedSummary?: React.ReactNode;
//   onEdit?: () => void;
// }) {
//   const active    = currentStep === stepNum;
//   const completed = currentStep > stepNum;
//   const locked    = currentStep < stepNum;

//   return (
//     <div style={{
//       background: "#fff", border: "1px solid #e0e0e0",
//       borderTop: active ? "2px solid #C5D82D" : "1px solid #e0e0e0",
//       marginBottom: 0, borderBottom: "none",
//       opacity: locked ? 0.5 : 1,
//       transition: "opacity 0.2s",
//     }}>
//       {/* Step header */}
//       <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
//         {/* Circle */}
//         <div style={{
//           width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
//           background: completed ? "#C5D82D" : active ? "#1b1b1b" : "#e5e5e0",
//           border: active ? "2px solid #C5D82D" : "none",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontSize: 11, fontWeight: 700,
//           color: completed ? "#1b1b1b" : active ? "#C5D82D" : "#999",
//         }}>
//           {completed ? <CheckCircle size={13} strokeWidth={3} /> : stepNum}
//         </div>

//         <div style={{ flex: 1 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <span style={{ fontSize: 13, fontWeight: 700, color: completed ? "#888" : "#1b1b1b", textTransform: "uppercase", letterSpacing: 0.6 }}>
//               {label}
//             </span>
//             {completed && onEdit && (
//               <button onClick={onEdit} style={{ fontSize: 12, fontWeight: 600, color: "#2874f0", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
//                 CHANGE
//               </button>
//             )}
//           </div>
//           {completed && completedSummary && (
//             <div style={{ marginTop: 2 }}>{completedSummary}</div>
//           )}
//         </div>
//       </div>

//       {/* Body */}
//       {active && (
//         <div style={{ padding: "0 20px 20px" }}>
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── PriceRow ──────────────────────────────────────────────────────────────────
// function PriceRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 8 }}>
//       <span>{label}</span>
//       <span style={{ fontWeight: 500, color: valueColor ?? "#1b1b1b" }}>{value}</span>
//     </div>
//   );
// }

// // ── Shared styles ─────────────────────────────────────────────────────────────
// const loadingScreen: React.CSSProperties = {
//   display: "flex", flexDirection: "column", alignItems: "center",
//   justifyContent: "center", minHeight: "100vh", background: "#f1f3f6",
// };
// const primaryBtn: React.CSSProperties = {
//   background: "#C5D82D", border: "none", borderRadius: 4,
//   padding: "11px 24px", fontSize: 14, fontWeight: 700,
//   cursor: "pointer", color: "#1b1b1b", letterSpacing: -0.2,
// };
// const changeBtnStyle: React.CSSProperties = {
//   fontSize: 13, fontWeight: 600, color: "#2874f0",
//   background: "none", border: "1px solid #2874f0",
//   borderRadius: 4, padding: "5px 12px", cursor: "pointer", flexShrink: 0,
// };
// const iconBtn: React.CSSProperties = {
//   background: "#f5f5f0", border: "none", borderRadius: 5,
//   padding: "5px 7px", cursor: "pointer", display: "flex",
//   alignItems: "center", justifyContent: "center", color: "#555",
// };
// const inputSt: React.CSSProperties = {
//   border: "1.5px solid #e5e5e0", borderRadius: 7, padding: "9px 12px",
//   fontSize: 13, width: "100%", background: "#fff", color: "#1b1b1b", outline: "none",
// };













"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, ArrowLeft, Lock, MapPin, Plus, Edit2, Trash2,
  X, ChevronRight, CheckCircle, Truck, CalendarDays, Package,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "@/components/grasa/CartContext";
import { BASE_URL } from "@/components/config/api";

// ── API ───────────────────────────────────────────────────────────────────────
const CART_URL = `${BASE_URL}/grasa/shop/cart`;
const ORDER_URL = `${BASE_URL}/g/payment/products/create-order`;
const CONFIRM_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
const SAVE_URL = `${BASE_URL}/grasa/shop/orders`;
const LOC_URL = `${BASE_URL}/api/locations`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const safeNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const getCookie = (n: string) => {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(^| )${n}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
};
const fmtDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};
const nextBakeDay = (base: Date, weekday: number) => {
  const d = new Date(base);
  let delta = (weekday - d.getDay() + 7) % 7;
  if (delta < 5) delta += 7;
  d.setDate(d.getDate() + delta);
  d.setHours(0, 0, 0, 0);
  return d;
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface Address {
  id: number; street: string; landmark?: string | null;
  postal_code: string; city: string; state: string; country: string;
  city_id: number; state_id: number; country_id: number; address_type?: string;
}
interface Opt { id: number; name: string; }

// ── Steps ─────────────────────────────────────────────────────────────────────
// 1 = Address  2 = Order Summary + Date  3 = Payment
type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, refreshCart } = useCart();
  const token = typeof window !== "undefined" ? getCookie("token") : null;

  // Cart meta
  const [cartId, setCartId] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [mhcPts, setMhcPts] = useState(0);

  // Steps
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [processing, setProc] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [isMobile, setMobile] = useState(false);

  // Address
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [defaultAddr, setDefaultAddr] = useState<Address | null>(null);
  const [showAddrPanel, setShowAddrPanel] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [countries, setCountries] = useState<Opt[]>([]);
  const [states, setStates] = useState<Opt[]>([]);
  const [cities, setCities] = useState<Opt[]>([]);
  const [form, setForm] = useState<any>({
    street: "", landmark: "", postal_code: "",
    country_id: 0, state_id: 0, city_id: 0, address_type: "home",
  });

  // Date
  const [selDate, setSelDate] = useState("");
  const today = new Date();
  const minDate = (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split("T")[0]; })();
  const quickDates = ([3, 6] as const).map(wd => {
    const d = nextBakeDay(today, wd);
    return { label: wd === 3 ? "Wednesday" : "Saturday", value: d.toISOString().split("T")[0], display: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) };
  });

  // Post-order modal
  const [modalOpen, setModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [nextOpts, setNextOpts] = useState<{ key: string; date: Date; display: string }[]>([]);
  const [nextSel, setNextSel] = useState("");

  // Razorpay
  const [rzpLoaded, setRzpLoaded] = useState(false);

  const skipAutoStepRef = useRef(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);



  // ── Bootstrap ───────────────────────────────────────────────────────────
  useEffect(() => {
    const chk = () => setMobile(window.innerWidth < 768);
    chk(); window.addEventListener("resize", chk); return () => window.removeEventListener("resize", chk);
  }, []);

  useEffect(() => {
    if ((window as any).Razorpay) { setRzpLoaded(true); return; }
    const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true; s.onload = () => setRzpLoaded(true); document.body.appendChild(s);
  }, []);

  const fetchCartMeta = useCallback(async () => {
    if (!token) return;
    try {
      const r = await fetch(CART_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) return;
      const d = await r.json();
      setMhcPts(safeNum(d?.applied_mhc_points));
      setCartId(d?.cart?.id ?? null);
      setTotal(safeNum(d?.cart?.total_price));
      setBasePrice(safeNum(d?.base_price));
    } catch { }
  }, [token]);

  useEffect(() => { setLoading(true); fetchCartMeta().finally(() => setLoading(false)); }, [fetchCartMeta]);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (orderDone) return;
    if (!token) { toast.error("Login required"); router.push("/login"); return; }
    if (mounted && !loading && !loadingMeta && (!cart || cart.length === 0)) {
      toast.error("Your cart is empty"); router.push("/cart");
    }
  }, [token, cart, mounted, loading, loadingMeta, orderDone, router]);



  // ── Fetch addresses ──────────────────────────────────────────────────────
  const fetchAddresses = useCallback(async (initial = false) => {
    if (initial) setAddrLoading(true);
    try {
      const r = await fetch(`${LOC_URL}/addresses`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!r.ok) throw new Error();
      const d = await r.json();
      const items: Address[] = d.items || [];
      setAddresses(items);
      if (items.length > 0 && !defaultAddr) setDefaultAddr(items[0]);
      else if (items.length > 0 && defaultAddr) {
        const still = items.find(a => a.id === defaultAddr.id);
        setDefaultAddr(still ?? items[0]);
      }
    } catch { toast.error("Could not load addresses"); }
    finally { if (initial) { setAddrLoading(false); setLoadingMeta(false); } }
  }, [token, defaultAddr]);

  useEffect(() => {
    (async () => {
      const r = await fetch(`${LOC_URL}/countrylist`);
      setCountries(r.ok ? await r.json() : []);
    })();
    fetchAddresses(true);
  }, []);

  useEffect(() => {
    if (form.country_id > 0) fetch(`${LOC_URL}/statelist?country_id=${form.country_id}`).then(r => r.ok ? r.json() : []).then(setStates);
    else setStates([]);
    setCities([]);
  }, [form.country_id]);

  useEffect(() => {
    if (form.state_id > 0) fetch(`${LOC_URL}/citylist?state_id=${form.state_id}`).then(r => r.ok ? r.json() : []).then(setCities);
    else setCities([]);
  }, [form.state_id]);

  // ── Address helpers ──────────────────────────────────────────────────────
  const resetForm = () => {
    setForm({ street: "", landmark: "", postal_code: "", country_id: 0, state_id: 0, city_id: 0, address_type: "home" });
    setStates([]); setCities([]); setEditing(null); setShowForm(false);
  };

  const handlePincode = async (v: string) => {
    const clean = v.replace(/\D/g, "").slice(0, 6);
    setForm((p: any) => ({ ...p, postal_code: clean }));
    if (clean.length !== 6) return;
    try {
      setPincodeLoading(true);
      const r = await fetch(`${LOC_URL}/addresses/autofill`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ pincode: clean }),
      });
      const d = await r.json();
      if (!r.ok || d.valid === false) { toast.error("Invalid pincode"); return; }
      if (d.country?.id) { const s = await fetch(`${LOC_URL}/statelist?country_id=${d.country.id}`); setStates(s.ok ? await s.json() : []); }
      if (d.state?.id) { const s = await fetch(`${LOC_URL}/citylist?state_id=${d.state.id}`); setCities(s.ok ? await s.json() : []); }
      setForm((p: any) => ({ ...p, country_id: d.country?.id ?? 0, state_id: d.state?.id ?? 0, city_id: d.city?.id ?? 0 }));
      toast.success("Autofilled ✓");
    } catch { toast.error("Autofill failed"); }
    finally { setPincodeLoading(false); }
  };

  const handleSaveAddr = async () => {
    if (!form.street || !form.postal_code || !form.country_id || !form.state_id || !form.city_id) {
      toast.error("Fill all required fields"); return;
    }
    try {
      setAdding(true);
      const url = editing ? `${LOC_URL}/addresses/${editing}` : `${LOC_URL}/addresses`;
      const r = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ street: form.street, landmark: form.landmark || "", postal_code: form.postal_code, city_id: form.city_id, state_id: form.state_id, country_id: form.country_id, address_type: form.address_type }),
      });
      if (!r.ok) throw new Error();
      toast.success(editing ? "Updated ✓" : "Added ✓");
      resetForm(); await fetchAddresses();
    } catch { toast.error("Failed to save"); }
    finally { setAdding(false); }
  };

  const handleDeleteAddr = async (id: number) => {
    if (!confirm("Delete this address?")) return;
    try {
      setDeleting(id);
      const r = await fetch(`${LOC_URL}/addresses/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!r.ok) throw new Error();
      toast.success("Deleted");
      const updated = addresses.filter(a => a.id !== id);
      setAddresses(updated);
      if (defaultAddr?.id === id) setDefaultAddr(updated[0] ?? null);
    } catch { toast.error("Failed"); }
    finally { setDeleting(null); }
  };



  // Auto-advance to step 2 when address is selected
  useEffect(() => {
    if (step === 1 && defaultAddr && addresses.length > 0 && !showAddrPanel && !showForm) {
      const timer = setTimeout(() => setStep(2), 300);
      return () => clearTimeout(timer);
    }
  }, [step, defaultAddr, showAddrPanel, showForm, addresses.length]);

  // Auto-advance to step 3 when delivery date is selected
  useEffect(() => {
    if (skipAutoStepRef.current) {
      skipAutoStepRef.current = false;
      return;
    }

    if (step === 2 && selDate) {
      const timer = setTimeout(() => setStep(3), 300);
      return () => clearTimeout(timer);
    }
  }, [step, selDate]);

  // ── Payment ──────────────────────────────────────────────────────────────
  const handlePay = useCallback(async () => {
    if (!defaultAddr) { toast.error("Select a delivery address"); return; }
    if (!selDate) { toast.error("Choose a delivery date"); return; }
    setProc(true);

    let ph: Window | null = null;
    try { ph = window.open("", "rzp_ph", "width=100,height=100"); } catch { }

    try {
      const createRes = await fetch(ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          items: (cart || []).map((i: any) => ({ product_id: i.product_id ?? i.id, quantity: i.quantity ?? 1 })),
          pay_amount: safeNum(total), coupon_code: "", mhc_points: safeNum(mhcPts),
          notes: { delivery_date: selDate },
        }),
      });
      const cd = await createRes.json().catch(() => null);
      if (!createRes.ok || !cd?.order_id) { toast.error("Order creation failed"); setProc(false); ph?.close(); return; }

      const rzp = new (window as any).Razorpay({
        key: cd.key_id, amount: cd.amount, currency: cd.currency ?? "INR",
        name: "GRASA", description: "Order Payment", order_id: cd.order_id,
        handler: async (resp: any) => {
          setProc(true);
          try {
            const cfRes = await fetch(CONFIRM_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              body: JSON.stringify({ razorpay_order_id: resp.razorpay_order_id, razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature, paid_amount: cd.amount }),
            });
            const cfd = await cfRes.json().catch(() => null);
            if (!cfRes.ok || !cfd?.transaction_id) { toast.error("Payment confirmed but save failed"); setProc(false); return; }

            const svRes = await fetch(SAVE_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              body: JSON.stringify({
                cart_id: cartId ?? 0, paid_amount: cd.amount,
                shipping_address_id: defaultAddr?.id ?? 0,
                coupon_code: "", currency: cd.currency ?? "INR",
                notes: `delivery_date:${selDate}`, source: "GRASAFOODS",
                payment_transaction_id: cfd.transaction_id,
                items: (cart || []).map((c: any) => ({ product_id: c.product_id ?? c.id, quantity: c.quantity ?? 1, unit_price: safeNum(c.effective_price ?? c.price).toString(), paid_amount: safeNum(c.effective_price ?? c.price).toString() })),
              }),
            });
            if (!svRes.ok) { toast.error("Payment OK but order save failed"); setProc(false); return; }
            setOrderDone(true); clearCart(); try { await refreshCart(); } catch { }
          } catch { toast.error("Failed to finalise order"); }
          finally { setProc(false); }
        },
        modal: { escape: true, ondismiss: () => { toast.error("Payment cancelled"); setProc(false); } },
      });
      rzp.on?.("payment.failed", () => { toast.error("Payment failed"); setProc(false); ph?.close(); });
      rzp.open();
      setTimeout(() => { try { if (ph && !ph.closed) ph.close(); } catch { } }, 500);
    } catch { toast.error("Payment failed"); setProc(false); ph?.close(); }
  }, [cart, total, mhcPts, token, defaultAddr, selDate, cartId, setProc, clearCart, refreshCart, setOrderDone, rzpLoaded]);

  // ── Post-order modal ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!orderDone) return;
    const t = new Date();
    setNextOpts([
      { key: "wed", date: nextBakeDay(t, 3), display: nextBakeDay(t, 3).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) },
      { key: "sat", date: nextBakeDay(t, 6), display: nextBakeDay(t, 6).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) },
    ]);
    setNextSel(""); setModalOpen(true); setCountdown(10);
  }, [orderDone]);

  useEffect(() => {
    if (!modalOpen) return;
    const i = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(i); return 0; } return c - 1; }), 1000);
    return () => clearInterval(i);
  }, [modalOpen]);

  useEffect(() => { if (modalOpen && countdown === 0) { setModalOpen(false); router.push("/orders"); } }, [countdown, modalOpen]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={loadingScreen}>
      <Loader2 size={32} style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }} />
      <p style={{ marginTop: 10, color: "#888", fontSize: 13 }}>Loading checkout…</p>
    </div>
  );
  if (!token) return (
    <div style={loadingScreen}>
      <p style={{ fontSize: 15, marginBottom: 16, color: "#1b1b1b" }}>Please log in to continue</p>
      <button onClick={() => router.push("/login")} style={primaryBtn}>Go to Login</button>
    </div>
  );

  const totalItems = (cart || []).reduce((s: number, i: any) => s + (i.quantity ?? 1), 0);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="checkout-root" style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .checkout-root *, .checkout-root *::before, .checkout-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
.checkout-root button, .checkout-root input, .checkout-root select { font-family: inherit; }
@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>

      <Toaster position={isMobile ? "top-center" : "bottom-right"}
        toastOptions={{ duration: 2500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} />

      {/* ── Top nav ──────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => router.push("/cart")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13, padding: "6px 0" }}>
            <ArrowLeft size={17} />
            {!isMobile && <span>Cart</span>}
          </button>
          <span style={{ color: "#e0e0e0" }}>|</span>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: -0.4, color: "#1b1b1b" }}>
            GRA<span style={{ color: "#C5D82D" }}>SA</span>
          </span>
        </div>

        {/* Step breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {(["Address", "Order Summary", "Payment"] as const).map((label, i) => {
            const s = (i + 1) as Step;
            const active = step === s;
            const done = step > s;
            return (
              <React.Fragment key={label}>
                {i > 0 && <div style={{ width: isMobile ? 20 : 40, height: 1, background: done ? "#C5D82D" : "#ddd" }} />}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: done ? "#C5D82D" : active ? "#1b1b1b" : "#e5e5e0",
                    border: active ? "2px solid #C5D82D" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    color: done ? "#1b1b1b" : active ? "#C5D82D" : "#999",
                    transition: "all 0.2s",
                  }}>
                    {done ? <CheckCircle size={14} strokeWidth={3} /> : i + 1}
                  </div>
                  {!isMobile && (
                    <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#1b1b1b" : done ? "#3d7a1a" : "#999", whiteSpace: "nowrap" }}>
                      {label}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#aaa" }}>
          <Lock size={11} style={{ color: "#C5D82D" }} />
          <span>Secure</span>
        </div>
      </div>



      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1060, margin: "0 auto", padding: isMobile ? "12px 10px 40px" : "20px 16px 60px",
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
        gap: isMobile ? 10 : 18, alignItems: "start",
      }}>

        {/* ═══ LEFT ════════════════════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

          {/* ── STEP 1: Address ──────────────────────────────────────────── */}
          <StepShell
            stepNum={1} label="ADDRESS" currentStep={step}
            completedSummary={defaultAddr ? (
              <span style={{ fontSize: 13, color: "#555" }}>
                <strong style={{ color: "#1b1b1b" }}>{defaultAddr.address_type?.toUpperCase() || "HOME"}</strong>
                &nbsp;{defaultAddr.street}, {defaultAddr.city} — {defaultAddr.postal_code}
              </span>
            ) : null}
            onEdit={() => { setStep(1); setShowAddrPanel(true); }}
          >
            {addrLoading ? (
              <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
                <Loader2 size={22} style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }} />
              </div>
            ) : (
              <div style={{ animation: "fadeIn 0.2s ease" }}>
                {/* Default address display */}
                {defaultAddr ? (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 3, background: "#f0f0e8", color: "#5c5c3d", textTransform: "uppercase", letterSpacing: 0.5 }}>
                            {defaultAddr.address_type || "Home"}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1b1b1b" }}>Deliver to:</span>
                        </div>
                        <div style={{ fontSize: 14, color: "#1b1b1b", lineHeight: 1.6 }}>
                          {defaultAddr.street}
                          {defaultAddr.landmark ? `, ${defaultAddr.landmark}` : ""}
                        </div>
                        <div style={{ fontSize: 13, color: "#555" }}>
                          {defaultAddr.city}, {defaultAddr.state} — {defaultAddr.postal_code}
                        </div>
                        <div style={{ fontSize: 12, color: "#888" }}>{defaultAddr.country}</div>
                      </div>
                      <button onClick={() => setShowAddrPanel(v => !v)} style={changeBtnStyle}>
                        {showAddrPanel ? "Close" : "Change"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "16px", background: "#fff8f0", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#c0392b" }}>
                    No address saved. Add one below.
                  </div>
                )}

                {/* Address list panel (shown on "Change") */}
                {showAddrPanel && (
                  <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, overflow: "hidden", marginBottom: 14, animation: "fadeIn 0.15s ease" }}>
                    {addresses.map((a, idx) => {
                      const sel = defaultAddr?.id === a.id;
                      return (
                        <div key={a.id} style={{ borderBottom: idx < addresses.length - 1 ? "1px solid #f0f0e8" : "none", padding: "12px 14px", background: sel ? "#fdfde8" : "#fff", display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div
                            onClick={() => { setDefaultAddr(a); setShowAddrPanel(false); }}
                            style={{ flex: 1, cursor: "pointer" }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                              <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${sel ? "#C5D82D" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {sel && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C5D82D" }} />}
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#777" }}>{a.address_type || "Home"}</span>
                            </div>
                            <div style={{ fontSize: 13, color: "#1b1b1b", paddingLeft: 22 }}>{a.street}{a.landmark ? `, ${a.landmark}` : ""}</div>
                            <div style={{ fontSize: 12, color: "#666", paddingLeft: 22 }}>{a.city}, {a.state} — {a.postal_code}</div>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <button onClick={() => { setEditing(a.id); setForm({ street: a.street ?? "", landmark: a.landmark ?? "", postal_code: a.postal_code ?? "", country_id: a.country_id ?? 0, state_id: a.state_id ?? 0, city_id: a.city_id ?? 0, address_type: a.address_type ?? "home" }); setShowForm(true); }} style={iconBtn}><Edit2 size={13} /></button>
                            <button onClick={() => handleDeleteAddr(a.id)} disabled={deleting === a.id} style={{ ...iconBtn, color: "#c0392b", opacity: deleting === a.id ? 0.5 : 1 }}>{deleting === a.id ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={13} />}</button>
                          </div>
                        </div>
                      );
                    })}
                    {/* Add new inside panel */}
                    <div
                      onClick={() => { resetForm(); setShowForm(true); }}
                      style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#2874f0", fontSize: 13, fontWeight: 600, background: "#f9f9ff" }}
                    >
                      <Plus size={15} /> Add new address
                    </div>
                  </div>
                )}

                {/* Quick add if no address */}
                {!defaultAddr && !showAddrPanel && (
                  <button onClick={() => { resetForm(); setShowForm(true); }} style={{ ...primaryBtn, display: "flex", alignItems: "center", gap: 6 }}>
                    <Plus size={15} /> Add address
                  </button>
                )}
              </div>
            )}
          </StepShell>


          {/* ── STEP 2: Order Summary + Delivery Date ────────────────────── */}
          <StepShell
            stepNum={2}
            label="ORDER SUMMARY"
            currentStep={step}
            completedSummary={
              <span style={{ fontSize: 13, color: "#555" }}>
                {totalItems} item{totalItems !== 1 ? "s" : ""} ·{" "}
                <strong style={{ color: "#1b1b1b" }}>₹{total.toFixed(2)}</strong>
                {selDate && <> · <span style={{ color: "#3d7a1a" }}>{fmtDate(selDate)}</span></>}
              </span>
            }
            onEdit={() => {
              skipAutoStepRef.current = true;
              setShowOrderSummary(true);
              setStep(2);
            }}
          >


            <div style={{ animation: "fadeIn 0.2s ease" }}>
              {/* Item list */}
              <div style={{ marginBottom: 20 }}>
                {(cart || []).map((item: any, i: number) => {
                  const name = item.name ?? item.title ?? item.product_name ?? `Item #${item.id}`;
                  const qty = item.quantity ?? 1;
                  const price = safeNum(item.effective_price ?? item.price);
                  return (
                    <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < (cart?.length ?? 0) - 1 ? "1px solid #f0f0e8" : "none" }}>
                      <div style={{ width: 64, height: 64, borderRadius: 8, background: "#f5f5f0", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {item.image_url ? <img src={item.image_url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>🥗</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1b1b1b", marginBottom: 3, lineHeight: 1.4 }}>{name}</div>
                        <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Qty: {qty}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>₹{(qty * price).toFixed(2)}</div>
                        {price !== (item.mrp ?? price) && (
                          <div style={{ fontSize: 12, color: "#888", textDecoration: "line-through" }}>₹{safeNum(item.mrp).toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery date — inline, prominent */}
              <div style={{ background: "#fafce8", border: "1.5px solid #C5D82D66", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                  <Truck size={15} style={{ color: "#5c8a1e" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#3d5c10", textTransform: "uppercase", letterSpacing: 0.4 }}>Choose Delivery Date</span>
                </div>
                <p style={{ fontSize: 12, color: "#6b8a3a", marginBottom: 12, lineHeight: 1.5 }}>
                  We bake fresh! Minimum 5 days from today. Pick your bake day:
                </p>
                {/* Quick picks */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {quickDates.map(qd => (
                    <div key={qd.value} onClick={() => setSelDate(qd.value)} style={{
                      border: `2px solid ${selDate === qd.value ? "#C5D82D" : "#dde8a0"}`,
                      borderRadius: 8, padding: "10px", cursor: "pointer", textAlign: "center",
                      background: selDate === qd.value ? "#fff" : "#f5f8e4",
                      boxShadow: selDate === qd.value ? "0 0 0 3px #C5D82D33" : "none",
                      transition: "all 0.15s",
                      position: "relative",
                    }}>
                      {selDate === qd.value && (
                        <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: "#C5D82D", borderRadius: 20, padding: "1px 8px", fontSize: 9, fontWeight: 700, color: "#1b1b1b", whiteSpace: "nowrap" }}>
                          ✓ SELECTED
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: "#6b8a3a", fontWeight: 600, marginBottom: 2 }}>{qd.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1b1b1b" }}>{qd.display}</div>
                    </div>
                  ))}
                </div>
                {/* Custom */}
                <div>
                  <div style={{ fontSize: 11, color: "#6b8a3a", fontWeight: 600, marginBottom: 5 }}>OR PICK A CUSTOM DATE</div>
                  <input type="date" min={minDate} value={selDate} onChange={e => setSelDate(e.target.value)}
                    style={{ width: "100%", border: `1.5px solid ${!selDate ? "#f5a623" : "#dde8a0"}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, background: "#fff", color: "#1b1b1b", outline: "none" }} />
                  {!selDate && <p style={{ fontSize: 11, color: "#f5a623", marginTop: 4, fontWeight: 500 }}>⚠ Select a date to proceed</p>}
                </div>
              </div>
            </div>
          </StepShell>

          {/* ── STEP 3: Payment ───────────────────────────────────────────── */}
          <StepShell stepNum={3} label="PAYMENT" currentStep={step}>
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              {/* Delivery summary */}
              <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <CalendarDays size={15} style={{ color: "#5c8a1e", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 1 }}>Delivery on</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>{fmtDate(selDate)}</div>
                </div>
              </div>
              <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 18, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <MapPin size={15} style={{ color: "#888", flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                  <strong style={{ color: "#1b1b1b" }}>Delivering to:</strong> {defaultAddr?.street}, {defaultAddr?.city}, {defaultAddr?.state} — {defaultAddr?.postal_code}
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={processing}
                style={{
                  width: "100%", background: processing ? "#e0e0d0" : "#C5D82D",
                  border: "none", borderRadius: 8, padding: "14px",
                  fontSize: 15, fontWeight: 700, cursor: processing ? "not-allowed" : "pointer",
                  color: "#1b1b1b", letterSpacing: -0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {processing && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                {processing ? "Processing…" : `Pay ₹${total.toFixed(2)}`}
              </button>

              <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <Lock size={11} /> Secured by Razorpay · 256-bit SSL
              </div>
            </div>
          </StepShell>

        </div>

        {/* ═══ RIGHT: Price Summary ════════════════════════════════════════ */}
        <div style={{ position: isMobile ? "relative" : "sticky", top: 72, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
                Price Details
              </span>
            </div>
            <div style={{ padding: "16px" }}>
              <PriceRow label={`Price (${totalItems} item${totalItems !== 1 ? "s" : ""})`} value={`₹${basePrice.toFixed(2)}`} />
              <PriceRow label="Delivery charges" value="FREE" valueColor="#3d7a1a" />
              {mhcPts > 0 && <PriceRow label="MHC Points discount" value={`-₹${mhcPts.toFixed(2)}`} valueColor="#3d7a1a" />}
              <div style={{ height: 1, background: "#e5e5e0", margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              {mhcPts > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#3d7a1a", fontWeight: 600 }}>
                  🪙 You save ₹{mhcPts.toFixed(2)} on this order
                </div>
              )}
            </div>
          </div>

          {/* Trust badge */}
          <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Lock size={15} style={{ color: "#C5D82D" }} />
            </div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
              Safe and secure payments. Easy returns. 100% Authentic products.
            </div>
          </div>
        </div>
      </div>

      {/* ── Address form modal ────────────────────────────────────────────── */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 60, overflow: "auto" }}
          onClick={resetForm}
        >
          <div style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : "12px", padding: isMobile ? "20px 16px" : "28px", width: "100%", maxWidth: 500, maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto", animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{editing ? "Edit Address" : "Add New Address"}</h3>
              <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
              <input style={{ ...inputSt, gridColumn: "1/-1" }} placeholder="Full address / street *" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
              <input style={{ ...inputSt, gridColumn: "1/-1" }} placeholder="Landmark (optional)" value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} />
              <div style={{ gridColumn: "1/-1" }}>
                <input style={inputSt} placeholder="Pincode *" value={form.postal_code} onChange={e => handlePincode(e.target.value)} />
                {pincodeLoading && <p style={{ fontSize: 11, color: "#7c9b2a", marginTop: 3 }}>Autofilling…</p>}
              </div>
              <select style={inputSt} value={form.country_id} onChange={e => setForm({ ...form, country_id: Number(e.target.value) })}>
                <option value={0}>Country *</option>
                {countries.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>
              <select style={inputSt} value={form.state_id} onChange={e => setForm({ ...form, state_id: Number(e.target.value) })}>
                <option value={0}>State *</option>
                {states.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>
              <select style={inputSt} value={form.city_id} onChange={e => setForm({ ...form, city_id: Number(e.target.value) })}>
                <option value={0}>City *</option>
                {cities.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>
              <select style={inputSt} value={form.address_type} onChange={e => setForm({ ...form, address_type: e.target.value })}>
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexDirection: isMobile ? "column-reverse" : "row", justifyContent: "flex-end" }}>
              <button onClick={resetForm} style={{ padding: "10px 20px", background: "#f5f5f0", border: "0.5px solid #ddd", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveAddr} disabled={adding} style={{ ...primaryBtn, opacity: adding ? 0.7 : 1 }}>
                {adding ? "Saving…" : editing ? "Update" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Post-order modal ──────────────────────────────────────────────── */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 70, overflow: "auto" }}>
          <div style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : "12px", padding: isMobile ? "24px 16px" : "32px", width: "100%", maxWidth: 400, animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease", maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Order Confirmed!</h2>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>
              Choose your <strong>next delivery date</strong>. Redirecting to orders in <strong>{countdown}s</strong>…
            </p>
            {nextOpts.map(o => (
              <label key={o.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `2px solid ${nextSel === o.key ? "#C5D82D" : "#e5e5e0"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 10, cursor: "pointer", background: nextSel === o.key ? "#fdfde8" : "#fff", transition: "all 0.15s" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{o.display}</span>
                <input type="radio" checked={nextSel === o.key} onChange={() => setNextSel(o.key)} style={{ cursor: "pointer" }} />
              </label>
            ))}
            <button onClick={() => {
              if (!nextSel) { toast.error("Pick a date"); return; }
              const opt = nextOpts.find(o => o.key === nextSel);
              if (!opt) return;
              localStorage.setItem("selectedDelivery", JSON.stringify({ day: opt.key, date: opt.date.toISOString(), display: opt.display }));
              setModalOpen(false); router.push("/products");
            }} style={{ ...primaryBtn, width: "100%", marginTop: 8 }}>
              Confirm &amp; Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── StepShell ─────────────────────────────────────────────────────────────────
function StepShell({ stepNum, label, currentStep, children, completedSummary, onEdit }: {
  stepNum: number; label: string; currentStep: number;
  children?: React.ReactNode;
  completedSummary?: React.ReactNode;
  onEdit?: () => void;
}) {
  const active = currentStep === stepNum;
  const completed = currentStep > stepNum;
  const locked = currentStep < stepNum;

  return (
    <div style={{
      background: "#fff", border: "1px solid #e0e0e0",
      borderTop: active ? "2px solid #C5D82D" : "1px solid #e0e0e0",
      marginBottom: 0, borderBottom: "none",
      opacity: locked ? 0.5 : 1,
      transition: "opacity 0.2s",
    }}>
      {/* Step header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        {/* Circle */}
        <div style={{
          width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
          background: completed ? "#C5D82D" : active ? "#1b1b1b" : "#e5e5e0",
          border: active ? "2px solid #C5D82D" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700,
          color: completed ? "#1b1b1b" : active ? "#C5D82D" : "#999",
        }}>
          {completed ? <CheckCircle size={13} strokeWidth={3} /> : stepNum}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            {/* LEFT: Label */}
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: completed ? "#888" : "#1b1b1b",
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              {label}
            </span>

            {/* RIGHT: Change Button */}
            {completed && onEdit && (
              <button
                onClick={onEdit}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#2874f0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                CHANGE
              </button>
            )}
          </div>
          {completed && completedSummary && (
            <div style={{ marginTop: 2 }}>{completedSummary}</div>
          )}
        </div>
      </div>

      {/* Body */}
      {active && (
        <div style={{ padding: "0 20px 20px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── PriceRow ──────────────────────────────────────────────────────────────────
function PriceRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 8 }}>
      <span>{label}</span>
      <span style={{ fontWeight: 500, color: valueColor ?? "#1b1b1b" }}>{value}</span>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const loadingScreen: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", minHeight: "100vh", background: "#f1f3f6",
};
const primaryBtn: React.CSSProperties = {
  background: "#C5D82D", border: "none", borderRadius: 4,
  padding: "11px 24px", fontSize: 14, fontWeight: 700,
  cursor: "pointer", color: "#1b1b1b", letterSpacing: -0.2,
};
const changeBtnStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: "#2874f0",
  background: "none", border: "1px solid #2874f0",
  borderRadius: 4, padding: "5px 12px", cursor: "pointer", flexShrink: 0,
};
const iconBtn: React.CSSProperties = {
  background: "#f5f5f0", border: "none", borderRadius: 5,
  padding: "5px 7px", cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center", color: "#555",
};
const inputSt: React.CSSProperties = {
  border: "1.5px solid #e5e5e0", borderRadius: 7, padding: "9px 12px",
  fontSize: 13, width: "100%", background: "#fff", color: "#1b1b1b", outline: "none",
};