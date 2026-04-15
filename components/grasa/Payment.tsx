// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { ShieldCheck, Package, Coins } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import toast, { Toaster } from "react-hot-toast";
// import { BASE_URL } from "@/components/config/api";

// const CREATE_ORDER_URL = `${BASE_URL}/g/payment/products/create-order`;
// const CONFIRM_PAYMENT_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
// const SAVE_ORDER_URL = `${BASE_URL}/grasa/shop/orders`;

// const safeNumber = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// export default function PaymentSection(props: {
//   token: string | null;
//   cart: any[];
//   totalAmount: number;
//   basePrice: number;        // ✅ ADD THIS
//   appliedMhcPoints: number;
//   selectedAddressId: number | null;
//   selectedDate: string;
//   cartId: number | null;
//   setCartId: (id: number | null) => void;
//   setOrderSuccess: (v: boolean) => void;
//   clearCart: () => void;
//   refreshCart: () => Promise<void> | void;
//   processing: boolean;
//   setProcessing: (v: boolean) => void;
// }) {

//   const {
//     token,
//     cart,
//     totalAmount,
//     appliedMhcPoints, // ✅ ADD
//     basePrice,
//     selectedAddressId,
//     selectedDate,
//     cartId,
//     setCartId,
//     setOrderSuccess,
//     clearCart,
//     refreshCart,
//     processing,
//     setProcessing,
//   } = props;

//   console.log(basePrice)

//   const [loadingPaymentMetaLocal, setLoadingPaymentMetaLocal] = useState(false);
//   const [razorScriptLoaded, setRazorScriptLoaded] = useState(false);

//   // Preload Razorpay script on mount so popup can be opened in the click gesture.
//   useEffect(() => {
//     console.log("[PaymentSection] mount -> preloading razorpay script");
//     if ((window as any).Razorpay) {
//       console.log("[PaymentSection] Razorpay already present");
//       setRazorScriptLoaded(true);
//       return;
//     }
//     const s = document.createElement("script");
//     s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.async = true;
//     s.onload = () => {
//       console.log("[PaymentSection] Razorpay script loaded");
//       setRazorScriptLoaded(true);
//     };
//     s.onerror = (e) => {
//       console.error("[PaymentSection] Razorpay script failed to load", e);
//       setRazorScriptLoaded(false);
//     };
//     document.body.appendChild(s);
//     return () => {
//       // do not remove script on unmount (safe)
//     };
//   }, []);

//   const loadRazorpayScript = () =>
//     new Promise<boolean>((resolve) => {
//       if ((window as any).Razorpay) return resolve(true);
//       const s = document.createElement("script");
//       s.src = "https://checkout.razorpay.com/v1/checkout.js";
//       s.onload = () => resolve(true);
//       s.onerror = () => resolve(false);
//       document.body.appendChild(s);
//     });

//   const handlePayNow = useCallback(async () => {
//     console.log("[PaymentSection] Pay Now clicked");
//     if (!selectedAddressId) {
//       console.log("[PaymentSection] No address selected");
//       toast.error("Please select a delivery address.");
//       return;
//     }

//     if (!selectedDate) {
//       console.log("[PaymentSection] No delivery date selected");
//       toast.error("Please pick a delivery date.");
//       return;
//     }

//     setProcessing(true);
//     setLoadingPaymentMetaLocal(true);

//     let placeholder: Window | null = null;
//     try {
//       placeholder = window.open(
//         "",
//         "rzp_placeholder_window",
//         "width=100,height=100,left=0,top=0"
//       );
//       if (placeholder) {
//         try {
//           placeholder.document.title = "Preparing Payment...";
//         } catch (e) {
//           // cross-origin or blocked access may throw; ignore
//         }
//         console.log("[PaymentSection] Placeholder window opened for gesture", placeholder);
//       } else {
//         console.warn("[PaymentSection] Placeholder window could not be opened (popup may be blocked)");
//       }
//     } catch (err) {
//       console.warn("[PaymentSection] error opening placeholder window", err);
//     }

//     try {
//       // Ensure Razorpay script is available (use preloaded flag if possible)
//       if (!razorScriptLoaded) {
//         console.log("[PaymentSection] Razorpay script not flagged loaded; loading now...");
//         const ok = await loadRazorpayScript();
//         if (!ok) {
//           console.error("[PaymentSection] Razorpay script failed to load at runtime");
//           toast.error("Payment SDK failed to load");
//           setProcessing(false);
//           setLoadingPaymentMetaLocal(false);
//           if (placeholder) placeholder.close();
//           return;
//         }
//         console.log("[PaymentSection] Razorpay script loaded (runtime)");
//       } else {
//         console.log("[PaymentSection] Razorpay script already loaded (flag)");
//       }

//       // 1) create order on backend
//       console.log("[PaymentSection] Creating order on backend...");
//       const itemsPayload = (cart || []).map((item: any) => ({
//         product_id: item.product_id ?? item.id,
//         quantity: item.quantity ?? 1,
//       }));

