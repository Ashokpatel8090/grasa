// "use client"

// import { createContext, useContext, useState, useEffect, ReactNode } from "react"
// import axios from "axios"
// import { BASE_URL } from "@/components/config/api";

// // ---------------- COOKIE HELPERS ----------------
// const getCookie = (name: string): string | null => {
//   if (typeof document === "undefined") return null;
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
//   refreshCart: (overrideToken?: string | null) => Promise<void>
//   clearCart: () => void
//   setToken: (token: string | null) => void
//   token: string | null
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([])
//   const [token, setTokenState] = useState<string | null>(null)

//   const CART_API = `${BASE_URL}/grasa/shop/cart`

//   // Load token on mount
//   useEffect(() => {
//     const cookieToken = getCookie("token")
//     if (cookieToken) {
//       setTokenState(cookieToken)
//     }
//   }, [])

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

//   // Refresh cart whenever token changes
//   useEffect(() => {
//     if (token) refreshCart()
//   }, [token])

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

//   const addToCart = async (item: { product_id: number; quantity: number }) => {
//     if (!token) {
//       console.error("No token found. User must login.")
//       return false
//     }

//     try {
//       const res = await axios.post(
//         `${BASE_URL}/grasa/shop/cart/items`,
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

//   const removeFromCart = async (product_id: number) => {
//     if (!token) return
//     try {
//       await axios.delete(
//         `${BASE_URL}/grasa/shop/cart/items/${product_id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       await refreshCart()
//     } catch (err) {
//       console.error("❌ Remove failed", err)
//     }
//   }

//   const updateQuantity = async (
//     product_id: number,
//     action: "increment" | "decrement"
//   ) => {
//     if (!token) return
//     try {
//       await axios.patch(
//         `${BASE_URL}/grasa/shop/cart/items/${product_id}`,
//         { action },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       await refreshCart()
//     } catch (err) {
//       console.error("❌ Update failed", err)
//     }
//   }

//   const clearCart = () => setCart([])

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
import { BASE_URL } from "@/components/config/api";

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
  out_of_stock: boolean // Added this field
}

