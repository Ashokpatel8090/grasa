
"use client"

import { useCart } from "@/components/grasa/CartContext"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"
export const dynamic = "force-dynamic"
import {
  ArrowLeft,
  Lock,
  Minus,
  Plus,
  Trash2,
  Loader2,
  ShoppingCart
} from "lucide-react"

interface CartItem {
  id: number
  product_id: number
  name: string
  price: string
  effective_price: number
  discount_percent: number
  stock_quantity: number
  unit_price: string
  quantity: number
  image_url: string | null
}

const generateCartSchema = (cart: CartItem[]) => {
  if (cart.length === 0) return null

  const domain = "https://www.grasamillets.com"

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cart.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        sku: `PROD${item.product_id}`,
        url: `${domain}/products/${item.product_id}`,
        image: item.image_url || `${domain}/product/placeholder.png`,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: item.effective_price,
          availability:
            item.stock_quantity > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "GRASA Super Foods & Beverages",
          },
        },
        description: `Quantity in Cart: ${item.quantity}`,
      },
    })),
  }
}

// ── Shared styles ──────────────────────────────────────────────
const primaryBtn: React.CSSProperties = {
  background: "#C5D82D", border: "none", borderRadius: 4,
  padding: "11px 24px", fontSize: 14, fontWeight: 700,
  cursor: "pointer", color: "#1b1b1b", letterSpacing: -0.2,
  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
}

