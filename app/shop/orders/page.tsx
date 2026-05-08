// import OrdersList from "@/components/orders/OrdersList";

// export default function OrdersPage() {
//   return (
//     <div className="min-h-screen bg-gray-50 px-2 md:px-10 pt-4">
//       <h1 className="text-3xl font-bold mb-2">My Orders</h1>

//       <OrdersList />
//     </div>
//   );
// }









"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BASE_URL } from "@/components/config/api";
import {
  Package,
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Loader2,
  ChevronLeft,
} from "lucide-react";

// ── TypeScript Types ──────────────────────────────────────────────────────────
type Product = {
  id: number;
  name: string;
  image: string;
  description?: string;
  mrp?: string;
  effective_price?: string;
};

type Item = {
  id: number;
  quantity: number;
  price_at_order: string;
  product: Product;
  status?: string;
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
  background: "#C5D82D",
  border: "none",
  borderRadius: 4,
  padding: "11px 24px",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  color: "#1b1b1b",
  letterSpacing: -0.2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textDecoration: "none",
};

const pageBtn: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: 4,
  padding: "8px 16px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  color: "#374151",
  display: "flex",
  alignItems: "center",
  gap: 6,
  transition: "all 0.2s",
};

const pageBtnDisabled: React.CSSProperties = {
  ...pageBtn,
  background: "#f3f4f6",
  color: "#9ca3af",
  cursor: "not-allowed",
  border: "1px solid #e5e7eb",
};

const loadingScreen: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "60vh",
};

// ── Cookie Utility ────────────────────────────────────────────────────────────
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

// ── Main Content Component ────────────────────────────────────────────────────
function OrdersListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setMobile] = useState(false);

  // Pagination Configuration
  const ITEMS_PER_PAGE = 10;

  // Read current page from URL or default to 1
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  useEffect(() => {
    const chk = () => setMobile(window.innerWidth < 768);
    chk();
    window.addEventListener("resize", chk);
    return () => window.removeEventListener("resize", chk);
  }, []);

  /* ---------------- FETCH ORDERS FROM API ---------------- */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = getCookie("token");

        const queryParams = new URLSearchParams({
          per_page: ITEMS_PER_PAGE.toString(),
          page: currentPage.toString(),
        });

        const res = await fetch(
          `${BASE_URL}/grasa/shop/orders?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch orders:", res.status);
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        console.log("[v0] Orders fetched:", data);

        // Handle both array and paginated response
        const ordersList = Array.isArray(data) ? data : data.results || data.data || [];
        setOrders(ordersList);
      } catch (error) {
        console.error("[v0] Orders fetch error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  /* ---------------- STATUS BADGE HELPER ---------------- */
  const getStatusDisplay = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("deliver")) {
      return {
        bg: "#e6f4ea",
        color: "#1e8e3e",
        border: "#ceead6",
        icon: <CheckCircle2 size={13} />,
      };
    }
    if (s.includes("cancel")) {
      return {
        bg: "#fce8e6",
        color: "#d93025",
        border: "#fad2cf",
        icon: <XCircle size={13} />,
      };
    }
    if (s.includes("ship")) {
      return {
        bg: "#e8f0fe",
        color: "#1a73e8",
        border: "#d2e3fc",
        icon: <Truck size={13} />,
      };
    }
    return {
      bg: "#fef7e0",
      color: "#f9ab00",
      border: "#fde293",
      icon: <Clock size={13} />,
    };
  };

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?page=${newPage}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f3f6",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        button, a { font-family: inherit; }
      `}</style>

      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: isMobile ? "2px 10px 40px" : "20px 16px 60px",
        }}
      >
        {loading ? (
          <div style={loadingScreen}>
            <Loader2
              size={32}
              style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }}
            />
            <p style={{ marginTop: 10, color: "#888", fontSize: 13 }}>
              Loading your orders…
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              padding: "60px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeIn 0.2s ease",
              marginTop: isMobile ? 0 : 20,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#f5f5f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Package size={28} style={{ color: "#a8a396" }} />
            </div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1b1b1b",
                marginBottom: 8,
              }}
            >
              No orders yet
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#888",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Looks like you haven&apos;t made any purchases yet.
            </p>
            <Link href="/products" style={{ ...primaryBtn, width: "auto" }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              overflow: "hidden",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <div
              style={{
                background: "#f5f5f5",
                padding: "12px 16px",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Order History ({orders.length})
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>
                Page {currentPage}
              </span>
            </div>

            <div>
              {orders.map((order, i) => {
                const item = order.items?.[0];
                if (!item) return null;

                const statusConfig = getStatusDisplay(order.status);

                return (
                  <Link
                    key={order.id}
                    href={`/shop/orders/${order.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        padding: "20px 16px",
                        borderBottom:
                          i < orders.length - 1
                            ? "1px solid #f0f0e8"
                            : "none",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 12,
                          flexWrap: "wrap",
                          gap: 10,
                        }}
                      >
                        <div style={{ fontSize: 13, color: "#555" }}>
                          <strong>
                            {new Date(order.order_date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </strong>
                          {" • "}
                          {new Date(order.order_date).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>

                        <div style={{ fontSize: 15, fontWeight: 700 }}>
                          ₹{parseFloat(order.total_amount).toLocaleString()}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          overflowX: "auto",
                          marginBottom: 12,
                        }}
                      >
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              width: 70,
                              height: 70,
                              border: "1px solid #e5e5e0",
                              borderRadius: 8,
                              overflow: "hidden",
                              flexShrink: 0,
                              background: "#fff",
                            }}
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: 4,
                            background: statusConfig.bg,
                            color: statusConfig.color,
                            border: `1px solid ${statusConfig.border}`,
                          }}
                        >
                          {statusConfig.icon}
                          {order.status}
                        </div>

                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#2874f0",
                          }}
                        >
                          View Details →
                        </div>
                      </div>
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

export default function OrdersList() {
  return (
    <Suspense
      fallback={
        <div style={loadingScreen}>
          <Loader2
            size={32}
            style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }}
          />
        </div>
      }
    >
      <OrdersListContent />
    </Suspense>
  );
}
