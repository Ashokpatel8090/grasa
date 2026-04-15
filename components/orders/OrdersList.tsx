
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { BASE_URL } from "@/components/config/api";
// import { 
//   ShoppingBag, 
//   Package, 
//   ChevronRight, 
//   Calendar, 
//   CheckCircle2, 
//   Clock, 
//   Truck, 
//   XCircle 
// } from "lucide-react";

// type Product = {
//   id: number;
//   name: string;
//   image: string;
// };

// type Item = {
//   id: number;
//   quantity: number;
//   price_at_order: string;
//   product: Product;
// };

// type Order = {
//   id: number;
//   order_date: string;
//   status: string;
//   total_amount: string;
//   currency: string;
//   items: Item[];
// };

// export default function OrdersList() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ---------------- COOKIE UTILITY (SSR Safe) ---------------- */
//   const getCookie = (name: string) => {
//     if (typeof document === "undefined") return null;
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return parts.pop()?.split(";").shift() || null;
//     }
//     return null;
//   };

//   /* ---------------- FETCH ORDERS ---------------- */
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = getCookie("token");
//         if (!token) throw new Error("No token found");

//         const res = await fetch(`${BASE_URL}/grasa/shop/orders`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch orders");

//         const data = await res.json();
//         setOrders(data);
//         localStorage.setItem("orders", JSON.stringify(data));
//       } catch (error) {
//         console.error("Orders fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   /* ---------------- STATUS BADGE HELPER ---------------- */
//   const getStatusDisplay = (status: string) => {
//     const s = status.toLowerCase();
//     if (s.includes("deliver")) {
//       return { color: "bg-[#dcfce7] text-green-800 border-[#86efac]", icon: <CheckCircle2 size={14} /> };
//     }
//     if (s.includes("cancel")) {
//       return { color: "bg-[#fee2e2] text-red-700 border-[#fca5a5]", icon: <XCircle size={14} /> };
//     }
//     if (s.includes("ship")) {
//       return { color: "bg-[#e0e7ff] text-indigo-800 border-[#a5b4fc]", icon: <Truck size={14} /> };
//     }
//     return { color: "bg-[#fef08a] text-yellow-800 border-[#fde047]", icon: <Clock size={14} /> };
//   };

//   return (
//     <div className="max-w-[1000px] w-full mx-auto p-4 sm:p-6 md:p-10 font-sans">
      
//       {/* ---------- HEADER ---------- */}
//       <div className="flex items-center gap-4 mb-10">
//         <div className="w-12 h-12 rounded-xl bg-[#C5D82D] shadow-sm flex items-center justify-center shrink-0 text-[#1b1b1b]">
//           <ShoppingBag size={24} />
//         </div>
//         <div>
//           <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b1b1b] tracking-tight">
//             My Orders
//           </h1>
//           <p className="text-[#5c5c5c] mt-1 font-medium">
//             Track, manage, and review your recent purchases.
//           </p>
//         </div>
//       </div>

//       <hr className="border-t border-[#d6d1c4] mb-10" />

//       {/* ---------- LOADING STATE ---------- */}
//       {loading ? (
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="p-4 sm:p-6 border border-[#d6d1c4] rounded-2xl bg-white animate-pulse flex flex-col sm:flex-row items-center gap-6">
//               <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#ebecdf] rounded-xl shrink-0"></div>
//               <div className="flex-1 w-full space-y-3">
//                 <div className="h-5 w-3/4 bg-[#ebecdf] rounded"></div>
//                 <div className="h-4 w-1/3 bg-[#f4f4f2] rounded"></div>
//                 <div className="h-6 w-24 bg-[#f4f4f2] rounded-full mt-2"></div>
//               </div>
//               <div className="hidden sm:block h-8 w-8 bg-[#f4f4f2] rounded-full"></div>
//             </div>
//           ))}
//         </div>
//       ) : orders.length === 0 ? (
//         /* ---------- EMPTY STATE ---------- */
//         <div className="bg-white border border-dashed border-[#d6d1c4] rounded-3xl p-12 text-center flex flex-col items-center gap-4 transition-colors hover:bg-[#ebecdf]">
//           <div className="w-20 h-20 bg-[#f4f4f2] rounded-full flex items-center justify-center text-[#a8a396]">
//             <Package size={40} />
//           </div>
//           <div>
//             <h3 className="text-xl font-bold text-[#1b1b1b]">No orders yet</h3>
//             <p className="text-[#5c5c5c] font-medium mt-2">Looks like you haven't made any purchases.</p>
//           </div>
//           <Link href="/shop" className="mt-4 px-6 py-3 bg-[#C5D82D] text-[#1b1b1b] rounded-xl font-bold shadow-sm hover:bg-[#b5c727] hover:-translate-y-0.5 transition-all">
//             Start Shopping
//           </Link>
//         </div>
//       ) : (
//         /* ---------- ORDERS LIST ---------- */
//         <div className="space-y-5">
//           {orders.map((order) => {
//             const item = order.items?.[0];
//             if (!item) return null; // Safety check in case order has no items

