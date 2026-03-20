// "use client"

// import { createContext, useContext, useState, useEffect, ReactNode } from "react"
// import axios from "axios"

// // ---------------- COOKIE HELPERS ----------------
// const getCookie = (name: string): string | null => {
//   const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
//   return match ? decodeURIComponent(match[2]) : null
// }

// const setCookie = (name: string, value: string, days = 7) => {
//   const expires = new Date()
//   expires.setDate(expires.getDate() + days)
//   document.cookie = `${name}=${encodeURIComponent(
//     value
//   )}; expires=${expires.toUTCString()}; path=/;`
// }

// const deleteCookie = (name: string) => {
//   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
// }

// // ---------------- TYPES ----------------
// type CartItem = {
//   id: number
//   product_id: number
//   name: string
//   price: string
//   effective_price: number
//   discount_percent: number
//   unit_price: string
//   image_url: string
//   quantity: number
//   stock_quantity: number
// }

// type CartContextType = {
//   cart: CartItem[]
//   addToCart: (item: { product_id: number; quantity: number }) => Promise<boolean>
//   removeFromCart: (product_id: number) => Promise<void>
//   updateQuantity: (
//     product_id: number,
//     action: "increment" | "decrement"
//   ) => Promise<void>
//   refreshCart: () => Promise<void>
//   clearCart: () => void
//   setToken: (token: string | null) => void
//   token: string | null
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([])
//   const [token, setTokenState] = useState<string | null>(null)

//   // ---------------- LOAD TOKEN ----------------
//   useEffect(() => {
//     const cookieToken = getCookie("token")
//     if (cookieToken) setTokenState(cookieToken)
//     else setTokenState(null)
//   }, [])

//   // ---------------- SET TOKEN ----------------
//   const setToken = (newToken: string | null) => {
//     if (!newToken) {
//       deleteCookie("token")
//       setTokenState(null)
//       setCart([])
//     } else {
//       setCookie("token", newToken)
//       setTokenState(newToken)
//       refreshCart(newToken)
//     }
//   }

//   const CART_API = "https://medicaps.cloud/grasa/shop/cart"

//   // ---------------- FETCH CART ----------------
//   const refreshCart = async (overrideToken?: string | null) => {
//     const activeToken = overrideToken ?? token
//     if (!activeToken) {
//       setCart([])
//       return
//     }

//     try {
//       const res = await axios.get(CART_API, {
//         headers: { Authorization: `Bearer ${activeToken}` },
//       })

//       const apiItems = res.data.cart?.items || []

//       const items: CartItem[] = apiItems.map((i: any) => ({
//         id: i.id,
//         product_id: i.product.id,
//         name: i.product.name,
//         price: i.product.price,
//         effective_price: i.product.effective_price,
//         discount_percent: i.product.discount_percent,
//         stock_quantity: i.product.stock_quantity,
//         image_url: i.product.image_url,
//         quantity: i.quantity,
//         unit_price: i.unit_price,
//       }))

//       setCart(items)
//     } catch (err) {
//       console.error("❌ Failed to fetch cart", err)
//       setCart([])
//     }
//   }

//   useEffect(() => {
//     if (token) refreshCart()
//   }, [token])

//   const clearCart = () => setCart([])

//   // ---------------- ADD ITEM ----------------
//   const addToCart = async (item: { product_id: number; quantity: number }) => {
//     if (!token) return false

//     try {
//       const res = await axios.post(
//         "https://medicaps.cloud/grasa/shop/cart/items",
//         item,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )

//       if (res.status === 200 || res.status === 201) {
//         await refreshCart()
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("❌ Add to cart failed", err)
//       return false
//     }
//   }

//   // ---------------- REMOVE ----------------
//   const removeFromCart = async (product_id: number) => {
//     if (!token) return
//     try {
//       await axios.delete(
//         `https://medicaps.cloud/grasa/shop/cart/items/${product_id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       await refreshCart()
//     } catch (err) {
//       console.error("❌ Remove failed", err)
//     }
//   }