type CartContextType = {
  cart: CartItem[]
  isLoading: boolean // Added loading state to context
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
  const [isLoading, setIsLoading] = useState<boolean>(true) // Initialize as true

  const CART_API = `${BASE_URL}/grasa/shop/cart`

  // Load token on mount
  useEffect(() => {
    const cookieToken = getCookie("token")
    if (cookieToken) {
      setTokenState(cookieToken)
    } else {
      // If no token exists at all, stop loading immediately
      setIsLoading(false) 
    }
  }, [])

  const refreshCart = async (overrideToken?: string | null) => {
    setIsLoading(true) // Start loading
    const activeToken = overrideToken ?? token
    
    if (!activeToken) {
      setCart([])
      setIsLoading(false)
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
        stock_quantity: i.product.stock_quantity || 0,
        image_url: i.product.image_url,
        quantity: i.quantity,
        unit_price: i.unit_price,
        out_of_stock: i.out_of_stock || false // Map out_of_stock from API
      }))
      setCart(items)
    } catch (err) {
      console.error("❌ Failed to fetch cart", err)
      setCart([])
    } finally {
      setIsLoading(false) // Stop loading whether successful or failed
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

  // ... (addToCart, removeFromCart, updateQuantity, clearCart remain the same) ...
  const addToCart = async (item: { product_id: number; quantity: number }) => {
    if (!token) return false
    try {
      const res = await axios.post(`${BASE_URL}/grasa/shop/cart/items`, item, { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 200 || res.status === 201) { await refreshCart(); return true }
      return false
    } catch (err) { return false }
  }

  const removeFromCart = async (product_id: number) => {
    if (!token) return
    try {
      await axios.delete(`${BASE_URL}/grasa/shop/cart/items/${product_id}`, { headers: { Authorization: `Bearer ${token}` } })
      await refreshCart()
    } catch (err) { console.error("❌ Remove failed", err) }
  }

  const updateQuantity = async (product_id: number, action: "increment" | "decrement") => {
    if (!token) return
    try {
      await axios.patch(`${BASE_URL}/grasa/shop/cart/items/${product_id}`, { action }, { headers: { Authorization: `Bearer ${token}` } })
      await refreshCart()
    } catch (err) { console.error("❌ Update failed", err) }
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading, // Export it here
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











// "use client"

// import { createContext, useContext, useState, useEffect, ReactNode } from "react"
// import axios from "axios"
// import { BASE_URL } from "@/components/config/api"

// // ================== COOKIE HELPERS ==================
// const getCookie = (name: string): string | null => {
//   if (typeof document === "undefined") return null
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

// // ================== TYPES ==================
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

// type CouponResponse = {
//   is_valid: boolean
//   discount: number
//   subtotal: number
//   final_price: number
//   message?: string
// }

// type CouponState = {
//   code: string | null
//   discount: number
//   subtotal: number
//   finalPrice: number
//   isValid: boolean
//   error: string | null
// }

// type CartContextType = {
//   cart: CartItem[]
//   cartId: number | null
//   coupon: CouponState
//   addToCart: (item: { product_id: number; quantity: number }) => Promise<boolean>
//   removeFromCart: (product_id: number) => Promise<void>
//   updateQuantity: (
//     product_id: number,
//     action: "increment" | "decrement"
//   ) => Promise<void>
//   refreshCart: (overrideToken?: string | null) => Promise<void>
//   clearCart: () => void
//   setToken: (token: string | null) => void
//   token: string | null
//   applyCoupon: (couponCode: string) => Promise<boolean>
//   removeCoupon: () => void
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([])
//   const [cartId, setCartId] = useState<number | null>(null)
//   const [token, setTokenState] = useState<string | null>(null)
//   const [coupon, setCoupon] = useState<CouponState>({
//     code: null,
//     discount: 0,
//     subtotal: 0,
//     finalPrice: 0,
//     isValid: false,
//     error: null,
//   })

//   const CART_API = `${BASE_URL}/grasa/shop/cart`
//   const COUPON_API = `${BASE_URL}/grasa/shop/coupons/validate`

//   // ================== LOAD TOKEN ON MOUNT ==================
//   useEffect(() => {
//     const cookieToken = getCookie("token")
//     if (cookieToken) {
//       setTokenState(cookieToken)
//     }
//   }, [])

//   // ================== REFRESH CART ==================
//   const refreshCart = async (overrideToken?: string | null) => {
//     const activeToken = overrideToken ?? token
//     if (!activeToken) {
//       setCart([])
//       setCartId(null)
//       return
//     }

//     try {
//       const res = await axios.get(CART_API, {
//         headers: { Authorization: `Bearer ${activeToken}` },
//       })

//       // Extract cart ID from response
//       const cart_id = res.data.cart?.id || null
//       setCartId(cart_id)

//       // Map items
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

//       // Clear coupon state when cart is refreshed
//       setCoupon({
//         code: null,
//         discount: 0,
//         subtotal: 0,
//         finalPrice: 0,
//         isValid: false,
//         error: null,
//       })
//     } catch (err) {
//       console.error("❌ Failed to fetch cart", err)
//       setCart([])
//       setCartId(null)
//     }
//   }

//   // ================== REFRESH CART WHEN TOKEN CHANGES ==================
//   useEffect(() => {
//     if (token) refreshCart()
//   }, [token])

//   // ================== SET TOKEN ==================
//   const setToken = (newToken: string | null) => {
//     if (!newToken) {
//       deleteCookie("token")
//       setTokenState(null)
//       setCart([])
//       setCartId(null)
//       setCoupon({
//         code: null,
//         discount: 0,
//         subtotal: 0,
//         finalPrice: 0,
//         isValid: false,
//         error: null,
//       })
//     } else {
//       setCookie("token", newToken)
//       setTokenState(newToken)
//       refreshCart(newToken)
//     }
//   }

//   // ================== ADD TO CART ==================
//   const addToCart = async (item: { product_id: number; quantity: number }) => {
//     if (!token) {
//       console.error("No token found. User must login.")
//       return false
//     }

//     try {
//       const res = await axios.post(`${BASE_URL}/grasa/shop/cart/items`, item, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
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

//   // ================== REMOVE FROM CART ==================
//   const removeFromCart = async (product_id: number) => {
//     if (!token) return
//     try {
//       await axios.delete(`${BASE_URL}/grasa/shop/cart/items/${product_id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       await refreshCart()
//     } catch (err) {
//       console.error("❌ Remove failed", err)
//     }
//   }

//   // ================== UPDATE QUANTITY ==================
//   const updateQuantity = async (
//     product_id: number,
//     action: "increment" | "decrement"
//   ) => {
//     if (!token) return
//     try {
//       await axios.patch(
//         `${BASE_URL}/grasa/shop/cart/items/${product_id}`,
//         { action },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       await refreshCart()
//     } catch (err) {
//       console.error("❌ Update failed", err)
//     }
//   }

//   // ================== APPLY COUPON ==================
//   const applyCoupon = async (couponCode: string): Promise<boolean> => {
//     if (!token || !cartId) {
//       setCoupon((prev) => ({
//         ...prev,
//         error: "Cart not initialized. Please refresh.",
//       }))
//       return false
//     }

//     if (!couponCode.trim()) {
//       setCoupon((prev) => ({
//         ...prev,
//         error: "Please enter a coupon code.",
//       }))
//       return false
//     }

//     try {
//       const res = await axios.post<CouponResponse>(
//         COUPON_API,
//         {
//           coupon_code: couponCode.trim(),
//           cart_id: cartId,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )

//       if (res.data.is_valid) {
//         setCoupon({
//           code: couponCode.trim(),
//           discount: res.data.discount,
//           subtotal: res.data.subtotal,
//           finalPrice: res.data.final_price,
//           isValid: true,
//           error: null,
//         })
//         return true
//       } else {
//         setCoupon((prev) => ({
//           ...prev,
//           error: res.data.message || "Invalid coupon code",
//           isValid: false,
//           code: null,
//         }))
//         return false
//       }
//     } catch (err: any) {
//       const errorMsg =
//         err?.response?.data?.message ||
//         err?.response?.statusText ||
//         "Failed to validate coupon"
//       setCoupon((prev) => ({
//         ...prev,
//         error: errorMsg,
//         isValid: false,
//         code: null,
//       }))
//       return false
//     }
//   }

//   // ================== REMOVE COUPON ==================
//   const removeCoupon = () => {
//     setCoupon({
//       code: null,
//       discount: 0,
//       subtotal: 0,
//       finalPrice: 0,
//       isValid: false,
//       error: null,
//     })
//   }

//   // ================== CLEAR CART ==================
//   const clearCart = () => {
//     setCart([])
//     setCartId(null)
//     setCoupon({
//       code: null,
//       discount: 0,
//       subtotal: 0,
//       finalPrice: 0,
//       isValid: false,
//       error: null,
//     })
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         cartId,
//         coupon,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         refreshCart,
//         setToken,
//         token,
//         clearCart,
//         applyCoupon,
//         removeCoupon,
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








// "use client"

// import { createContext, useContext, useState, useEffect, ReactNode } from "react"
// import axios from "axios"
// import { BASE_URL } from "@/components/config/api"

// // ---------------- COOKIE HELPERS ----------------
// const getCookie = (name: string): string | null => {
//   if (typeof document === "undefined") return null;
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
// export type CartItem = {
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

// export type Coupon = {
//   id: number
//   coupon_code: string
//   description: string | null
//   discount_type: string
//   discount_value: string
// }

// export type AppliedCoupon = {
//   code: string
//   discount: number
// }

// type CartContextType = {
//   cart: CartItem[]
//   cartId: number | null
//   availableCoupons: Coupon[]
//   appliedCoupon: AppliedCoupon | null
//   addToCart: (item: { product_id: number; quantity: number }) => Promise<boolean>
//   removeFromCart: (product_id: number) => Promise<void>
//   updateQuantity: (
//     product_id: number,
//     action: "increment" | "decrement"
//   ) => Promise<void>
//   refreshCart: (overrideToken?: string | null) => Promise<void>
//   validateCoupon: (code: string) => Promise<{ success: boolean; message: string }>
//   removeCoupon: () => void
//   clearCart: () => void
//   setToken: (token: string | null) => void
//   token: string | null
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([])
//   const [cartId, setCartId] = useState<number | null>(null)
//   const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])
//   const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
//   const [token, setTokenState] = useState<string | null>(null)

//   const CART_API = `${BASE_URL}/grasa/shop/cart`

//   // Load token on mount
//   useEffect(() => {
//     const cookieToken = getCookie("token")
//     if (cookieToken) {
//       setTokenState(cookieToken)
//     }
//   }, [])

//   const refreshCart = async (overrideToken?: string | null) => {
//     const activeToken = overrideToken ?? token
//     if (!activeToken) {
//       setCart([])
//       setCartId(null)
//       setAvailableCoupons([])
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
//       setCartId(res.data.cart?.id || null)
//       setAvailableCoupons(res.data.available_coupons || [])
//     } catch (err) {
//       console.error("❌ Failed to fetch cart", err)
//       setCart([])
//       setCartId(null)
//       setAvailableCoupons([])
//     }
//   }

//   // Refresh cart whenever token changes
//   useEffect(() => {
//     if (token) refreshCart()
//   }, [token])

//   const setToken = (newToken: string | null) => {
//     if (!newToken) {
//       deleteCookie("token")
//       setTokenState(null)
//       setCart([])
//       setCartId(null)
//       setAppliedCoupon(null)
//     } else {
//       setCookie("token", newToken)
//       setTokenState(newToken)
//       refreshCart(newToken)
//     }
//   }

//   const addToCart = async (item: { product_id: number; quantity: number }) => {
//     if (!token) return false
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/grasa/shop/cart/items`,
//         item,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       if (res.status === 200 || res.status === 201) {
//         await refreshCart()
//         setAppliedCoupon(null) // Reset coupon on cart changes
//         return true
//       }
//       return false
//     } catch (err) {
//       console.error("❌ Add to cart failed", err)
//       return false
//     }
//   }

//   const removeFromCart = async (product_id: number) => {
//     if (!token) return
//     try {
//       await axios.delete(
//         `${BASE_URL}/grasa/shop/cart/items/${product_id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       setAppliedCoupon(null) // Reset coupon on cart changes
//       await refreshCart()
//     } catch (err) {
//       console.error("❌ Remove failed", err)
//     }
//   }

//   const updateQuantity = async (
//     product_id: number,
//     action: "increment" | "decrement"
//   ) => {
//     if (!token) return
//     try {
//       await axios.patch(
//         `${BASE_URL}/grasa/shop/cart/items/${product_id}`,
//         { action },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       setAppliedCoupon(null) // Reset coupon on cart changes
//       await refreshCart()
//     } catch (err) {
//       console.error("❌ Update failed", err)
//     }
//   }

//   const validateCoupon = async (code: string) => {
//     if (!token || !cartId) return { success: false, message: "Cart not found" }
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/grasa/shop/coupons/validate`,
//         { coupon_code: code, cart_id: cartId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )

//       if (res.data.is_valid) {
//         setAppliedCoupon({
//           code: res.data.coupon_code,
//           discount: res.data.discount,
//         })
//         return { success: true, message: "Coupon applied successfully!" }
//       } else {
//         return { success: false, message: res.data.message || "Invalid coupon" }
//       }
//     } catch (err: any) {
//       return {
//         success: false,
//         message: err.response?.data?.message || "Failed to validate coupon",
//       }
//     }
//   }

//   const removeCoupon = () => setAppliedCoupon(null)

//   const clearCart = () => {
//     setCart([])
//     setCartId(null)
//     setAppliedCoupon(null)
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         cartId,
//         availableCoupons,
//         appliedCoupon,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         refreshCart,
//         validateCoupon,
//         removeCoupon,
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