//       const orderReqPayload = {
//          items: itemsPayload,
//          pay_amount: safeNumber(totalAmount),
//          coupon_code: "",
//          mhc_points: safeNumber(appliedMhcPoints), // ✅ ADD
//          notes: { delivery_date: selectedDate },
//       };

//       console.log("[PaymentSection] create-order payload:", orderReqPayload);

//       const res = await fetch(CREATE_ORDER_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify(orderReqPayload),
//       });

//       const createData = await res.json().catch((e) => {
//         console.error("[PaymentSection] create-order response parse failed", e);
//         return null;
//       });

//       console.log("[PaymentSection] create-order response:", res.status, createData);

//       if (!res.ok || !createData || !createData.order_id) {
//         console.error("[PaymentSection] order create failed", createData);
//         toast.error("Order creation failed");
//         setProcessing(false);
//         setLoadingPaymentMetaLocal(false);
//         if (placeholder) placeholder.close();
//         return;
//       }

//       // Build Razorpay options
//       const options = {
//         key: createData.key_id,
//         amount: createData.amount,
//         currency: createData.currency ?? "INR",
//         name: "GRASA",
//         description: "Order Payment",
//         order_id: createData.order_id,
//         handler: async (response: any) => {
//           console.log("[PaymentSection] Razorpay handler called with response:", response);
//           try {
//             setProcessing(true);

//             // 2) confirm payment with backend (transaction record)
//             const paymentConfirmPayload = {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               paid_amount: createData.amount,
//             };

//             console.log("[PaymentSection] confirming payment payload:", paymentConfirmPayload);

//             const confirmRes = await fetch(CONFIRM_PAYMENT_URL, {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 ...(token ? { Authorization: `Bearer ${token}` } : {}),
//               },
//               body: JSON.stringify(paymentConfirmPayload),
//             });

//             const confirmData = await confirmRes.json().catch((e) => {
//               console.error("[PaymentSection] confirm payment parse failed", e);
//               return null;
//             });

//             console.log("[PaymentSection] confirm payment response:", confirmRes.status, confirmData);

//             if (!confirmRes.ok || !confirmData || !confirmData.transaction_id) {
//               console.error("[PaymentSection] confirm payment failed", confirmData);
//               toast.error("Payment confirmed but saving transaction failed");
//               setProcessing(false);
//               setLoadingPaymentMetaLocal(false);
//               return;
//             }

//             const txnId = confirmData.transaction_id;
//             console.log("[PaymentSection] transaction id:", txnId);

//             // 3) save order to shop/orders
//             const finalOrderPayload = {
//               cart_id: cartId ?? 0,
//               paid_amount: createData.amount,
//               shipping_address_id: selectedAddressId ?? 0,
//               coupon_code: "",
//               currency: createData.currency ?? "INR",
//               notes: `delivery_date:${selectedDate}`,
//               source: "GRASAFOODS",
//               payment_transaction_id: txnId,
//               items: (cart || []).map((c: any) => ({
//                 product_id: c.product_id ?? c.id,
//                 quantity: c.quantity ?? 1,
//                 unit_price: safeNumber(c.effective_price ?? c.price).toString(),
//                 paid_amount: safeNumber(c.effective_price ?? c.price).toString(),
//               })),
//             };

//             console.log("[PaymentSection] saving final order payload:", finalOrderPayload);

//             const saveRes = await fetch(SAVE_ORDER_URL, {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 ...(token ? { Authorization: `Bearer ${token}` } : {}),
//               },
//               body: JSON.stringify(finalOrderPayload),
//             });

//             const saveData = await saveRes.json().catch(() => null);
//             console.log("[PaymentSection] save order response:", saveRes.status, saveData);

//             if (!saveRes.ok) {
//               console.error("[PaymentSection] save order failed", saveData);
//               toast.error("Payment succeeded but creating order failed");
//               setProcessing(false);
//               setLoadingPaymentMetaLocal(false);
//               return;
//             }

//             // final success
//             console.log("[PaymentSection] Order created successfully:", saveData);
//             setOrderSuccess(true);
//             clearCart();
//             try {
//               await refreshCart();
//             } catch (e) {
//               console.warn("[PaymentSection] refreshCart failed:", e);
//             }
//             setProcessing(false);
//             setLoadingPaymentMetaLocal(false);
//           } catch (err) {
//             console.error("[PaymentSection] error in razorpay handler:", err);
//             toast.error("Failed to finalize order after payment");
//             setProcessing(false);
//             setLoadingPaymentMetaLocal(false);
//           }
//         },
//         modal: {
//             escape: true,
//             ondismiss: () => {
//                 console.log("[PaymentSection] Razorpay popup manually closed");
//                 toast.error("Payment cancelled");
//                 setProcessing(false);
//                 setLoadingPaymentMetaLocal(false);
//             },
//         },
//       };