//             const statusConfig = getStatusDisplay(order.status);

//             return (
//               <Link key={order.id} href={`/shop/orders/${order.id}`} className="block group">
//                 <div className="bg-white border border-[#d6d1c4] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:-translate-y-1 hover:shadow-lg hover:border-[#C5D82D] transition-all duration-300 relative overflow-hidden">
                  
//                   {/* Subtle highlight bar on the left */}
//                   <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-transparent group-hover:bg-[#C5D82D] transition-colors"></div>

//                   {/* Product Image */}
//                   <div className="bg-[#f4f4f2] rounded-xl p-2 shrink-0 border border-[#d6d1c4] group-hover:border-[#C5D82D] transition-colors w-full sm:w-auto flex justify-center">
//                     <img
//                       src={item.product.image}
//                       alt={item.product.name}
//                       className="w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-lg mix-blend-multiply"
//                     />
//                   </div>

//                   {/* Order Details */}
//                   <div className="flex-1 min-w-0 w-full flex flex-col gap-2">
//                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
//                       <h3 className="font-extrabold text-[#1b1b1b] text-lg sm:text-xl leading-tight line-clamp-2 group-hover:text-[#9eae24] transition-colors pr-4">
//                         {item.product.name}
//                       </h3>
//                       <div className="flex items-center gap-1.5 text-[#a8a396] text-sm font-semibold shrink-0">
//                         <Calendar size={14} />
//                         {new Date(order.order_date).toLocaleDateString(undefined, { 
//                           year: 'numeric', 
//                           month: 'short', 
//                           day: 'numeric' 
//                         })}
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
//                       <p className="text-[#5c5c5c] font-bold text-sm bg-[#f4f4f2] px-3 py-1 rounded-md border border-[#d6d1c4]">
//                         Qty: {item.quantity}
//                       </p>
//                       <p className="text-[#1b1b1b] font-extrabold text-lg">
//                         ₹{parseFloat(item.price_at_order).toLocaleString()}
//                       </p>
//                     </div>

//                     <div className="mt-2 flex items-center">
//                       <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${statusConfig.color}`}>
//                         {statusConfig.icon}
//                         <span className="uppercase tracking-wider">{order.status}</span>
//                       </span>
//                     </div>
//                   </div>

//                   {/* Action Icon (Visible on larger screens) */}
//                   <div className="hidden sm:flex w-10 h-10 rounded-full bg-[#f4f4f2] items-center justify-center text-[#a8a396] group-hover:bg-[#C5D82D] group-hover:text-[#1b1b1b] transition-colors shrink-0">
//                     <ChevronRight size={20} />
//                   </div>

//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }












"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/components/config/api";
import { 
  ShoppingBag, 
  Package, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  image: string;
};

type Item = {
  id: number;
  quantity: number;
  price_at_order: string;
  product: Product;
};

type Order = {
  id: number;
  order_date: string;
  status: string;
  total_amount: string;
  currency: string;
  items: Item[];
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const primaryBtn: React.CSSProperties = {
  background: "#C5D82D", border: "none", borderRadius: 4,
  padding: "11px 24px", fontSize: 14, fontWeight: 700,
  cursor: "pointer", color: "#1b1b1b", letterSpacing: -0.2,
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  textDecoration: "none"
};

const loadingScreen: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", minHeight: "60vh",
};

