"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OrderDetails from "@/components/orders/OrderDetails";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = Number(params.orderId);

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    const selectedOrder = orders.find(
      (o: any) => o.id === orderId
    );

    setOrder(selectedOrder);
  }, [orderId]);

  if (!order) return <p className="p-10">Loading order...</p>;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <OrderDetails order={order} />
    </div>
  );
}