//       console.log("[PaymentSection] Razorpay options prepared:", options);

//       // Create and open Razorpay modal
//       try {
//         const R = (window as any).Razorpay;
//         if (!R) {
//           console.error("[PaymentSection] Razorpay object missing even after script load");
//           toast.error("Payment SDK not available");
//           setProcessing(false);
//           setLoadingPaymentMetaLocal(false);
//           if (placeholder) placeholder.close();
//           return;
//         }

//         const rzp = new R(options);

//         // attach event listeners for debug (if available)
//         try {
//             rzp.on && rzp.on("payment.failed", (err: any) => {
//                 console.error("[PaymentSection] payment.failed event:", err);
//                 toast.error("Payment was cancelled.");
//                 // Reset UI states
//                 setProcessing(false);
//                 setLoadingPaymentMetaLocal(false);

//                 // Close placeholder if still open
//                 try {
//                 if (placeholder && !placeholder.closed) {
//                     placeholder.close();
//                 }
//                 } catch {}
//             });
//         } catch (e) {
//             console.warn("Failed registering payment.failed handler", e);
//         }

//         // Slightly delay open to ensure placeholder window exists in gesture context,
//         // but we call open synchronously here (still inside async function).
//         console.log("[PaymentSection] Opening Razorpay modal now...");
//         rzp.open();

//         // Close placeholder if any (some browsers need a short timeout)
//         setTimeout(() => {
//           try {
//             if (placeholder && !placeholder.closed) {
//               placeholder.close();
//               console.log("[PaymentSection] placeholder window closed");
//             }
//           } catch (e) {
//             console.warn("[PaymentSection] closing placeholder failed", e);
//           }
//         }, 500);
//       } catch (err) {
//         console.error("[PaymentSection] Failed to open Razorpay modal:", err);
//         toast.error("Failed to open payment modal");
//         setProcessing(false);
//         setLoadingPaymentMetaLocal(false);
//         if (placeholder) placeholder.close();
//       }
//     } catch (err) {
//       console.error("[PaymentSection] Pay flow error:", err);
//       toast.error("Payment failed");
//       setProcessing(false);
//       setLoadingPaymentMetaLocal(false);
//       if (placeholder) placeholder.close();
//     }
//   }, [
//     cart,
//     totalAmount,
//     token,
//     selectedAddressId,
//     selectedDate,
//     cartId,
//     setProcessing,
//     clearCart,
//     refreshCart,
//     setOrderSuccess,
//     razorScriptLoaded,
//   ]);

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
//       {/* ADDED THE TOASTER COMPONENT HERE */}
//       {/* <Toaster position="top-center" reverseOrder={false} /> */}
//       <Toaster
//           position="bottom-right"
//           toastOptions={{
//             duration: 2500,
//             style: {
//               background: "#1f2937",
//               color: "#fff",
//               borderRadius: "10px",
//             },
//           }}
//           reverseOrder={false}
//         />

//       <div className="flex items-center gap-3 mb-4">
//         <div className="rounded-full bg-green-50 p-3">
//           <ShieldCheck className="text-green-600" size={22} />
//         </div>
//         <div>
//           <h2 className="text-lg font-bold">Order Summary</h2>
//           <p className="text-sm text-gray-500">Review items and pay securely</p>
//         </div>
//       </div>

//       <div className="mb-4">
//         <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
//           <Package /> Items{" "}
//           <span className="text-xs text-gray-500">({(cart || []).length})</span>
//         </h3>
//         <div className="space-y-3 max-h-64 overflow-auto pr-2">
//           {(cart || []).map((item: any, idx: number) => {
//             const name =
//               item.name ?? item.title ?? item.product_name ?? `Product #${item.id}`;
//             const qty = item.quantity ?? 1;
//             const price = Number(item.effective_price ?? item.price ?? 0);
//             const lineTotal = qty * price;
//             return (
//               <div key={idx} className="flex items-center gap-4 border rounded p-3">
//                 <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
//                   {item.image_url ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img src={item.image_url} alt={name} className="w-full h-full object-cover" />
//                   ) : (
//                     <div className="text-sm text-gray-500">No Image</div>
//                   )}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="font-semibold text-gray-800 truncate">{name}</div>
//                   <div className="text-sm text-gray-600 truncate">Qty: {qty} × ₹{price.toFixed(2)}</div>
//                 </div>

//                 <div className="text-right">
//                   <div className="font-bold">₹{lineTotal.toFixed(2)}</div>
//                   <div className="text-xs text-gray-500">Unit: ₹{price.toFixed(2)}</div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="border-t pt-4">
//         <div className="text-sm text-gray-800 font-medium space-y-1">
//           <div className="flex justify-between">
//             <span className="font-bold">Subtotal</span>
//             <span>₹{basePrice.toFixed(2)}</span>
//           </div>

