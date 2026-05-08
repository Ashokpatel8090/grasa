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
// const CART_URL = `${BASE_URL}/grasa/shop/cart`;
// const ORDER_URL = `${BASE_URL}/g/payment/products/create-order`;
// const CONFIRM_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
// const SAVE_URL = `${BASE_URL}/grasa/shop/orders`;
// const LOC_URL = `${BASE_URL}/api/locations`;

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
//   const [cartId, setCartId] = useState<number | null>(null);
//   const [total, setTotal] = useState(0);
//   const [basePrice, setBasePrice] = useState(0);
//   const [mhcPts, setMhcPts] = useState(0);

//   // Steps
//   const [step, setStep] = useState<Step>(1);
//   const [loading, setLoading] = useState(true);
//   const [loadingMeta, setLoadingMeta] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [processing, setProc] = useState(false);
//   const [orderDone, setOrderDone] = useState(false);
//   const [isMobile, setMobile] = useState(false);

//   // Address
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [addrLoading, setAddrLoading] = useState(true);
//   const [defaultAddr, setDefaultAddr] = useState<Address | null>(null);
//   const [showAddrPanel, setShowAddrPanel] = useState(false);
//   const [deleting, setDeleting] = useState<number | null>(null);
//   const [editing, setEditing] = useState<number | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [adding, setAdding] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [countries, setCountries] = useState<Opt[]>([]);
//   const [states, setStates] = useState<Opt[]>([]);
//   const [cities, setCities] = useState<Opt[]>([]);
//   const [form, setForm] = useState<any>({
//     street: "", landmark: "", postal_code: "",
//     country_id: 0, state_id: 0, city_id: 0, address_type: "home",
//   });

//   // Date
//   const [selDate, setSelDate] = useState("");
//   const today = new Date();
//   const minDate = (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split("T")[0]; })();
//   const quickDates = ([3, 6] as const).map(wd => {
//     const d = nextBakeDay(today, wd);
//     return { label: wd === 3 ? "Wednesday" : "Saturday", value: d.toISOString().split("T")[0], display: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) };
//   });

//   // Post-order modal
//   const [modalOpen, setModalOpen] = useState(false);
//   const [countdown, setCountdown] = useState(10);
//   const [nextOpts, setNextOpts] = useState<{ key: string; date: Date; display: string }[]>([]);
//   const [nextSel, setNextSel] = useState("");

//   // Razorpay
//   const [rzpLoaded, setRzpLoaded] = useState(false);

//   const skipAutoStepRef = useRef(false);
//   const [showOrderSummary, setShowOrderSummary] = useState(false);



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
//     } catch { }
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
//       if (d.state?.id) { const s = await fetch(`${LOC_URL}/citylist?state_id=${d.state.id}`); setCities(s.ok ? await s.json() : []); }
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
//     if (skipAutoStepRef.current) {
//       skipAutoStepRef.current = false;
//       return;
//     }

//     if (step === 2 && selDate) {
//       const timer = setTimeout(() => setStep(3), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [step, selDate]);

//   // ── Payment ──────────────────────────────────────────────────────────────
//   const handlePay = useCallback(async () => {
//     if (!defaultAddr) { toast.error("Select a delivery address"); return; }
//     if (!selDate) { toast.error("Choose a delivery date"); return; }
//     setProc(true);

//     let ph: Window | null = null;
//     try { ph = window.open("", "rzp_ph", "width=100,height=100"); } catch { }

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
//             setOrderDone(true); clearCart(); try { await refreshCart(); } catch { }
//           } catch { toast.error("Failed to finalise order"); }
//           finally { setProc(false); }
//         },
//         modal: { escape: true, ondismiss: () => { toast.error("Payment cancelled"); setProc(false); } },
//       });
//       rzp.on?.("payment.failed", () => { toast.error("Payment failed"); setProc(false); ph?.close(); });
//       rzp.open();
//       setTimeout(() => { try { if (ph && !ph.closed) ph.close(); } catch { } }, 500);
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
//     <div className="checkout-root" style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
//         .checkout-root *, .checkout-root *::before, .checkout-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
// .checkout-root button, .checkout-root input, .checkout-root select { font-family: inherit; }
// @keyframes spin    { to { transform: rotate(360deg); } }
// @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
// @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
//       `}</style>

//       <Toaster position={isMobile ? "top-center" : "bottom-right"}
//         toastOptions={{ duration: 2500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} />

//       {/* ── Top nav ──────────────────────────────────────────────────────── */}
//       <div style={{  padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "center", position: "sticky", top: 0, zIndex: 40 }}>

//         {/* Step breadcrumb */}
//         <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
//           {(["Address", "Order Summary", "Payment"] as const).map((label, i) => {
//             const s = (i + 1) as Step;
//             const active = step === s;
//             const done = step > s;
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
//             stepNum={2}
//             label="ORDER SUMMARY"
//             currentStep={step}
//             completedSummary={
//               <span style={{ fontSize: 13, color: "#555" }}>
//                 {totalItems} item{totalItems !== 1 ? "s" : ""} ·{" "}
//                 <strong style={{ color: "#1b1b1b" }}>₹{total.toFixed(2)}</strong>
//                 {selDate && <> · <span style={{ color: "#3d7a1a" }}>{fmtDate(selDate)}</span></>}
//               </span>
//             }
//             onEdit={() => {
//               skipAutoStepRef.current = true;
//               setShowOrderSummary(true);
//               setStep(2);
//             }}
//           >


//             <div style={{ animation: "fadeIn 0.2s ease" }}>
//               {/* Item list */}
//               <div style={{ marginBottom: 20 }}>
//                 {(cart || []).map((item: any, i: number) => {
//                   const name = item.name ?? item.title ?? item.product_name ?? `Item #${item.id}`;
//                   const qty = item.quantity ?? 1;
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
//   const active = currentStep === stepNum;
//   const completed = currentStep > stepNum;
//   const locked = currentStep < stepNum;

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
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

//             {/* LEFT: Label */}
//             <span
//               style={{
//                 fontSize: 13,
//                 fontWeight: 700,
//                 color: completed ? "#888" : "#1b1b1b",
//                 textTransform: "uppercase",
//                 letterSpacing: 0.6,
//               }}
//             >
//               {label}
//             </span>

//             {/* RIGHT: Change Button */}
//             {completed && onEdit && (
//               <button
//                 onClick={onEdit}
//                 style={{
//                   fontSize: 12,
//                   fontWeight: 600,
//                   color: "#2874f0",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                 }}
//               >
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
//   X, ChevronRight, CheckCircle, Truck, CalendarDays, Package, Tag, BadgePercent, Gift,
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { useCart } from "@/components/grasa/CartContext";
// import { BASE_URL } from "@/components/config/api";

// // ── API ───────────────────────────────────────────────────────────────────────
// const CART_URL = `${BASE_URL}/grasa/shop/cart`;
// const ORDER_URL = `${BASE_URL}/grasa/shop/orders`;
// const CONFIRM_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
// const LOC_URL = `${BASE_URL}/api/locations`;
// const COUPON_VALIDATE_URL = `${BASE_URL}/grasa/shop/coupons/validate`;

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
// interface Coupon {
//   id: number; coupon_code: string; description: string | null;
//   discount_type: string; discount_value: string;
//   min_order_amount: string; max_discount_amount: string;
//   is_active: boolean;
// }
// interface CouponResult {
//   is_valid: boolean; coupon_code: string; discount: number;
//   subtotal: number; final_price: number; message: string;
// }

// type Step = 1 | 2 | 3;

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, refreshCart } = useCart();
//   const token = typeof window !== "undefined" ? getCookie("token") : null;

//   // Cart meta
//   const [cartId, setCartId] = useState<number | null>(null);
//   const [total, setTotal] = useState(0);
//   const [basePrice, setBasePrice] = useState(0);
//   const [mhcPts, setMhcPts] = useState(0);
//   const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

//   // Coupon state
//   const [couponInput, setCouponInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
//   const [couponLoading, setCouponLoading] = useState(false);
//   const [finalPrice, setFinalPrice] = useState(0);
//   const [discount, setDiscount] = useState(0);

//   // Steps
//   const [step, setStep] = useState<Step>(1);
//   const [loading, setLoading] = useState(true);
//   const [loadingMeta, setLoadingMeta] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [processing, setProc] = useState(false);
//   const [orderDone, setOrderDone] = useState(false);
//   const [isMobile, setMobile] = useState(false);

//   // Address
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [addrLoading, setAddrLoading] = useState(true);
//   const [defaultAddr, setDefaultAddr] = useState<Address | null>(null);
//   const [showAddrPanel, setShowAddrPanel] = useState(false);
//   const [deleting, setDeleting] = useState<number | null>(null);
//   const [editing, setEditing] = useState<number | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [adding, setAdding] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [countries, setCountries] = useState<Opt[]>([]);
//   const [states, setStates] = useState<Opt[]>([]);
//   const [cities, setCities] = useState<Opt[]>([]);
//   const [form, setForm] = useState<any>({
//     street: "", landmark: "", postal_code: "",
//     country_id: 0, state_id: 0, city_id: 0, address_type: "home",
//   });

//   // Date
//   const [selDate, setSelDate] = useState("");
//   const today = new Date();
//   const minDate = (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split("T")[0]; })();
//   const quickDates = ([3, 6] as const).map(wd => {
//     const d = nextBakeDay(today, wd);
//     return { label: wd === 3 ? "Wednesday" : "Saturday", value: d.toISOString().split("T")[0], display: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) };
//   });

//   // Post-order modal
//   const [modalOpen, setModalOpen] = useState(false);
//   const [countdown, setCountdown] = useState(10);
//   const [nextOpts, setNextOpts] = useState<{ key: string; date: Date; display: string }[]>([]);
//   const [nextSel, setNextSel] = useState("");

//   // Razorpay
//   const [rzpLoaded, setRzpLoaded] = useState(false);

//   const skipAutoStepRef = useRef(false);
//   const [showOrderSummary, setShowOrderSummary] = useState(false);

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
//       const bp = safeNum(d?.base_price);
//       setTotal(bp);
//       setBasePrice(bp);
//       setFinalPrice(bp);
//       if (d?.available_coupons) setAvailableCoupons(d.available_coupons);
//     } catch { }
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

//   // ── Coupon Logic ─────────────────────────────────────────────────────────
//   const handleApplyCoupon = async (code?: string) => {
//     const couponCode = code ?? couponInput.trim().toUpperCase();
//     if (!couponCode) { toast.error("Enter a coupon code"); return; }
//     if (!cartId) { toast.error("Cart not loaded yet"); return; }
//     setCouponLoading(true);
//     try {
//       const r = await fetch(COUPON_VALIDATE_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ coupon_code: couponCode, cart_id: cartId }),
//       });
//       const data = await r.json();
//       if (!r.ok || r.status === 404 || data.is_valid === false) {
//         toast.error(data?.message ?? "Invalid coupon code");
//         return;
//       }
//       setAppliedCoupon(data);
//       setDiscount(safeNum(data.discount));
//       setFinalPrice(safeNum(data.final_price));
//       setTotal(safeNum(data.final_price));
//       setCouponInput(couponCode);
//       toast.success("Coupon applied!");
//     } catch {
//       toast.error("Failed to validate coupon");
//     } finally {
//       setCouponLoading(false);
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     setDiscount(0);
//     setFinalPrice(basePrice);
//     setTotal(basePrice);
//     setCouponInput("");
//     toast.success("Coupon removed");
//   };

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
//       if (d.state?.id) { const s = await fetch(`${LOC_URL}/citylist?state_id=${d.state.id}`); setCities(s.ok ? await s.json() : []); }
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
//     if (skipAutoStepRef.current) { skipAutoStepRef.current = false; return; }
//     if (step === 2 && selDate) {
//       const timer = setTimeout(() => setStep(3), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [step, selDate]);

//   // ── Payment ──────────────────────────────────────────────────────────────
//   const handlePay = useCallback(async () => {
//     if (!defaultAddr) { toast.error("Select a delivery address"); return; }
//     if (!selDate) { toast.error("Choose a delivery date"); return; }
//     setProc(true);

//     let ph: Window | null = null;
//     try { ph = window.open("", "rzp_ph", "width=100,height=100"); } catch { }

//     try {
//       const createRes = await fetch(ORDER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           cart_id: cartId ?? 0,
//           shipping_address_id: defaultAddr?.id ?? 0,
//           mhc_points: mhcPts.toString(),
//           coupon_code: appliedCoupon?.coupon_code ?? "",
//           currency: "INR",
//           notes: `delivery_date:${selDate}`,
//           source: "GRASAMILLETS",
//           items: (cart || []).map((i: any) => ({
//             product_id: i.product_id ?? i.id,
//             quantity: i.quantity ?? 1,
//             unit_price: safeNum(i.effective_price ?? i.price).toString(),
//           })),
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
//             setOrderDone(true); clearCart(); try { await refreshCart(); } catch { }
//           } catch { toast.error("Failed to finalise order"); }
//           finally { setProc(false); }
//         },
//         modal: { escape: true, ondismiss: () => { toast.error("Payment cancelled"); setProc(false); } },
//       });
//       rzp.on?.("payment.failed", () => { toast.error("Payment failed"); setProc(false); ph?.close(); });
//       rzp.open();
//       setTimeout(() => { try { if (ph && !ph.closed) ph.close(); } catch { } }, 500);
//     } catch { toast.error("Payment failed"); setProc(false); ph?.close(); }
//   }, [cart, total, mhcPts, token, defaultAddr, selDate, cartId, appliedCoupon, setProc, clearCart, refreshCart, setOrderDone]);

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

//   // ── Coupon Panel Component ────────────────────────────────────────────────
//   const CouponPanel = () => (
//     <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden", marginBottom: 10 }}>
//       <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
//           Coupons & Offers
//         </span>
//       </div>
//       <div style={{ padding: "14px 16px" }}>
//         {/* Applied coupon display */}
//         {appliedCoupon ? (
//           <div style={{
//             border: "1.5px dashed #7ab648",
//             borderRadius: 8,
//             padding: "12px 14px",
//             background: "linear-gradient(135deg, #f0fce8 0%, #f8fdf2 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 10,
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8f5d8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                 <Tag size={15} style={{ color: "#5a9e2f" }} />
//               </div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: "#2e7d32", letterSpacing: 0.3 }}>
//                   {appliedCoupon.coupon_code}
//                 </div>
//                 <div style={{ fontSize: 11, color: "#5a9e2f", marginTop: 1 }}>
//                   Coupon applied successfully
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={handleRemoveCoupon}
//               style={{
//                 background: "none", border: "none", cursor: "pointer",
//                 fontSize: 12, fontWeight: 700, color: "#e53935",
//                 textTransform: "uppercase", letterSpacing: 0.3, padding: "4px 8px",
//                 borderRadius: 4, transition: "background 0.15s",
//               }}
//             >
//               REMOVE
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Coupon input */}
//             <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
//               <input
//                 placeholder="ENTER COUPON CODE"
//                 value={couponInput}
//                 onChange={e => setCouponInput(e.target.value.toUpperCase())}
//                 onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
//                 style={{
//                   flex: 1, border: "1.5px solid #e0e0e0", borderRadius: 6,
//                   padding: "9px 12px", fontSize: 13, color: "#1b1b1b",
//                   background: "#fafafa", outline: "none", letterSpacing: 0.5,
//                   fontWeight: 500,
//                 }}
//               />
//               <button
//                 onClick={() => handleApplyCoupon()}
//                 disabled={couponLoading || !couponInput.trim()}
//                 style={{
//                   background: couponInput.trim() ? "#C5D82D" : "#f0f0f0",
//                   border: "none", borderRadius: 6, padding: "9px 16px",
//                   fontSize: 13, fontWeight: 700, cursor: couponInput.trim() ? "pointer" : "not-allowed",
//                   color: couponInput.trim() ? "#1b1b1b" : "#aaa",
//                   transition: "all 0.15s", minWidth: 72, display: "flex", alignItems: "center", justifyContent: "center",
//                 }}
//               >
//                 {couponLoading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : "Apply"}
//               </button>
//             </div>

//             {/* Available coupons */}
//             {availableCoupons.length > 0 && (
//               <div style={{ display: "grid", gridTemplateColumns: availableCoupons.length === 1 ? "1fr" : "1fr 1fr", gap: 8 }}>
//                 {availableCoupons.map(c => (
//                   <div key={c.id} style={{
//                     border: "1.5px dashed #c8e6c9",
//                     borderRadius: 8,
//                     padding: "10px 12px",
//                     background: "#fafff5",
//                     position: "relative",
//                     overflow: "hidden",
//                   }}>
//                     <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: "#C5D82D", borderRadius: "8px 0 0 8px" }} />
//                     <div style={{ fontSize: 12, fontWeight: 800, color: "#1b1b1b", letterSpacing: 0.4, marginBottom: 3 }}>
//                       {c.coupon_code}
//                     </div>
//                     <div style={{ fontSize: 11, color: "#5a9e2f", fontWeight: 500, marginBottom: 8 }}>
//                       Flat ₹{safeNum(c.discount_value).toFixed(0)} OFF
//                     </div>
//                     <button
//                       onClick={() => handleApplyCoupon(c.coupon_code)}
//                       disabled={couponLoading}
//                       style={{
//                         background: "#C5D82D", border: "none", borderRadius: 4,
//                         padding: "5px 12px", fontSize: 11, fontWeight: 700,
//                         cursor: "pointer", color: "#1b1b1b", letterSpacing: 0.2,
//                         display: "flex", alignItems: "center", gap: 4,
//                       }}
//                     >
//                       {couponLoading ? <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} /> : "Apply"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );

//   // ── Price Summary Component ───────────────────────────────────────────────
//   const PriceSummary = () => (
//     <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
//       <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
//           Price Details
//         </span>
//       </div>
//       <div style={{ padding: "16px" }}>
//         <PriceRow label={`Price (${totalItems} item${totalItems !== 1 ? "s" : ""})`} value={`₹${basePrice.toFixed(2)}`} />
//         <PriceRow label="Delivery charges" value="FREE" valueColor="#3d7a1a" />
//         {mhcPts > 0 && <PriceRow label="MHC Points discount" value={`-₹${mhcPts.toFixed(2)}`} valueColor="#3d7a1a" />}
//         {appliedCoupon && discount > 0 && (
//           <PriceRow
//             label={`Discount (${appliedCoupon.coupon_code})`}
//             value={`- ₹${discount.toFixed(2)}`}
//             valueColor="#2e7d32"
//           />
//         )}
//         <div style={{ height: 1, background: "#e5e5e0", margin: "12px 0" }} />
//         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>
//           <span>Total Amount</span>
//           <span>₹{finalPrice.toFixed(2)}</span>
//         </div>
//         {(discount > 0 || mhcPts > 0) && (
//           <div style={{ marginTop: 10, fontSize: 12, color: "#3d7a1a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, background: "#f0fce8", borderRadius: 6, padding: "6px 10px" }}>
//             🎉 You save ₹{(discount + mhcPts).toFixed(2)} on this order
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="checkout-root" style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
//         .checkout-root *, .checkout-root *::before, .checkout-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         .checkout-root button, .checkout-root input, .checkout-root select { font-family: inherit; }
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
//         @keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
//         .coupon-card:hover { border-color: #C5D82D !important; background: #f5fee8 !important; }
//         .pay-btn-mobile { 
//           position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
//           padding: 12px 16px 28px;
//           background: linear-gradient(to top, #f1f3f6 70%, rgba(241,243,246,0));
//         }
//       `}</style>

//       <Toaster position={isMobile ? "top-center" : "bottom-right"}
//         toastOptions={{ duration: 2500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} />

