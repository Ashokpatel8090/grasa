"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/components/grasa/CartContext";
import AddressSection from "../../components/grasa/Address";
import PaymentSection from "../../components/grasa/Payment";
import { Button } from "@/components/ui/button";

const FETCH_CART_URL = "https://medicaps.cloud/grasa/shop/cart";

/* ================= COOKIE UTILITY ================= */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

/* ================= DATE HELPERS ================= */
function nextWeekdayFrom(date: Date, targetWeekday: number) {
  const d = new Date(date.getTime());
  const day = d.getDay();
  let delta = (targetWeekday - day + 7) % 7;
  if (delta === 0) delta = 7;
  d.setDate(d.getDate() + delta);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDisplayDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ================= PAGE ================= */
export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, refreshCart } = useCart();

  const token = typeof window !== "undefined" ? getCookie("token") : null;

  /* ================= STATE ================= */
  const [cartId, setCartId] = useState<number | null>(null);
  const [apiTotalAmount, setApiTotalAmount] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [loadingPaymentMeta, setLoadingPaymentMeta] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [appliedMhcPoints, setAppliedMhcPoints] = useState<number>(0);
  const [basePrice, setBasePrice] = useState<number>(0);

  


  /* ================= FETCH CART META ================= */
  const fetchCartMeta = useCallback(async () => {
    if (!token) return null;

    try {
      const res = await fetch(FETCH_CART_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch cart");
        return null;
      }

      const data = await res.json();
      
      setAppliedMhcPoints(Number(data?.applied_mhc_points ?? 0));


      const cid = data?.cart?.id ?? null;
      const total = Number(data?.cart?.total_price ?? 0);
      const base = Number(data?.base_price ?? 0);

      console.log(total)

      setCartId(cid);
      setApiTotalAmount(total);
      setBasePrice(base);


      return cid;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [token]);

  /* ================= INIT ================= */
  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetchCartMeta();
      setLoading(false);
    })();
  }, [fetchCartMeta]);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= GUARDS ================= */
  useEffect(() => {
    if (orderSuccess) return;

    if (!token) {
      toast.error("Login required to checkout");
      router.push("/login");
      return;
    }

    if (mounted && !loading && !loadingPaymentMeta) {
      if (!cart || cart.length === 0) {
        toast.error("Cart is empty");
        router.push("/cart");
      }
    }
  }, [token, cart, mounted, loading, loadingPaymentMeta, orderSuccess, router]);

  /* ================= AUTO DELIVERY POPUP ================= */
  useEffect(() => {
    let hasStored = false;
    try {
      if (typeof window !== "undefined") {
        hasStored = !!localStorage.getItem("selectedDelivery");
      }
    } catch {
      hasStored = false;
    }

    if (hasStored) return;

    const t = setTimeout(() => setShowDeliveryPopup(true), 2000);
    return () => clearTimeout(t);
  }, []);

  /* ================= ORDER SUCCESS MODAL ================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [deliveryOptions, setDeliveryOptions] = useState<
    { key: "wednesday" | "saturday"; date: Date; display: string }[]
  >([]);
  const [selectedOptionKey, setSelectedOptionKey] = useState<
    "wednesday" | "saturday" | ""
  >("");

  useEffect(() => {
    if (!orderSuccess) return;

    const today = new Date();
    const wed = nextWeekdayFrom(today, 3);
    const sat = nextWeekdayFrom(today, 6);

    setDeliveryOptions([
      { key: "wednesday", date: wed, display: formatDisplayDate(wed) },
      { key: "saturday", date: sat, display: formatDisplayDate(sat) },
    ]);

    setSelectedOptionKey("");
    setModalOpen(true);
    setCountdown(10);
  }, [orderSuccess]);

  useEffect(() => {
    if (!modalOpen) return;

    const i = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(i);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(i);
  }, [modalOpen]);

  useEffect(() => {
    if (modalOpen && countdown === 0) {
      setModalOpen(false);
      router.push("/orders");
    }
  }, [countdown, modalOpen, router]);

  const handleModalSubmit = () => {
    if (!selectedOptionKey) {
      toast.error("Please select a delivery date");
      return;
    }

    const opt = deliveryOptions.find((o) => o.key === selectedOptionKey);
    if (!opt) return;

    localStorage.setItem(
      "selectedDelivery",
      JSON.stringify({
        day: opt.key,
        date: opt.date.toISOString(),
        display: opt.display,
      })
    );

    setModalOpen(false);
    router.push("/products");
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
        <p className="text-lg mt-3 text-gray-600">Loading checkout...</p>
      </div>
    );

  if (!token)
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Checkout — Address & Delivery Date
          </h1>
          {/* <div className="text-sm text-gray-600">
            Items: {cart.length} • Total: ₹{apiTotalAmount.toFixed(2)}
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AddressSection
              token={token}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              showDeliveryPopup={showDeliveryPopup}
              setShowDeliveryPopup={setShowDeliveryPopup}
              setLoadingPaymentMeta={setLoadingPaymentMeta}
            />
          </div>

          <PaymentSection
  token={token}
  cart={cart}
  totalAmount={apiTotalAmount}
  basePrice={basePrice}          // ✅ ADDED
  appliedMhcPoints={appliedMhcPoints}
  selectedAddressId={selectedAddressId}
  selectedDate={selectedDate}
  cartId={cartId}
  setCartId={setCartId}
  setOrderSuccess={setOrderSuccess}
  clearCart={clearCart}
  refreshCart={refreshCart}
  processing={processing}
  setProcessing={setProcessing}
/>

        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Order Confirmed 🎉 ({countdown}s)
            </h2>

            {deliveryOptions.map((o) => (
              <label
                key={o.key}
                className="flex justify-between border p-3 rounded mb-3 cursor-pointer"
              >
                <span>{o.display}</span>
                <input
                  type="radio"
                  checked={selectedOptionKey === o.key}
                  onChange={() => setSelectedOptionKey(o.key)}
                />
              </label>
            ))}

            <Button className="w-full mt-4" onClick={handleModalSubmit}>
              Confirm Delivery
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