//           <div className="flex justify-between border-b pb-2 mb-2">
//             <span className="font-bold flex items-center gap-1 text-gray-800">
//               {/* <Coins className="w-4 h-4" /> */}
//               Applied MHC Points
//             </span>
//             <span className="text-gray-800">
//               -🪙{appliedMhcPoints.toFixed(2)}
//             </span>
//           </div>

//           <div className="flex justify-between font-bold text-gray-900 mt-1 text-xl">
//             <span>Total</span>
//             <span>₹{totalAmount.toFixed(2)}</span>
//           </div>
//           <p className="text-sm text-green-700 font-semibold mt-1">
//             You saved ₹{appliedMhcPoints.toFixed(2)} on this order 🎉
//           </p>
//         </div>

//         <div className="mt-4">
//           <Button
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg"
//             onClick={handlePayNow}
//             disabled={processing || loadingPaymentMetaLocal}
//           >
//             {processing ? "Processing..." : "Pay Now"}
//           </Button>
//         </div>

//         <div className="mt-3 text-xs text-gray-400 text-center">
//           Secure payment processed by Razorpay. If you face issues, open browser console (F12) to inspect logs.
//         </div>
//       </div>
//     </div>
//   );
// }









// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { ShieldCheck, Package, CalendarDays } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { BASE_URL } from "@/components/config/api";

// const CREATE_ORDER_URL = `${BASE_URL}/g/payment/products/create-order`;
// const CONFIRM_PAYMENT_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
// const SAVE_ORDER_URL = `${BASE_URL}/grasa/shop/orders`;

// const safeNumber = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// function formatDate(iso: string) {
//   if (!iso) return null;
//   const d = new Date(iso);
//   if (isNaN(d.getTime())) return iso;
//   return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "short", day: "numeric" });
// }

// export default function PaymentSection(props: {
//   token: string | null;
//   cart: any[];
//   totalAmount: number;
//   basePrice: number;
//   appliedMhcPoints: number;
//   selectedAddressId: number | null;
//   selectedDate: string;
//   cartId: number | null;
//   setCartId: (id: number | null) => void;
//   setOrderSuccess: (v: boolean) => void;
//   clearCart: () => void;
//   refreshCart: () => Promise<void> | void;
//   processing: boolean;
//   setProcessing: (v: boolean) => void;
// }) {
//   const {
//     token, cart, totalAmount, basePrice, appliedMhcPoints,
//     selectedAddressId, selectedDate, cartId,
//     setCartId, setOrderSuccess, clearCart, refreshCart,
//     processing, setProcessing,
//   } = props;

//   const [loadingLocal, setLoadingLocal] = useState(false);
//   const [razorScriptLoaded, setRazorScriptLoaded] = useState(false);

//   useEffect(() => {
//     if ((window as any).Razorpay) { setRazorScriptLoaded(true); return; }
//     const s = document.createElement("script");
//     s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.async = true;
//     s.onload = () => setRazorScriptLoaded(true);
//     document.body.appendChild(s);
//   }, []);

//   const loadRazorpayScript = () =>
//     new Promise<boolean>((resolve) => {
//       if ((window as any).Razorpay) return resolve(true);
//       const s = document.createElement("script");
//       s.src = "https://checkout.razorpay.com/v1/checkout.js";
//       s.onload = () => resolve(true);
//       s.onerror = () => resolve(false);
//       document.body.appendChild(s);
//     });

//   const handlePayNow = useCallback(async () => {
//     if (!selectedAddressId) { toast.error("Please select a delivery address"); return; }
//     if (!selectedDate) { toast.error("Please pick a delivery date"); return; }

//     setProcessing(true);
//     setLoadingLocal(true);

//     let placeholder: Window | null = null;
//     try {
//       placeholder = window.open("", "rzp_ph", "width=100,height=100,left=0,top=0");
//     } catch {}

//     try {
//       if (!razorScriptLoaded) {
//         const ok = await loadRazorpayScript();
//         if (!ok) {
//           toast.error("Payment SDK failed to load");
//           setProcessing(false); setLoadingLocal(false);
//           placeholder?.close();
//           return;
//         }
//       }

//       const itemsPayload = (cart || []).map((item: any) => ({
//         product_id: item.product_id ?? item.id,
//         quantity: item.quantity ?? 1,
//       }));

//       const orderReqPayload = {
//         items: itemsPayload,
//         pay_amount: safeNumber(totalAmount),
//         coupon_code: "",
//         mhc_points: safeNumber(appliedMhcPoints),
//         notes: { delivery_date: selectedDate },
//       };

//       const res = await fetch(CREATE_ORDER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify(orderReqPayload),
//       });

//       const createData = await res.json().catch(() => null);

//       if (!res.ok || !createData?.order_id) {
//         toast.error("Order creation failed");
//         setProcessing(false); setLoadingLocal(false);
//         placeholder?.close();
//         return;
//       }

//       const options = {
//         key: createData.key_id,
//         amount: createData.amount,
//         currency: createData.currency ?? "INR",
//         name: "GRASA",
//         description: "Order Payment",
//         order_id: createData.order_id,
//         handler: async (response: any) => {
//           try {
//             setProcessing(true);