export default function OrdersList() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const chk = () => setMobile(window.innerWidth < 768);
    chk(); window.addEventListener("resize", chk); return () => window.removeEventListener("resize", chk);
  }, []);

  /* ---------------- COOKIE UTILITY (SSR Safe) ---------------- */
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getCookie("token");
        if (!token) throw new Error("No token found");

        const res = await fetch(`${BASE_URL}/grasa/shop/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
        localStorage.setItem("orders", JSON.stringify(data));
      } catch (error) {
        console.error("Orders fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ---------------- STATUS BADGE HELPER ---------------- */
  const getStatusDisplay = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("deliver")) {
      return { bg: "#e6f4ea", color: "#1e8e3e", border: "#ceead6", icon: <CheckCircle2 size={13} /> };
    }
    if (s.includes("cancel")) {
      return { bg: "#fce8e6", color: "#d93025", border: "#fad2cf", icon: <XCircle size={13} /> };
    }
    if (s.includes("ship")) {
      return { bg: "#e8f0fe", color: "#1a73e8", border: "#d2e3fc", icon: <Truck size={13} /> };
    }
    return { bg: "#fef7e0", color: "#f9ab00", border: "#fde293", icon: <Clock size={13} /> };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        button, a { font-family: inherit; }
      `}</style>

      {/* ── Top nav (Matched exactly to Checkout & Cart) ────────────────── */}
      {/* <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => router.push("/profile")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13, padding: "6px 0" }}>
            <ArrowLeft size={17} />
            {!isMobile && <span>Profile</span>}
          </button>
          <span style={{ color: "#e0e0e0" }}>|</span>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: -0.4, color: "#1b1b1b" }}>
            GRA<span style={{ color: "#C5D82D" }}>SA</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#aaa" }}>
          <ShoppingBag size={13} style={{ color: "#C5D82D" }} />
          <span>My Orders</span>
        </div>
      </div> */}

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "12px 10px 40px" : "20px 16px 60px" }}>

        {loading ? (
          <div style={loadingScreen}>
            <Loader2 size={32} style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: 10, color: "#888", fontSize: 13 }}>Loading your orders…</p>
          </div>
        ) : orders.length === 0 ? (
          /* ---------- EMPTY STATE ---------- */
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease", marginTop: isMobile ? 0 : 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Package size={28} style={{ color: "#a8a396" }} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1b1b1b", marginBottom: 8 }}>No orders yet</h2>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 24, textAlign: "center" }}>Looks like you haven't made any purchases yet.</p>
            <Link href="/products" style={{ ...primaryBtn, width: "auto" }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          /* ---------- ORDERS LIST ---------- */
          <div style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, overflow: "hidden", animation: "fadeIn 0.2s ease" }}>
            
            {/* Header */}
            <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
                Order History ({orders.length})
              </span>
            </div>

            {/* List */}
            <div>
              {orders.map((order, i) => {
                const item = order.items?.[0];
                if (!item) return null;

                const statusConfig = getStatusDisplay(order.status);

                return (
                  <Link 
                    key={order.id} 
                    href={`/shop/orders/${order.id}`} 
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    <div style={{ 
                      display: "flex", 
                      flexDirection: isMobile ? "column" : "row",
                      alignItems: isMobile ? "flex-start" : "center",
                      gap: 16, 
                      padding: "20px 16px", 
                      borderBottom: i < orders.length - 1 ? "1px solid #f0f0e8" : "none",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fcfcfc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      
                      {/* Top row for mobile (Image + Title) */}
                      <div style={{ display: "flex", gap: 16, width: "100%" }}>
                        {/* Image */}
                        <div style={{ width: 80, height: 80, borderRadius: 8, background: "#f5f5f0", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e5e5e0" }}>
                          <img
                            src={item.product.image || "/product/placeholder.png"}
                            alt={item.product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", padding: 4 }}
                          />
                        </div>

                        {/* Middle Content */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "#1b1b1b", marginBottom: 6, lineHeight: 1.4 }}>
                            {item.product.name}
                          </div>
                          
                          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>
                              ₹{parseFloat(item.price_at_order).toLocaleString()}
                            </div>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#ccc" }} />
                            <div style={{ fontSize: 13, color: "#555" }}>
                              Qty: {item.quantity}
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888", fontWeight: 500 }}>
                            <Calendar size={13} />
                            {new Date(order.order_date).toLocaleDateString("en-IN", { 
                              year: 'numeric', month: 'short', day: 'numeric' 
                            })}
                          </div>
                        </div>

                        {/* Status & Action (Desktop) */}
                        {!isMobile && (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 12, shrink: 0, minWidth: 120 }}>
                            <div style={{ 
                              display: "flex", alignItems: "center", gap: 6, 
                              fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                              padding: "4px 10px", borderRadius: 4,
                              background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.border}`
                            }}>
                              {statusConfig.icon}
                              {order.status}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#2874f0", display: "flex", alignItems: "center", gap: 2 }}>
                              View Details <ChevronRight size={14} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status & Action (Mobile) */}
                      {isMobile && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", borderTop: "1px dashed #e0e0e0", paddingTop: 12, mt: 4 }}>
                          <div style={{ 
                            display: "flex", alignItems: "center", gap: 6, 
                            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                            padding: "4px 10px", borderRadius: 4,
                            background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.border}`
                          }}>
                            {statusConfig.icon}
                            {order.status}
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#2874f0", display: "flex", alignItems: "center", gap: 2 }}>
                            Details <ChevronRight size={14} />
                          </div>
                        </div>
                      )}

                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}