//   // ---------------- UPDATE QUANTITY ----------------
//   const updateQuantity = async (
//     product_id: number,
//     action: "increment" | "decrement"
//   ) => {
//     if (!token) return
//     try {
//       await axios.patch(
//         `https://medicaps.cloud/grasa/shop/cart/items/${product_id}`,
//         { action },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       await refreshCart()
//     } catch (err) {
//       console.error("❌ Update failed", err)
//     }
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         refreshCart,
//         setToken,
//         token,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export function useCart() {
//   const context = useContext(CartContext)
//   if (!context) throw new Error("useCart must be used within CartProvider")
//   return context
// }







"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"

// ---------------- COOKIE HELPERS ----------------
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date()
  expires.setDate(expires.getDate() + days)
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/;`
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// ---------------- TYPES ----------------
type CartItem = {
  id: number
  product_id: number
  name: string
  price: string
  effective_price: number
  discount_percent: number
  unit_price: string
  image_url: string
  quantity: number
  stock_quantity: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: { product_id: number; quantity: number }) => Promise<boolean>
  removeFromCart: (product_id: number) => Promise<void>
  updateQuantity: (
    product_id: number,
    action: "increment" | "decrement"
  ) => Promise<void>
  refreshCart: (overrideToken?: string | null) => Promise<void>
  clearCart: () => void
  setToken: (token: string | null) => void
  token: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [token, setTokenState] = useState<string | null>(null)

  const CART_API = "https://medicaps.cloud/grasa/shop/cart"

  // Load token on mount
  useEffect(() => {
    const cookieToken = getCookie("token")
    if (cookieToken) {
      setTokenState(cookieToken)
    }
  }, [])

  const refreshCart = async (overrideToken?: string | null) => {
    const activeToken = overrideToken ?? token
    if (!activeToken) {
      setCart([])
      return
    }

    try {
      const res = await axios.get(CART_API, {
        headers: { Authorization: `Bearer ${activeToken}` },
      })
      const apiItems = res.data.cart?.items || []
      const items: CartItem[] = apiItems.map((i: any) => ({
        id: i.id,
        product_id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        effective_price: i.product.effective_price,
        discount_percent: i.product.discount_percent,
        stock_quantity: i.product.stock_quantity,
        image_url: i.product.image_url,
        quantity: i.quantity,
        unit_price: i.unit_price,
      }))
      setCart(items)
    } catch (err) {
      console.error("❌ Failed to fetch cart", err)
      setCart([])
    }
  }

  // Refresh cart whenever token changes
  useEffect(() => {
    if (token) refreshCart()
  }, [token])

  const setToken = (newToken: string | null) => {
    if (!newToken) {
      deleteCookie("token")
      setTokenState(null)
      setCart([])
    } else {
      setCookie("token", newToken)
      setTokenState(newToken)
      refreshCart(newToken)
    }
  }

  const addToCart = async (item: { product_id: number; quantity: number }) => {
    if (!token) {
      console.error("No token found. User must login.")
      return false
    }

    try {
      const res = await axios.post(
        "https://medicaps.cloud/grasa/shop/cart/items",
        item,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.status === 200 || res.status === 201) {
        await refreshCart()
        return true
      }
      return false
    } catch (err) {
      console.error("❌ Add to cart failed", err)
      return false
    }
  }

  const removeFromCart = async (product_id: number) => {
    if (!token) return
    try {
      await axios.delete(
        `https://medicaps.cloud/grasa/shop/cart/items/${product_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await refreshCart()
    } catch (err) {
      console.error("❌ Remove failed", err)
    }
  }

  const updateQuantity = async (
    product_id: number,
    action: "increment" | "decrement"
  ) => {
    if (!token) return
    try {
      await axios.patch(
        `https://medicaps.cloud/grasa/shop/cart/items/${product_id}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await refreshCart()
    } catch (err) {
      console.error("❌ Update failed", err)
    }
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart,
        setToken,
        token,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}