//             const confirmRes = await fetch(CONFIRM_PAYMENT_URL, {
//               method: "POST",
//               headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//               body: JSON.stringify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 paid_amount: createData.amount,
//               }),
//             });

//             const confirmData = await confirmRes.json().catch(() => null);

//             if (!confirmRes.ok || !confirmData?.transaction_id) {
//               toast.error("Payment confirmed but transaction save failed");
//               setProcessing(false); setLoadingLocal(false);
//               return;
//             }

//             const saveRes = await fetch(SAVE_ORDER_URL, {
//               method: "POST",
//               headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//               body: JSON.stringify({
//                 cart_id: cartId ?? 0,
//                 paid_amount: createData.amount,
//                 shipping_address_id: selectedAddressId ?? 0,
//                 coupon_code: "",
//                 currency: createData.currency ?? "INR",
//                 notes: `delivery_date:${selectedDate}`,
//                 source: "GRASAFOODS",
//                 payment_transaction_id: confirmData.transaction_id,
//                 items: (cart || []).map((c: any) => ({
//                   product_id: c.product_id ?? c.id,
//                   quantity: c.quantity ?? 1,
//                   unit_price: safeNumber(c.effective_price ?? c.price).toString(),
//                   paid_amount: safeNumber(c.effective_price ?? c.price).toString(),
//                 })),
//               }),
//             });

//             const saveData = await saveRes.json().catch(() => null);

//             if (!saveRes.ok) {
//               toast.error("Payment succeeded but order creation failed");
//               setProcessing(false); setLoadingLocal(false);
//               return;
//             }

//             setOrderSuccess(true);
//             clearCart();
//             try { await refreshCart(); } catch {}
//             setProcessing(false); setLoadingLocal(false);
//           } catch (err) {
//             toast.error("Failed to finalize order");
//             setProcessing(false); setLoadingLocal(false);
//           }
//         },
//         modal: {
//           escape: true,
//           ondismiss: () => {
//             toast.error("Payment cancelled");
//             setProcessing(false); setLoadingLocal(false);
//           },
//         },
//       };

//       const R = (window as any).Razorpay;
//       if (!R) {
//         toast.error("Payment SDK not available");
//         setProcessing(false); setLoadingLocal(false);
//         placeholder?.close();
//         return;
//       }

//       const rzp = new R(options);
//       try {
//         rzp.on?.("payment.failed", () => {
//           toast.error("Payment failed");
//           setProcessing(false); setLoadingLocal(false);
//           try { if (placeholder && !placeholder.closed) placeholder.close(); } catch {}
//         });
//       } catch {}

//       rzp.open();
//       setTimeout(() => {
//         try { if (placeholder && !placeholder.closed) placeholder.close(); } catch {}
//       }, 500);
//     } catch (err) {
//       toast.error("Payment failed");
//       setProcessing(false); setLoadingLocal(false);
//       placeholder?.close();
//     }
//   }, [cart, totalAmount, appliedMhcPoints, token, selectedAddressId, selectedDate, cartId,
//       setProcessing, clearCart, refreshCart, setOrderSuccess, razorScriptLoaded]);

//   const isReady = selectedAddressId && selectedDate && !processing && !loadingLocal;
//   const displayDate = formatDate(selectedDate);

//   return (
//     <div style={{
//       background: "#fff", borderRadius: 12,
//       border: "0.5px solid #e5e5e0", padding: 20,
//       position: "sticky", top: 20,
//     }}>
//       <Toaster
//         position="bottom-right"
//         toastOptions={{
//           duration: 2500,
//           style: { background: "#1b1b1b", color: "#fff", borderRadius: 10 },
//         }}
//       />

//       {/* Header */}
//       <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: "0.5px solid #e5e5e0" }}>
//         <div style={{
//           width: 36, height: 36, borderRadius: "50%",
//           background: "#f0fce8", display: "flex", alignItems: "center", justifyContent: "center",
//         }}>
//           <ShieldCheck size={18} style={{ color: "#3d7a1a" }} />
//         </div>
//         <div>
//           <div style={{ fontSize: 15, fontWeight: 500 }}>Order summary</div>
//           <div style={{ fontSize: 12, color: "#888" }}>Review &amp; pay securely</div>
//         </div>
//       </div>

//       {/* Items */}
//       <div style={{ marginBottom: 16 }}>
//         <div style={{
//           display: "flex", alignItems: "center", gap: 6,
//           fontSize: 13, fontWeight: 500, color: "#5c5c5c",
//           marginBottom: 10,
//         }}>
//           <Package size={14} />
//           Items ({(cart || []).length})
//         </div>