//       {/* ── Top nav ──────────────────────────────────────────────────────── */}
//       <div style={{ padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "center", position: "sticky", top: 0, zIndex: 40, background: "#fff", borderBottom: "1px solid #e5e5e0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
//           {(["Address", "Order Summary", "Payment"] as const).map((label, i) => {
//             const s = (i + 1) as Step;
//             const active = step === s;
//             const done = step > s;
//             return (
//               <React.Fragment key={label}>
//                 {i > 0 && <div style={{ width: isMobile ? 20 : 40, height: 1.5, background: done ? "#C5D82D" : "#e0e0e0", transition: "background 0.3s" }} />}
//                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
//                   <div style={{
//                     width: 28, height: 28, borderRadius: "50%",
//                     background: done ? "#C5D82D" : active ? "#1b1b1b" : "#f0f0f0",
//                     border: active ? "2.5px solid #C5D82D" : "none",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: 11, fontWeight: 700,
//                     color: done ? "#1b1b1b" : active ? "#C5D82D" : "#bbb",
//                     transition: "all 0.25s",
//                     boxShadow: active ? "0 0 0 4px #C5D82D22" : "none",
//                   }}>
//                     {done ? <CheckCircle size={15} strokeWidth={3} /> : i + 1}
//                   </div>
//                   {!isMobile && (
//                     <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#1b1b1b" : done ? "#3d7a1a" : "#aaa", whiteSpace: "nowrap", letterSpacing: 0.3 }}>
//                       {label}
//                     </span>
//                   )}
//                 </div>
//               </React.Fragment>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Main layout ───────────────────────────────────────────────────── */}
//       <div style={{
//         maxWidth: 1060, margin: "0 auto", padding: isMobile ? "12px 10px 120px" : "20px 16px 60px",
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
//                           {defaultAddr.street}{defaultAddr.landmark ? `, ${defaultAddr.landmark}` : ""}
//                         </div>
//                         <div style={{ fontSize: 13, color: "#555" }}>{defaultAddr.city}, {defaultAddr.state} — {defaultAddr.postal_code}</div>
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

//                 {showAddrPanel && (
//                   <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, overflow: "hidden", marginBottom: 14, animation: "fadeIn 0.15s ease" }}>
//                     {addresses.map((a, idx) => {
//                       const sel = defaultAddr?.id === a.id;
//                       return (
//                         <div key={a.id} style={{ borderBottom: idx < addresses.length - 1 ? "1px solid #f0f0e8" : "none", padding: "12px 14px", background: sel ? "#fdfde8" : "#fff", display: "flex", alignItems: "flex-start", gap: 10 }}>
//                           <div onClick={() => { setDefaultAddr(a); setShowAddrPanel(false); }} style={{ flex: 1, cursor: "pointer" }}>
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
//                     <div onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#2874f0", fontSize: 13, fontWeight: 600, background: "#f9f9ff" }}>
//                       <Plus size={15} /> Add new address
//                     </div>
//                   </div>
//                 )}

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
//             stepNum={2}
//             label="ORDER SUMMARY"
//             currentStep={step}
//             completedSummary={
//               <span style={{ fontSize: 13, color: "#555" }}>
//                 {totalItems} item{totalItems !== 1 ? "s" : ""} · <strong style={{ color: "#1b1b1b" }}>₹{basePrice.toFixed(2)}</strong>
//                 {selDate && <> · <span style={{ color: "#3d7a1a" }}>{fmtDate(selDate)}</span></>}
//               </span>
//             }
//             onEdit={() => { skipAutoStepRef.current = true; setShowOrderSummary(true); setStep(2); }}
//           >
//             <div style={{ animation: "fadeIn 0.2s ease" }}>
//               <div style={{ marginBottom: 20 }}>
//                 {(cart || []).map((item: any, i: number) => {
//                   const name = item.name ?? item.title ?? item.product_name ?? `Item #${item.id}`;
//                   const qty = item.quantity ?? 1;
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

//               {/* Delivery date */}
//               <div style={{ background: "#fafce8", border: "1.5px solid #C5D82D66", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
//                   <Truck size={15} style={{ color: "#5c8a1e" }} />
//                   <span style={{ fontSize: 13, fontWeight: 700, color: "#3d5c10", textTransform: "uppercase", letterSpacing: 0.4 }}>Choose Delivery Date</span>
//                 </div>
//                 <p style={{ fontSize: 12, color: "#6b8a3a", marginBottom: 12, lineHeight: 1.5 }}>
//                   We bake fresh! Minimum 5 days from today. Pick your bake day:
//                 </p>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
//                   {quickDates.map(qd => (
//                     <div key={qd.value} onClick={() => setSelDate(qd.value)} style={{
//                       border: `2px solid ${selDate === qd.value ? "#C5D82D" : "#dde8a0"}`,
//                       borderRadius: 8, padding: "10px", cursor: "pointer", textAlign: "center",
//                       background: selDate === qd.value ? "#fff" : "#f5f8e4",
//                       boxShadow: selDate === qd.value ? "0 0 0 3px #C5D82D33" : "none",
//                       transition: "all 0.15s", position: "relative",
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
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <CalendarDays size={15} style={{ color: "#5c8a1e", flexShrink: 0, marginTop: 2 }} />
//                 <div>
//                   <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 1 }}>Delivery on</div>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>{fmtDate(selDate)}</div>
//                 </div>
//               </div>
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <MapPin size={15} style={{ color: "#888", flexShrink: 0, marginTop: 2 }} />
//                 <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
//                   <strong style={{ color: "#1b1b1b" }}>Delivering to:</strong> {defaultAddr?.street}, {defaultAddr?.city}, {defaultAddr?.state} — {defaultAddr?.postal_code}
//                 </div>
//               </div>

//               {/* Order total recap */}
//               <div style={{ background: "#fafce8", border: "1px solid #C5D82D44", borderRadius: 8, padding: "12px 14px", marginBottom: 18 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <span style={{ fontSize: 13, color: "#555" }}>
//                     {totalItems} item{totalItems !== 1 ? "s" : ""}
//                     {appliedCoupon && <span style={{ marginLeft: 6, fontSize: 11, color: "#5a9e2f", fontWeight: 600 }}>· {appliedCoupon.coupon_code} applied</span>}
//                   </span>
//                   <div style={{ textAlign: "right" }}>
//                     {appliedCoupon && discount > 0 && (
//                       <div style={{ fontSize: 11, color: "#888", textDecoration: "line-through" }}>₹{basePrice.toFixed(2)}</div>
//                     )}
//                     <div style={{ fontSize: 17, fontWeight: 800, color: "#1b1b1b" }}>₹{finalPrice.toFixed(2)}</div>
//                   </div>
//                 </div>
//                 {discount > 0 && (
//                   <div style={{ fontSize: 12, color: "#3d7a1a", marginTop: 4, fontWeight: 600 }}>
//                     🎉 You save ₹{(discount + mhcPts).toFixed(2)} on this order
//                   </div>
//                 )}
//               </div>

//               {/* Desktop pay button */}
//               {!isMobile && (
//                 <>
//                   <button
//                     onClick={handlePay}
//                     disabled={processing}
//                     style={{
//                       width: "100%", background: processing ? "#e0e0d0" : "linear-gradient(135deg, #d4e82d 0%, #C5D82D 100%)",
//                       border: "none", borderRadius: 8, padding: "15px",
//                       fontSize: 15, fontWeight: 700, cursor: processing ? "not-allowed" : "pointer",
//                       color: "#1b1b1b", letterSpacing: -0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                       boxShadow: processing ? "none" : "0 4px 16px #C5D82D55",
//                       transition: "all 0.2s",
//                     }}
//                   >
//                     {processing && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
//                     {processing ? "Processing…" : `Pay ₹${(appliedCoupon ? finalPrice : basePrice - mhcPts).toFixed(2)}`}
//                   </button>
//                   <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
//                     <Lock size={11} /> Secured by Razorpay · 256-bit SSL
//                   </div>
//                 </>
//               )}
//             </div>
//           </StepShell>

//         </div>

//         {/* ═══ RIGHT: Coupon + Price Summary ══════════════════════════════ */}
//         <div style={{ position: isMobile ? "relative" : "sticky", top: 72, display: "flex", flexDirection: "column", gap: 10 }}>
//           <CouponPanel />
//           <PriceSummary />
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

//       {/* ── Mobile sticky pay button ─────────────────────────────────────── */}
//       {isMobile && step === 3 && (
//         <div className="pay-btn-mobile">
//           <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e5e0" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//               <div>
//                 <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>TOTAL AMOUNT</div>
//                 <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
//                   {appliedCoupon && discount > 0 && (
//                     <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>₹{basePrice.toFixed(2)}</span>
//                   )}
//                   <span style={{ fontSize: 20, fontWeight: 800, color: "#1b1b1b" }}>₹{finalPrice.toFixed(2)}</span>
//                 </div>
//                 {discount > 0 && <div style={{ fontSize: 11, color: "#3d7a1a", fontWeight: 600 }}>You save ₹{discount.toFixed(2)}</div>}
//               </div>
//               <button
//                 onClick={handlePay}
//                 disabled={processing}
//                 style={{
//                   background: processing ? "#e0e0d0" : "linear-gradient(135deg, #d4e82d 0%, #C5D82D 100%)",
//                   border: "none", borderRadius: 10, padding: "13px 28px",
//                   fontSize: 15, fontWeight: 800, cursor: processing ? "not-allowed" : "pointer",
//                   color: "#1b1b1b", display: "flex", alignItems: "center", gap: 8,
//                   boxShadow: processing ? "none" : "0 4px 16px #C5D82D66",
//                   letterSpacing: -0.3,
//                 }}
//               >
//                 {processing ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
//                 {processing ? "Wait…" : "Pay Now"}
//               </button>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10, color: "#bbb" }}>
//               <Lock size={10} /> Secured by Razorpay · 256-bit SSL
//             </div>
//           </div>
//         </div>
//       )}

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
//   const active = currentStep === stepNum;
//   const completed = currentStep > stepNum;
//   const locked = currentStep < stepNum;

//   return (
//     <div style={{
//       background: "#fff", border: "1px solid #e0e0e0",
//       borderTop: active ? "2px solid #C5D82D" : "1px solid #e0e0e0",
//       marginBottom: 0, borderBottom: "none",
//       opacity: locked ? 0.5 : 1,
//       transition: "opacity 0.2s",
//     }}>
//       <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
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
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <span style={{ fontSize: 13, fontWeight: 700, color: completed ? "#888" : "#1b1b1b", textTransform: "uppercase", letterSpacing: 0.6 }}>
//               {label}
//             </span>
//             {completed && onEdit && (
//               <button onClick={onEdit} style={{ fontSize: 12, fontWeight: 600, color: "#2874f0", background: "none", border: "none", cursor: "pointer" }}>
//                 CHANGE
//               </button>
//             )}
//           </div>
//           {completed && completedSummary && <div style={{ marginTop: 2 }}>{completedSummary}</div>}
//         </div>
//       </div>
//       {active && <div style={{ padding: "0 20px 20px" }}>{children}</div>}
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
//   X, ChevronRight, CheckCircle, Truck, CalendarDays, Package, Tag, BadgePercent, Gift,
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { useCart } from "@/components/grasa/CartContext";
// import { BASE_URL } from "@/components/config/api";

// // ── API ───────────────────────────────────────────────────────────────────────
// const CART_URL = `${BASE_URL}/grasa/shop/cart`;
// const ORDER_URL = `${BASE_URL}/grasa/shop/orders`;
// // const CONFIRM_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
// const CONFIRM_URL = `${BASE_URL}/grasa/shop/orders`;
// const LOC_URL = `${BASE_URL}/api/locations`;
// const COUPON_VALIDATE_URL = `${BASE_URL}/grasa/shop/coupons/validate`;

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
// interface Coupon {
//   id: number; coupon_code: string; description: string | null;
//   discount_type: string; discount_value: string;
//   min_order_amount: string; max_discount_amount: string;
//   is_active: boolean;
// }
// interface CouponResult {
//   is_valid: boolean; coupon_code: string; discount: number;
//   subtotal: number; final_price: number; message: string;
// }

// type Step = 1 | 2 | 3;

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, refreshCart } = useCart();
//   const token = typeof window !== "undefined" ? getCookie("token") : null;

//   // Cart meta
//   const [cartId, setCartId] = useState<number | null>(null);
//   const [total, setTotal] = useState(0);
//   const [basePrice, setBasePrice] = useState(0);
//   const [mhcPts, setMhcPts] = useState(0);
//   const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

//   // Coupon state
//   const [couponInput, setCouponInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
//   const [couponLoading, setCouponLoading] = useState(false);
//   const [finalPrice, setFinalPrice] = useState(0);
//   const [discount, setDiscount] = useState(0);

//   // Steps
//   const [step, setStep] = useState<Step>(1);
//   const [loading, setLoading] = useState(true);
//   const [loadingMeta, setLoadingMeta] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [processing, setProc] = useState(false);
//   const [orderDone, setOrderDone] = useState(false);
//   const [isMobile, setMobile] = useState(false);

//   // Order response data
//   const [orderData, setOrderData] = useState<any>(null);

//   // Address
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [addrLoading, setAddrLoading] = useState(true);
//   const [defaultAddr, setDefaultAddr] = useState<Address | null>(null);
//   const [showAddrPanel, setShowAddrPanel] = useState(false);
//   const [deleting, setDeleting] = useState<number | null>(null);
//   const [editing, setEditing] = useState<number | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [adding, setAdding] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [countries, setCountries] = useState<Opt[]>([]);
//   const [states, setStates] = useState<Opt[]>([]);
//   const [cities, setCities] = useState<Opt[]>([]);
//   const [form, setForm] = useState<any>({
//     street: "", landmark: "", postal_code: "",
//     country_id: 0, state_id: 0, city_id: 0, address_type: "home",
//   });

//   // Date
//   const [selDate, setSelDate] = useState("");
//   const today = new Date();
//   const minDate = (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split("T")[0]; })();
//   const quickDates = ([3, 6] as const).map(wd => {
//     const d = nextBakeDay(today, wd);
//     return { label: wd === 3 ? "Wednesday" : "Saturday", value: d.toISOString().split("T")[0], display: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) };
//   });

//   // Post-order modal
//   const [modalOpen, setModalOpen] = useState(false);
//   const [countdown, setCountdown] = useState(10);
//   const [nextOpts, setNextOpts] = useState<{ key: string; date: Date; display: string }[]>([]);
//   const [nextSel, setNextSel] = useState("");

//   // Razorpay
//   const [rzpLoaded, setRzpLoaded] = useState(false);

//   const skipAutoStepRef = useRef(false);
//   const [showOrderSummary, setShowOrderSummary] = useState(false);

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
//       const bp = safeNum(d?.base_price);
//       setTotal(bp);
//       setBasePrice(bp);
//       setFinalPrice(bp);
//       if (d?.available_coupons) setAvailableCoupons(d.available_coupons);
//     } catch { }
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

//   // ── Coupon Logic ─────────────────────────────────────────────────────────
//   const handleApplyCoupon = async (code?: string) => {
//     const couponCode = code ?? couponInput.trim().toUpperCase();
//     if (!couponCode) { toast.error("Enter a coupon code"); return; }
//     if (!cartId) { toast.error("Cart not loaded yet"); return; }
//     setCouponLoading(true);
//     try {
//       const r = await fetch(COUPON_VALIDATE_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ coupon_code: couponCode, cart_id: cartId }),
//       });
//       const data = await r.json();
//       if (!r.ok || r.status === 404 || data.is_valid === false) {
//         toast.error(data?.message ?? "Invalid coupon code");
//         return;
//       }
//       setAppliedCoupon(data);
//       setDiscount(safeNum(data.discount));
//       setFinalPrice(safeNum(data.final_price));
//       setTotal(safeNum(data.final_price));
//       setCouponInput(couponCode);
//       toast.success("Coupon applied!");
//     } catch {
//       toast.error("Failed to validate coupon");
//     } finally {
//       setCouponLoading(false);
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     setDiscount(0);
//     setFinalPrice(basePrice);
//     setTotal(basePrice);
//     setCouponInput("");
//     toast.success("Coupon removed");
//   };

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
//       if (d.state?.id) { const s = await fetch(`${LOC_URL}/citylist?state_id=${d.state.id}`); setCities(s.ok ? await s.json() : []); }
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
//     if (skipAutoStepRef.current) { skipAutoStepRef.current = false; return; }
//     if (step === 2 && selDate) {
//       const timer = setTimeout(() => setStep(3), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [step, selDate]);

//   // ── Payment Flow ──────────────────────────────────────────────────────────
//   const handlePay = useCallback(async () => {
//     if (!defaultAddr) { toast.error("Select a delivery address"); return; }
//     if (!selDate) { toast.error("Choose a delivery date"); return; }
//     setProc(true);

//     let ph: Window | null = null;
//     try { ph = window.open("", "rzp_ph", "width=100,height=100"); } catch { }

//     try {
//       // Step 1: Create order via order API
//       const orderRes = await fetch(ORDER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           cart_id: cartId ?? 0,
//           shipping_address_id: defaultAddr?.id ?? 0,
//           mhc_points: mhcPts.toString(),
//           coupon_code: appliedCoupon?.coupon_code ?? "",
//           currency: "INR",
//           notes: `delivery_date:${selDate}`,
//           source: "GRASAMILLETS",
//           items: (cart || []).map((i: any) => ({
//             product_id: i.product_id ?? i.id,
//             quantity: i.quantity ?? 1,
//             unit_price: safeNum(i.effective_price ?? i.price).toString(),
//           })),
//         }),
//       });

//       const orderResponse = await orderRes.json().catch(() => null);
      
//       if (!orderRes.ok || !orderResponse?.order) { 
//         toast.error("Order creation failed"); 
//         setProc(false); 
//         ph?.close(); 
//         return; 
//       }

//       // Store order data for success modal
//       setOrderData(orderResponse.order);

//       // Step 2: Initialize Razorpay payment
//       const razorpayCheckout = orderResponse.razorpay_checkout;
      
//       if (!razorpayCheckout?.order_id) {
//         toast.error("Payment initialization failed");
//         setProc(false);
//         ph?.close();
//         return;
//       }

//       const rzp = new (window as any).Razorpay({
//         key: razorpayCheckout.key_id,
//         amount: razorpayCheckout.amount,
//         currency: razorpayCheckout.currency ?? "INR",
//         name: "GRASA",
//         description: "Order Payment",
//         order_id: razorpayCheckout.order_id,
//         prefill: {
//           email: orderResponse.user_email || "",
//           contact: orderResponse.user_phone || "",
//         },
//         handler: async (resp: any) => {
//           setProc(true);
//           try {
//             // Step 3: Confirm payment
//             // order id from order response
//             const orderId = orderResponse?.order?.id;

//             if (!orderId) {
//               toast.error("Order ID missing");
//               return;
//             }

//             const cfRes = await fetch(
//               `${BASE_URL}/grasa/shop/orders/${orderId}/confirm`,
//               {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                 },
//                 body: JSON.stringify({
//                   razorpay_payment_id: resp.razorpay_payment_id,
//                   razorpay_signature: resp.razorpay_signature,
//                 }),
//               }
//             );

//             const confirmData = await cfRes.json().catch(() => null);

//             if (!cfRes.ok) {
//               toast.error(confirmData?.message || "Payment verification failed");
//               setProc(false);
//               return;
//             }

//             // Payment successful
//             setOrderDone(true);
//             clearCart();
//             try { await refreshCart(); } catch { }
//           } catch (err) {
//             console.error("Payment finalization error:", err);
//             toast.error("Failed to finalize order");
//           } finally {
//             setProc(false);
//           }
//         },
//         modal: {
//           escape: true,
//           ondismiss: () => {
//             toast.error("Payment cancelled");
//             setProc(false);
//           },
//         },
//       });

//       rzp.on?.("payment.failed", (error: any) => {
//         console.error("Razorpay error:", error);
//         toast.error("Payment failed: " + (error?.description || "Unknown error"));
//         setProc(false);
//         ph?.close();
//       });

//       rzp.open();
//       setTimeout(() => { try { if (ph && !ph.closed) ph.close(); } catch { } }, 500);
//     } catch (err) {
//       console.error("Payment error:", err);
//       toast.error("Payment failed");
//       setProc(false);
//       ph?.close();
//     }
//   }, [cart, total, mhcPts, token, defaultAddr, selDate, cartId, appliedCoupon, clearCart, refreshCart, setProc]);



//   // ── Post-order modal ─────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!orderDone) return;
//     const t = new Date();
//     setNextOpts([
//       { key: "wed", date: nextBakeDay(t, 3), display: nextBakeDay(t, 3).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) },
//       { key: "sat", date: nextBakeDay(t, 6), display: nextBakeDay(t, 6).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) },
//     ]);
//     setNextSel("");
//     setModalOpen(true);
//     setCountdown(10);
//   }, [orderDone]);

