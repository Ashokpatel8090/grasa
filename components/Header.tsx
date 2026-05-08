"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/components/grasa/CartContext";

import {
  FiMenu,
  FiX,
  FiShoppingCart,
} from "react-icons/fi";

/* ===================== COOKIE HELPER ===================== */
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subStatus, setSubStatus] = useState("normal"); // --- Subscription State ---
  
  // --- Longevity Test State ---
  const [hasStoredResult, setHasStoredResult] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { cart } = useCart();

  const cartCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);

  useEffect(() => {
    setMounted(true);

    const checkAuthAndSub = () => {
      const token = getCookie("token");
      setIsLoggedIn(!!token);

      // Fetch subscription status directly from the cookie saved during login
      if (token) {
        const status = getCookie("subscription_status");
        if (status === "active") {
          setSubStatus("pro");
        } else {
          setSubStatus("normal");
        }
      } else {
        setSubStatus("normal");
      }
    };

    checkAuthAndSub();
    window.addEventListener("focus", checkAuthAndSub);

    const saved = localStorage.getItem('grasa_longevity_result');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
        if (Date.now() - parsed.timestamp < oneMonthInMs) {
          setHasStoredResult(true);
        }
      } catch (err) {
        console.error("Failed to parse local storage in Header:", err);
      }
    }

    return () => window.removeEventListener("focus", checkAuthAndSub);
  }, []);

  const handleLogout = () => {
    // Clear Auth Cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Clear Subscription Cookies
    document.cookie = "grasa_subscription=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "subscription_status=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "subscription_plan_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "subscription_expiry=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "subscription_cancel_at_cycle_end=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setIsLoggedIn(false);
    setSubStatus("normal");
    setUserDropdownOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header className="w-full bg-white fixed top-0 left-0 z-50 border-b border-gray-100">
        <div className="flex items-center justify-between max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 h-[72px]">

          {/* Logo */}
          <div className="flex items-center cursor-pointer -ml-2 sm:-ml-3" onClick={() => router.push("/")}>
            <Image
              src="/logo.png"
              alt="Grasa Logo"
              width={86}
              height={16}
              priority
              className="object-contain"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-5 sm:gap-6">

            {/* DESKTOP CTA */}
            <button
              onClick={() => {
                  if (hasStoredResult) {
                    localStorage.removeItem('grasa_longevity_result');
                  }
                  // localStorage.removeItem('grasa_longevity_result');
                  router.push("/longevity-test");
                }}
                className={`hidden md:block bg-[#1b1b1b] text-white border border-[#1b1b1b] cursor-pointer rounded-full px-6 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-[#C5D82D] hover:text-[#1b1b1b] hover:border-[#C5D82D] transition-all duration-300 hover:shadow-[0_0_15px_rgba(197,216,45,0.3)] hover:-translate-y-0.5 ${!mounted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              {hasStoredResult ? "Retake Longevity Test ™" : "Take The Longevity Test ™"}
            </button>

            {/* CART ICON */}
            <div
              className="relative cursor-pointer flex items-center justify-center"
              onClick={() => router.push("/cart")}
            >
              <FiShoppingCart className="w-6 h-6 text-[#1b1b1b]" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#C5D82D] text-[#1b1b1b] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            {/* USER ICON + DROPDOWN */}
            <div className="relative flex items-center justify-center">
              
              {/* Premium Ring & Hover Animations */}
              <div 
                className={`relative cursor-pointer rounded-full transition-all duration-300 ease-out hover:scale-105 ${
                  isLoggedIn && subStatus === "pro" 
                    ? "p-[3px] bg-gradient-to-tr from-[#C5D82D] via-[#e3f45b] to-[#C5D82D] shadow-[0_0_15px_rgba(197,216,45,0.5)] hover:shadow-[0_0_25px_rgba(197,216,45,0.7)]" 
                    : "p-[2px] bg-gray-200 hover:bg-gray-300 shadow-sm hover:shadow-md" 
                }`}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                {/* Actual Avatar Background */}
                <div className={`rounded-full w-9 h-9 flex items-center justify-center transition-colors duration-300 ${
                  isLoggedIn && subStatus === "pro" ? "bg-[#1b1b1b]" : "bg-white"
                }`}>
                  
                  {/* Uploaded Flat Icon */}
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    className={`w-[18px] h-[18px] transition-colors duration-300 ${
                      isLoggedIn && subStatus === "pro" ? "text-[#C5D82D]" : "text-gray-700"
                    }`}
                  >
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
                  </svg>

                </div>
              </div>

              {userDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserDropdownOpen(false)}
                  />

                  {/* Frosted Glass Dropdown */}
                  <div
                    className="absolute top-12 right-0 w-[220px] rounded-[20px] z-50"
                    style={{
                      background: "rgba(255,255,255,0.72)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      border: "0.5px solid rgba(210,208,198,0.6)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.06)",
                      padding: "14px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {isLoggedIn ? (
                      <>
                        {/* Header with avatar */}
                        <div className="flex items-center gap-2.5 pb-3 border-b border-[rgba(210,208,198,0.5)] mb-1">
                          <div className="w-9 h-9 rounded-full bg-[#1b1b1b] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                            G
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-[#1b1b1b] leading-tight m-0">My Account</p>
                            <p className="text-[11px] text-gray-800 mt-0.5 m-0">
                               Welcome back! {subStatus === "pro" && <span className="text-[#C5D82D] font-bold">(PRO)</span>}
                            </p>
                          </div>
                        </div>

                        {/* My Profile */}
                        <a
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#1b1b1b] no-underline transition-all duration-150 hover:-translate-y-0.5"
                          style={{
                            background: "rgba(255,255,255,0.55)",
                            border: "0.5px solid rgba(210,208,198,0.45)",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.9)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.55)")}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(197,216,45,0.18)] flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a6b00" strokeWidth="2" strokeLinecap="round">
                              <circle cx="12" cy="8" r="4"/>
                              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                            </svg>
                          </div>
                          My Profile
                        </a>

                        {/* My Orders */}
                        <a
                          href="/shop/orders"
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#1b1b1b] no-underline transition-all duration-150 hover:-translate-y-0.5"
                          style={{
                            background: "rgba(255,255,255,0.55)",
                            border: "0.5px solid rgba(210,208,198,0.45)",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.9)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.55)")}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(197,216,45,0.18)] flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a6b00" strokeWidth="2" strokeLinecap="round">
                              <rect x="3" y="3" width="18" height="18" rx="3"/>
                              <path d="M8 12h8M8 8h5M8 16h6"/>
                            </svg>
                          </div>
                          My Orders
                        </a>

                        {/* Divider */}
                        <div className="h-px bg-[rgba(210,208,198,0.5)] my-0.5" />

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#c0392b] cursor-pointer transition-all duration-150 hover:-translate-y-0.5 w-full"
                          style={{
                            background: "rgba(246,28,28,0.07)",
                            border: "0.5px solid rgba(246,28,28,0.18)",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(246,28,28,0.13)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(246,28,28,0.07)")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                          </svg>
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Guest Header */}
                        <div className="flex items-center gap-2.5 pb-3 border-b border-[rgba(210,208,198,0.5)] mb-1">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round">
                              <circle cx="12" cy="8" r="4"/>
                              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-[12px] text-gray-800 font-medium leading-tight m-0">Welcome to GRASA</p>
                            <p className="text-[11px] text-gray-700 mt-0.5 m-0">Sign in to continue</p>
                          </div>
                        </div>

                        {/* Login Button */}
                        <a
                          href="/login"
                          className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-[13px] font-medium no-underline transition-all duration-200 hover:-translate-y-0.5"
                          style={{ background: "#1b1b1b", color: "#fff" }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = "#C5D82D";
                            e.currentTarget.style.color = "#1b1b1b";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = "#1b1b1b";
                            e.currentTarget.style.color = "#fff";
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                          </svg>
                          Login / Sign Up
                        </a>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* HAMBURGER MENU */}
            <div
              className="cursor-pointer flex items-center justify-center"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <FiX className="w-7 h-7 text-[#1b1b1b]" />
              ) : (
                <FiMenu className="w-7 h-7 text-[#1b1b1b]" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-[72px] right-0 h-[calc(100vh-72px)] w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-[#d6d1c4] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto p-6 space-y-3 font-sans pb-24">

          {/* Mobile Only Longevity CTA */}
          <button
            onClick={() => { setOpen(false); router.push("/longevity-test"); }}
            className={`md:hidden w-full mb-4 bg-[#1b1b1b] text-white border border-[#1b1b1b] cursor-pointer rounded-xl px-4 py-4 text-sm font-bold tracking-wider uppercase hover:bg-[#C5D82D] hover:text-[#1b1b1b] hover:border-[#C5D82D] transition-all duration-300 ${!mounted ? 'opacity-0' : 'opacity-100'}`}
          >
            {hasStoredResult ? "Retake Longevity Test ™" : "Take The Longevity Test ™"}
          </button>

          <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-xs mb-2 block">Navigation</span>


          {/* Products */}
          <div
            className="bg-[#E8C96A] p-4 rounded-2xl cursor-pointer hover:bg-[#ebecdf] hover:border-[#1b1b1b] border border-transparent flex items-center justify-between group transition-all"
            onClick={() => {
              setOpen(false);
              router.push("/consultations");
            }}
          >
            <span className="font-bold text-[#1b1b1b]">Consultations</span>
            <span className="text-[#000000] group-hover:text-[#1b1b1b] group-hover:translate-x-1 font-bold transition-all">→</span>
          </div>

          {/* Recommended Plan */}
          {/* <div
            className="bg-[#f4f4f2] p-4 rounded-2xl cursor-pointer hover:bg-[#ebecdf] hover:border-[#1b1b1b] border border-transparent flex items-center justify-between group transition-all"
            onClick={() => {
              setOpen(false);
              if (pathname === "/") {
                const section = document.getElementById("regimen-plans");
                if (section) {
                  setTimeout(() => {
                    section.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              } else {
                router.push("/#regimen-plans");
              }
            }}
          >
            <span className="font-bold text-[#1b1b1b]">My Recommended Plan</span>
            <span className="text-[#d6d1c4] group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
          </div> */}

          <div
  className="bg-[#C5D82D] p-4 rounded-2xl cursor-pointer 
  border-2 border-[#C5D82D] 
  hover:bg-[#ebecdf] hover:border-[#1b1b1b] 
  flex items-center justify-between group transition-all duration-300"
  onClick={() => {
    setOpen(false);
    if (pathname === "/") {
      const section = document.getElementById("regimen-plans");
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      router.push("/#regimen-plans");
    }
  }}
>
  <span className="font-bold text-[#1b1b1b]">
    My Recommended Plan
  </span>

  <span className="text-[#000000] font-extrabold group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">
    →
  </span>
</div>

          {/* Products */}
          <div
            className="bg-[#f4f4f2] p-4 rounded-2xl cursor-pointer hover:bg-[#ebecdf] hover:border-[#1b1b1b] border border-transparent flex items-center justify-between group transition-all"
            onClick={() => {
              setOpen(false);
              router.push("/products");
            }}
          >
            <span className="font-bold text-[#1b1b1b]">Products</span>
            <span className="text-[#000000] font-extrabold group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
          </div>

          {/* Blog */}
          <div
            className="bg-[#f4f4f2] p-4 rounded-2xl cursor-pointer hover:bg-[#ebecdf] hover:border-[#1b1b1b] border border-transparent flex items-center justify-between group transition-all"
            onClick={() => {
              setOpen(false);
              router.push("/blogs");
            }}
          >
            <span className="font-bold text-[#1b1b1b]">Journal & Blog</span>
            <span className="text-[#000000] font-extrabold group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
          </div>

          <div className="h-px bg-[#d6d1c4] my-6"></div>

          <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-xs mb-2 block">About GRASA</span>

          <div
            className="bg-[#f4f4f2] p-4 rounded-2xl cursor-pointer hover:bg-[#ebecdf] hover:border-[#1b1b1b] border border-transparent flex items-center justify-between group transition-all"
            onClick={() => {
              setOpen(false);
              router.push("/about");
            }}
          >
            <span className="font-bold text-[#1b1b1b]">About Us</span>
            <span className="text-[#000000] font-extrabold group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
          </div>

          {/* Vision & Mission */}
          <div
            className="bg-[#f4f4f2] p-4 rounded-2xl cursor-pointer hover:bg-[#ebecdf] hover:border-[#1b1b1b] border border-transparent flex items-center justify-between group transition-all"
            onClick={() => {
              setOpen(false);
              router.push("/vision-mission");
            }}
          >
            <span className="font-bold text-[#1b1b1b]">Our Vision & Mission</span>
            <span className="text-[#000000] font-extrabold group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
          </div>

          {/* Science */}
          <div
            className="bg-[#f4f4f2] p-4 rounded-2xl cursor-pointer hover:bg-[#ebecdf] hover:border-[#1b1b1b] border border-transparent flex items-center justify-between group transition-all"
            onClick={() => {
              setOpen(false);
              router.push("/science");
            }}
          >
            <span className="font-bold text-[#1b1b1b]">The Science</span>
            <span className="text-[#000000] font-extrabold group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
          </div>

          <div className="h-px bg-[#d6d1c4] my-6"></div>

          <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-xs mb-2 block">Support</span>

          {/* Call Us */}
          <a
            href="tel:+919870263399"
            className="flex items-center justify-between bg-white border border-[#d6d1c4] p-4 rounded-2xl cursor-pointer hover:border-[#1b1b1b] text-[#1b1b1b] group transition-all shadow-sm"
          >
            <span className="font-bold">Call Us Now 📞</span>
            <span className="text-[#000000] font-extrabold group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919870263399"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-white border border-[#d6d1c4] p-4 rounded-2xl cursor-pointer hover:border-[#25D366] hover:text-[#25D366] text-[#1b1b1b] group transition-all shadow-sm"
          >
            <span className="font-bold">Chat on WhatsApp</span>
            <span className="text-[#000000] font-extrabold group-hover:text-[#25D366] group-hover:translate-x-1 transition-all">→</span>
          </a>

          {/* Shop All Products */}
          <div
            className="bg-[#C5D82D] text-[#1b1b1b] p-4 rounded-2xl text-center font-bold uppercase tracking-wider text-sm cursor-pointer hover:bg-[#b5c729] hover:-translate-y-1 hover:shadow-lg transition-all mt-8"
            onClick={() => {
              setOpen(false);
              router.push("/products");
            }}
          >
            Shop All Products
          </div>
        </div>
      </div>
    </>
  );
}