//         <div style={{ maxHeight: 220, overflowY: "auto" }}>
//           {(cart || []).map((item: any, idx: number) => {
//             const name = item.name ?? item.title ?? item.product_name ?? `Product #${item.id}`;
//             const qty = item.quantity ?? 1;
//             const price = Number(item.effective_price ?? item.price ?? 0);
//             return (
//               <div key={idx} style={{
//                 display: "flex", gap: 10, alignItems: "center",
//                 padding: "8px 0", borderBottom: "0.5px solid #f0f0e8",
//               }}>
//                 <div style={{
//                   width: 44, height: 44, borderRadius: 8,
//                   background: "#f9f8f4", flexShrink: 0, overflow: "hidden",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>
//                   {item.image_url
//                     ? <img src={item.image_url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                     : <span style={{ fontSize: 20 }}>🥗</span>
//                   }
//                 </div>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
//                   <div style={{ fontSize: 12, color: "#888" }}>Qty: {qty} × ₹{price.toFixed(2)}</div>
//                 </div>
//                 <div style={{ fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
//                   ₹{(qty * price).toFixed(2)}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Pricing */}
//       <div style={{ paddingTop: 12, borderTop: "0.5px solid #e5e5e0" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#5c5c5c", marginBottom: 6 }}>
//           <span>Subtotal</span>
//           <span>₹{basePrice.toFixed(2)}</span>
//         </div>

//         {appliedMhcPoints > 0 && (
//           <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#3d7a1a", marginBottom: 6 }}>
//             <span>MHC points</span>
//             <span>-🪙 {appliedMhcPoints.toFixed(2)}</span>
//           </div>
//         )}

//         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 500, paddingTop: 10, marginTop: 4, borderTop: "0.5px solid #e5e5e0" }}>
//           <span>Total</span>
//           <span>₹{totalAmount.toFixed(2)}</span>
//         </div>

//         {appliedMhcPoints > 0 && (
//           <div style={{
//             background: "#f0fce8", color: "#2d6a0e",
//             borderRadius: 20, fontSize: 12, padding: "5px 12px",
//             marginTop: 10, display: "inline-block", fontWeight: 500,
//           }}>
//             You saved ₹{appliedMhcPoints.toFixed(2)} on this order
//           </div>
//         )}
//       </div>

//       {/* Delivery date in summary */}
//       <div style={{
//         background: displayDate ? "#f8fce8" : "#f9f8f4",
//         border: `0.5px solid ${displayDate ? "#c5d82d88" : "#e5e5e0"}`,
//         borderRadius: 10, padding: "12px 14px", margin: "16px 0",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5c8a1e", fontWeight: 500, marginBottom: 4 }}>
//           <CalendarDays size={13} /> Delivery date
//         </div>
//         {displayDate
//           ? <div style={{ fontSize: 13, fontWeight: 500, color: "#2d4a10" }}>{displayDate}</div>
//           : <div style={{ fontSize: 13, color: "#999", fontStyle: "italic" }}>Not selected — choose in Step 2</div>
//         }
//       </div>

//       {/* Pay button */}
//       <button
//         onClick={handlePayNow}
//         disabled={!isReady}
//         style={{
//           width: "100%", background: isReady ? "#C5D82D" : "#e5e5e0",
//           border: "none", borderRadius: 10,
//           padding: 14, fontSize: 15, fontWeight: 500,
//           cursor: isReady ? "pointer" : "not-allowed",
//           color: isReady ? "#1b1b1b" : "#999",
//           transition: "all 0.15s",
//         }}
//       >
//         {processing ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)} securely`}
//       </button>

//       {!selectedAddressId && (
//         <p style={{ fontSize: 12, color: "#c0392b", textAlign: "center", marginTop: 8 }}>
//           Select a delivery address to continue
//         </p>
//       )}
//       {selectedAddressId && !selectedDate && (
//         <p style={{ fontSize: 12, color: "#c0392b", textAlign: "center", marginTop: 8 }}>
//           Select a delivery date to continue
//         </p>
//       )}

//       <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 10 }}>
//         Protected by Razorpay · 256-bit SSL encryption
//       </div>
//     </div>
//   );
// }













"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Package, CalendarDays, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "@/components/config/api";

const CREATE_ORDER_URL = `${BASE_URL}/g/payment/products/create-order`;
const CONFIRM_PAYMENT_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
const SAVE_ORDER_URL = `${BASE_URL}/grasa/shop/orders`;

const safeNumber = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

function formatDate(iso: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
}

