import OrdersList from "@/components/orders/OrdersList";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <OrdersList />
    </div>
  );
}