//   useEffect(() => {
//     if (!modalOpen) return;
//     const i = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(i); return 0; } return c - 1; }), 1000);
//     return () => clearInterval(i);
//   }, [modalOpen]);

//   useEffect(() => { if (modalOpen && countdown === 0) { setModalOpen(false); router.push("/shop/orders"); } }, [countdown, modalOpen, router]);

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

//   // ── Coupon Panel Component ────────────────────────────────────────────────
//   const CouponPanel = () => (
//     <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden", marginBottom: 10 }}>
//       <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
//           Coupons & Offers
//         </span>
//       </div>
//       <div style={{ padding: "14px 16px" }}>
//         {appliedCoupon ? (
//           <div style={{
//             border: "1.5px dashed #7ab648",
//             borderRadius: 8,
//             padding: "12px 14px",
//             background: "linear-gradient(135deg, #f0fce8 0%, #f8fdf2 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 10,
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8f5d8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                 <Tag size={15} style={{ color: "#5a9e2f" }} />
//               </div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: "#2e7d32", letterSpacing: 0.3 }}>
//                   {appliedCoupon.coupon_code}
//                 </div>
//                 <div style={{ fontSize: 11, color: "#5a9e2f", marginTop: 1 }}>
//                   Coupon applied successfully
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={handleRemoveCoupon}
//               style={{
//                 background: "none", border: "none", cursor: "pointer",
//                 fontSize: 12, fontWeight: 700, color: "#e53935",
//                 textTransform: "uppercase", letterSpacing: 0.3, padding: "4px 8px",
//                 borderRadius: 4, transition: "background 0.15s",
//               }}
//             >
//               REMOVE
//             </button>
//           </div>
//         ) : (
//           <>
//             <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
//               <input
//                 placeholder="ENTER COUPON CODE"
//                 value={couponInput}
//                 onChange={e => setCouponInput(e.target.value.toUpperCase())}
//                 onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
//                 style={{
//                   flex: 1, border: "1.5px solid #e0e0e0", borderRadius: 6,
//                   padding: "9px 12px", fontSize: 13, color: "#1b1b1b",
//                   background: "#fafafa", outline: "none", letterSpacing: 0.5,
//                   fontWeight: 500,
//                 }}
//               />
//               <button
//                 onClick={() => handleApplyCoupon()}
//                 disabled={couponLoading || !couponInput.trim()}
//                 style={{
//                   background: couponInput.trim() ? "#C5D82D" : "#f0f0f0",
//                   border: "none", borderRadius: 6, padding: "9px 16px",
//                   fontSize: 13, fontWeight: 700, cursor: couponInput.trim() ? "pointer" : "not-allowed",
//                   color: couponInput.trim() ? "#1b1b1b" : "#aaa",
//                   transition: "all 0.15s", minWidth: 72, display: "flex", alignItems: "center", justifyContent: "center",
//                 }}
//               >
//                 {couponLoading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : "Apply"}
//               </button>
//             </div>

//             {availableCoupons.length > 0 && (
//               <div style={{ display: "grid", gridTemplateColumns: availableCoupons.length === 1 ? "1fr" : "1fr 1fr", gap: 8 }}>
//                 {availableCoupons.map(c => (
//                   <div key={c.id} style={{
//                     border: "1.5px dashed #c8e6c9",
//                     borderRadius: 8,
//                     padding: "10px 12px",
//                     background: "#fafff5",
//                     position: "relative",
//                     overflow: "hidden",
//                   }}>
//                     <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: "#C5D82D", borderRadius: "8px 0 0 8px" }} />
//                     <div style={{ fontSize: 12, fontWeight: 800, color: "#1b1b1b", letterSpacing: 0.4, marginBottom: 3 }}>
//                       {c.coupon_code}
//                     </div>
//                     <div style={{ fontSize: 11, color: "#5a9e2f", fontWeight: 500, marginBottom: 8 }}>
//                       Flat ₹{safeNum(c.discount_value).toFixed(0)} OFF
//                     </div>
//                     <button
//                       onClick={() => handleApplyCoupon(c.coupon_code)}
//                       disabled={couponLoading}
//                       style={{
//                         background: "#C5D82D", border: "none", borderRadius: 4,
//                         padding: "5px 12px", fontSize: 11, fontWeight: 700,
//                         cursor: "pointer", color: "#1b1b1b", letterSpacing: 0.2,
//                         display: "flex", alignItems: "center", gap: 4,
//                       }}
//                     >
//                       {couponLoading ? <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} /> : "Apply"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );

//   // ── Price Summary Component ───────────────────────────────────────────────
//   const PriceSummary = () => (
//     <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
//       <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
//           Price Details
//         </span>
//       </div>
//       <div style={{ padding: "16px" }}>
//         <PriceRow label={`Price (${totalItems} item${totalItems !== 1 ? "s" : ""})`} value={`₹${basePrice.toFixed(2)}`} />
//         <PriceRow label="Delivery charges" value="FREE" valueColor="#3d7a1a" />
//         {mhcPts > 0 && <PriceRow label="MHC Points discount" value={`-₹${mhcPts.toFixed(2)}`} valueColor="#3d7a1a" />}
//         {appliedCoupon && discount > 0 && (
//           <PriceRow
//             label={`Discount (${appliedCoupon.coupon_code})`}
//             value={`- ₹${discount.toFixed(2)}`}
//             valueColor="#2e7d32"
//           />
//         )}
//         <div style={{ height: 1, background: "#e5e5e0", margin: "12px 0" }} />
//         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>
//           <span>Total Amount</span>
//           <span>₹{finalPrice.toFixed(2)}</span>
//         </div>
//         {(discount > 0 || mhcPts > 0) && (
//           <div style={{ marginTop: 10, fontSize: 12, color: "#3d7a1a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, background: "#f0fce8", borderRadius: 6, padding: "6px 10px" }}>
//             🎉 You save ₹{(discount + mhcPts).toFixed(2)} on this order
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="checkout-root" style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
//         .checkout-root *, .checkout-root *::before, .checkout-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         .checkout-root button, .checkout-root input, .checkout-root select { font-family: inherit; }
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
//         @keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
//         @keyframes bounce  { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
//         .coupon-card:hover { border-color: #C5D82D !important; background: #f5fee8 !important; }
//         .pay-btn-mobile { 
//           position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
//           padding: 12px 16px 28px;
//           background: linear-gradient(to top, #f1f3f6 70%, rgba(241,243,246,0));
//         }
//       `}</style>

//       <Toaster position={isMobile ? "top-center" : "bottom-right"}
//         toastOptions={{ duration: 2500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} />

//       {/* ── Top nav ──────────────────────────────────────────────────────── */}
//       <div style={{ padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "center", position: "sticky", top: 0, zIndex: 40, background: "#fff", borderBottom: "1px solid #e5e5e0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
//           {(["Address", "Order Summary", "Payment"] as const).map((label, i) => {
//             const s = (i + 1) as Step;
//             const active = step === s;
//             const done = step > s;
//             return (
//               <React.Fragment key={label}>
//                 {i > 0 && <div style={{ width: isMobile ? 20 : 40, height: 1.5, background: done ? "#C5D82D" : "#e0e0e0", transition: "background 0.3s" }} />}
//                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
//                   <div style={{
//                     width: 28, height: 28, borderRadius: "50%",
//                     background: done ? "#C5D82D" : active ? "#1b1b1b" : "#f0f0f0",
//                     border: active ? "2.5px solid #C5D82D" : "none",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: 11, fontWeight: 700,
//                     color: done ? "#1b1b1b" : active ? "#C5D82D" : "#bbb",
//                     transition: "all 0.25s",
//                     boxShadow: active ? "0 0 0 4px #C5D82D22" : "none",
//                   }}>
//                     {done ? <CheckCircle size={15} strokeWidth={3} /> : i + 1}
//                   </div>
//                   {!isMobile && (
//                     <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#1b1b1b" : done ? "#3d7a1a" : "#aaa", whiteSpace: "nowrap", letterSpacing: 0.3 }}>
//                       {label}
//                     </span>
//                   )}
//                 </div>
//               </React.Fragment>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Main layout ───────────────────────────────────────────────────── */}
//       <div style={{
//         maxWidth: 1060, margin: "0 auto", padding: isMobile ? "12px 10px 120px" : "20px 16px 60px",
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
//                           {defaultAddr.street}{defaultAddr.landmark ? `, ${defaultAddr.landmark}` : ""}
//                         </div>
//                         <div style={{ fontSize: 13, color: "#555" }}>{defaultAddr.city}, {defaultAddr.state} — {defaultAddr.postal_code}</div>
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

//                 {showAddrPanel && (
//                   <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, overflow: "hidden", marginBottom: 14, animation: "fadeIn 0.15s ease" }}>
//                     {addresses.map((a, idx) => {
//                       const sel = defaultAddr?.id === a.id;
//                       return (
//                         <div key={a.id} style={{ borderBottom: idx < addresses.length - 1 ? "1px solid #f0f0e8" : "none", padding: "12px 14px", background: sel ? "#fdfde8" : "#fff", display: "flex", alignItems: "flex-start", gap: 10 }}>
//                           <div onClick={() => { setDefaultAddr(a); setShowAddrPanel(false); }} style={{ flex: 1, cursor: "pointer" }}>
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
//                     <div onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#2874f0", fontSize: 13, fontWeight: 600, background: "#f9f9ff" }}>
//                       <Plus size={15} /> Add new address
//                     </div>
//                   </div>
//                 )}

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
//             stepNum={2}
//             label="ORDER SUMMARY"
//             currentStep={step}
//             completedSummary={
//               <span style={{ fontSize: 13, color: "#555" }}>
//                 {totalItems} item{totalItems !== 1 ? "s" : ""} · <strong style={{ color: "#1b1b1b" }}>₹{basePrice.toFixed(2)}</strong>
//                 {selDate && <> · <span style={{ color: "#3d7a1a" }}>{fmtDate(selDate)}</span></>}
//               </span>
//             }
//             onEdit={() => { skipAutoStepRef.current = true; setShowOrderSummary(true); setStep(2); }}
//           >
//             <div style={{ animation: "fadeIn 0.2s ease" }}>
//               <div style={{ marginBottom: 20 }}>
//                 {(cart || []).map((item: any, i: number) => {
//                   const name = item.name ?? item.title ?? item.product_name ?? `Item #${item.id}`;
//                   const qty = item.quantity ?? 1;
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

//               {/* Delivery date */}
//               <div style={{ background: "#fafce8", border: "1.5px solid #C5D82D66", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
//                   <Truck size={15} style={{ color: "#5c8a1e" }} />
//                   <span style={{ fontSize: 13, fontWeight: 700, color: "#3d5c10", textTransform: "uppercase", letterSpacing: 0.4 }}>Choose Delivery Date</span>
//                 </div>
//                 <p style={{ fontSize: 12, color: "#6b8a3a", marginBottom: 12, lineHeight: 1.5 }}>
//                   We bake fresh! Minimum 5 days from today. Pick your bake day:
//                 </p>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
//                   {quickDates.map(qd => (
//                     <div key={qd.value} onClick={() => setSelDate(qd.value)} style={{
//                       border: `2px solid ${selDate === qd.value ? "#C5D82D" : "#dde8a0"}`,
//                       borderRadius: 8, padding: "10px", cursor: "pointer", textAlign: "center",
//                       background: selDate === qd.value ? "#fff" : "#f5f8e4",
//                       boxShadow: selDate === qd.value ? "0 0 0 3px #C5D82D33" : "none",
//                       transition: "all 0.15s", position: "relative",
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
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <CalendarDays size={15} style={{ color: "#5c8a1e", flexShrink: 0, marginTop: 2 }} />
//                 <div>
//                   <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 1 }}>Delivery on</div>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>{fmtDate(selDate)}</div>
//                 </div>
//               </div>
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <MapPin size={15} style={{ color: "#888", flexShrink: 0, marginTop: 2 }} />
//                 <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
//                   <strong style={{ color: "#1b1b1b" }}>Delivering to:</strong> {defaultAddr?.street}, {defaultAddr?.city}, {defaultAddr?.state} — {defaultAddr?.postal_code}
//                 </div>
//               </div>

//               {/* Order total recap */}
//               <div style={{ background: "#fafce8", border: "1px solid #C5D82D44", borderRadius: 8, padding: "12px 14px", marginBottom: 18 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <span style={{ fontSize: 13, color: "#555" }}>
//                     {totalItems} item{totalItems !== 1 ? "s" : ""}
//                     {appliedCoupon && <span style={{ marginLeft: 6, fontSize: 11, color: "#5a9e2f", fontWeight: 600 }}>· {appliedCoupon.coupon_code} applied</span>}
//                   </span>
//                   <div style={{ textAlign: "right" }}>
//                     {appliedCoupon && discount > 0 && (
//                       <div style={{ fontSize: 11, color: "#888", textDecoration: "line-through" }}>₹{basePrice.toFixed(2)}</div>
//                     )}
//                     <div style={{ fontSize: 17, fontWeight: 800, color: "#1b1b1b" }}>₹{finalPrice.toFixed(2)}</div>
//                   </div>
//                 </div>
//                 {discount > 0 && (
//                   <div style={{ fontSize: 12, color: "#3d7a1a", marginTop: 4, fontWeight: 600 }}>
//                     🎉 You save ₹{(discount + mhcPts).toFixed(2)} on this order
//                   </div>
//                 )}
//               </div>

//               {/* Desktop pay button */}
//               {!isMobile && (
//                 <>
//                   <button
//                     onClick={handlePay}
//                     disabled={processing}
//                     style={{
//                       width: "100%", background: processing ? "#e0e0d0" : "linear-gradient(135deg, #d4e82d 0%, #C5D82D 100%)",
//                       border: "none", borderRadius: 8, padding: "15px",
//                       fontSize: 15, fontWeight: 700, cursor: processing ? "not-allowed" : "pointer",
//                       color: "#1b1b1b", letterSpacing: -0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                       boxShadow: processing ? "none" : "0 4px 16px #C5D82D55",
//                       transition: "all 0.2s",
//                     }}
//                   >
//                     {processing && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
//                     {processing ? "Processing…" : `Pay ₹${(appliedCoupon ? finalPrice : basePrice - mhcPts).toFixed(2)}`}
//                   </button>
//                   <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
//                     <Lock size={11} /> Secured by Razorpay · 256-bit SSL
//                   </div>
//                 </>
//               )}
//             </div>
//           </StepShell>

//         </div>

//         {/* ═══ RIGHT: Coupon + Price Summary ══════════════════════════════ */}
//         <div style={{ position: isMobile ? "relative" : "sticky", top: 72, display: "flex", flexDirection: "column", gap: 10 }}>
//           <CouponPanel />
//           <PriceSummary />
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

//       {/* ── Mobile sticky pay button ─────────────────────────────────────── */}
//       {isMobile && step === 3 && (
//         <div className="pay-btn-mobile">
//           <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e5e0" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//               <div>
//                 <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>TOTAL AMOUNT</div>
//                 <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
//                   {appliedCoupon && discount > 0 && (
//                     <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>₹{basePrice.toFixed(2)}</span>
//                   )}
//                   <span style={{ fontSize: 20, fontWeight: 800, color: "#1b1b1b" }}>₹{finalPrice.toFixed(2)}</span>
//                 </div>
//                 {discount > 0 && <div style={{ fontSize: 11, color: "#3d7a1a", fontWeight: 600 }}>You save ₹{discount.toFixed(2)}</div>}
//               </div>
//               <button
//                 onClick={handlePay}
//                 disabled={processing}
//                 style={{
//                   background: processing ? "#e0e0d0" : "linear-gradient(135deg, #d4e82d 0%, #C5D82D 100%)",
//                   border: "none", borderRadius: 10, padding: "13px 28px",
//                   fontSize: 15, fontWeight: 800, cursor: processing ? "not-allowed" : "pointer",
//                   color: "#1b1b1b", display: "flex", alignItems: "center", gap: 8,
//                   boxShadow: processing ? "none" : "0 4px 16px #C5D82D66",
//                   letterSpacing: -0.3,
//                 }}
//               >
//                 {processing ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
//                 {processing ? "Wait…" : "Pay Now"}
//               </button>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10, color: "#bbb" }}>
//               <Lock size={10} /> Secured by Razorpay · 256-bit SSL
//             </div>
//           </div>
//         </div>
//       )}

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

//       {/* ── Post-order modal (SUCCESS MODAL) ──────────────────────────────── */}
//       {modalOpen && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 70, overflow: "auto" }}>
//           <div style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : "12px", padding: isMobile ? "24px 16px" : "32px", width: "100%", maxWidth: 450, animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease", maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto" }}>
//             {/* Animated celebration icon */}
//             <div style={{ fontSize: 48, marginBottom: 16, textAlign: "center", animation: "bounce 1s ease-in-out infinite" }}>
//               🎉
//             </div>

//             <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: "center", color: "#1b1b1b" }}>
//               Order Confirmed!
//             </h2>

//             <p style={{ fontSize: 14, color: "#666", marginBottom: 20, textAlign: "center", lineHeight: 1.6 }}>
//               Your order has been placed successfully. A confirmation email has been sent to your registered email address.
//             </p>

//             {/* Order details from API response */}
//             {orderData && (
//               <div style={{ background: "#f9f8f4", borderRadius: 10, padding: "16px", marginBottom: 20 }}>
//                 <div style={{ marginBottom: 12 }}>
//                   <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3 }}>
//                     Order Number
//                   </div>
//                   <div style={{ fontSize: 16, fontWeight: 800, color: "#1b1b1b", letterSpacing: 0.5 }}>
//                     #{orderData.id || "—"}
//                   </div>
//                 </div>

//                 <div style={{ height: 1, background: "#e5e5e0", marginBottom: 12 }} />

//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                   <div>
//                     <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3 }}>
//                       Order Total
//                     </div>
//                     <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>
//                       ₹{safeNum(orderData.total_amount).toFixed(2)}
//                     </div>
//                   </div>

//                   <div>
//                     <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3 }}>
//                       Items
//                     </div>
//                     <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>
//                       {orderData.items?.length || 0} Item{(orderData.items?.length || 0) !== 1 ? "s" : ""}
//                     </div>
//                   </div>
//                 </div>

//                 {orderData.discount_amount > 0 && (
//                   <>
//                     <div style={{ height: 1, background: "#e5e5e0", margin: "12px 0" }} />
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                       <span style={{ fontSize: 12, color: "#5a9e2f", fontWeight: 600 }}>💰 Discount Applied</span>
//                       <span style={{ fontSize: 13, fontWeight: 700, color: "#2e7d32 " }}>-₹{safeNum(orderData.discount_amount).toFixed(2)}</span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}

//             {/* Delivery date selection */}
//             <div style={{ marginBottom: 20 }}>
//               <p style={{ fontSize: 13, fontWeight: 600, color: "#1b1b1b", marginBottom: 10 }}>
//                 📅 Choose your next delivery date
//               </p>
//               <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                 {nextOpts.map(o => (
//                   <label key={o.key} style={{ 
//                     display: "flex", 
//                     alignItems: "center", 
//                     justifyContent: "space-between",
//                     border: `2px solid ${nextSel === o.key ? "#C5D82D" : "#e5e5e0"}`, 
//                     borderRadius: 10, 
//                     padding: "14px 16px", 
//                     cursor: "pointer", 
//                     background: nextSel === o.key ? "#fdfde8" : "#fff", 
//                     transition: "all 0.15s",
//                     boxShadow: nextSel === o.key ? "0 0 0 3px #C5D82D22" : "none"
//                   }}>
//                     <span style={{ fontSize: 14, fontWeight: 600, color: "#1b1b1b" }}>
//                       {o.display}
//                     </span>
//                     <input 
//                       type="radio" 
//                       checked={nextSel === o.key} 
//                       onChange={() => setNextSel(o.key)} 
//                       style={{ cursor: "pointer", width: 16, height: 16 }} 
//                     />
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Auto-redirect countdown */}
//             <p style={{ fontSize: 12, color: "#aaa", textAlign: "center", marginBottom: 16 }}>
//               Redirecting to orders page in <strong>{countdown}s</strong>
//             </p>