export default function PaymentSection(props: {
  token: string | null;
  cart: any[];
  totalAmount: number;
  basePrice: number;
  appliedMhcPoints: number;
  selectedAddressId: number | null;
  selectedDate: string;
  cartId: number | null;
  setCartId: (id: number | null) => void;
  setOrderSuccess: (v: boolean) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void> | void;
  processing: boolean;
  setProcessing: (v: boolean) => void;
}) {
  const {
    token, cart, totalAmount, basePrice, appliedMhcPoints,
    selectedAddressId, selectedDate, cartId,
    setCartId, setOrderSuccess, clearCart, refreshCart,
    processing, setProcessing,
  } = props;

  const [loadingLocal, setLoadingLocal] = useState(false);
  const [razorScriptLoaded, setRazorScriptLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if ((window as any).Razorpay) { setRazorScriptLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => setRazorScriptLoaded(true);
    document.body.appendChild(s);
  }, []);

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePayNow = useCallback(async () => {
    if (!selectedAddressId) { toast.error("Please select a delivery address"); return; }
    if (!selectedDate) { toast.error("Please pick a delivery date"); return; }

    setProcessing(true);
    setLoadingLocal(true);

    let placeholder: Window | null = null;
    try {
      placeholder = window.open("", "rzp_ph", "width=100,height=100,left=0,top=0");
    } catch {}

    try {
      if (!razorScriptLoaded) {
        const ok = await loadRazorpayScript();
        if (!ok) {
          toast.error("Payment SDK failed to load");
          setProcessing(false); setLoadingLocal(false);
          placeholder?.close();
          return;
        }
      }

      const itemsPayload = (cart || []).map((item: any) => ({
        product_id: item.product_id ?? item.id,
        quantity: item.quantity ?? 1,
      }));

      const orderReqPayload = {
        items: itemsPayload,
        pay_amount: safeNumber(totalAmount),
        coupon_code: "",
        mhc_points: safeNumber(appliedMhcPoints),
        notes: { delivery_date: selectedDate },
      };

      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(orderReqPayload),
      });

      const createData = await res.json().catch(() => null);

      if (!res.ok || !createData?.order_id) {
        toast.error("Order creation failed");
        setProcessing(false); setLoadingLocal(false);
        placeholder?.close();
        return;
      }

      const options = {
        key: createData.key_id,
        amount: createData.amount,
        currency: createData.currency ?? "INR",
        name: "GRASA",
        description: "Order Payment",
        order_id: createData.order_id,
        handler: async (response: any) => {
          try {
            setProcessing(true);

            const confirmRes = await fetch(CONFIRM_PAYMENT_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paid_amount: createData.amount,
              }),
            });

            const confirmData = await confirmRes.json().catch(() => null);

            if (!confirmRes.ok || !confirmData?.transaction_id) {
              toast.error("Payment confirmed but transaction save failed");
              setProcessing(false); setLoadingLocal(false);
              return;
            }

            const saveRes = await fetch(SAVE_ORDER_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              body: JSON.stringify({
                cart_id: cartId ?? 0,
                paid_amount: createData.amount,
                shipping_address_id: selectedAddressId ?? 0,
                coupon_code: "",
                currency: createData.currency ?? "INR",
                notes: `delivery_date:${selectedDate}`,
                source: "GRASAFOODS",
                payment_transaction_id: confirmData.transaction_id,
                items: (cart || []).map((c: any) => ({
                  product_id: c.product_id ?? c.id,
                  quantity: c.quantity ?? 1,
                  unit_price: safeNumber(c.effective_price ?? c.price).toString(),
                  paid_amount: safeNumber(c.effective_price ?? c.price).toString(),
                })),
              }),
            });

            const saveData = await saveRes.json().catch(() => null);

            if (!saveRes.ok) {
              toast.error("Payment succeeded but order creation failed");
              setProcessing(false); setLoadingLocal(false);
              return;
            }

            setOrderSuccess(true);
            clearCart();
            try { await refreshCart(); } catch {}
            setProcessing(false); setLoadingLocal(false);
          } catch (err) {
            toast.error("Failed to finalize order");
            setProcessing(false); setLoadingLocal(false);
          }
        },
        modal: {
          escape: true,
          ondismiss: () => {
            toast.error("Payment cancelled");
            setProcessing(false); setLoadingLocal(false);
          },
        },
      };

      const R = (window as any).Razorpay;
      if (!R) {
        toast.error("Payment SDK not available");
        setProcessing(false); setLoadingLocal(false);
        placeholder?.close();
        return;
      }

      const rzp = new R(options);
      try {
        rzp.on?.("payment.failed", () => {
          toast.error("Payment failed");
          setProcessing(false); setLoadingLocal(false);
          try { if (placeholder && !placeholder.closed) placeholder.close(); } catch {}
        });
      } catch {}

      rzp.open();
      setTimeout(() => {
        try { if (placeholder && !placeholder.closed) placeholder.close(); } catch {}
      }, 500);
    } catch (err) {
      toast.error("Payment failed");
      setProcessing(false); setLoadingLocal(false);
      placeholder?.close();
    }
  }, [cart, totalAmount, appliedMhcPoints, token, selectedAddressId, selectedDate, cartId,
      setProcessing, clearCart, refreshCart, setOrderSuccess, razorScriptLoaded]);

  const isReady = selectedAddressId && selectedDate && !processing && !loadingLocal;
  const displayDate = formatDate(selectedDate);

  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      border: "0.5px solid #e5e5e0", padding: isMobile ? "16px" : "20px",
      position: isMobile ? "relative" : "sticky", top: isMobile ? "auto" : 20,
      marginBottom: isMobile ? "12px" : "0",
    }}>
      <Toaster
        position={isMobile ? "top-center" : "bottom-right"}
        toastOptions={{
          duration: 2500,
          style: { background: "#1b1b1b", color: "#fff", borderRadius: 10 },
        }}
      />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: isMobile ? "8px" : "10px",
        marginBottom: 16, paddingBottom: 12, borderBottom: "0.5px solid #e5e5e0",
        flexWrap: "wrap",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#f0fce8", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <ShieldCheck size={18} style={{ color: "#3d7a1a" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: 600 }}>Order summary</div>
          <div style={{ fontSize: 12, color: "#888" }}>Review &amp; pay securely</div>
        </div>
      </div>

      {/* Items */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 13, fontWeight: 600, color: "#5c5c5c",
          marginBottom: 10,
        }}>
          <Package size={14} />
          Items ({(cart || []).length})
        </div>

        <div style={{ maxHeight: isMobile ? "200px" : "220px", overflowY: "auto" }}>
          {(cart || []).map((item: any, idx: number) => {
            const name = item.name ?? item.title ?? item.product_name ?? `Product #${item.id}`;
            const qty = item.quantity ?? 1;
            const price = Number(item.effective_price ?? item.price ?? 0);
            return (
              <div key={idx} style={{
                display: "flex", gap: isMobile ? "8px" : "10px", alignItems: "flex-start",
                padding: "8px 0", borderBottom: "0.5px solid #f0f0e8",
              }}>
                <div style={{
                  width: isMobile ? "40px" : "44px", height: isMobile ? "40px" : "44px",
                  borderRadius: 8,
                  background: "#f9f8f4", flexShrink: 0, overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: 18 }}>🥗</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>Qty: {qty} × ₹{price.toFixed(2)}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
                  ₹{(qty * price).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ paddingTop: 12, borderTop: "0.5px solid #e5e5e0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#5c5c5c", marginBottom: 6 }}>
          <span>Subtotal</span>
          <span>₹{basePrice.toFixed(2)}</span>
        </div>

        {appliedMhcPoints > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#3d7a1a", marginBottom: 6 }}>
            <span>MHC points</span>
            <span>-🪙 {appliedMhcPoints.toFixed(2)}</span>
          </div>
        )}

        <div style={{
          display: "flex", justifyContent: "space-between", fontSize: isMobile ? "15px" : "16px",
          fontWeight: 600, paddingTop: 10, marginTop: 4, borderTop: "0.5px solid #e5e5e0",
        }}>
          <span>Total</span>
          <span style={{ color: "#C5D82D" }}>₹{totalAmount.toFixed(2)}</span>
        </div>

        {appliedMhcPoints > 0 && (
          <div style={{
            background: "#f0fce8", color: "#2d6a0e",
            borderRadius: 20, fontSize: 12, padding: "6px 12px",
            marginTop: 10, display: "inline-block", fontWeight: 500,
          }}>
            You saved ₹{appliedMhcPoints.toFixed(2)} on this order
          </div>
        )}
      </div>

      {/* Delivery date in summary */}
      <div style={{
        background: displayDate ? "#f8fce8" : "#f9f8f4",
        border: `0.5px solid ${displayDate ? "#c5d82d88" : "#e5e5e0"}`,
        borderRadius: 10, padding: "12px 14px", margin: "16px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5c8a1e", fontWeight: 600, marginBottom: 4 }}>
          <CalendarDays size={13} /> Delivery date
        </div>
        {displayDate
          ? <div style={{ fontSize: 13, fontWeight: 500, color: "#2d4a10" }}>{displayDate}</div>
          : <div style={{ fontSize: 13, color: "#999", fontStyle: "italic" }}>Not selected — choose in Step 2</div>
        }
      </div>

      {/* Pay button */}
      <button
        onClick={handlePayNow}
        disabled={!isReady}
        style={{
          width: "100%", background: isReady ? "#C5D82D" : "#e5e5e0",
          border: "none", borderRadius: 10,
          padding: isMobile ? "12px 14px" : "14px", fontSize: isMobile ? "14px" : "15px", fontWeight: 600,
          cursor: isReady ? "pointer" : "not-allowed",
          color: isReady ? "#1b1b1b" : "#999",
          transition: "all 0.15s",
        }}
      >
        {processing ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)} securely`}
      </button>

      {!selectedAddressId && (
        <p style={{ fontSize: 12, color: "#c0392b", textAlign: "center", marginTop: 8 }}>
          Select a delivery address to continue
        </p>
      )}
      {selectedAddressId && !selectedDate && (
        <p style={{ fontSize: 12, color: "#c0392b", textAlign: "center", marginTop: 8 }}>
          Select a delivery date to continue
        </p>
      )}

      <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <Lock size={12} /> Protected by Razorpay · 256-bit SSL
      </div>
    </div>
  );
}
