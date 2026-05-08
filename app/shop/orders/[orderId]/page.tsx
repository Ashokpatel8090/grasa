"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OrderDetails from "@/components/orders/OrderDetails";
import { BASE_URL } from "@/components/config/api";
import { Loader2 } from "lucide-react";

type Order = any;

// ── Cookie Utility ────────────────────────────────────────────────────────────
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getCookie("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const res = await fetch(
          `${BASE_URL}/grasa/shop/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch order details:", res.status);
          throw new Error("Failed to fetch order details");
        }

        const data = await res.json();
        console.log("[v0] Order details fetched:", data);
        setOrder(data);
      } catch (error) {
        console.error("[v0] Order details fetch error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "1rem",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <Loader2
          size={32}
          style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }}
        />
        <p style={{ color: "#888", fontSize: "0.9rem" }}>
          Loading order details…
        </p>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "1rem",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            background: "#fce8e6",
            border: "1px solid #f8d7da",
            color: "#d93025",
            padding: "1rem",
            borderRadius: "8px",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>
            {error || "Order not found"}
          </p>
        </div>
        <a
          href="/shop/orders"
          style={{
            padding: "0.75rem 1.5rem",
            background: "#C5D82D",
            color: "#1b1b1b",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          Back to Orders
        </a>
      </div>
    );
  }

  return <OrderDetails order={order} />;
}
