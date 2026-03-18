// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { ShieldCheck, Package, Coins } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import toast, { Toaster } from "react-hot-toast";

// const CREATE_ORDER_URL = "https://medicaps.cloud/g/payment/products/create-order";
// const CONFIRM_PAYMENT_URL =
//   "https://medicaps.cloud/grasa/shop/payments/gr/confirm";
// const SAVE_ORDER_URL = "https://medicaps.cloud/grasa/shop/orders";

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
//       toast.success("Please select delivery date")
//       console.log("[PaymentSection] No delivery date selected");
//       toast.error("Please pick a delivery date");
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
//           pay_amount: safeNumber(totalAmount),
//           coupon_code: "",
//           mhc_points: safeNumber(appliedMhcPoints), // ✅ ADD
//           notes: { delivery_date: selectedDate },
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
//         name: "GRASA Super Foods",
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
//             },

//         // Optional debug callback for failures (Razorpay emits events too)
//         // Note: Razorpay offers 'prefill' and 'theme' fields if needed
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
//             } catch (e) {
//             console.warn("Failed registering payment.failed handler", e);
//             }


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
//  <div className="text-sm text-gray-800 font-medium space-y-1">
//   <div className="flex justify-between">
//     <span className="font-bold">Subtotal</span>
//     <span>₹{basePrice.toFixed(2)}</span>
//   </div>

//   <div className="flex justify-between border-b pb-2 mb-2">
//     <span className="font-bold flex items-center gap-1 text-gray-800">
//       {/* <Coins className="w-4 h-4" /> */}
//       Applied MHC Points
//     </span>
//     <span className="text-gray-800">
//       -🪙{appliedMhcPoints.toFixed(2)}
//     </span>
//   </div>

//   <div className="flex justify-between font-bold text-gray-900 mt-1 text-xl">
//     <span>Total</span>
//     <span>₹{totalAmount.toFixed(2)}</span>
//   </div>
//   <p className="text-sm text-green-700 font-semibold mt-1">
//   You saved ₹{appliedMhcPoints.toFixed(2)} on this order 🎉
// </p>

// </div>

// </div>


//         <div className="mt-4">
//           <Button
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg"
//             onClick={handlePayNow}
//             disabled={processing || loadingPaymentMetaLocal}
//           >
//             {processing ? "Processing..." : "Pay Now"}
//           </Button>
//         </div>

//         <div className="mt-3 text-xs text-gray-400 text-center">Secure payment processed by Razorpay. If you face issues, open browser console (F12) to inspect logs.</div>
//       </div>
//     </div>
//   );
// }





"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Package, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

const CREATE_ORDER_URL = "https://medicaps.cloud/g/payment/products/create-order";
const CONFIRM_PAYMENT_URL =
  "https://medicaps.cloud/grasa/shop/payments/gr/confirm";
const SAVE_ORDER_URL = "https://medicaps.cloud/grasa/shop/orders";

