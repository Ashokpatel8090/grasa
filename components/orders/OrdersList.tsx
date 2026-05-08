
// "use client";

// import React, { useEffect, useState, Suspense } from "react";
// import Link from "next/link";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { BASE_URL } from "@/components/config/api";
// import {
//   Package,
//   ChevronRight,
//   Calendar,
//   CheckCircle2,
//   Clock,
//   Truck,
//   XCircle,
//   Loader2,
//   ChevronLeft
// } from "lucide-react";

// // ── TypeScript Types ──────────────────────────────────────────────────────────
// type Product = {
//   id: number;
//   name: string;
//   image: string;
//   description?: string;
//   mrp?: string;
//   effective_price?: string;
// };

// type ReviewImage = {
//   id: number;
//   url: string;
//   public_id: string;
// };

// type Review = {
//   id: number | null;
//   product_id: number | null;
//   user_id: number | null;
//   order_id: number | null;
//   rating: number | null;
//   review_text: string | null;
//   is_verified_purchase: boolean | null;
//   status: string | null;
//   images?: ReviewImage[];
// };

// type Item = {
//   id: number;
//   quantity: number;
//   price_at_order: string;
//   product: Product;
//   status?: string;
//   reviews?: Review | null;
// };

// type Order = {
//   id: number;
//   order_date: string;
//   status: string;
//   total_amount: string;
//   currency: string;
//   items: Item[];
// };

// // ── Shared styles ─────────────────────────────────────────────────────────────
// const primaryBtn: React.CSSProperties = {
//   background: "#C5D82D", border: "none", borderRadius: 4,
//   padding: "11px 24px", fontSize: 14, fontWeight: 700,
//   cursor: "pointer", color: "#1b1b1b", letterSpacing: -0.2,
//   display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//   textDecoration: "none"
// };

// const pageBtn: React.CSSProperties = {
//   background: "#fff", border: "1px solid #d1d5db", borderRadius: 4,
//   padding: "8px 16px", fontSize: 14, fontWeight: 600,
//   cursor: "pointer", color: "#374151", display: "flex", 
//   alignItems: "center", gap: 6, transition: "all 0.2s"
// };

// const pageBtnDisabled: React.CSSProperties = {
//   ...pageBtn,
//   background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed", border: "1px solid #e5e7eb"
// };

// const loadingScreen: React.CSSProperties = {
//   display: "flex", flexDirection: "column", alignItems: "center",
//   justifyContent: "center", minHeight: "60vh",
// };

// // ── Main Content Component ────────────────────────────────────────────────────
// function OrdersListContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
  
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobile, setMobile] = useState(false);

//   // Pagination Configuration
//   const ITEMS_PER_PAGE = 5; 
  
//   // Read current page from URL or default to 1
//   const pageParam = searchParams.get("page");
//   const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

//   useEffect(() => {
//     const chk = () => setMobile(window.innerWidth < 768);
//     chk(); window.addEventListener("resize", chk); return () => window.removeEventListener("resize", chk);
//   }, []);

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
//         console.log("Orders data from API:", data);
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
//     const s = status?.toLowerCase() || "";
//     if (s.includes("deliver")) {
//       return { bg: "#e6f4ea", color: "#1e8e3e", border: "#ceead6", icon: <CheckCircle2 size={13} /> };
//     }
//     if (s.includes("cancel")) {
//       return { bg: "#fce8e6", color: "#d93025", border: "#fad2cf", icon: <XCircle size={13} /> };
//     }
//     if (s.includes("ship")) {
//       return { bg: "#e8f0fe", color: "#1a73e8", border: "#d2e3fc", icon: <Truck size={13} /> };
//     }
//     return { bg: "#fef7e0", color: "#f9ab00", border: "#fde293", icon: <Clock size={13} /> };
//   };

//   /* ---------------- PAGINATION LOGIC ---------------- */
//   const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       // Update the URL without a full page reload
//       router.push(`${pathname}?page=${newPage}`);
//       // Scroll to top of the list for better UX
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         button, a { font-family: inherit; }
//       `}</style>

//       {/* ── Main layout ───────────────────────────────────────────────────── */}
//       <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "2px 10px 40px" : "20px 16px 60px" }}>