//             {/* Buttons */}
//             <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
//               <button 
//                 onClick={() => {
//                   if (!nextSel) { toast.error("Pick a date"); return; }
//                   const opt = nextOpts.find(o => o.key === nextSel);
//                   if (!opt) return;
//                   localStorage.setItem("selectedDelivery", JSON.stringify({ day: opt.key, date: opt.date.toISOString(), display: opt.display }));
//                   setModalOpen(false);
//                   router.push("/products");
//                 }} 
//                 style={{ ...primaryBtn, width: "100%", fontSize: 15 }}>
//                 Continue Shopping
//               </button>
//               <button 
//                 onClick={() => { setModalOpen(false); router.push("/shop/orders"); }} 
//                 style={{ 
//                   width: "100%", 
//                   padding: "12px 24px", 
//                   border: "2px solid #C5D82D", 
//                   background: "transparent",
//                   borderRadius: 6, 
//                   fontSize: 14, 
//                   fontWeight: 700, 
//                   cursor: "pointer", 
//                   color: "#C5D82D",
//                   transition: "all 0.2s"
//                 }}>
//                 View My Orders
//               </button>
//             </div>
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
//   const active = currentStep === stepNum;
//   const completed = currentStep > stepNum;
//   const locked = currentStep < stepNum;

//   return (
//     <div style={{
//       background: "#fff", border: "1px solid #e0e0e0",
//       borderTop: active ? "2px solid #C5D82D" : "1px solid #e0e0e0",
//       marginBottom: 0, borderBottom: "none",
//       opacity: locked ? 0.5 : 1,
//       transition: "opacity 0.2s",
//     }}>
//       <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
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
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <span style={{ fontSize: 13, fontWeight: 700, color: completed ? "#888" : "#1b1b1b", textTransform: "uppercase", letterSpacing: 0.6 }}>
//               {label}
//             </span>
//             {completed && onEdit && (
//               <button onClick={onEdit} style={{ fontSize: 12, fontWeight: 600, color: "#2874f0", background: "none", border: "none", cursor: "pointer" }}>
//                 CHANGE
//               </button>
//             )}
//           </div>
//           {completed && completedSummary && <div style={{ marginTop: 2 }}>{completedSummary}</div>}
//         </div>
//       </div>
//       {active && <div style={{ padding: "0 20px 20px" }}>{children}</div>}
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
  X, ChevronRight, CheckCircle, Truck, CalendarDays, Package, Tag, BadgePercent, Gift,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "@/components/grasa/CartContext";
import { BASE_URL } from "@/components/config/api";