const safeNumber = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export default function PaymentSection(props: {
  token: string | null;
  cart: any[];
  totalAmount: number;
  basePrice: number;        // ✅ ADD THIS
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
    token,
    cart,
    totalAmount,
    appliedMhcPoints, // ✅ ADD
    basePrice,
    selectedAddressId,
    selectedDate,
    cartId,
    setCartId,
    setOrderSuccess,
    clearCart,
    refreshCart,
    processing,
    setProcessing,
  } = props;

  console.log(basePrice)

  const [loadingPaymentMetaLocal, setLoadingPaymentMetaLocal] = useState(false);
  const [razorScriptLoaded, setRazorScriptLoaded] = useState(false);

  // Preload Razorpay script on mount so popup can be opened in the click gesture.
  useEffect(() => {
    console.log("[PaymentSection] mount -> preloading razorpay script");
    if ((window as any).Razorpay) {
      console.log("[PaymentSection] Razorpay already present");
      setRazorScriptLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => {
      console.log("[PaymentSection] Razorpay script loaded");
      setRazorScriptLoaded(true);
    };
    s.onerror = (e) => {
      console.error("[PaymentSection] Razorpay script failed to load", e);
      setRazorScriptLoaded(false);
    };
    document.body.appendChild(s);
    return () => {
      // do not remove script on unmount (safe)
    };
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
    console.log("[PaymentSection] Pay Now clicked");
    if (!selectedAddressId) {
      console.log("[PaymentSection] No address selected");
      toast.error("Please select a delivery address.");
      return;
    }

    if (!selectedDate) {
      console.log("[PaymentSection] No delivery date selected");
      toast.error("Please pick a delivery date.");
      return;
    }

    setProcessing(true);
    setLoadingPaymentMetaLocal(true);

    let placeholder: Window | null = null;
    try {
      placeholder = window.open(
        "",
        "rzp_placeholder_window",
        "width=100,height=100,left=0,top=0"
      );
      if (placeholder) {
        try {
          placeholder.document.title = "Preparing Payment...";
        } catch (e) {
          // cross-origin or blocked access may throw; ignore
        }
        console.log("[PaymentSection] Placeholder window opened for gesture", placeholder);
      } else {
        console.warn("[PaymentSection] Placeholder window could not be opened (popup may be blocked)");
      }
    } catch (err) {
      console.warn("[PaymentSection] error opening placeholder window", err);
    }

    try {
      // Ensure Razorpay script is available (use preloaded flag if possible)
      if (!razorScriptLoaded) {
        console.log("[PaymentSection] Razorpay script not flagged loaded; loading now...");
        const ok = await loadRazorpayScript();
        if (!ok) {
          console.error("[PaymentSection] Razorpay script failed to load at runtime");
          toast.error("Payment SDK failed to load");
          setProcessing(false);
          setLoadingPaymentMetaLocal(false);
          if (placeholder) placeholder.close();
          return;
        }
        console.log("[PaymentSection] Razorpay script loaded (runtime)");
      } else {
        console.log("[PaymentSection] Razorpay script already loaded (flag)");
      }

      // 1) create order on backend
      console.log("[PaymentSection] Creating order on backend...");
      const itemsPayload = (cart || []).map((item: any) => ({
        product_id: item.product_id ?? item.id,
        quantity: item.quantity ?? 1,
      }));

      const orderReqPayload = {
         items: itemsPayload,
         pay_amount: safeNumber(totalAmount),
         coupon_code: "",
         mhc_points: safeNumber(appliedMhcPoints), // ✅ ADD
         notes: { delivery_date: selectedDate },
      };

      console.log("[PaymentSection] create-order payload:", orderReqPayload);

      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderReqPayload),
      });

      const createData = await res.json().catch((e) => {
        console.error("[PaymentSection] create-order response parse failed", e);
        return null;
      });

      console.log("[PaymentSection] create-order response:", res.status, createData);

      if (!res.ok || !createData || !createData.order_id) {
        console.error("[PaymentSection] order create failed", createData);
        toast.error("Order creation failed");
        setProcessing(false);
        setLoadingPaymentMetaLocal(false);
        if (placeholder) placeholder.close();
        return;
      }

      // Build Razorpay options
      const options = {
        key: createData.key_id,
        amount: createData.amount,
        currency: createData.currency ?? "INR",
        name: "GRASA Super Foods",
        description: "Order Payment",
        order_id: createData.order_id,
        handler: async (response: any) => {
          console.log("[PaymentSection] Razorpay handler called with response:", response);
          try {
            setProcessing(true);

            // 2) confirm payment with backend (transaction record)
            const paymentConfirmPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paid_amount: createData.amount,
            };

            console.log("[PaymentSection] confirming payment payload:", paymentConfirmPayload);

            const confirmRes = await fetch(CONFIRM_PAYMENT_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(paymentConfirmPayload),
            });

            const confirmData = await confirmRes.json().catch((e) => {
              console.error("[PaymentSection] confirm payment parse failed", e);
              return null;
            });

            console.log("[PaymentSection] confirm payment response:", confirmRes.status, confirmData);

            if (!confirmRes.ok || !confirmData || !confirmData.transaction_id) {
              console.error("[PaymentSection] confirm payment failed", confirmData);
              toast.error("Payment confirmed but saving transaction failed");
              setProcessing(false);
              setLoadingPaymentMetaLocal(false);
              return;
            }

            const txnId = confirmData.transaction_id;
            console.log("[PaymentSection] transaction id:", txnId);

            // 3) save order to shop/orders
            const finalOrderPayload = {
              cart_id: cartId ?? 0,
              paid_amount: createData.amount,
              shipping_address_id: selectedAddressId ?? 0,
              coupon_code: "",
              currency: createData.currency ?? "INR",
              notes: `delivery_date:${selectedDate}`,
              source: "GRASAFOODS",
              payment_transaction_id: txnId,
              items: (cart || []).map((c: any) => ({
                product_id: c.product_id ?? c.id,
                quantity: c.quantity ?? 1,
                unit_price: safeNumber(c.effective_price ?? c.price).toString(),
                paid_amount: safeNumber(c.effective_price ?? c.price).toString(),
              })),
            };

            console.log("[PaymentSection] saving final order payload:", finalOrderPayload);

            const saveRes = await fetch(SAVE_ORDER_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(finalOrderPayload),
            });

            const saveData = await saveRes.json().catch(() => null);
            console.log("[PaymentSection] save order response:", saveRes.status, saveData);

            if (!saveRes.ok) {
              console.error("[PaymentSection] save order failed", saveData);
              toast.error("Payment succeeded but creating order failed");
              setProcessing(false);
              setLoadingPaymentMetaLocal(false);
              return;
            }

            // final success
            console.log("[PaymentSection] Order created successfully:", saveData);
            setOrderSuccess(true);
            clearCart();
            try {
              await refreshCart();
            } catch (e) {
              console.warn("[PaymentSection] refreshCart failed:", e);
            }
            setProcessing(false);
            setLoadingPaymentMetaLocal(false);
          } catch (err) {
            console.error("[PaymentSection] error in razorpay handler:", err);
            toast.error("Failed to finalize order after payment");
            setProcessing(false);
            setLoadingPaymentMetaLocal(false);
          }
        },
        modal: {
            escape: true,
            ondismiss: () => {
                console.log("[PaymentSection] Razorpay popup manually closed");
                toast.error("Payment cancelled");
                setProcessing(false);
                setLoadingPaymentMetaLocal(false);
            },
        },
      };

      console.log("[PaymentSection] Razorpay options prepared:", options);

      // Create and open Razorpay modal
      try {
        const R = (window as any).Razorpay;
        if (!R) {
          console.error("[PaymentSection] Razorpay object missing even after script load");
          toast.error("Payment SDK not available");
          setProcessing(false);
          setLoadingPaymentMetaLocal(false);
          if (placeholder) placeholder.close();
          return;
        }

        const rzp = new R(options);

        // attach event listeners for debug (if available)
        try {
            rzp.on && rzp.on("payment.failed", (err: any) => {
                console.error("[PaymentSection] payment.failed event:", err);
                toast.error("Payment was cancelled.");
                // Reset UI states
                setProcessing(false);
                setLoadingPaymentMetaLocal(false);

                // Close placeholder if still open
                try {
                if (placeholder && !placeholder.closed) {
                    placeholder.close();
                }
                } catch {}
            });
        } catch (e) {
            console.warn("Failed registering payment.failed handler", e);
        }

        // Slightly delay open to ensure placeholder window exists in gesture context,
        // but we call open synchronously here (still inside async function).
        console.log("[PaymentSection] Opening Razorpay modal now...");
        rzp.open();

        // Close placeholder if any (some browsers need a short timeout)
        setTimeout(() => {
          try {
            if (placeholder && !placeholder.closed) {
              placeholder.close();
              console.log("[PaymentSection] placeholder window closed");
            }
          } catch (e) {
            console.warn("[PaymentSection] closing placeholder failed", e);
          }
        }, 500);
      } catch (err) {
        console.error("[PaymentSection] Failed to open Razorpay modal:", err);
        toast.error("Failed to open payment modal");
        setProcessing(false);
        setLoadingPaymentMetaLocal(false);
        if (placeholder) placeholder.close();
      }
    } catch (err) {
      console.error("[PaymentSection] Pay flow error:", err);
      toast.error("Payment failed");
      setProcessing(false);
      setLoadingPaymentMetaLocal(false);
      if (placeholder) placeholder.close();
    }
  }, [
    cart,
    totalAmount,
    token,
    selectedAddressId,
    selectedDate,
    cartId,
    setProcessing,
    clearCart,
    refreshCart,
    setOrderSuccess,
    razorScriptLoaded,
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      {/* ADDED THE TOASTER COMPONENT HERE */}
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "10px",
            },
          }}
          reverseOrder={false}
        />

      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-full bg-green-50 p-3">
          <ShieldCheck className="text-green-600" size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold">Order Summary</h2>
          <p className="text-sm text-gray-500">Review items and pay securely</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Package /> Items{" "}
          <span className="text-xs text-gray-500">({(cart || []).length})</span>
        </h3>
        <div className="space-y-3 max-h-64 overflow-auto pr-2">
          {(cart || []).map((item: any, idx: number) => {
            const name =
              item.name ?? item.title ?? item.product_name ?? `Product #${item.id}`;
            const qty = item.quantity ?? 1;
            const price = Number(item.effective_price ?? item.price ?? 0);
            const lineTotal = qty * price;
            return (
              <div key={idx} className="flex items-center gap-4 border rounded p-3">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm text-gray-500">No Image</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 truncate">{name}</div>
                  <div className="text-sm text-gray-600 truncate">Qty: {qty} × ₹{price.toFixed(2)}</div>
                </div>

                <div className="text-right">
                  <div className="font-bold">₹{lineTotal.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Unit: ₹{price.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="text-sm text-gray-800 font-medium space-y-1">
          <div className="flex justify-between">
            <span className="font-bold">Subtotal</span>
            <span>₹{basePrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between border-b pb-2 mb-2">
            <span className="font-bold flex items-center gap-1 text-gray-800">
              {/* <Coins className="w-4 h-4" /> */}
              Applied MHC Points
            </span>
            <span className="text-gray-800">
              -🪙{appliedMhcPoints.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-bold text-gray-900 mt-1 text-xl">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
          <p className="text-sm text-green-700 font-semibold mt-1">
            You saved ₹{appliedMhcPoints.toFixed(2)} on this order 🎉
          </p>
        </div>

        <div className="mt-4">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg"
            onClick={handlePayNow}
            disabled={processing || loadingPaymentMetaLocal}
          >
            {processing ? "Processing..." : "Pay Now"}
          </Button>
        </div>

        <div className="mt-3 text-xs text-gray-400 text-center">
          Secure payment processed by Razorpay. If you face issues, open browser console (F12) to inspect logs.
        </div>
      </div>
    </div>
  );
}