//         {loading ? (
//           <div style={loadingScreen}>
//             <Loader2 size={32} style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }} />
//             <p style={{ marginTop: 10, color: "#888", fontSize: 13 }}>Loading your orders…</p>
//           </div>
//         ) : orders.length === 0 ? (
//           /* ---------- EMPTY STATE ---------- */
//           <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease", marginTop: isMobile ? 0 : 20 }}>
//             <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
//               <Package size={28} style={{ color: "#a8a396" }} />
//             </div>
//             <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1b1b1b", marginBottom: 8 }}>No orders yet</h2>
//             <p style={{ fontSize: 13, color: "#888", marginBottom: 24, textAlign: "center" }}>Looks like you haven't made any purchases yet.</p>
//             <Link href="/products" style={{ ...primaryBtn, width: "auto" }}>
//               Start Shopping
//             </Link>
//           </div>
//         ) : (
//           /* ---------- ORDERS LIST ---------- */
//           <div style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, overflow: "hidden", animation: "fadeIn 0.2s ease" }}>
            
//             {/* Header */}
//             <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
//                 Order History ({orders.length})
//               </span>
//               <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>
//                 Page {currentPage} of {totalPages || 1}
//               </span>
//             </div>

//             {/* List */}
//             <div>
//               {paginatedOrders.map((order, i) => {
//                 const item = order.items?.[0];
//                 if (!item) return null;

//                 const statusConfig = getStatusDisplay(order.status);
                
//                 return (
//                   <Link
//                     key={order.id}
//                     href={`/shop/orders/${order.id}`}
//                     style={{ textDecoration: "none", color: "inherit" }}
//                   >
//                     <div
//                       style={{
//                         padding: "20px 16px",
//                         borderBottom:
//                           i < paginatedOrders.length - 1 ? "1px solid #f0f0e8" : "none",
//                         cursor: "pointer",
//                       }}
//                     >
//                       {/* 🔹 TOP ROW */}
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           marginBottom: 12,
//                           flexWrap: "wrap",
//                           gap: 10,
//                         }}
//                       >
//                         {/* Date + Time */}
//                         <div style={{ fontSize: 13, color: "#555" }}>
//                           <strong>
//                             {new Date(order.order_date).toLocaleDateString("en-IN", {
//                               day: "numeric",
//                               month: "short",
//                               year: "numeric",
//                             })}
//                           </strong>
//                           {" • "}
//                           {new Date(order.order_date).toLocaleTimeString("en-IN", {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </div>

//                         {/* Total Price */}
//                         <div style={{ fontSize: 15, fontWeight: 700 }}>
//                           ₹{parseFloat(order.total_amount).toLocaleString()}
//                         </div>
//                       </div>

//                       {/* 🔹 PRODUCT IMAGES (AMAZON STYLE) */}
//                       <div
//                         style={{
//                           display: "flex",
//                           gap: 10,
//                           overflowX: "auto",
//                           marginBottom: 12,
//                         }}
//                       >
//                         {order.items.map((item) => (
//                           <div
//                             key={item.id}
//                             style={{
//                               width: 70,
//                               height: 70,
//                               border: "1px solid #e5e5e0",
//                               borderRadius: 8,
//                               overflow: "hidden",
//                               flexShrink: 0,
//                               background: "#fff",
//                             }}
//                           >
//                             <img
//                               src={item.product.image}
//                               alt={item.product.name}
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                               }}
//                             />
//                           </div>
//                         ))}
//                       </div>

//                       {/* 🔹 ORDER INFO */}
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           flexWrap: "wrap",
//                           gap: 10,
//                         }}
//                       >
//                         {/* Status */}
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 6,
//                             fontSize: 12,
//                             fontWeight: 700,
//                             padding: "4px 10px",
//                             borderRadius: 4,
//                             background: statusConfig.bg,
//                             color: statusConfig.color,
//                             border: `1px solid ${statusConfig.border}`,
//                           }}
//                         >
//                           {statusConfig.icon}
//                           {order.status}
//                         </div>

//                         {/* CTA */}
//                         <div
//                           style={{
//                             fontSize: 13,
//                             fontWeight: 600,
//                             color: "#2874f0",
//                           }}
//                         >
//                           View Details →
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* ---------- PAGINATION CONTROLS ---------- */}
//             {totalPages > 1 && (
//               <div style={{ 
//                 padding: "16px", 
//                 borderTop: "1px solid #e0e0e0", 
//                 display: "flex", 
//                 justifyContent: "space-between", 
//                 alignItems: "center",
//                 background: "#fcfcfc"
//               }}>
//                 <button 
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   style={currentPage === 1 ? pageBtnDisabled : pageBtn}
//                 >
//                   <ChevronLeft size={16} />
//                   Previous
//                 </button>
                