// ── API ───────────────────────────────────────────────────────────────────────
const CART_URL = `${BASE_URL}/grasa/shop/cart`;
const ORDER_URL = `${BASE_URL}/grasa/shop/orders`;
// const CONFIRM_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
const CONFIRM_URL = `${BASE_URL}/grasa/shop/orders`;
const LOC_URL = `${BASE_URL}/api/locations`;
const COUPON_VALIDATE_URL = `${BASE_URL}/grasa/shop/coupons/validate`;

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
interface Coupon {
  id: number; coupon_code: string; description: string | null;
  discount_type: string; discount_value: string;
  min_order_amount: string; max_discount_amount: string;
  is_active: boolean; is_applicable: boolean;
}
interface CouponResult {
  is_valid: boolean; coupon_code: string; discount: number;
  subtotal: number; final_price: number; message: string;
}
interface CartResponse {
  cart: { id: number };
  price_breakup: {
    subtotal: string;
    coupon_discount: string;
    total_after_coupon: string;
    applicable_mhc_points: string;
    final_payable_amount: string;
  };
  available_mhc_points: string;
  available_coupons: Coupon[];
}

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
  const [appliedMhcPts, setAppliedMhcPts] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Steps
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [processing, setProc] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [isMobile, setMobile] = useState(false);

  // Order response data
  const [orderData, setOrderData] = useState<any>(null);

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

  const fetchCartMeta = useCallback(async (couponCode?: string) => {
    if (!token) return;
    try {
      let url = CART_URL;
      if (couponCode) {
        url = `${CART_URL}?coupon_code=${encodeURIComponent(couponCode)}`;
      }
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) return;
      const d = await r.json() as CartResponse;
      
      // Set cart id
      setCartId(d?.cart?.id ?? null);
      
      // Extract price breakup
      const pb = d?.price_breakup;
      const subtotal = safeNum(pb?.subtotal);
      const appliedMhc = safeNum(pb?.applicable_mhc_points);
      const couponDisc = safeNum(pb?.coupon_discount);
      const finalPayable = safeNum(pb?.final_payable_amount);
      
      // Update states
      setBasePrice(subtotal);
      setAppliedMhcPts(appliedMhc);
      setCouponDiscount(couponDisc);
      setTotal(finalPayable);
      setFinalPrice(finalPayable);
      setMhcPts(safeNum(d?.available_mhc_points));
      
      if (d?.available_coupons) setAvailableCoupons(d.available_coupons);
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

  // ── Coupon Logic ─────────────────────────────────────────────────────────
  const handleApplyCoupon = async (code?: string) => {
    const couponCode = code ?? couponInput.trim().toUpperCase();
    if (!couponCode) { toast.error("Enter a coupon code"); return; }
    
    // Check if coupon is applicable
    const coupon = availableCoupons.find(c => c.coupon_code === couponCode);
    if (coupon && !coupon.is_applicable) {
      toast.error("This coupon is not applicable for your order");
      return;
    }
    
    setCouponLoading(true);
    try {
      // Call cart API with coupon code instead of validate API
      await fetchCartMeta(couponCode);
      setAppliedCoupon(couponCode);
      setCouponInput(couponCode);
      toast.success("Coupon applied!");
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponDiscount(0);
    setCouponInput("");
    // Recalculate final price with only MHC points
    const finalPrice = basePrice - appliedMhcPts;
    setFinalPrice(finalPrice);
    setTotal(finalPrice);
    toast.success("Coupon removed");
  };

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
    if (skipAutoStepRef.current) { skipAutoStepRef.current = false; return; }
    if (step === 2 && selDate) {
      const timer = setTimeout(() => setStep(3), 300);
      return () => clearTimeout(timer);
    }
  }, [step, selDate]);

  // ── Payment Flow ──────────────────────────────────────────────────────────
  const handlePay = useCallback(async () => {
    if (!defaultAddr) { toast.error("Select a delivery address"); return; }
    if (!selDate) { toast.error("Choose a delivery date"); return; }
    setProc(true);

    let ph: Window | null = null;
    try { ph = window.open("", "rzp_ph", "width=100,height=100"); } catch { }

    try {
      // Step 1: Create order via order API
      const orderRes = await fetch(ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          cart_id: cartId ?? 0,
          shipping_address_id: defaultAddr?.id ?? 0,
          mhc_points: appliedMhcPts.toString(),
          coupon_code: appliedCoupon ?? "",
          currency: "INR",
          notes: `delivery_date:${selDate}`,
          source: "GRASAMILLETS",
          items: (cart || []).map((i: any) => ({
            product_id: i.product_id ?? i.id,
            quantity: i.quantity ?? 1,
            unit_price: safeNum(i.effective_price ?? i.price).toString(),
          })),
        }),
      });

      const orderResponse = await orderRes.json().catch(() => null);
      
      if (!orderRes.ok || !orderResponse?.order) { 
        toast.error("Order creation failed"); 
        setProc(false); 
        ph?.close(); 
        return; 
      }

      // Store order data for success modal
      setOrderData(orderResponse.order);

      // Step 2: Initialize Razorpay payment
      const razorpayCheckout = orderResponse.razorpay_checkout;
      
      if (!razorpayCheckout?.order_id) {
        toast.error("Payment initialization failed");
        setProc(false);
        ph?.close();
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: razorpayCheckout.key_id,
        amount: razorpayCheckout.amount,
        currency: razorpayCheckout.currency ?? "INR",
        name: "GRASA",
        description: "Order Payment",
        order_id: razorpayCheckout.order_id,
        prefill: {
          email: orderResponse.user_email || "",
          contact: orderResponse.user_phone || "",
        },
        handler: async (resp: any) => {
          setProc(true);
          try {
            // Step 3: Confirm payment
            // order id from order response
            const orderId = orderResponse?.order?.id;

            if (!orderId) {
              toast.error("Order ID missing");
              return;
            }

            const cfRes = await fetch(
              `${BASE_URL}/grasa/shop/orders/${orderId}/confirm`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  razorpay_payment_id: resp.razorpay_payment_id,
                  razorpay_signature: resp.razorpay_signature,
                }),
              }
            );

            const confirmData = await cfRes.json().catch(() => null);

            if (!cfRes.ok) {
              toast.error(confirmData?.message || "Payment verification failed");
              setProc(false);
              return;
            }

            // Payment successful
            setOrderDone(true);
            clearCart();
            try { await refreshCart(); } catch { }
          } catch (err) {
            console.error("Payment finalization error:", err);
            toast.error("Failed to finalize order");
          } finally {
            setProc(false);
          }
        },
        modal: {
          escape: true,
          ondismiss: () => {
            toast.error("Payment cancelled");
            setProc(false);
          },
        },
      });

      rzp.on?.("payment.failed", (error: any) => {
        console.error("Razorpay error:", error);
        toast.error("Payment failed: " + (error?.description || "Unknown error"));
        setProc(false);
        ph?.close();
      });

      rzp.open();
      setTimeout(() => { try { if (ph && !ph.closed) ph.close(); } catch { } }, 500);
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed");
      setProc(false);
      ph?.close();
    }
  }, [cart, total, appliedMhcPts, token, defaultAddr, selDate, cartId, appliedCoupon, clearCart, refreshCart, setProc]);



  // ── Post-order modal ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!orderDone) return;
    const t = new Date();
    setNextOpts([
      { key: "wed", date: nextBakeDay(t, 3), display: nextBakeDay(t, 3).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) },
      { key: "sat", date: nextBakeDay(t, 6), display: nextBakeDay(t, 6).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" }) },
    ]);
    setNextSel("");
    setModalOpen(true);
    setCountdown(10);
  }, [orderDone]);

  useEffect(() => {
    if (!modalOpen) return;
    const i = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(i); return 0; } return c - 1; }), 1000);
    return () => clearInterval(i);
  }, [modalOpen]);

  useEffect(() => { if (modalOpen && countdown === 0) { setModalOpen(false); router.push("/shop/orders"); } }, [countdown, modalOpen, router]);

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

  // ── Coupon Panel Component ────────────────────────────────────────────────
  const CouponPanel = () => (
    <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden", marginBottom: 10 }}>
      <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
          Coupons & Offers
        </span>
      </div>
      <div style={{ padding: "14px 16px" }}>
        {appliedCoupon ? (
          <div style={{
            border: "1.5px dashed #7ab648",
            borderRadius: 8,
            padding: "12px 14px",
            background: "linear-gradient(135deg, #f0fce8 0%, #f8fdf2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8f5d8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Tag size={15} style={{ color: "#5a9e2f" }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#2e7d32", letterSpacing: 0.3 }}>
                  {appliedCoupon}
                </div>
                <div style={{ fontSize: 11, color: "#5a9e2f", marginTop: 1 }}>
                  Coupon applied successfully
                </div>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 700, color: "#e53935",
                textTransform: "uppercase", letterSpacing: 0.3, padding: "4px 8px",
                borderRadius: 4, transition: "background 0.15s",
              }}
            >
              REMOVE
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <input
                placeholder="ENTER COUPON CODE"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                style={{
                  flex: 1, border: "1.5px solid #e0e0e0", borderRadius: 6,
                  padding: "9px 12px", fontSize: 13, color: "#1b1b1b",
                  background: "#fafafa", outline: "none", letterSpacing: 0.5,
                  fontWeight: 500,
                }}
              />
              <button
                onClick={() => handleApplyCoupon()}
                disabled={couponLoading || !couponInput.trim()}
                style={{
                  background: couponInput.trim() ? "#C5D82D" : "#f0f0f0",
                  border: "none", borderRadius: 6, padding: "9px 16px",
                  fontSize: 13, fontWeight: 700, cursor: couponInput.trim() ? "pointer" : "not-allowed",
                  color: couponInput.trim() ? "#1b1b1b" : "#aaa",
                  transition: "all 0.15s", minWidth: 72, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {couponLoading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : "Apply"}
              </button>
            </div>

            {availableCoupons.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: availableCoupons.length === 1 ? "1fr" : "1fr 1fr", gap: 8 }}>
                {availableCoupons.map(c => (
                  <div key={c.id} style={{
                    border: "1.5px dashed #c8e6c9",
                    borderRadius: 8,
                    padding: "10px 12px",
                    background: c.is_applicable ? "#fafff5" : "#f5f5f5",
                    position: "relative",
                    overflow: "hidden",
                    opacity: c.is_applicable ? 1 : 0.6,
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: c.is_applicable ? "#C5D82D" : "#ccc", borderRadius: "8px 0 0 8px" }} />
                    <div style={{ fontSize: 12, fontWeight: 800, color: c.is_applicable ? "#1b1b1b" : "#999", letterSpacing: 0.4, marginBottom: 3 }}>
                      {c.coupon_code}
                    </div>
                    <div style={{ fontSize: 11, color: c.is_applicable ? "#5a9e2f" : "#999", fontWeight: 500, marginBottom: 8 }}>
                      Flat ₹{safeNum(c.discount_value).toFixed(0)} OFF
                    </div>
                    <button
                      onClick={() => handleApplyCoupon(c.coupon_code)}
                      disabled={couponLoading || !c.is_applicable}
                      style={{
                        background: c.is_applicable ? "#C5D82D" : "#ddd", 
                        border: "none", borderRadius: 4,
                        padding: "5px 12px", fontSize: 11, fontWeight: 700,
                        cursor: c.is_applicable ? "pointer" : "not-allowed", 
                        color: c.is_applicable ? "#1b1b1b" : "#999", 
                        letterSpacing: 0.2,
                        display: "flex", alignItems: "center", gap: 4,
                      }}
                    >
                      {couponLoading ? <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} /> : c.is_applicable ? "Apply" : "Not Applicable"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // ── Price Summary Component ───────────────────────────────────────────────
  const PriceSummary = () => (
    <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
      <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
          Price Details
        </span>
      </div>
      <div style={{ padding: "16px" }}>
        <PriceRow label={`Price (${totalItems} item${totalItems !== 1 ? "s" : ""})`} value={`₹${basePrice.toFixed(2)}`} />
        <PriceRow label="Delivery charges" value="FREE" valueColor="#3d7a1a" />
        {appliedMhcPts > 0 && <PriceRow label="MHC Points discount" value={`-₹${appliedMhcPts.toFixed(2)}`} valueColor="#3d7a1a" />}
        {appliedCoupon && couponDiscount > 0 && (
          <PriceRow
            label={`Discount (${appliedCoupon})`}
            value={`- ₹${couponDiscount.toFixed(2)}`}
            valueColor="#2e7d32"
          />
        )}
        <div style={{ height: 1, background: "#e5e5e0", margin: "12px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>
          <span>Total Amount</span>
          <span>₹{finalPrice.toFixed(2)}</span>
        </div>
        {(couponDiscount > 0 || appliedMhcPts > 0) && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#3d7a1a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, background: "#f0fce8", borderRadius: 6, padding: "6px 10px" }}>
            🎉 You save ₹{(couponDiscount + appliedMhcPts).toFixed(2)} on this order
          </div>
        )}
      </div>
    </div>
  );

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
        @keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes bounce  { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .coupon-card:hover { border-color: #C5D82D !important; background: #f5fee8 !important; }
        .pay-btn-mobile { 
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
          padding: 12px 16px 28px;
          background: linear-gradient(to top, #f1f3f6 70%, rgba(241,243,246,0));
        }
      `}</style>

      <Toaster position={isMobile ? "top-center" : "bottom-right"}
        toastOptions={{ duration: 2500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} />

      {/* ── Top nav ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "center", position: "sticky", top: 0, zIndex: 40, background: "#fff", borderBottom: "1px solid #e5e5e0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {(["Address", "Order Summary", "Payment"] as const).map((label, i) => {
            const s = (i + 1) as Step;
            const active = step === s;
            const done = step > s;
            return (
              <React.Fragment key={label}>
                {i > 0 && <div style={{ width: isMobile ? 20 : 40, height: 1.5, background: done ? "#C5D82D" : "#e0e0e0", transition: "background 0.3s" }} />}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: done ? "#C5D82D" : active ? "#1b1b1b" : "#f0f0f0",
                    border: active ? "2.5px solid #C5D82D" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    color: done ? "#1b1b1b" : active ? "#C5D82D" : "#bbb",
                    transition: "all 0.25s",
                    boxShadow: active ? "0 0 0 4px #C5D82D22" : "none",
                  }}>
                    {done ? <CheckCircle size={15} strokeWidth={3} /> : i + 1}
                  </div>
                  {!isMobile && (
                    <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#1b1b1b" : done ? "#3d7a1a" : "#aaa", whiteSpace: "nowrap", letterSpacing: 0.3 }}>
                      {label}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1060, margin: "0 auto", padding: isMobile ? "12px 10px 120px" : "20px 16px 60px",
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
                          {defaultAddr.street}{defaultAddr.landmark ? `, ${defaultAddr.landmark}` : ""}
                        </div>
                        <div style={{ fontSize: 13, color: "#555" }}>{defaultAddr.city}, {defaultAddr.state} — {defaultAddr.postal_code}</div>
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

                {showAddrPanel && (
                  <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, overflow: "hidden", marginBottom: 14, animation: "fadeIn 0.15s ease" }}>
                    {addresses.map((a, idx) => {
                      const sel = defaultAddr?.id === a.id;
                      return (
                        <div key={a.id} style={{ borderBottom: idx < addresses.length - 1 ? "1px solid #f0f0e8" : "none", padding: "12px 14px", background: sel ? "#fdfde8" : "#fff", display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div onClick={() => { setDefaultAddr(a); setShowAddrPanel(false); }} style={{ flex: 1, cursor: "pointer" }}>
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
                    <div onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#2874f0", fontSize: 13, fontWeight: 600, background: "#f9f9ff" }}>
                      <Plus size={15} /> Add new address
                    </div>
                  </div>
                )}

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
                {totalItems} item{totalItems !== 1 ? "s" : ""} · <strong style={{ color: "#1b1b1b" }}>₹{basePrice.toFixed(2)}</strong>
                {selDate && <> · <span style={{ color: "#3d7a1a" }}>{fmtDate(selDate)}</span></>}
              </span>
            }
            onEdit={() => { skipAutoStepRef.current = true; setShowOrderSummary(true); setStep(2); }}
          >
            <div style={{ animation: "fadeIn 0.2s ease" }}>
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

              {/* Delivery date */}
              <div style={{ background: "#fafce8", border: "1.5px solid #C5D82D66", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                  <Truck size={15} style={{ color: "#5c8a1e" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#3d5c10", textTransform: "uppercase", letterSpacing: 0.4 }}>Choose Delivery Date</span>
                </div>
                <p style={{ fontSize: 12, color: "#6b8a3a", marginBottom: 12, lineHeight: 1.5 }}>
                  We bake fresh! Minimum 5 days from today. Pick your bake day:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {quickDates.map(qd => (
                    <div key={qd.value} onClick={() => setSelDate(qd.value)} style={{
                      border: `2px solid ${selDate === qd.value ? "#C5D82D" : "#dde8a0"}`,
                      borderRadius: 8, padding: "10px", cursor: "pointer", textAlign: "center",
                      background: selDate === qd.value ? "#fff" : "#f5f8e4",
                      boxShadow: selDate === qd.value ? "0 0 0 3px #C5D82D33" : "none",
                      transition: "all 0.15s", position: "relative",
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
              <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <CalendarDays size={15} style={{ color: "#5c8a1e", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 1 }}>Delivery on</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>{fmtDate(selDate)}</div>
                </div>
              </div>
              <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <MapPin size={15} style={{ color: "#888", flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                  <strong style={{ color: "#1b1b1b" }}>Delivering to:</strong> {defaultAddr?.street}, {defaultAddr?.city}, {defaultAddr?.state} — {defaultAddr?.postal_code}
                </div>
              </div>

              {/* Order total recap */}
              <div style={{ background: "#fafce8", border: "1px solid #C5D82D44", borderRadius: 8, padding: "12px 14px", marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#555" }}>
                    {totalItems} item{totalItems !== 1 ? "s" : ""}
                    {appliedCoupon && <span style={{ marginLeft: 6, fontSize: 11, color: "#5a9e2f", fontWeight: 600 }}>· {appliedCoupon.coupon_code} applied</span>}
                  </span>
                  <div style={{ textAlign: "right" }}>
                    {appliedCoupon && discount > 0 && (
                      <div style={{ fontSize: 11, color: "#888", textDecoration: "line-through" }}>₹{basePrice.toFixed(2)}</div>
                    )}
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#1b1b1b" }}>₹{finalPrice.toFixed(2)}</div>
                  </div>
                </div>
                {discount > 0 && (
                  <div style={{ fontSize: 12, color: "#3d7a1a", marginTop: 4, fontWeight: 600 }}>
                    🎉 You save ₹{(discount + mhcPts).toFixed(2)} on this order
                  </div>
                )}
              </div>

              {/* Desktop pay button */}
              {!isMobile && (
                <>
                  <button
                    onClick={handlePay}
                    disabled={processing}
                    style={{
                      width: "100%", background: processing ? "#e0e0d0" : "linear-gradient(135deg, #d4e82d 0%, #C5D82D 100%)",
                      border: "none", borderRadius: 8, padding: "15px",
                      fontSize: 15, fontWeight: 700, cursor: processing ? "not-allowed" : "pointer",
                      color: "#1b1b1b", letterSpacing: -0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: processing ? "none" : "0 4px 16px #C5D82D55",
                      transition: "all 0.2s",
                    }}
                  >
                    {processing && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                    {processing ? "Processing…" : `Pay ₹${finalPrice.toFixed(2)}`}
                  </button>
                  <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <Lock size={11} /> Secured by Razorpay · 256-bit SSL
                  </div>
                </>
              )}
            </div>
          </StepShell>

        </div>

        {/* ═══ RIGHT: Coupon + Price Summary ══════════════════════════════ */}
        <div style={{ position: isMobile ? "relative" : "sticky", top: 72, display: "flex", flexDirection: "column", gap: 10 }}>
          <CouponPanel />
          <PriceSummary />
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

      {/* ── Mobile sticky pay button ─────────────────────────────────────── */}
      {isMobile && step === 3 && (
        <div className="pay-btn-mobile">
          <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e5e0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>TOTAL AMOUNT</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  {appliedCoupon && discount > 0 && (
                    <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>₹{basePrice.toFixed(2)}</span>
                  )}
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#1b1b1b" }}>₹{finalPrice.toFixed(2)}</span>
                </div>
                {discount > 0 && <div style={{ fontSize: 11, color: "#3d7a1a", fontWeight: 600 }}>You save ₹{discount.toFixed(2)}</div>}
              </div>
              <button
                onClick={handlePay}
                disabled={processing}
                style={{
                  background: processing ? "#e0e0d0" : "linear-gradient(135deg, #d4e82d 0%, #C5D82D 100%)",
                  border: "none", borderRadius: 10, padding: "13px 28px",
                  fontSize: 15, fontWeight: 800, cursor: processing ? "not-allowed" : "pointer",
                  color: "#1b1b1b", display: "flex", alignItems: "center", gap: 8,
                  boxShadow: processing ? "none" : "0 4px 16px #C5D82D66",
                  letterSpacing: -0.3,
                }}
              >
                {processing ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
                {processing ? "Wait…" : "Pay Now"}
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10, color: "#bbb" }}>
              <Lock size={10} /> Secured by Razorpay · 256-bit SSL
            </div>
          </div>
        </div>
      )}

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

      {/* ── Post-order modal (SUCCESS MODAL) ──────────────────────────────── */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 70, overflow: "auto" }}>
          <div style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : "12px", padding: isMobile ? "24px 16px" : "32px", width: "100%", maxWidth: 450, animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease", maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto" }}>
            {/* Animated celebration icon */}
            <div style={{ fontSize: 48, marginBottom: 16, textAlign: "center", animation: "bounce 1s ease-in-out infinite" }}>
              🎉
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: "center", color: "#1b1b1b" }}>
              Order Confirmed!
            </h2>

            <p style={{ fontSize: 14, color: "#666", marginBottom: 20, textAlign: "center", lineHeight: 1.6 }}>
              Your order has been placed successfully. A confirmation email has been sent to your registered email address.
            </p>

            {/* Order details from API response */}
            {orderData && (
              <div style={{ background: "#f9f8f4", borderRadius: 10, padding: "16px", marginBottom: 20 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3 }}>
                    Order Number
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1b1b1b", letterSpacing: 0.5 }}>
                    #{orderData.id || "—"}
                  </div>
                </div>

                <div style={{ height: 1, background: "#e5e5e0", marginBottom: 12 }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3 }}>
                      Order Total
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>
                      ₹{safeNum(orderData.total_amount).toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3 }}>
                      Items
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>
                      {orderData.items?.length || 0} Item{(orderData.items?.length || 0) !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                {orderData.discount_amount > 0 && (
                  <>
                    <div style={{ height: 1, background: "#e5e5e0", margin: "12px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#5a9e2f", fontWeight: 600 }}>💰 Discount Applied</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2e7d32 " }}>-₹{safeNum(orderData.discount_amount).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Delivery date selection */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1b1b1b", marginBottom: 10 }}>
                📅 Choose your next delivery date
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {nextOpts.map(o => (
                  <label key={o.key} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    border: `2px solid ${nextSel === o.key ? "#C5D82D" : "#e5e5e0"}`, 
                    borderRadius: 10, 
                    padding: "14px 16px", 
                    cursor: "pointer", 
                    background: nextSel === o.key ? "#fdfde8" : "#fff", 
                    transition: "all 0.15s",
                    boxShadow: nextSel === o.key ? "0 0 0 3px #C5D82D22" : "none"
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1b1b1b" }}>
                      {o.display}
                    </span>
                    <input 
                      type="radio" 
                      checked={nextSel === o.key} 
                      onChange={() => setNextSel(o.key)} 
                      style={{ cursor: "pointer", width: 16, height: 16 }} 
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Auto-redirect countdown */}
            <p style={{ fontSize: 12, color: "#aaa", textAlign: "center", marginBottom: 16 }}>
              Redirecting to orders page in <strong>{countdown}s</strong>
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
              <button 
                onClick={() => {
                  if (!nextSel) { toast.error("Pick a date"); return; }
                  const opt = nextOpts.find(o => o.key === nextSel);
                  if (!opt) return;
                  localStorage.setItem("selectedDelivery", JSON.stringify({ day: opt.key, date: opt.date.toISOString(), display: opt.display }));
                  setModalOpen(false);
                  router.push("/products");
                }} 
                style={{ ...primaryBtn, width: "100%", fontSize: 15 }}>
                Continue Shopping
              </button>
              <button 
                onClick={() => { setModalOpen(false); router.push("/shop/orders"); }} 
                style={{ 
                  width: "100%", 
                  padding: "12px 24px", 
                  border: "2px solid #C5D82D", 
                  background: "transparent",
                  borderRadius: 6, 
                  fontSize: 14, 
                  fontWeight: 700, 
                  cursor: "pointer", 
                  color: "#C5D82D",
                  transition: "all 0.2s"
                }}>
                View My Orders
              </button>
            </div>
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
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
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
            <span style={{ fontSize: 13, fontWeight: 700, color: completed ? "#888" : "#1b1b1b", textTransform: "uppercase", letterSpacing: 0.6 }}>
              {label}
            </span>
            {completed && onEdit && (
              <button onClick={onEdit} style={{ fontSize: 12, fontWeight: 600, color: "#2874f0", background: "none", border: "none", cursor: "pointer" }}>
                CHANGE
              </button>
            )}
          </div>
          {completed && completedSummary && <div style={{ marginTop: 2 }}>{completedSummary}</div>}
        </div>
      </div>
      {active && <div style={{ padding: "0 20px 20px" }}>{children}</div>}
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
















// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Loader2, ArrowLeft, Lock, MapPin, Plus, Edit2, Trash2,
//   X, ChevronRight, CheckCircle, Truck, CalendarDays, Package, Tag, BadgePercent, Gift,
//   Zap, TrendingUp, Award
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { useCart } from "@/components/grasa/CartContext";
// import { BASE_URL } from "@/components/config/api";

// // ── API ───────────────────────────────────────────────────────────────────────
// const CART_URL = `${BASE_URL}/grasa/shop/cart`;
// const ORDER_URL = `${BASE_URL}/grasa/shop/orders`;
// const CONFIRM_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
// const LOC_URL = `${BASE_URL}/api/locations`;
// const COUPON_VALIDATE_URL = `${BASE_URL}/grasa/shop/coupons/validate`;

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
// interface Coupon {
//   id: number; coupon_code: string; description: string | null;
//   discount_type: string; discount_value: string;
//   min_order_amount: string; max_discount_amount: string;
//   is_active: boolean;
// }
// interface CouponResult {
//   is_valid: boolean; coupon_code: string; discount: number;
//   subtotal: number; final_price: number; message: string;
// }

// type Step = 1 | 2 | 3;

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, refreshCart } = useCart();
//   const token = typeof window !== "undefined" ? getCookie("token") : null;

//   // Cart meta
//   const [cartId, setCartId] = useState<number | null>(null);
//   const [total, setTotal] = useState(0);
//   const [basePrice, setBasePrice] = useState(0);
  
//   // MHC Points state
//   const [availableMhcPoints, setAvailableMhcPoints] = useState(0);
//   const [mhcPointsToUse, setMhcPointsToUse] = useState(0);
//   const [mhcPointsDiscount, setMhcPointsDiscount] = useState(0);
//   const [useMhcPoints, setUseMhcPoints] = useState(false);
//   const [mhcPointsEarned, setMhcPointsEarned] = useState(0);

//   const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

//   // Coupon state
//   const [couponInput, setCouponInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
//   const [couponLoading, setCouponLoading] = useState(false);
//   const [finalPrice, setFinalPrice] = useState(0);
//   const [discount, setDiscount] = useState(0);

//   // Steps
//   const [step, setStep] = useState<Step>(1);
//   const [loading, setLoading] = useState(true);
//   const [loadingMeta, setLoadingMeta] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [processing, setProc] = useState(false);
//   const [orderDone, setOrderDone] = useState(false);
//   const [isMobile, setMobile] = useState(false);

//   // Address
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [addrLoading, setAddrLoading] = useState(true);
//   const [defaultAddr, setDefaultAddr] = useState<Address | null>(null);
//   const [showAddrPanel, setShowAddrPanel] = useState(false);
//   const [deleting, setDeleting] = useState<number | null>(null);
//   const [editing, setEditing] = useState<number | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [adding, setAdding] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [countries, setCountries] = useState<Opt[]>([]);
//   const [states, setStates] = useState<Opt[]>([]);
//   const [cities, setCities] = useState<Opt[]>([]);
//   const [form, setForm] = useState<any>({
//     street: "", landmark: "", postal_code: "",
//     country_id: 0, state_id: 0, city_id: 0, address_type: "home",
//   });

//   // Date
//   const [selDate, setSelDate] = useState("");
//   const today = new Date();
//   const minDate = (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split("T")[0]; })();
//   const quickDates = ([3, 6] as const).map(wd => {
//     const d = nextBakeDay(today, wd);
//     return { label: wd === 3 ? "Wednesday" : "Saturday", value: d.toISOString().split("T")[0], display: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) };
//   });

//   // Post-order modal
//   const [modalOpen, setModalOpen] = useState(false);
//   const [countdown, setCountdown] = useState(10);
//   const [nextOpts, setNextOpts] = useState<{ key: string; date: Date; display: string }[]>([]);
//   const [nextSel, setNextSel] = useState("");

//   // Razorpay
//   const [rzpLoaded, setRzpLoaded] = useState(false);

//   const skipAutoStepRef = useRef(false);
//   const [showOrderSummary, setShowOrderSummary] = useState(false);

//   // ── Bootstrap ───────────────────────────────────────────────────────
//   useEffect(() => {
//     const chk = () => setMobile(window.innerWidth < 768);
//     chk(); window.addEventListener("resize", chk); return () => window.removeEventListener("resize", chk);
//   }, []);

//   useEffect(() => {
//     if ((window as any).Razorpay) { setRzpLoaded(true); return; }
//     const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.async = true; s.onload = () => setRzpLoaded(true); document.body.appendChild(s);
//   }, []);

//   // ── Calculate MHC Points & Final Price ──────────────────────────────────
//   const calculatePricing = useCallback((bp: number, appliedCoupon: CouponResult | null, useMhc: boolean, availMhc: number) => {
//     let tempPrice = bp;
//     let tempDiscount = 0;
//     let tempMhcDiscount = 0;
//     let tempMhcUsed = 0;

//     // Apply coupon discount first
//     if (appliedCoupon) {
//       tempDiscount = safeNum(appliedCoupon.discount);
//       tempPrice = bp - tempDiscount;
//     }

//     // Apply MHC points if enabled
//     if (useMhc && availMhc > 0) {
//       // 1 MHC point = 1 rupee (you can adjust this conversion rate)
//       tempMhcDiscount = Math.min(availMhc, tempPrice);
//       tempMhcUsed = tempMhcDiscount;
//       tempPrice = Math.max(0, tempPrice - tempMhcDiscount);
//     }

//     // Calculate earned points (typically 1% of original price)
//     const pointsEarned = Math.floor(bp * 0.01);

//     return {
//       finalPrice: tempPrice,
//       couponDiscount: tempDiscount,
//       mhcDiscount: tempMhcDiscount,
//       mhcPointsUsed: tempMhcUsed,
//       pointsEarned,
//       totalSavings: tempDiscount + tempMhcDiscount,
//     };
//   }, []);

//   // ── Update pricing when dependencies change ────────────────────────────
//   useEffect(() => {
//     const pricing = calculatePricing(basePrice, appliedCoupon, useMhcPoints, availableMhcPoints);
//     setFinalPrice(pricing.finalPrice);
//     setDiscount(pricing.couponDiscount);
//     setMhcPointsDiscount(pricing.mhcDiscount);
//     setMhcPointsToUse(pricing.mhcPointsUsed);
//     setMhcPointsEarned(pricing.pointsEarned);
//     setTotal(pricing.finalPrice);
//   }, [basePrice, appliedCoupon, useMhcPoints, availableMhcPoints, calculatePricing]);

//   const fetchCartMeta = useCallback(async () => {
//     if (!token) return;
//     try {
//       const r = await fetch(CART_URL, { headers: { Authorization: `Bearer ${token}` } });
//       if (!r.ok) return;
//       const d = await r.json();
//       const availMhc = safeNum(d?.available_mhc_points);
//       setAvailableMhcPoints(availMhc);
//       setCartId(d?.cart?.id ?? null);
//       const bp = safeNum(d?.base_price);
//       setBasePrice(bp);
//       if (d?.available_coupons) setAvailableCoupons(d.available_coupons);
//     } catch { }
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

//   // ── Coupon Logic ─────────────────────────────────────────────────────────
//   const handleApplyCoupon = async (code?: string) => {
//     const couponCode = code ?? couponInput.trim().toUpperCase();
//     if (!couponCode) { toast.error("Enter a coupon code"); return; }
//     if (!cartId) { toast.error("Cart not loaded yet"); return; }
//     setCouponLoading(true);
//     try {
//       const r = await fetch(COUPON_VALIDATE_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ coupon_code: couponCode, cart_id: cartId }),
//       });
//       const data = await r.json();
//       if (!r.ok || r.status === 404 || data.is_valid === false) {
//         toast.error(data?.message ?? "Invalid coupon code");
//         return;
//       }
//       setAppliedCoupon(data);
//       setCouponInput(couponCode);
//       toast.success("Coupon applied!");
//     } catch {
//       toast.error("Failed to validate coupon");
//     } finally {
//       setCouponLoading(false);
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     setCouponInput("");
//     toast.success("Coupon removed");
//   };

//   // ── MHC Points Logic ───────────────────────────────────────────────────────
//   const handleToggleMhcPoints = (use: boolean) => {
//     setUseMhcPoints(use);
//     if (use && availableMhcPoints > 0) {
//       toast.success(`${availableMhcPoints} MHC points ready to use!`);
//     } else if (use && availableMhcPoints === 0) {
//       toast.error("No MHC points available");
//       setUseMhcPoints(false);
//     } else {
//       toast.success("MHC points disabled");
//     }
//   };

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
//       if (d.state?.id) { const s = await fetch(`${LOC_URL}/citylist?state_id=${d.state.id}`); setCities(s.ok ? await s.json() : []); }
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
//     if (skipAutoStepRef.current) { skipAutoStepRef.current = false; return; }
//     if (step === 2 && selDate) {
//       const timer = setTimeout(() => setStep(3), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [step, selDate]);

//   // ── Payment ──────────────────────────────────────────────────────────────
//   const handlePay = useCallback(async () => {
//     if (!defaultAddr) { toast.error("Select a delivery address"); return; }
//     if (!selDate) { toast.error("Choose a delivery date"); return; }
//     setProc(true);

//     let ph: Window | null = null;
//     try { ph = window.open("", "rzp_ph", "width=100,height=100"); } catch { }

//     try {
//       const createRes = await fetch(ORDER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           cart_id: cartId ?? 0,
//           shipping_address_id: defaultAddr?.id ?? 0,
//           mhc_points: useMhcPoints ? mhcPointsToUse.toString() : "0",
//           coupon_code: appliedCoupon?.coupon_code ?? "",
//           currency: "INR",
//           notes: `delivery_date:${selDate}`,
//           source: "GRASAMILLETS",
//           items: (cart || []).map((i: any) => ({
//             product_id: i.product_id ?? i.id,
//             quantity: i.quantity ?? 1,
//             unit_price: safeNum(i.effective_price ?? i.price).toString(),
//           })),
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
//             setOrderDone(true); clearCart(); try { await refreshCart(); } catch { }
//           } catch { toast.error("Failed to finalise order"); }
//           finally { setProc(false); }
//         },
//         modal: { escape: true, ondismiss: () => { toast.error("Payment cancelled"); setProc(false); } },
//       });
//       rzp.on?.("payment.failed", () => { toast.error("Payment failed"); setProc(false); ph?.close(); });
//       rzp.open();
//       setTimeout(() => { try { if (ph && !ph.closed) ph.close(); } catch { } }, 500);
//     } catch { toast.error("Payment failed"); setProc(false); ph?.close(); }
//   }, [cart, finalPrice, mhcPointsToUse, useMhcPoints, token, defaultAddr, selDate, cartId, appliedCoupon, setProc, clearCart, refreshCart, setOrderDone]);

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

//   // ── MHC Points Panel Component ─────────────────────────────────────────
//   const MhcPointsPanel = () => (
//     <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden", marginBottom: 10 }}>
//       <div style={{ background: "linear-gradient(135deg, #ffd89b 0%, #ffb545 100%)", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#8b4513", textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
//           <Zap size={14} /> MHC Loyalty Points
//         </span>
//       </div>
//       <div style={{ padding: "14px 16px" }}>
//         {/* Available balance */}
//         <div style={{
//           border: "1.5px solid #ffe0b2",
//           borderRadius: 8,
//           padding: "12px 14px",
//           background: "linear-gradient(135deg, #fff8f0 0%, #fffbf5 100%)",
//           marginBottom: 12,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 10,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #ffd89b 0%, #ffb545 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(255, 181, 69, 0.3)" }}>
//               <Award size={18} style={{ color: "#fff" }} />
//             </div>
//             <div>
//               <div style={{ fontSize: 12, fontWeight: 500, color: "#666", marginBottom: 2 }}>Available Balance</div>
//               <div style={{ fontSize: 18, fontWeight: 800, color: "#1b1b1b", letterSpacing: -0.5 }}>
//                 {availableMhcPoints.toLocaleString()}
//               </div>
//             </div>
//           </div>
//           <div style={{ textAlign: "right" }}>
//             <div style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>Worth</div>
//             <div style={{ fontSize: 16, fontWeight: 700, color: "#d4a574" }}>₹{availableMhcPoints.toFixed(0)}</div>
//           </div>
//         </div>

//         {/* Toggle to use points */}
//         {availableMhcPoints > 0 && (
//           <div style={{
//             border: "1.5px solid #c8e6c9",
//             borderRadius: 8,
//             padding: "12px 14px",
//             background: useMhcPoints ? "#f0fce8" : "#fafaf8",
//             marginBottom: 12,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             cursor: "pointer",
//             transition: "all 0.2s",
//             boxShadow: useMhcPoints ? "0 2px 8px rgba(192, 232, 32, 0.15)" : "none",
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{
//                 width: 24, height: 24, borderRadius: 4, border: `2px solid ${useMhcPoints ? "#C5D82D" : "#ddd"}`,
//                 display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
//                 background: useMhcPoints ? "#C5D82D" : "transparent",
//               }}>
//                 {useMhcPoints && <CheckCircle size={14} style={{ color: "#1b1b1b" }} strokeWidth={3} />}
//               </div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: "#1b1b1b" }}>Use MHC Points</div>
//                 <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>Save ₹{availableMhcPoints.toFixed(0)} instantly</div>
//               </div>
//             </div>
//             <input
//               type="checkbox"
//               checked={useMhcPoints}
//               onChange={(e) => handleToggleMhcPoints(e.target.checked)}
//               style={{ cursor: "pointer", width: 18, height: 18, accentColor: "#C5D82D" }}
//             />
//           </div>
//         )}

//         {/* Points usage breakdown */}
//         {useMhcPoints && mhcPointsToUse > 0 && (
//           <div style={{
//             border: "1px solid #e8f5e9",
//             borderRadius: 8,
//             padding: "12px 14px",
//             background: "#f1f8f5",
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//           }}>
//             <TrendingUp size={16} style={{ color: "#3d7a1a", flexShrink: 0 }} />
//             <div style={{ fontSize: 12, color: "#2e7d32", fontWeight: 500 }}>
//               <strong>₹{mhcPointsToUse.toFixed(0)}</strong> will be deducted from your <strong>{mhcPointsToUse}</strong> available points
//             </div>
//           </div>
//         )}

//         {/* Points earning preview */}
//         {mhcPointsEarned > 0 && (
//           <div style={{
//             marginTop: 12,
//             padding: "10px 12px",
//             background: "#fafff5",
//             borderRadius: 8,
//             border: "1px dashed #C5D82D",
//             fontSize: 12,
//             color: "#5a9e2f",
//           }}>
//             🎁 <strong>Earn {mhcPointsEarned} points</strong> on this order
//           </div>
//         )}

//         {availableMhcPoints === 0 && (
//           <div style={{
//             padding: "10px 12px",
//             background: "#f5f5f5",
//             borderRadius: 8,
//             fontSize: 12,
//             color: "#999",
//             textAlign: "center",
//           }}>
//             No points available yet. Start earning with every purchase!
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // ── Coupon Panel Component ────────────────────────────────────────────────
//   const CouponPanel = () => (
//     <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden", marginBottom: 10 }}>
//       <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
//           Coupons & Offers
//         </span>
//       </div>
//       <div style={{ padding: "14px 16px" }}>
//         {/* Applied coupon display */}
//         {appliedCoupon ? (
//           <div style={{
//             border: "1.5px dashed #7ab648",
//             borderRadius: 8,
//             padding: "12px 14px",
//             background: "linear-gradient(135deg, #f0fce8 0%, #f8fdf2 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 10,
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8f5d8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                 <Tag size={15} style={{ color: "#5a9e2f" }} />
//               </div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: "#2e7d32", letterSpacing: 0.3 }}>
//                   {appliedCoupon.coupon_code}
//                 </div>
//                 <div style={{ fontSize: 11, color: "#5a9e2f", marginTop: 1 }}>
//                   Saving ₹{discount.toFixed(2)}
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={handleRemoveCoupon}
//               style={{
//                 background: "none", border: "none", cursor: "pointer",
//                 fontSize: 12, fontWeight: 700, color: "#e53935",
//                 textTransform: "uppercase", letterSpacing: 0.3, padding: "4px 8px",
//                 borderRadius: 4, transition: "background 0.15s",
//               }}
//             >
//               REMOVE
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Coupon input */}
//             <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
//               <input
//                 placeholder="ENTER COUPON CODE"
//                 value={couponInput}
//                 onChange={e => setCouponInput(e.target.value.toUpperCase())}
//                 onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
//                 style={{
//                   flex: 1, border: "1.5px solid #e0e0e0", borderRadius: 6,
//                   padding: "9px 12px", fontSize: 13, color: "#1b1b1b",
//                   background: "#fafafa", outline: "none", letterSpacing: 0.5,
//                   fontWeight: 500,
//                 }}
//               />
//               <button
//                 onClick={() => handleApplyCoupon()}
//                 disabled={couponLoading || !couponInput.trim()}
//                 style={{
//                   background: couponInput.trim() ? "#C5D82D" : "#f0f0f0",
//                   border: "none", borderRadius: 6, padding: "9px 16px",
//                   fontSize: 13, fontWeight: 700, cursor: couponInput.trim() ? "pointer" : "not-allowed",
//                   color: couponInput.trim() ? "#1b1b1b" : "#aaa",
//                   transition: "all 0.15s", minWidth: 72, display: "flex", alignItems: "center", justifyContent: "center",
//                 }}
//               >
//                 {couponLoading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : "Apply"}
//               </button>
//             </div>

//             {/* Available coupons */}
//             {availableCoupons.length > 0 && (
//               <div style={{ display: "grid", gridTemplateColumns: availableCoupons.length === 1 ? "1fr" : "1fr 1fr", gap: 8 }}>
//                 {availableCoupons.map(c => (
//                   <div key={c.id} style={{
//                     border: "1.5px dashed #c8e6c9",
//                     borderRadius: 8,
//                     padding: "10px 12px",
//                     background: "#fafff5",
//                     position: "relative",
//                     overflow: "hidden",
//                   }}>
//                     <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: "#C5D82D", borderRadius: "8px 0 0 8px" }} />
//                     <div style={{ fontSize: 12, fontWeight: 800, color: "#1b1b1b", letterSpacing: 0.4, marginBottom: 3 }}>
//                       {c.coupon_code}
//                     </div>
//                     <div style={{ fontSize: 11, color: "#5a9e2f", fontWeight: 500, marginBottom: 8 }}>
//                       Flat ₹{safeNum(c.discount_value).toFixed(0)} OFF
//                     </div>
//                     <button
//                       onClick={() => handleApplyCoupon(c.coupon_code)}
//                       disabled={couponLoading}
//                       style={{
//                         background: "#C5D82D", border: "none", borderRadius: 4,
//                         padding: "5px 12px", fontSize: 11, fontWeight: 700,
//                         cursor: "pointer", color: "#1b1b1b", letterSpacing: 0.2,
//                         display: "flex", alignItems: "center", gap: 4,
//                       }}
//                     >
//                       {couponLoading ? <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} /> : "Apply"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );

//   // ── Price Summary Component ───────────────────────────────────────────────
//   const PriceSummary = () => (
//     <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
//       <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
//           Price Details
//         </span>
//       </div>
//       <div style={{ padding: "16px" }}>
//         <PriceRow label={`Price (${totalItems} item${totalItems !== 1 ? "s" : ""})`} value={`₹${basePrice.toFixed(2)}`} />
//         <PriceRow label="Delivery charges" value="FREE" valueColor="#3d7a1a" />
//         {appliedCoupon && discount > 0 && (
//           <PriceRow
//             label={`Coupon Discount (${appliedCoupon.coupon_code})`}
//             value={`- ₹${discount.toFixed(2)}`}
//             valueColor="#2e7d32"
//           />
//         )}
//         {useMhcPoints && mhcPointsToUse > 0 && (
//           <PriceRow
//             label="MHC Points Redeemed"
//             value={`- ₹${mhcPointsToUse.toFixed(2)}`}
//             valueColor="#d4a574"
//           />
//         )}
//         <div style={{ height: 1, background: "#e5e5e0", margin: "12px 0" }} />
//         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>
//           <span>Total Amount</span>
//           <span>₹{finalPrice.toFixed(2)}</span>
//         </div>
//         {(discount > 0 || mhcPointsToUse > 0) && (
//           <div style={{ marginTop: 10, fontSize: 12, color: "#3d7a1a", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, background: "#f0fce8", borderRadius: 6, padding: "6px 10px" }}>
//             🎉 You save ₹{(discount + mhcPointsToUse).toFixed(2)} on this order
//           </div>
//         )}
//         {mhcPointsEarned > 0 && (
//           <div style={{ marginTop: 8, fontSize: 11, color: "#d4a574", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, background: "#fff8f0", borderRadius: 6, padding: "6px 10px" }}>
//             ⭐ Earn {mhcPointsEarned} points after order
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="checkout-root" style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
//         .checkout-root *, .checkout-root *::before, .checkout-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         .checkout-root button, .checkout-root input, .checkout-root select { font-family: inherit; }
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
//         @keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
//         .coupon-card:hover { border-color: #C5D82D !important; background: #f5fee8 !important; }
//         .pay-btn-mobile { 
//           position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
//           padding: 12px 16px 28px;
//           background: linear-gradient(to top, #f1f3f6 70%, rgba(241,243,246,0));
//         }
//       `}</style>

//       <Toaster position={isMobile ? "top-center" : "bottom-right"}
//         toastOptions={{ duration: 2500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} />

//       {/* ── Top nav ──────────────────────────────────────────────────────── */}
//       <div style={{ padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "center", position: "sticky", top: 0, zIndex: 40, background: "#fff", borderBottom: "1px solid #e5e5e0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
//           {(["Address", "Order Summary", "Payment"] as const).map((label, i) => {
//             const s = (i + 1) as Step;
//             const active = step === s;
//             const done = step > s;
//             return (
//               <React.Fragment key={label}>
//                 {i > 0 && <div style={{ width: isMobile ? 20 : 40, height: 1.5, background: done ? "#C5D82D" : "#e0e0e0", transition: "background 0.3s" }} />}
//                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
//                   <div style={{
//                     width: 28, height: 28, borderRadius: "50%",
//                     background: done ? "#C5D82D" : active ? "#1b1b1b" : "#f0f0f0",
//                     border: active ? "2.5px solid #C5D82D" : "none",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: 11, fontWeight: 700,
//                     color: done ? "#1b1b1b" : active ? "#C5D82D" : "#bbb",
//                     transition: "all 0.25s",
//                     boxShadow: active ? "0 0 0 4px #C5D82D22" : "none",
//                   }}>
//                     {done ? <CheckCircle size={15} strokeWidth={3} /> : i + 1}
//                   </div>
//                   {!isMobile && (
//                     <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#1b1b1b" : done ? "#3d7a1a" : "#aaa", whiteSpace: "nowrap", letterSpacing: 0.3 }}>
//                       {label}
//                     </span>
//                   )}
//                 </div>
//               </React.Fragment>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Main layout ───────────────────────────────────────────────────── */}
//       <div style={{
//         maxWidth: 1060, margin: "0 auto", padding: isMobile ? "12px 10px 120px" : "20px 16px 60px",
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
//                           {defaultAddr.street}{defaultAddr.landmark ? `, ${defaultAddr.landmark}` : ""}
//                         </div>
//                         <div style={{ fontSize: 13, color: "#555" }}>{defaultAddr.city}, {defaultAddr.state} — {defaultAddr.postal_code}</div>
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

//                 {showAddrPanel && (
//                   <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, overflow: "hidden", marginBottom: 14, animation: "fadeIn 0.15s ease" }}>
//                     {addresses.map((a, idx) => {
//                       const sel = defaultAddr?.id === a.id;
//                       return (
//                         <div key={a.id} style={{ borderBottom: idx < addresses.length - 1 ? "1px solid #f0f0e8" : "none", padding: "12px 14px", background: sel ? "#fdfde8" : "#fff", display: "flex", alignItems: "flex-start", gap: 10 }}>
//                           <div onClick={() => { setDefaultAddr(a); setShowAddrPanel(false); }} style={{ flex: 1, cursor: "pointer" }}>
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
//                     <div onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#2874f0", fontSize: 13, fontWeight: 600, background: "#f9f9ff" }}>
//                       <Plus size={15} /> Add new address
//                     </div>
//                   </div>
//                 )}

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
//             stepNum={2}
//             label="ORDER SUMMARY"
//             currentStep={step}
//             completedSummary={
//               <span style={{ fontSize: 13, color: "#555" }}>
//                 {totalItems} item{totalItems !== 1 ? "s" : ""} · <strong style={{ color: "#1b1b1b" }}>₹{basePrice.toFixed(2)}</strong>
//                 {selDate && <> · <span style={{ color: "#3d7a1a" }}>{fmtDate(selDate)}</span></>}
//               </span>
//             }
//             onEdit={() => { skipAutoStepRef.current = true; setShowOrderSummary(true); setStep(2); }}
//           >
//             <div style={{ animation: "fadeIn 0.2s ease" }}>
//               <div style={{ marginBottom: 20 }}>
//                 {(cart || []).map((item: any, i: number) => {
//                   const name = item.name ?? item.title ?? item.product_name ?? `Item #${item.id}`;
//                   const qty = item.quantity ?? 1;
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

//               {/* Delivery date */}
//               <div style={{ background: "#fafce8", border: "1.5px solid #C5D82D66", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
//                   <Truck size={15} style={{ color: "#5c8a1e" }} />
//                   <span style={{ fontSize: 13, fontWeight: 700, color: "#3d5c10", textTransform: "uppercase", letterSpacing: 0.4 }}>Choose Delivery Date</span>
//                 </div>
//                 <p style={{ fontSize: 12, color: "#6b8a3a", marginBottom: 12, lineHeight: 1.5 }}>
//                   We bake fresh! Minimum 5 days from today. Pick your bake day:
//                 </p>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
//                   {quickDates.map(qd => (
//                     <div key={qd.value} onClick={() => setSelDate(qd.value)} style={{
//                       border: `2px solid ${selDate === qd.value ? "#C5D82D" : "#dde8a0"}`,
//                       borderRadius: 8, padding: "10px", cursor: "pointer", textAlign: "center",
//                       background: selDate === qd.value ? "#fff" : "#f5f8e4",
//                       boxShadow: selDate === qd.value ? "0 0 0 3px #C5D82D33" : "none",
//                       transition: "all 0.15s", position: "relative",
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
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <CalendarDays size={15} style={{ color: "#5c8a1e", flexShrink: 0, marginTop: 2 }} />
//                 <div>
//                   <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 1 }}>Delivery on</div>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>{fmtDate(selDate)}</div>
//                 </div>
//               </div>
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <MapPin size={15} style={{ color: "#888", flexShrink: 0, marginTop: 2 }} />
//                 <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
//                   <strong style={{ color: "#1b1b1b" }}>Delivering to:</strong> {defaultAddr?.street}, {defaultAddr?.city}, {defaultAddr?.state} — {defaultAddr?.postal_code}
//                 </div>
//               </div>

//               {/* Order total recap */}
//               <div style={{ background: "#fafce8", border: "1px solid #C5D82D44", borderRadius: 8, padding: "12px 14px", marginBottom: 18 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <span style={{ fontSize: 13, color: "#555" }}>
//                     {totalItems} item{totalItems !== 1 ? "s" : ""}
//                     {appliedCoupon && <span style={{ marginLeft: 6, fontSize: 11, color: "#5a9e2f", fontWeight: 600 }}>· {appliedCoupon.coupon_code} applied</span>}
//                   </span>
//                   <div style={{ textAlign: "right" }}>
//                     {(appliedCoupon || mhcPointsToUse > 0) && (
//                       <div style={{ fontSize: 11, color: "#888", textDecoration: "line-through", marginBottom: 2 }}>₹{basePrice.toFixed(2)}</div>
//                     )}
//                     <div style={{ fontSize: 17, fontWeight: 800, color: "#1b1b1b" }}>₹{finalPrice.toFixed(2)}</div>
//                   </div>
//                 </div>
//                 {(discount > 0 || mhcPointsToUse > 0) && (
//                   <div style={{ fontSize: 12, color: "#3d7a1a", marginTop: 4, fontWeight: 600 }}>
//                     🎉 You save ₹{(discount + mhcPointsToUse).toFixed(2)} on this order
//                   </div>
//                 )}
//               </div>

//               {/* Desktop pay button */}
//               {!isMobile && (
//                 <>
//                   <button
//                     onClick={handlePay}
//                     disabled={processing}
//                     style={{
//                       width: "100%", background: processing ? "#e0e0d0" : "linear-gradient(135deg, #d4e82d 0%, #C5D82D 100%)",
//                       border: "none", borderRadius: 8, padding: "15px",
//                       fontSize: 15, fontWeight: 700, cursor: processing ? "not-allowed" : "pointer",
//                       color: "#1b1b1b", letterSpacing: -0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                       boxShadow: processing ? "none" : "0 4px 16px #C5D82D55",
//                       transition: "all 0.2s",
//                     }}
//                   >
//                     {processing && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
//                     {processing ? "Processing…" : `Pay ₹${finalPrice.toFixed(2)}`}
//                   </button>
//                   <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
//                     <Lock size={11} /> Secured by Razorpay · 256-bit SSL
//                   </div>
//                 </>
//               )}
//             </div>
//           </StepShell>

//         </div>

//         {/* ═══ RIGHT: MHC + Coupon + Price Summary ═════════════════════════ */}
//         <div style={{ position: isMobile ? "relative" : "sticky", top: 72, display: "flex", flexDirection: "column", gap: 10 }}>
//           <MhcPointsPanel />
//           <CouponPanel />
//           <PriceSummary />
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

//       {/* ── Mobile sticky pay button ─────────────────────────────────────── */}
//       {isMobile && step === 3 && (
//         <div className="pay-btn-mobile">
//           <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e5e0" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//               <div>
//                 <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>TOTAL AMOUNT</div>
//                 <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
//                   {(appliedCoupon || mhcPointsToUse > 0) && (
//                     <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>₹{basePrice.toFixed(2)}</span>
//                   )}
//                   <span style={{ fontSize: 20, fontWeight: 800, color: "#1b1b1b" }}>₹{finalPrice.toFixed(2)}</span>
//                 </div>
//                 {(discount > 0 || mhcPointsToUse > 0) && <div style={{ fontSize: 11, color: "#3d7a1a", fontWeight: 600 }}>You save ₹{(discount + mhcPointsToUse).toFixed(2)}</div>}
//               </div>
//               <button
//                 onClick={handlePay}
//                 disabled={processing}
//                 style={{
//                   background: processing ? "#e0e0d0" : "linear-gradient(135deg, #d4e82d 0%, #C5D82D 100%)",
//                   border: "none", borderRadius: 10, padding: "13px 28px",
//                   fontSize: 15, fontWeight: 800, cursor: processing ? "not-allowed" : "pointer",
//                   color: "#1b1b1b", display: "flex", alignItems: "center", gap: 8,
//                   boxShadow: processing ? "none" : "0 4px 16px #C5D82D66",
//                   letterSpacing: -0.3,
//                 }}
//               >
//                 {processing ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
//                 {processing ? "Wait…" : "Pay Now"}
//               </button>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10, color: "#bbb" }}>
//               <Lock size={10} /> Secured by Razorpay · 256-bit SSL
//             </div>
//           </div>
//         </div>
//       )}

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
//   const active = currentStep === stepNum;
//   const completed = currentStep > stepNum;
//   const locked = currentStep < stepNum;

//   return (
//     <div style={{
//       background: "#fff", border: "1px solid #e0e0e0",
//       borderTop: active ? "2px solid #C5D82D" : "1px solid #e0e0e0",
//       marginBottom: 0, borderBottom: "none",
//       opacity: locked ? 0.5 : 1,
//       transition: "opacity 0.2s",
//     }}>
//       <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
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
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <span style={{ fontSize: 13, fontWeight: 700, color: completed ? "#888" : "#1b1b1b", textTransform: "uppercase", letterSpacing: 0.6 }}>
//               {label}
//             </span>
//             {completed && onEdit && (
//               <button onClick={onEdit} style={{ fontSize: 12, fontWeight: 600, color: "#2874f0", background: "none", border: "none", cursor: "pointer" }}>
//                 CHANGE
//               </button>
//             )}
//           </div>
//           {completed && completedSummary && <div style={{ marginTop: 2 }}>{completedSummary}</div>}
//         </div>
//       </div>
//       {active && <div style={{ padding: "0 20px 20px" }}>{children}</div>}
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
//   X, ChevronRight, CheckCircle, Truck, CalendarDays, Package, Tag, BadgePercent, Gift,
//   Zap, TrendingUp, Award
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { useCart } from "@/components/grasa/CartContext";
// import { BASE_URL } from "@/components/config/api";

// // ── API ───────────────────────────────────────────────────────────────────────
// const CART_URL = `${BASE_URL}/grasa/shop/cart`;
// const ORDER_URL = `${BASE_URL}/grasa/shop/orders`;
// const CONFIRM_URL = `${BASE_URL}/grasa/shop/payments/gr/confirm`;
// const LOC_URL = `${BASE_URL}/api/locations`;
// const COUPON_VALIDATE_URL = `${BASE_URL}/grasa/shop/coupons/validate`;

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
// interface Coupon {
//   id: number; coupon_code: string; description: string | null;
//   discount_type: string; discount_value: string;
//   min_order_amount: string; max_discount_amount: string;
//   is_active: boolean;
// }
// interface CouponResult {
//   is_valid: boolean; coupon_code: string; discount: number;
//   subtotal: number; final_price: number; message: string;
// }

// // Cart meta from API
// interface CartMeta {
//   base_price: string;           // e.g. "350.00" — original price before any discount
//   applicable_mhc_points: string; // e.g. "30"  — max points usable on THIS order
//   reduced_price: string;         // e.g. "320.00" — price after applying applicable_mhc_points
//   available_mhc_points: string;  // e.g. "40"  — total points user holds in wallet
//   available_coupons: Coupon[];
// }

// type Step = 1 | 2 | 3;

// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, refreshCart } = useCart();
//   const token = typeof window !== "undefined" ? getCookie("token") : null;

//   // ── Cart / pricing state ─────────────────────────────────────────────────
//   const [cartId, setCartId] = useState<number | null>(null);
//   const [basePrice, setBasePrice] = useState(0);          // original price
//   const [applicableMhcPoints, setApplicableMhcPoints] = useState(0); // max points usable on order
//   const [availableMhcPoints, setAvailableMhcPoints] = useState(0);   // wallet balance
//   const [reducedPrice, setReducedPrice] = useState(0);    // base_price - applicable_mhc_points

//   // ── MHC toggle ───────────────────────────────────────────────────────────
//   const [useMhcPoints, setUseMhcPoints] = useState(false);

//   // ── Coupon state ─────────────────────────────────────────────────────────
//   const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
//   const [couponInput, setCouponInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
//   const [couponLoading, setCouponLoading] = useState(false);

//   // ── Derived pricing (recalculated whenever deps change) ──────────────────
//   // finalPrice = basePrice − couponDiscount − mhcDiscount
//   // mhcDiscount = applicable_mhc_points (1 point = ₹1), only when useMhcPoints === true
//   const couponDiscount = appliedCoupon ? safeNum(appliedCoupon.discount) : 0;
//   const mhcDiscount = useMhcPoints ? applicableMhcPoints : 0; // points used = applicable_mhc_points
//   const finalPrice = Math.max(0, basePrice - couponDiscount - mhcDiscount);

//   // Points earned preview (1% of base)
//   const mhcPointsEarned = Math.floor(basePrice * 0.01);

//   // ── UI state ─────────────────────────────────────────────────────────────
//   const [step, setStep] = useState<Step>(1);
//   const [loading, setLoading] = useState(true);
//   const [loadingMeta, setLoadingMeta] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [processing, setProc] = useState(false);
//   const [orderDone, setOrderDone] = useState(false);
//   const [isMobile, setMobile] = useState(false);

//   // ── Address state ────────────────────────────────────────────────────────
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [addrLoading, setAddrLoading] = useState(true);
//   const [defaultAddr, setDefaultAddr] = useState<Address | null>(null);
//   const [showAddrPanel, setShowAddrPanel] = useState(false);
//   const [deleting, setDeleting] = useState<number | null>(null);
//   const [editing, setEditing] = useState<number | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [adding, setAdding] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [countries, setCountries] = useState<Opt[]>([]);
//   const [states, setStates] = useState<Opt[]>([]);
//   const [cities, setCities] = useState<Opt[]>([]);
//   const [form, setForm] = useState<any>({
//     street: "", landmark: "", postal_code: "",
//     country_id: 0, state_id: 0, city_id: 0, address_type: "home",
//   });

//   // ── Delivery date ────────────────────────────────────────────────────────
//   const [selDate, setSelDate] = useState("");
//   const today = new Date();
//   const minDate = (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split("T")[0]; })();
//   const quickDates = ([3, 6] as const).map(wd => {
//     const d = nextBakeDay(today, wd);
//     return {
//       label: wd === 3 ? "Wednesday" : "Saturday",
//       value: d.toISOString().split("T")[0],
//       display: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
//     };
//   });

//   // ── Post-order modal ─────────────────────────────────────────────────────
//   const [modalOpen, setModalOpen] = useState(false);
//   const [countdown, setCountdown] = useState(10);
//   const [nextOpts, setNextOpts] = useState<{ key: string; date: Date; display: string }[]>([]);
//   const [nextSel, setNextSel] = useState("");

//   // ── Misc refs ────────────────────────────────────────────────────────────
//   const [rzpLoaded, setRzpLoaded] = useState(false);
//   const skipAutoStepRef = useRef(false);
//   const [showOrderSummary, setShowOrderSummary] = useState(false);

//   // ── Bootstrap ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const chk = () => setMobile(window.innerWidth < 768);
//     chk(); window.addEventListener("resize", chk); return () => window.removeEventListener("resize", chk);
//   }, []);

//   useEffect(() => {
//     if ((window as any).Razorpay) { setRzpLoaded(true); return; }
//     const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.async = true; s.onload = () => setRzpLoaded(true); document.body.appendChild(s);
//   }, []);

//   // ── Fetch cart meta ──────────────────────────────────────────────────────
//   // API returns: base_price, applicable_mhc_points, reduced_price, available_mhc_points, available_coupons
//   const fetchCartMeta = useCallback(async () => {
//     if (!token) return;
//     try {
//       const r = await fetch(CART_URL, { headers: { Authorization: `Bearer ${token}` } });
//       if (!r.ok) return;
//       const d: CartMeta & { cart?: { id?: number } } = await r.json();

//       setCartId(d?.cart?.id ?? null);
//       setBasePrice(safeNum(d.base_price));
//       setApplicableMhcPoints(safeNum(d.applicable_mhc_points)); // max deductible
//       setAvailableMhcPoints(safeNum(d.available_mhc_points));   // wallet total
//       setReducedPrice(safeNum(d.reduced_price));                 // server-computed price after MHC
//       if (d.available_coupons) setAvailableCoupons(d.available_coupons);
//     } catch { /* silent */ }
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

//   // ── MHC toggle handler ───────────────────────────────────────────────────
//   const handleToggleMhcPoints = (use: boolean) => {
//     if (use && applicableMhcPoints === 0) {
//       toast.error("No redeemable MHC points for this order");
//       return;
//     }
//     setUseMhcPoints(use);
//     if (use) {
//       toast.success(`₹${applicableMhcPoints} discount applied via MHC points!`);
//     } else {
//       toast.success("MHC points removed");
//     }
//   };

//   // ── Coupon logic ─────────────────────────────────────────────────────────
//   const handleApplyCoupon = async (code?: string) => {
//     const couponCode = (code ?? couponInput).trim().toUpperCase();
//     if (!couponCode) { toast.error("Enter a coupon code"); return; }
//     if (!cartId) { toast.error("Cart not loaded yet"); return; }
//     setCouponLoading(true);
//     try {
//       const r = await fetch(COUPON_VALIDATE_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({ coupon_code: couponCode, cart_id: cartId }),
//       });
//       const data = await r.json();
//       if (!r.ok || data.is_valid === false) {
//         toast.error(data?.message ?? "Invalid or expired coupon");
//         return;
//       }
//       setAppliedCoupon(data);
//       setCouponInput(couponCode);
//       toast.success(`Coupon "${couponCode}" applied! You save ₹${safeNum(data.discount).toFixed(2)}`);
//     } catch {
//       toast.error("Failed to validate coupon");
//     } finally {
//       setCouponLoading(false);
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     setCouponInput("");
//     toast.success("Coupon removed");
//   };

//   // ── Address fetch ────────────────────────────────────────────────────────
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
//       if (d.state?.id) { const s = await fetch(`${LOC_URL}/citylist?state_id=${d.state.id}`); setCities(s.ok ? await s.json() : []); }
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
//         body: JSON.stringify({
//           street: form.street, landmark: form.landmark || "",
//           postal_code: form.postal_code, city_id: form.city_id,
//           state_id: form.state_id, country_id: form.country_id, address_type: form.address_type,
//         }),
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

//   // ── Step auto-advance ────────────────────────────────────────────────────
//   useEffect(() => {
//     if (step === 1 && defaultAddr && addresses.length > 0 && !showAddrPanel && !showForm) {
//       const timer = setTimeout(() => setStep(2), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [step, defaultAddr, showAddrPanel, showForm, addresses.length]);

//   useEffect(() => {
//     if (skipAutoStepRef.current) { skipAutoStepRef.current = false; return; }
//     if (step === 2 && selDate) {
//       const timer = setTimeout(() => setStep(3), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [step, selDate]);

//   // ── Payment ──────────────────────────────────────────────────────────────
//   const handlePay = useCallback(async () => {
//     if (!defaultAddr) { toast.error("Select a delivery address"); return; }
//     if (!selDate) { toast.error("Choose a delivery date"); return; }
//     setProc(true);

//     let ph: Window | null = null;
//     try { ph = window.open("", "rzp_ph", "width=100,height=100"); } catch { }

//     try {
//       const createRes = await fetch(ORDER_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//         body: JSON.stringify({
//           cart_id: cartId ?? 0,
//           shipping_address_id: defaultAddr?.id ?? 0,
//           // Send applicable_mhc_points (the server-validated max) when user opts in
//           mhc_points: useMhcPoints ? applicableMhcPoints.toString() : "0",
//           coupon_code: appliedCoupon?.coupon_code ?? "",
//           currency: "INR",
//           notes: `delivery_date:${selDate}`,
//           source: "GRASAMILLETS",
//           items: (cart || []).map((i: any) => ({
//             product_id: i.product_id ?? i.id,
//             quantity: i.quantity ?? 1,
//             unit_price: safeNum(i.effective_price ?? i.price).toString(),
//           })),
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
//               body: JSON.stringify({
//                 razorpay_order_id: resp.razorpay_order_id,
//                 razorpay_payment_id: resp.razorpay_payment_id,
//                 razorpay_signature: resp.razorpay_signature,
//                 paid_amount: cd.amount,
//               }),
//             });
//             const cfd = await cfRes.json().catch(() => null);
//             if (!cfRes.ok || !cfd?.transaction_id) { toast.error("Payment confirmed but save failed"); setProc(false); return; }
//             setOrderDone(true); clearCart(); try { await refreshCart(); } catch { }
//           } catch { toast.error("Failed to finalise order"); }
//           finally { setProc(false); }
//         },
//         modal: { escape: true, ondismiss: () => { toast.error("Payment cancelled"); setProc(false); } },
//       });
//       rzp.on?.("payment.failed", () => { toast.error("Payment failed"); setProc(false); ph?.close(); });
//       rzp.open();
//       setTimeout(() => { try { if (ph && !ph.closed) ph.close(); } catch { } }, 500);
//     } catch { toast.error("Payment failed"); setProc(false); ph?.close(); }
//   }, [cart, finalPrice, applicableMhcPoints, useMhcPoints, token, defaultAddr, selDate, cartId, appliedCoupon, setProc, clearCart, refreshCart, setOrderDone]);

//   // ── Post-order modal countdown ────────────────────────────────────────────
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

//   // ── Loading guards ────────────────────────────────────────────────────────
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
//   const totalSavings = couponDiscount + mhcDiscount;

//   // ─────────────────────────────────────────────────────────────────────────
//   // ── MHC Points Panel ─────────────────────────────────────────────────────
//   // ─────────────────────────────────────────────────────────────────────────
//   const MhcPointsPanel = () => (
//     <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden", marginBottom: 10 }}>
//       {/* Header */}
//       <div style={{ background: "linear-gradient(135deg, #ffd89b 0%, #ffb545 100%)", padding: "12px 16px", borderBottom: "1px solid #ffe0b2" }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#8b4513", textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
//           <Zap size={14} /> MHC Loyalty Points
//         </span>
//       </div>

//       <div style={{ padding: "14px 16px" }}>
//         {/* Wallet balance row */}
//         <div style={{
//           border: "1.5px solid #ffe0b2", borderRadius: 8, padding: "12px 14px",
//           background: "linear-gradient(135deg, #fff8f0 0%, #fffbf5 100%)",
//           marginBottom: 12, display: "flex", alignItems: "center",
//           justifyContent: "space-between", gap: 10,
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{
//               width: 40, height: 40, borderRadius: "50%",
//               background: "linear-gradient(135deg, #ffd89b 0%, #ffb545 100%)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               flexShrink: 0, boxShadow: "0 4px 12px rgba(255,181,69,0.3)",
//             }}>
//               <Award size={18} style={{ color: "#fff" }} />
//             </div>
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 500, color: "#666", marginBottom: 2 }}>Wallet Balance</div>
//               <div style={{ fontSize: 18, fontWeight: 800, color: "#1b1b1b", letterSpacing: -0.5 }}>
//                 {availableMhcPoints.toLocaleString()} pts
//               </div>
//             </div>
//           </div>
//           <div style={{ textAlign: "right" }}>
//             <div style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>Redeemable now</div>
//             {/* applicableMhcPoints is what the server says can be used on this order */}
//             <div style={{ fontSize: 16, fontWeight: 700, color: applicableMhcPoints > 0 ? "#d4a574" : "#bbb" }}>
//               ₹{applicableMhcPoints.toFixed(0)}
//             </div>
//           </div>
//         </div>

//         {/* Toggle row — shown only when there are applicable points */}
//         {applicableMhcPoints > 0 ? (
//           <div
//             onClick={() => handleToggleMhcPoints(!useMhcPoints)}
//             style={{
//               border: `1.5px solid ${useMhcPoints ? "#C5D82D" : "#e0e0e0"}`,
//               borderRadius: 8, padding: "12px 14px",
//               background: useMhcPoints ? "#f0fce8" : "#fafaf8",
//               marginBottom: 12, display: "flex", alignItems: "center",
//               justifyContent: "space-between", cursor: "pointer",
//               transition: "all 0.2s",
//               boxShadow: useMhcPoints ? "0 2px 8px rgba(197,216,45,0.15)" : "none",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               {/* Custom checkbox */}
//               <div style={{
//                 width: 22, height: 22, borderRadius: 5,
//                 border: `2px solid ${useMhcPoints ? "#C5D82D" : "#ccc"}`,
//                 background: useMhcPoints ? "#C5D82D" : "transparent",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 flexShrink: 0, transition: "all 0.2s",
//               }}>
//                 {useMhcPoints && <CheckCircle size={13} style={{ color: "#1b1b1b" }} strokeWidth={3} />}
//               </div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: "#1b1b1b" }}>
//                   Use {applicableMhcPoints} MHC Points
//                 </div>
//                 <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
//                   Save ₹{applicableMhcPoints.toFixed(0)} instantly on this order
//                 </div>
//               </div>
//             </div>
//             {/* Native checkbox for accessibility, visually hidden */}
//             <input
//               type="checkbox"
//               checked={useMhcPoints}
//               onChange={e => handleToggleMhcPoints(e.target.checked)}
//               onClick={e => e.stopPropagation()}
//               style={{ cursor: "pointer", width: 18, height: 18, accentColor: "#C5D82D" }}
//             />
//           </div>
//         ) : (
//           /* No applicable points for this order */
//           <div style={{
//             padding: "10px 12px", background: "#f5f5f5", borderRadius: 8,
//             fontSize: 12, color: "#999", textAlign: "center", marginBottom: 12,
//           }}>
//             {availableMhcPoints > 0
//               ? `You have ${availableMhcPoints} pts in wallet but none are applicable on this order.`
//               : "No MHC points in wallet. Earn with every purchase!"}
//           </div>
//         )}

//         {/* Active deduction info */}
//         {useMhcPoints && mhcDiscount > 0 && (
//           <div style={{
//             border: "1px solid #e8f5e9", borderRadius: 8, padding: "10px 14px",
//             background: "#f1f8f5", display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
//           }}>
//             <TrendingUp size={15} style={{ color: "#3d7a1a", flexShrink: 0 }} />
//             <div style={{ fontSize: 12, color: "#2e7d32", fontWeight: 500 }}>
//               <strong>₹{mhcDiscount.toFixed(0)}</strong> will be deducted using&nbsp;
//               <strong>{applicableMhcPoints}</strong> MHC points
//             </div>
//           </div>
//         )}

//         {/* Points earning preview */}
//         {mhcPointsEarned > 0 && (
//           <div style={{
//             padding: "8px 12px", background: "#fafff5", borderRadius: 8,
//             border: "1px dashed #C5D82D", fontSize: 12, color: "#5a9e2f",
//           }}>
//             🎁 Earn <strong>{mhcPointsEarned} points</strong> worth ₹{mhcPointsEarned} after this order
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   // ── Coupon Panel ──────────────────────────────────────────────────────────
//   // ─────────────────────────────────────────────────────────────────────────
//   const CouponPanel = () => (
//     <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden", marginBottom: 10 }}>
//       <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
//           <BadgePercent size={14} /> Coupons &amp; Offers
//         </span>
//       </div>

//       <div style={{ padding: "14px 16px" }}>
//         {appliedCoupon ? (
//           /* Applied coupon badge */
//           <div style={{
//             border: "1.5px dashed #7ab648", borderRadius: 8,
//             padding: "12px 14px", background: "linear-gradient(135deg, #f0fce8 0%, #f8fdf2 100%)",
//             display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8f5d8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                 <Tag size={15} style={{ color: "#5a9e2f" }} />
//               </div>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: "#2e7d32", letterSpacing: 0.3 }}>
//                   {appliedCoupon.coupon_code}
//                 </div>
//                 <div style={{ fontSize: 11, color: "#5a9e2f", marginTop: 1 }}>
//                   Discount: ₹{couponDiscount.toFixed(2)} applied
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={handleRemoveCoupon}
//               style={{
//                 background: "none", border: "1px solid #e53935", cursor: "pointer",
//                 fontSize: 11, fontWeight: 700, color: "#e53935",
//                 textTransform: "uppercase", letterSpacing: 0.3,
//                 padding: "4px 10px", borderRadius: 4, transition: "all 0.15s",
//               }}
//             >
//               REMOVE
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Coupon input row */}
//             <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
//               <input
//                 placeholder="ENTER COUPON CODE"
//                 value={couponInput}
//                 onChange={e => setCouponInput(e.target.value.toUpperCase())}
//                 onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
//                 style={{
//                   flex: 1, border: "1.5px solid #e0e0e0", borderRadius: 6,
//                   padding: "9px 12px", fontSize: 13, color: "#1b1b1b",
//                   background: "#fafafa", outline: "none", letterSpacing: 0.5, fontWeight: 500,
//                 }}
//               />
//               <button
//                 onClick={() => handleApplyCoupon()}
//                 disabled={couponLoading || !couponInput.trim()}
//                 style={{
//                   background: couponInput.trim() ? "#C5D82D" : "#f0f0f0",
//                   border: "none", borderRadius: 6, padding: "9px 18px",
//                   fontSize: 13, fontWeight: 700,
//                   cursor: couponInput.trim() ? "pointer" : "not-allowed",
//                   color: couponInput.trim() ? "#1b1b1b" : "#aaa",
//                   transition: "all 0.15s", minWidth: 76,
//                   display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
//                 }}
//               >
//                 {couponLoading
//                   ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
//                   : "Apply"}
//               </button>
//             </div>

//             {/* Available coupons list from API */}
//             {availableCoupons.length > 0 && (
//               <>
//                 <div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
//                   Available Offers
//                 </div>
//                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                   {availableCoupons.map(c => {
//                     const discVal = safeNum(c.discount_value);
//                     const minAmt = safeNum(c.min_order_amount);
//                     const eligible = basePrice >= minAmt;
//                     return (
//                       <div key={c.id} style={{
//                         border: `1.5px dashed ${eligible ? "#c8e6c9" : "#e0e0e0"}`,
//                         borderRadius: 8, padding: "10px 12px",
//                         background: eligible ? "#fafff5" : "#fafafa",
//                         position: "relative", overflow: "hidden",
//                         opacity: eligible ? 1 : 0.7,
//                       }}>
//                         {/* colour accent bar */}
//                         <div style={{
//                           position: "absolute", top: 0, left: 0,
//                           width: 3, height: "100%",
//                           background: eligible ? "#C5D82D" : "#ccc",
//                           borderRadius: "8px 0 0 8px",
//                         }} />
//                         <div style={{ paddingLeft: 10 }}>
//                           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
//                             <div style={{ fontSize: 12, fontWeight: 800, color: "#1b1b1b", letterSpacing: 0.4 }}>
//                               {c.coupon_code}
//                             </div>
//                             {eligible ? (
//                               <button
//                                 onClick={() => handleApplyCoupon(c.coupon_code)}
//                                 disabled={couponLoading}
//                                 style={{
//                                   background: "#C5D82D", border: "none", borderRadius: 4,
//                                   padding: "4px 12px", fontSize: 11, fontWeight: 700,
//                                   cursor: "pointer", color: "#1b1b1b", letterSpacing: 0.2,
//                                   display: "flex", alignItems: "center", gap: 4,
//                                 }}
//                               >
//                                 {couponLoading
//                                   ? <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />
//                                   : "Apply"}
//                               </button>
//                             ) : (
//                               <span style={{ fontSize: 10, color: "#f5a623", fontWeight: 600, padding: "3px 8px", background: "#fff8e1", borderRadius: 4 }}>
//                                 Add ₹{(minAmt - basePrice).toFixed(0)} more
//               </span>
//                             )}
//                           </div>
//                           <div style={{ fontSize: 11, color: eligible ? "#5a9e2f" : "#888", fontWeight: 500 }}>
//                             Flat ₹{discVal.toFixed(0)} OFF{minAmt > 0 ? ` · Min order ₹${minAmt.toFixed(0)}` : ""}
//                           </div>
//                           {c.description && (
//                             <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{c.description}</div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   // ── Price Summary ─────────────────────────────────────────────────────────
//   // ─────────────────────────────────────────────────────────────────────────
//   const PriceSummary = () => (
//     <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
//       <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
//         <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
//           Price Details
//         </span>
//       </div>
//       <div style={{ padding: "16px" }}>
//         {/* Base price */}
//         <PriceRow
//           label={`Price (${totalItems} item${totalItems !== 1 ? "s" : ""})`}
//           value={`₹${basePrice.toFixed(2)}`}
//         />
//         {/* Free delivery */}
//         <PriceRow label="Delivery charges" value="FREE" valueColor="#3d7a1a" />

//         {/* Coupon discount row */}
//         {appliedCoupon && couponDiscount > 0 && (
//           <PriceRow
//             label={
//               <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                 <Tag size={11} style={{ color: "#5a9e2f", flexShrink: 0 }} />
//                 Coupon ({appliedCoupon.coupon_code})
//               </span>
//             }
//             value={`− ₹${couponDiscount.toFixed(2)}`}
//             valueColor="#2e7d32"
//           />
//         )}

//         {/* MHC points deduction row */}
//         {useMhcPoints && mhcDiscount > 0 && (
//           <PriceRow
//             label={
//               <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                 <Zap size={11} style={{ color: "#d4a574", flexShrink: 0 }} />
//                 MHC Points ({applicableMhcPoints} pts)
//               </span>
//             }
//             value={`− ₹${mhcDiscount.toFixed(2)}`}
//             valueColor="#d4a574"
//           />
//         )}

//         {/* Divider */}
//         <div style={{ height: 1, background: "#e5e5e0", margin: "12px 0" }} />

//         {/* Total */}
//         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#1b1b1b" }}>
//           <span>Total Amount</span>
//           <span>₹{finalPrice.toFixed(2)}</span>
//         </div>

//         {/* Savings badge */}
//         {totalSavings > 0 && (
//           <div style={{
//             marginTop: 10, fontSize: 12, color: "#3d7a1a", fontWeight: 600,
//             display: "flex", alignItems: "center", gap: 4,
//             background: "#f0fce8", borderRadius: 6, padding: "6px 10px",
//           }}>
//             🎉 You save ₹{totalSavings.toFixed(2)} on this order
//           </div>
//         )}

//         {/* Points earned preview */}
//         {mhcPointsEarned > 0 && (
//           <div style={{
//             marginTop: 8, fontSize: 11, color: "#d4a574", fontWeight: 600,
//             display: "flex", alignItems: "center", gap: 4,
//             background: "#fff8f0", borderRadius: 6, padding: "6px 10px",
//           }}>
//             ⭐ Earn {mhcPointsEarned} MHC points after this order
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   // ── Render ────────────────────────────────────────────────────────────────
//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="checkout-root" style={{ minHeight: "100vh", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
//         .checkout-root *, .checkout-root *::before, .checkout-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         .checkout-root button, .checkout-root input, .checkout-root select { font-family: inherit; }
//         @keyframes spin    { to { transform: rotate(360deg); } }
//         @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
//         .pay-btn-mobile {
//           position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
//           padding: 12px 16px 28px;
//           background: linear-gradient(to top, #f1f3f6 70%, rgba(241,243,246,0));
//         }
//       `}</style>

//       <Toaster
//         position={isMobile ? "top-center" : "bottom-right"}
//         toastOptions={{ duration: 2500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }}
//       />

//       {/* ── Top nav stepper ───────────────────────────────────────────────── */}
//       <div style={{ padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "center", position: "sticky", top: 0, zIndex: 40, background: "#fff", borderBottom: "1px solid #e5e5e0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
//           {(["Address", "Order Summary", "Payment"] as const).map((label, i) => {
//             const s = (i + 1) as Step;
//             const active = step === s;
//             const done = step > s;
//             return (
//               <React.Fragment key={label}>
//                 {i > 0 && <div style={{ width: isMobile ? 20 : 40, height: 1.5, background: done ? "#C5D82D" : "#e0e0e0", transition: "background 0.3s" }} />}
//                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
//                   <div style={{
//                     width: 28, height: 28, borderRadius: "50%",
//                     background: done ? "#C5D82D" : active ? "#1b1b1b" : "#f0f0f0",
//                     border: active ? "2.5px solid #C5D82D" : "none",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontSize: 11, fontWeight: 700,
//                     color: done ? "#1b1b1b" : active ? "#C5D82D" : "#bbb",
//                     transition: "all 0.25s",
//                     boxShadow: active ? "0 0 0 4px #C5D82D22" : "none",
//                   }}>
//                     {done ? <CheckCircle size={15} strokeWidth={3} /> : i + 1}
//                   </div>
//                   {!isMobile && (
//                     <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#1b1b1b" : done ? "#3d7a1a" : "#aaa", whiteSpace: "nowrap", letterSpacing: 0.3 }}>
//                       {label}
//                     </span>
//                   )}
//                 </div>
//               </React.Fragment>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Main layout ───────────────────────────────────────────────────── */}
//       <div style={{
//         maxWidth: 1060, margin: "0 auto",
//         padding: isMobile ? "12px 10px 120px" : "20px 16px 60px",
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
//                           {defaultAddr.street}{defaultAddr.landmark ? `, ${defaultAddr.landmark}` : ""}
//                         </div>
//                         <div style={{ fontSize: 13, color: "#555" }}>{defaultAddr.city}, {defaultAddr.state} — {defaultAddr.postal_code}</div>
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

//                 {showAddrPanel && (
//                   <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, overflow: "hidden", marginBottom: 14, animation: "fadeIn 0.15s ease" }}>
//                     {addresses.map((a, idx) => {
//                       const sel = defaultAddr?.id === a.id;
//                       return (
//                         <div key={a.id} style={{ borderBottom: idx < addresses.length - 1 ? "1px solid #f0f0e8" : "none", padding: "12px 14px", background: sel ? "#fdfde8" : "#fff", display: "flex", alignItems: "flex-start", gap: 10 }}>
//                           <div onClick={() => { setDefaultAddr(a); setShowAddrPanel(false); }} style={{ flex: 1, cursor: "pointer" }}>
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
//                             <button
//                               onClick={() => {
//                                 setEditing(a.id);
//                                 setForm({ street: a.street ?? "", landmark: a.landmark ?? "", postal_code: a.postal_code ?? "", country_id: a.country_id ?? 0, state_id: a.state_id ?? 0, city_id: a.city_id ?? 0, address_type: a.address_type ?? "home" });
//                                 setShowForm(true);
//                               }}
//                               style={iconBtn}
//                             >
//                               <Edit2 size={13} />
//                             </button>
//                             <button onClick={() => handleDeleteAddr(a.id)} disabled={deleting === a.id} style={{ ...iconBtn, color: "#c0392b", opacity: deleting === a.id ? 0.5 : 1 }}>
//                               {deleting === a.id ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={13} />}
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     <div onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#2874f0", fontSize: 13, fontWeight: 600, background: "#f9f9ff" }}>
//                       <Plus size={15} /> Add new address
//                     </div>
//                   </div>
//                 )}

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
//                 {totalItems} item{totalItems !== 1 ? "s" : ""} · <strong style={{ color: "#1b1b1b" }}>₹{basePrice.toFixed(2)}</strong>
//                 {selDate && <> · <span style={{ color: "#3d7a1a" }}>{fmtDate(selDate)}</span></>}
//               </span>
//             }
//             onEdit={() => { skipAutoStepRef.current = true; setShowOrderSummary(true); setStep(2); }}
//           >
//             <div style={{ animation: "fadeIn 0.2s ease" }}>
//               {/* Cart items */}
//               <div style={{ marginBottom: 20 }}>
//                 {(cart || []).map((item: any, i: number) => {
//                   const name = item.name ?? item.title ?? item.product_name ?? `Item #${item.id}`;
//                   const qty = item.quantity ?? 1;
//                   const price = safeNum(item.effective_price ?? item.price);
//                   return (
//                     <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < (cart?.length ?? 0) - 1 ? "1px solid #f0f0e8" : "none" }}>
//                       <div style={{ width: 64, height: 64, borderRadius: 8, background: "#f5f5f0", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                         {item.image_url
//                           ? <img src={item.image_url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                           : <span style={{ fontSize: 24 }}>🥗</span>}
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

//               {/* Delivery date picker */}
//               <div style={{ background: "#fafce8", border: "1.5px solid #C5D82D66", borderRadius: 10, padding: "16px", marginBottom: 16 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
//                   <Truck size={15} style={{ color: "#5c8a1e" }} />
//                   <span style={{ fontSize: 13, fontWeight: 700, color: "#3d5c10", textTransform: "uppercase", letterSpacing: 0.4 }}>Choose Delivery Date</span>
//                 </div>
//                 <p style={{ fontSize: 12, color: "#6b8a3a", marginBottom: 12, lineHeight: 1.5 }}>
//                   We bake fresh! Minimum 5 days from today. Pick your bake day:
//                 </p>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
//                   {quickDates.map(qd => (
//                     <div key={qd.value} onClick={() => setSelDate(qd.value)} style={{
//                       border: `2px solid ${selDate === qd.value ? "#C5D82D" : "#dde8a0"}`,
//                       borderRadius: 8, padding: "10px", cursor: "pointer", textAlign: "center",
//                       background: selDate === qd.value ? "#fff" : "#f5f8e4",
//                       boxShadow: selDate === qd.value ? "0 0 0 3px #C5D82D33" : "none",
//                       transition: "all 0.15s", position: "relative",
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
//                 <div>
//                   <div style={{ fontSize: 11, color: "#6b8a3a", fontWeight: 600, marginBottom: 5 }}>OR PICK A CUSTOM DATE</div>
//                   <input
//                     type="date" min={minDate} value={selDate}
//                     onChange={e => setSelDate(e.target.value)}
//                     style={{ width: "100%", border: `1.5px solid ${!selDate ? "#f5a623" : "#dde8a0"}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, background: "#fff", color: "#1b1b1b", outline: "none" }}
//                   />
//                   {!selDate && <p style={{ fontSize: 11, color: "#f5a623", marginTop: 4, fontWeight: 500 }}>⚠ Select a date to proceed</p>}
//                 </div>
//               </div>
//             </div>
//           </StepShell>

//           {/* ── STEP 3: Payment ───────────────────────────────────────────── */}
//           <StepShell stepNum={3} label="PAYMENT" currentStep={step}>
//             <div style={{ animation: "fadeIn 0.2s ease" }}>
//               {/* Delivery date recap */}
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <CalendarDays size={15} style={{ color: "#5c8a1e", flexShrink: 0, marginTop: 2 }} />
//                 <div>
//                   <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 1 }}>Delivery on</div>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: "#1b1b1b" }}>{fmtDate(selDate)}</div>
//                 </div>
//               </div>

//               {/* Address recap */}
//               <div style={{ background: "#f9f8f4", borderRadius: 8, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
//                 <MapPin size={15} style={{ color: "#888", flexShrink: 0, marginTop: 2 }} />
//                 <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
//                   <strong style={{ color: "#1b1b1b" }}>Delivering to:</strong>{" "}
//                   {defaultAddr?.street}, {defaultAddr?.city}, {defaultAddr?.state} — {defaultAddr?.postal_code}
//                 </div>
//               </div>

//               {/* Price recap box */}
//               <div style={{ background: "#fafce8", border: "1px solid #C5D82D44", borderRadius: 8, padding: "12px 14px", marginBottom: 18 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <div style={{ fontSize: 13, color: "#555" }}>
//                     {totalItems} item{totalItems !== 1 ? "s" : ""}
//                     {appliedCoupon && (
//                       <span style={{ marginLeft: 6, fontSize: 11, color: "#5a9e2f", fontWeight: 600 }}>
//                         · {appliedCoupon.coupon_code}
//                       </span>
//                     )}
//                     {useMhcPoints && mhcDiscount > 0 && (
//                       <span style={{ marginLeft: 6, fontSize: 11, color: "#d4a574", fontWeight: 600 }}>
//                         · {applicableMhcPoints} pts
//                       </span>
//                     )}
//                   </div>
//                   <div style={{ textAlign: "right" }}>
//                     {totalSavings > 0 && (
//                       <div style={{ fontSize: 11, color: "#aaa", textDecoration: "line-through", marginBottom: 2 }}>
//                         ₹{basePrice.toFixed(2)}
//                       </div>
//                     )}
//                     <div style={{ fontSize: 17, fontWeight: 800, color: "#1b1b1b" }}>₹{finalPrice.toFixed(2)}</div>
//                   </div>
//                 </div>
//                 {totalSavings > 0 && (
//                   <div style={{ fontSize: 12, color: "#3d7a1a", marginTop: 6, fontWeight: 600 }}>
//                     🎉 You save ₹{totalSavings.toFixed(2)} on this order
//                   </div>
//                 )}
//               </div>

//               {/* Desktop pay button */}
//               {!isMobile && (
//                 <>
//                   <button
//                     onClick={handlePay}
//                     disabled={processing}
//                     style={{
//                       width: "100%",
//                       background: processing ? "#e0e0d0" : "linear-gradient(135deg, #d4e82d 0%, #C5D82D 100%)",
//                       border: "none", borderRadius: 8, padding: "15px",
//                       fontSize: 15, fontWeight: 700, cursor: processing ? "not-allowed" : "pointer",
//                       color: "#1b1b1b", letterSpacing: -0.3,
//                       display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                       boxShadow: processing ? "none" : "0 4px 16px #C5D82D55",
//                       transition: "all 0.2s",
//                     }}
//                   >
//                     {processing && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
//                     {processing ? "Processing…" : `Pay ₹${finalPrice.toFixed(2)}`}
//                   </button>
//                   <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
//                     <Lock size={11} /> Secured by Razorpay · 256-bit SSL
//                   </div>
//                 </>
//               )}
//             </div>
//           </StepShell>
//         </div>

//         {/* ═══ RIGHT: MHC + Coupon + Price Summary ═════════════════════════ */}
//         <div style={{ position: isMobile ? "relative" : "sticky", top: 72, display: "flex", flexDirection: "column", gap: 10 }}>
//           <MhcPointsPanel />
//           <CouponPanel />
//           <PriceSummary />
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

//       {/* ── Mobile sticky pay button ─────────────────────────────────────── */}
//       {isMobile && step === 3 && (
//         <div className="pay-btn-mobile">
//           <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e5e0" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//               <div>
//                 <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>TOTAL AMOUNT</div>
//                 <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
//                   {totalSavings > 0 && (
//                     <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>₹{basePrice.toFixed(2)}</span>
//                   )}
//                   <span style={{ fontSize: 20, fontWeight: 800, color: "#1b1b1b" }}>₹{finalPrice.toFixed(2)}</span>
//                 </div>
//                 {totalSavings > 0 && (
//                   <div style={{ fontSize: 11, color: "#3d7a1a", fontWeight: 600 }}>
//                     You save ₹{totalSavings.toFixed(2)}
//                   </div>
//                 )}
//               </div>
//               <button
//                 onClick={handlePay}
//                 disabled={processing}
//                 style={{
//                   background: processing ? "#e0e0d0" : "linear-gradient(135deg, #d4e82d 0%, #C5D82D 100%)",
//                   border: "none", borderRadius: 10, padding: "13px 28px",
//                   fontSize: 15, fontWeight: 800, cursor: processing ? "not-allowed" : "pointer",
//                   color: "#1b1b1b", display: "flex", alignItems: "center", gap: 8,
//                   boxShadow: processing ? "none" : "0 4px 16px #C5D82D66", letterSpacing: -0.3,
//                 }}
//               >
//                 {processing ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
//                 {processing ? "Wait…" : "Pay Now"}
//               </button>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10, color: "#bbb" }}>
//               <Lock size={10} /> Secured by Razorpay · 256-bit SSL
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Address form modal ────────────────────────────────────────────── */}
//       {showForm && (
//         <div
//           style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 60, overflow: "auto" }}
//           onClick={resetForm}
//         >
//           <div
//             style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : "12px", padding: isMobile ? "20px 16px" : "28px", width: "100%", maxWidth: 500, maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto", animation: isMobile ? "slideUp 0.3s ease-out" : "fadeIn 0.2s ease" }}
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
//             <button
//               onClick={() => {
//                 if (!nextSel) { toast.error("Pick a date"); return; }
//                 const opt = nextOpts.find(o => o.key === nextSel);
//                 if (!opt) return;
//                 localStorage.setItem("selectedDelivery", JSON.stringify({ day: opt.key, date: opt.date.toISOString(), display: opt.display }));
//                 setModalOpen(false); router.push("/products");
//               }}
//               style={{ ...primaryBtn, width: "100%", marginTop: 8 }}
//             >
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
//   const active = currentStep === stepNum;
//   const completed = currentStep > stepNum;
//   const locked = currentStep < stepNum;

//   return (
//     <div style={{
//       background: "#fff",
//       border: "1px solid #e0e0e0",
//       borderTop: active ? "2px solid #C5D82D" : "1px solid #e0e0e0",
//       marginBottom: 0, borderBottom: "none",
//       opacity: locked ? 0.5 : 1,
//       transition: "opacity 0.2s",
//     }}>
//       <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
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
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <span style={{ fontSize: 13, fontWeight: 700, color: completed ? "#888" : "#1b1b1b", textTransform: "uppercase", letterSpacing: 0.6 }}>
//               {label}
//             </span>
//             {completed && onEdit && (
//               <button onClick={onEdit} style={{ fontSize: 12, fontWeight: 600, color: "#2874f0", background: "none", border: "none", cursor: "pointer" }}>
//                 CHANGE
//               </button>
//             )}
//           </div>
//           {completed && completedSummary && <div style={{ marginTop: 2 }}>{completedSummary}</div>}
//         </div>
//       </div>
//       {active && <div style={{ padding: "0 20px 20px" }}>{children}</div>}
//     </div>
//   );
// }

// // ── PriceRow ──────────────────────────────────────────────────────────────────
// function PriceRow({ label, value, valueColor }: { label: React.ReactNode; value: string; valueColor?: string }) {
//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#555", marginBottom: 8 }}>
//       <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{label}</span>
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