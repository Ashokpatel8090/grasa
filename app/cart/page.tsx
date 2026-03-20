"use client"

import { useCart } from "../../components/grasa/CartContext"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react";

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

  const domain = "https://www.grasafoods.com"

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
        image:
          item.image_url || `${domain}/product/placeholder.png`,
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

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, refreshCart } = useCart()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [localQuantities, setLocalQuantities] = useState<
    Record<number, number>
  >({})

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
    (acc, item) =>
      acc + Number(item.effective_price) * item.quantity,
    0
  )

  const jsonLd = generateCartSchema(cart)

  const handleRemove = async (
    product_id: number,
    name: string
  ) => {
    setRemovingId(product_id)
    await removeFromCart(product_id)
    setRemovingId(null)
    toast.success(`${name} removed from cart!`)
  }

  // UPDATED LOGIC
  const handleQuantity = async (
    product_id: number,
    action: "increment" | "decrement",
    name: string
  ) => {
    const currentQty = localQuantities[product_id]

    // If quantity = 1 and user clicks decrement -> remove item
    if (action === "decrement" && currentQty === 1) {
      await handleRemove(product_id, name)
      return
    }

    setUpdatingId(product_id)

    setLocalQuantities((prev) => ({
      ...prev,
      [product_id]:
        action === "increment"
          ? prev[product_id] + 1
          : prev[product_id] - 1,
    }))

    try {
      await updateQuantity(product_id, action)
      toast.success(`${name} quantity updated`)
    } catch {
      toast.error("Failed to update quantity")
    }

    setUpdatingId(null)
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center mt-20 mb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500 mb-4"></div>
        <p className="text-lg font-medium text-zinc-700">
          Loading your cart...
        </p>
      </div>
    )

  if (cart.length === 0)
    return (
      <p className="text-center mt-20 mb-20 text-lg">
        Your cart is empty 🛒
      </p>
    )

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}

      <div className="max-w-[82%] mx-auto px-4 py-10">

        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "10px",
            },
          }}
        />

        <h1 className="text-2xl font-serif mb-6">
          Your Cart
        </h1>

        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center gap-4 border-b border-gray-200 pb-4"
            >
              <div
                className="w-32 h-32 relative cursor-pointer"
                onClick={() =>
                  router.push(`/products/${item.product_id}`)
                }
              >
                <Image
                  src={
                    item.image_url ||
                    "/product/placeholder.png"
                  }
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/products/${item.product_id}`
                    )
                  }
                >
                  <h2 className="font-semibold text-lg">
                    {item.name}
                  </h2>

                  <div className="flex items-center gap-2">
                    {item.discount_percent > 0 ? (
                      <>
                        <p className="text-2xl font-bold text-gray-900">
                          Rs. {item.effective_price}
                        </p>
                        <p className="line-through text-gray-500 text-sm">
                          Rs. {item.price}
                        </p>
                        <span className="text-sm text-red-600 font-semibold">
                          {item.discount_percent}% Off
                        </span>
                      </>
                    ) : (
                      <p className="text-lg font-bold">
                        Rs. {item.price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        updatingId === item.product_id
                      }
                      onClick={() =>
                        handleQuantity(
                          item.product_id,
                          "decrement",
                          item.name
                        )
                      }
                    >
                      -
                    </Button>

                    <span className="min-w-[30px] text-center font-medium">
                      {updatingId === item.product_id
                        ? "..."
                        : localQuantities[
                            item.product_id
                          ]}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        updatingId === item.product_id
                      }
                      onClick={() =>
                        handleQuantity(
                          item.product_id,
                          "increment",
                          item.name
                        )
                      }
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={
                      removingId === item.product_id
                    }
                    onClick={() =>
                      handleRemove(
                        item.product_id,
                        item.name
                      )
                    }
                  >
                    {removingId === item.product_id
                      ? "Removing..."
                      : "Remove"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end items-center gap-6  pt-6">
  <span className="text-2xl font-bold text-[#1b1b1b]">
    Total: ₹{totalPrice}
  </span>

  <Button
    className="bg-[#C5D82D] hover:bg-[#b8cc28] text-[#1b1b1b] font-bold text-lg px-8 py-6 rounded-xl flex items-center gap-2 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
    onClick={() => router.push("/checkout")}
  >
    Proceed to Buy
    <ArrowRight size={20} strokeWidth={2.5} />
  </Button>
</div>
      </div>
    </>
  )
}