const loadingScreen: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  justifyContent: "center", minHeight: "60vh",
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, refreshCart } = useCart()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [localQuantities, setLocalQuantities] = useState<Record<number, number>>({})
  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    const chk = () => setMobile(window.innerWidth < 768)
    chk(); window.addEventListener("resize", chk); return () => window.removeEventListener("resize", chk)
  }, [])

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true)
      await refreshCart()
      setLoading(false)
    }
    fetchCart()
  }, [])

  useEffect(() => {
    const q: Record<number, number> = {}
    cart.forEach((item) => {
      q[item.product_id] = item.quantity
    })
    setLocalQuantities(q)
  }, [cart])

  const totalPrice = cart.reduce(
    (acc, item) => acc + Number(item.effective_price) * item.quantity,
    0
  )
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  const jsonLd = generateCartSchema(cart)

  const handleRemove = async (product_id: number, name: string) => {
    setRemovingId(product_id)
    await removeFromCart(product_id)
    setRemovingId(null)
    toast.success(`${name} removed from cart`)
  }

  const handleQuantity = async (
    product_id: number,
    action: "increment" | "decrement",
    name: string
  ) => {
    const currentQty = localQuantities[product_id]

    if (action === "decrement" && currentQty <= 1) {
      await handleRemove(product_id, name)
      return
    }

    setUpdatingId(product_id)
    setLocalQuantities((prev) => ({
      ...prev,
      [product_id]: action === "increment" ? prev[product_id] + 1 : prev[product_id] - 1,
    }))

    try {
      await updateQuantity(product_id, action)
    } catch {
      toast.error("Failed to update quantity")
      setLocalQuantities((prev) => ({ ...prev, [product_id]: currentQty }))
    }
    setUpdatingId(null)
  }

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
.cart-root *, .cart-root *::before, .cart-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
.cart-root button { font-family: inherit; }
@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      <Toaster position={isMobile ? "top-center" : "bottom-right"}
        toastOptions={{ duration: 2500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} />

      {/* Main content - works with layout's header (72px padding) */}
      <div className="cart-root" style={{ minHeight: "calc(100vh - 72px)", background: "#f1f3f6", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Main layout */}
        <div style={{
          maxWidth: 1060, margin: "0 auto", padding: isMobile ? "12px 10px 40px" : "20px 16px 60px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
          gap: isMobile ? 10 : 18, alignItems: "start",
        }}>

          {loading ? (
            <div style={{ gridColumn: "1 / -1", ...loadingScreen }}>
              <Loader2 size={32} style={{ color: "#C5D82D", animation: "spin 1s linear infinite" }} />
              <p style={{ marginTop: 10, color: "#888", fontSize: 13 }}>Loading your cart…</p>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease", marginTop: isMobile ? 0 : 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f5f5f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <ShoppingCart size={28} style={{ color: "#a8a396" }} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1b1b1b", marginBottom: 8 }}>Your cart is empty</h2>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 24, textAlign: "center" }}>Looks like you haven't added anything to your cart yet.</p>
              <button onClick={() => router.push("/products")} style={{ ...primaryBtn, width: "auto" }}>
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* ═══ LEFT: Cart Items ══════════════════════════════════════════ */}
              <div style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, overflow: "hidden", animation: "fadeIn 0.2s ease" }}>

                {/* Header */}
                <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
                    My Cart ({totalItems})
                  </span>
                </div>

                {/* Item List */}
                <div>
                  {cart.map((item, i) => (
                    <div key={item.id} style={{ display: "flex", gap: 16, padding: "20px 16px", borderBottom: i < cart.length - 1 ? "1px solid #f0f0e8" : "none" }}>

                      {/* Image */}
                      <div
                        onClick={() => router.push(`/products/${item.product_id}`)}
                        style={{ width: 80, height: 80, borderRadius: 8, background: "#f5f5f0", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid #e5e5e0" }}
                      >
                        <Image
                          src={item.image_url || "/product/placeholder.png"}
                          alt={item.name}
                          width={80}
                          height={80}
                          style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", padding: 4 }}
                        />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <div
  onClick={() => router.push(`/products/${item.product_id}`)}
  className="text-[15px] font-semibold text-[#1b1b1b] mb-1 leading-[1.4] cursor-pointer inline-block hover:text-blue-600 border-b-2 border-transparent "
>
  {item.name}
</div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#1b1b1b" }}>₹{item.effective_price}</div>
                          {item.discount_percent > 0 && (
                            <>
                              <div style={{ fontSize: 12, color: "#888", textDecoration: "line-through" }}>₹{item.price}</div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#3d7a1a" }}>{item.discount_percent}% OFF</div>
                            </>
                          )}
                        </div>

                        {/* Actions (Quantity & Remove) */}
                        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: "auto" }}>

                          {/* Custom Input Stepper */}
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e5e0", borderRadius: 4, overflow: "hidden", height: 28 }}>
                            <button
                              disabled={updatingId === item.product_id}
                              onClick={() => handleQuantity(item.product_id, "decrement", item.name)}
                              style={{ width: 28, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", border: "none", borderRight: "1px solid #e5e5e0", cursor: updatingId === item.product_id ? "not-allowed" : "pointer", color: "#555" }}
                            >
                              <Minus size={13} strokeWidth={2.5} />
                            </button>

                            <div style={{ width: 40, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#1b1b1b", background: "#fff" }}>
                              {updatingId === item.product_id ? (
                                <Loader2 size={14} style={{ animation: "spin 1s linear infinite", color: "#C5D82D" }} />
                              ) : (
                                localQuantities[item.product_id]
                              )}
                            </div>

                            <button
                              disabled={updatingId === item.product_id}
                              onClick={() => handleQuantity(item.product_id, "increment", item.name)}
                              style={{ width: 28, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", border: "none", borderLeft: "1px solid #e5e5e0", cursor: updatingId === item.product_id ? "not-allowed" : "pointer", color: "#555" }}
                            >
                              <Plus size={13} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Remove text button */}
                          <button
                            disabled={removingId === item.product_id}
                            onClick={() => handleRemove(item.product_id, item.name)}
                            style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, color: "#2874f0", cursor: "pointer", textTransform: "uppercase" }}
                          >
                            {removingId === item.product_id ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* ═══ RIGHT: Price Summary ════════════════════════════════════════ */}
              <div style={{ position: isMobile ? "relative" : "sticky", top: 76, display: "flex", flexDirection: "column", gap: 10, animation: "fadeIn 0.2s ease" }}>
                <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>

                  {/* Header */}
                  <div style={{ background: "#f5f5f5", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.8 }}>
                      Price Details
                    </span>
                  </div>

                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 12 }}>
                      <span>Price ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                      <span style={{ fontWeight: 500, color: "#1b1b1b" }}>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 12 }}>
                      <span>Delivery charges</span>
                      <span style={{ fontWeight: 500, color: "#3d7a1a" }}>Calculated next</span>
                    </div>

                    <div style={{ height: 1, background: "#e5e5e0", margin: "16px 0" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: "#1b1b1b", marginBottom: 20 }}>
                      <span>Total Amount</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => router.push("/checkout")}
                      style={primaryBtn}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>

                {/* Trust badge */}
                <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Lock size={15} style={{ color: "#C5D82D" }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                    Safe and secure checkout. 100% Authentic products.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