//                 <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
//                   Page <strong style={{ color: "#111827" }}>{currentPage}</strong> of {totalPages}
//                 </span>

//                 <button 
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   style={currentPage === totalPages ? pageBtnDisabled : pageBtn}
//                 >
//                   Next
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Wrap the main content in a Suspense boundary to prevent Next.js build errors 
// // when using useSearchParams() statically.
// export default function OrdersList() {
//   return (
//     <Suspense fallback={
//       <div style={loadingScreen}>
//         <Loader2 size={32} style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }} />
//       </div>
//     }>
//       <OrdersListContent />
//     </Suspense>
//   );
// }









"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BASE_URL } from "@/components/config/api";

// ── Config ────────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

// ── Cookie Helper ─────────────────────────────────────────────────────────────
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

// ── Types ─────────────────────────────────────────────────────────────────────
type Product = {
  id: number;
  name: string;
  image?: string;
  category?: string;
};

type Item = {
  id: number;
  quantity: number;
  price_at_order: string;
  subtotal: string;
  status?: string;
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

type PaginatedResponse = {
  orders?: Order[];
  data?: Order[];
  total?: number;
  total_pages?: number;
  page?: number;
  per_page?: number;
};

// ── Status Config ─────────────────────────────────────────────────────────────
const getStatusConfig = (status: string) => {
  const s = status?.toLowerCase() || "";
  if (s.includes("deliver"))  return { dot: "#22c55e", bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", label: "Delivered",   icon: "✓" };
  if (s.includes("cancel"))   return { dot: "#ef4444", bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "Cancelled",   icon: "✕" };
  if (s.includes("ship"))     return { dot: "#3b82f6", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", label: "Shipped",     icon: "→" };
  if (s.includes("process"))  return { dot: "#f59e0b", bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "Processing",  icon: "⟳" };
  return                             { dot: "#a855f7", bg: "#faf5ff", color: "#7e22ce", border: "#e9d5ff", label: status || "Pending", icon: "○" };
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f0eb", animation: "pulse 1.5s ease-in-out infinite" }}>
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 12, background: "#e8e6df", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, background: "#e8e6df", borderRadius: 4, width: "40%", marginBottom: 10 }} />
        <div style={{ height: 12, background: "#e8e6df", borderRadius: 4, width: "60%", marginBottom: 8 }} />
        <div style={{ height: 12, background: "#e8e6df", borderRadius: 4, width: "30%" }} />
      </div>
    </div>
  </div>
);

// ── Main Content ──────────────────────────────────────────────────────────────
function OrdersListContent() {
  const router     = useRouter();
  const searchParams = useSearchParams();
  const pathname   = usePathname();

  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isMobile, setMobile]     = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const pageParam   = searchParams.get("page");
  const currentPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

  useEffect(() => {
    const chk = () => setMobile(window.innerWidth < 640);
    chk();
    window.addEventListener("resize", chk);
    return () => window.removeEventListener("resize", chk);
  }, []);

  const fetchOrders = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) throw new Error("No token");

      const res = await fetch(
        `${BASE_URL}/grasa/shop/orders?per_page=${ITEMS_PER_PAGE}&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Fetch failed");

      const raw = await res.json();

      // Handle both array response and paginated object response
      if (Array.isArray(raw)) {
        setOrders(raw);
        setTotalOrders(raw.length);
        setTotalPages(1);
      } else {
        const list: Order[] = raw.orders ?? raw.data ?? raw.items ?? [];
        setOrders(list);
        setTotalOrders(raw.total ?? list.length);
        setTotalPages(raw.total_pages ?? Math.ceil((raw.total ?? list.length) / ITEMS_PER_PAGE));
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  const handlePageChange = (p: number) => {
    if (p < 1 || p > totalPages) return;
    router.push(`${pathname}?page=${p}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        .ol-page { min-height:100vh; background:#edecea; font-family:'DM Sans',sans-serif; }
        .ol-wrap { max-width:780px; margin:0 auto; padding: 28px 16px 80px; }
        .ol-heading-block { margin-bottom:28px; }
        .ol-eyebrow { font-size:10px; letter-spacing:.22em; text-transform:uppercase; font-weight:700; color:#8a7f6e; display:block; margin-bottom:6px; }
        .ol-title { font-family:'Fraunces',Georgia,serif; font-size:clamp(2rem,5vw,3rem); font-weight:700; color:#1c1a16; line-height:1.05; margin:0; letter-spacing:-.03em; }
        .ol-subtitle { font-size:13px; color:#7a7264; margin-top:6px; }
        .ol-card { background:#fff; border:1px solid #dedad2; border-radius:20px; overflow:hidden; box-shadow:0 2px 20px rgba(0,0,0,0.04); animation:fadeUp .25s ease; }
        .ol-card-header { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; background:#f7f5f1; border-bottom:1px solid #edecea; }
        .ol-card-header-label { font-size:11px; font-weight:700; color:#8a7f6e; text-transform:uppercase; letter-spacing:.15em; }
        .ol-order-row { display:block; text-decoration:none; color:inherit; transition:background .15s; border-bottom:1px solid #f2f0eb; }
        .ol-order-row:last-child { border-bottom:none; }
        .ol-order-row:hover { background:#faf9f7; }
        .ol-order-inner { padding:18px 20px; }
        .ol-order-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; gap:12px; }
        .ol-order-id { font-family:'Fraunces',serif; font-size:1rem; font-weight:700; color:#1c1a16; }
        .ol-order-date { font-size:12px; color:#7a7264; margin-top:2px; }
        .ol-order-price { font-family:'Fraunces',serif; font-size:1.1rem; font-weight:700; color:#1c1a16; text-align:right; white-space:nowrap; }
        .ol-order-currency { font-size:11px; color:#8a7f6e; font-family:'DM Sans',sans-serif; font-weight:500; }
        .ol-images { display:flex; gap:8px; overflow-x:auto; padding-bottom:2px; margin-bottom:14px; }
        .ol-img-wrap { width:64px; height:64px; border-radius:10px; border:1px solid #dedad2; background:#f7f5f1; overflow:hidden; flex-shrink:0; }
        .ol-img-wrap img { width:100%; height:100%; object-fit:cover; }
        .ol-img-more { width:64px; height:64px; border-radius:10px; border:1px dashed #c8c2b5; background:#f7f5f1; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#8a7f6e; flex-shrink:0; }
        .ol-order-bottom { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }
        .ol-status { display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:700; padding:5px 12px; border-radius:999px; border:1px solid; }
        .ol-status-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
        .ol-cta { font-size:12.5px; font-weight:600; color:#5a6b3a; display:flex; align-items:center; gap:4px; }
        .ol-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 20px; text-align:center; }
        .ol-empty-icon { width:72px; height:72px; border-radius:50%; background:#f2f0eb; border:1px solid #dedad2; display:flex; align-items:center; justify-content:center; font-size:28px; margin-bottom:20px; }
        .ol-empty-title { font-family:'Fraunces',serif; font-size:1.4rem; font-weight:700; color:#1c1a16; margin:0 0 8px; }
        .ol-empty-sub { font-size:13px; color:#7a7264; margin:0 0 28px; }
        .ol-shop-btn { display:inline-flex; align-items:center; gap:8px; background:#1c1a16; color:#c8d94a; border:none; border-radius:999px; padding:12px 28px; font-size:14px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; text-decoration:none; transition:opacity .18s; }
        .ol-shop-btn:hover { opacity:.85; }
        .ol-pagination { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-top:1px solid #edecea; background:#f7f5f1; gap:12px; flex-wrap:wrap; }
        .ol-pg-btn { display:flex; align-items:center; gap:6px; padding:8px 18px; border-radius:999px; border:1.5px solid #dedad2; background:#fff; font-size:13px; font-weight:600; color:#1c1a16; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .18s; }
        .ol-pg-btn:hover:not(:disabled) { border-color:#1c1a16; background:#1c1a16; color:#fff; }
        .ol-pg-btn:disabled { opacity:.4; cursor:not-allowed; }
        .ol-pg-info { font-size:12.5px; color:#7a7264; font-weight:500; }
        .ol-pg-pills { display:flex; gap:4px; }
        .ol-pg-pill { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:700; cursor:pointer; border:1.5px solid transparent; transition:all .18s; background:transparent; font-family:'DM Sans',sans-serif; color:#7a7264; }
        .ol-pg-pill:hover { border-color:#dedad2; color:#1c1a16; }
        .ol-pg-pill.active { background:#1c1a16; color:#c8d94a; border-color:#1c1a16; }
        .ol-loader { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 20px; }
        .ol-spinner { width:36px; height:36px; border:3px solid #dedad2; border-top-color:#1c1a16; border-radius:50%; animation:spin .7s linear infinite; margin-bottom:14px; }
        .ol-loader-text { font-size:13px; color:#7a7264; font-weight:500; }
        @media(max-width:480px) {
          .ol-wrap { padding:20px 12px 60px; }
          .ol-order-inner { padding:14px 14px; }
          .ol-pagination { justify-content:center; }
          .ol-pg-pills { display:none; }
        }
      `}</style>

      <div className="ol-page">
        <div className="ol-wrap">

          {/* ── Header ── */}
          <div className="ol-heading-block">
            <span className="ol-eyebrow">Your Account</span>
            <h1 className="ol-title">My Orders</h1>
            {totalOrders > 0 && !loading && (
              <p className="ol-subtitle">{totalOrders} order{totalOrders !== 1 ? "s" : ""} placed</p>
            )}
          </div>

          {/* ── Card ── */}
          <div className="ol-card">
            {loading ? (
              <>
                <div className="ol-card-header">
                  <span className="ol-card-header-label">Loading orders…</span>
                </div>
                {[1,2,3].map(i => <Skeleton key={i} />)}
              </>
            ) : orders.length === 0 ? (
              <div className="ol-empty">
                <div className="ol-empty-icon">📦</div>
                <h2 className="ol-empty-title">No orders yet</h2>
                <p className="ol-empty-sub">Explore our products and place your first order!</p>
                <Link href="/products" className="ol-shop-btn">Start Shopping →</Link>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="ol-card-header">
                  <span className="ol-card-header-label">
                    Order History · Page {currentPage} of {totalPages}
                  </span>
                  <span className="ol-card-header-label">{totalOrders} Total</span>
                </div>

                {/* Orders */}
                {orders.map((order) => {
                  const sc = getStatusConfig(order.status);
                  const previewItems = order.items.slice(0, 3);
                  const extra = order.items.length - 3;
                  return (
                    <Link
                      key={order.id}
                      href={`/shop/orders/${order.id}`}
                      className="ol-order-row"
                      onMouseEnter={() => setHoveredId(order.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="ol-order-inner">
                        {/* Top row */}
                        <div className="ol-order-top">
                          <div>
                            <div className="ol-order-id">Order #{order.id}</div>
                            <div className="ol-order-date">
                              {formatDate(order.order_date)} · {formatTime(order.order_date)}
                            </div>
                          </div>
                          <div>
                            <div className="ol-order-price">
                              ₹{parseFloat(order.total_amount).toLocaleString("en-IN")}
                            </div>
                            <div className="ol-order-currency">{order.currency}</div>
                          </div>
                        </div>

                        {/* Product thumbnails */}
                        <div className="ol-images">
                          {previewItems.map(item => (
                            <div key={item.id} className="ol-img-wrap">
                              {item.product.image
                                ? <img src={item.product.image} alt={item.product.name} />
                                : <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>📦</div>
                              }
                            </div>
                          ))}
                          {extra > 0 && <div className="ol-img-more">+{extra}</div>}
                        </div>

                        {/* Bottom row */}
                        <div className="ol-order-bottom">
                          <span
                            className="ol-status"
                            style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}
                          >
                            <span className="ol-status-dot" style={{ background: sc.dot }} />
                            {sc.label || order.status}
                          </span>
                          <span className="ol-cta">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""} · View Details
                            <span style={{ transition:"transform .18s", display:"inline-block", transform: hoveredId === order.id ? "translateX(4px)" : "translateX(0)" }}>→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="ol-pagination">
                    <button
                      className="ol-pg-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Prev
                    </button>

                    <div className="ol-pg-pills">
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let page = i + 1;
                        if (totalPages > 7) {
                          if (currentPage <= 4) page = i + 1;
                          else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                          else page = currentPage - 3 + i;
                        }
                        return (
                          <button
                            key={page}
                            className={`ol-pg-pill${page === currentPage ? " active" : ""}`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <span className="ol-pg-info">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      className="ol-pg-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Wrapped with Suspense for useSearchParams ─────────────────────────────────
export default function OrdersList() {
  return (
    <Suspense fallback={
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh" }}>
        <div style={{ width:36,height:36,border:"3px solid #dedad2",borderTopColor:"#1c1a16",borderRadius:"50%",animation:"spin .7s linear infinite" }} />
      </div>
    }>
      <OrdersListContent />
    </Suspense>
  );
}