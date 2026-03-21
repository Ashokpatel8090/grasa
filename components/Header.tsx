

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/components/grasa/CartContext";


import {
  FiMenu,
  FiX,
  FiUser,
  FiShoppingCart,
} from "react-icons/fi";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // --- Longevity Test State ---
  const [hasStoredResult, setHasStoredResult] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { cart } = useCart(); // 🛒 cart context

  // Added 'any' type to item to prevent potential build errors if CartContext isn't strictly typed
  const cartCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);

  useEffect(() => {
    setMounted(true);

    // 1. Check Auth Status
    const checkAuth = () => {
      const cookies = document.cookie.split("; ");
      const token = cookies.find((row) => row.startsWith("token="));
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("focus", checkAuth);

    // 2. Check for existing Longevity Test Result in LocalStorage
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

    return () => window.removeEventListener("focus", checkAuth);
  }, []);



  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setIsLoggedIn(false);
    setUserDropdownOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header className="w-full bg-white fixed top-0 left-0 z-50 border-b border-gray-100">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px]">

          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
            <Image
              src="/logo.png"
              alt="Grasa Logo"
              width={100}
              height={16}
              priority
              className="object-contain p-2"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 sm:gap-6">

            {/* DESKTOP CTA */}
            
            <button 
              onClick={() => router.push("/longevity-test")}
              className={`hidden md:block bg-[#1b1b1b] text-white border border-[#1b1b1b] cursor-pointer rounded-full px-6 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-[#C5D82D] hover:text-[#1b1b1b] hover:border-[#C5D82D] transition-all duration-300 hover:shadow-[0_0_15px_rgba(197,216,45,0.3)] hover:-translate-y-0.5 ${!mounted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              {hasStoredResult ? "Retake Longevity Test ™" : "Take The Longevity Test ™"}
            </button>

            {/* CART ICON */}
            <div
              className="relative cursor-pointer"
              onClick={() => router.push("/cart")}
            >
              <FiShoppingCart className="w-6 h-6 text-black" />

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-[#C5D82D] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            <div className="relative">
              <FiUser
                className="text-black w-10 h-10 flex items-center justify-center cursor-pointer bg-gray-400 rounded-full p-2"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              />

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserDropdownOpen(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-lg p-2 flex flex-col gap-2 z-50">
                    {isLoggedIn ? (
                      <>
                        <a
                          href="/profile"
                          className="w-full font-semibold text-center text-sm border rounded-md py-1.5 hover:bg-gray-100 transition"
                        >
                          My Profile
                        </a>

                        <a
                          href="/shop/orders"
                          className="w-full font-semibold text-center text-sm border rounded-md py-1.5 hover:bg-gray-100 transition"
                        >
                          My Orders
                        </a>

                        <button
                          onClick={handleLogout}
                          className="w-full font-semibold text-center text-sm border rounded-md py-1.5 hover:bg-gray-100 transition"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <a
                        href="/login"
                        className="w-full font-semibold text-center text-sm border rounded-md py-1.5 hover:bg-gray-100 transition"
                      >
                        Login
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
              
            {/* MENU */}
            <div
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <FiX className="w-6 h-6 text-black" />
              ) : (
                <FiMenu className="w-6 h-6 text-black" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] bg-black/30 z-40"
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

          {/* Recommended Plan */}
          {/* Recommended Plan */}
          <div 
            className="bg-[#f4f4f2] p-4 rounded-2xl cursor-pointer hover:bg-[#ebecdf] hover:border-[#1b1b1b] border border-transparent flex items-center justify-between group transition-all"
            onClick={() => {
              setOpen(false);
              
              if (pathname === "/") {
                // If already on the home page, smoothly scroll to the section
                const section = document.getElementById("regimen-plans");
                if (section) {
                  // Small timeout ensures the sidebar closes before scrolling starts
                  setTimeout(() => {
                    section.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              } else {
                // If on another page, navigate to home and then to the ID
                router.push("/#regimen-plans");
              }
            }}
          >
            <span className="font-bold text-[#1b1b1b]">My Recommended Plan</span>
            <span className="text-[#d6d1c4] group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
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
            <span className="text-[#d6d1c4] group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
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
            <span className="text-[#d6d1c4] group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
          </div>

          <div className="h-px bg-[#d6d1c4] my-6"></div>

          <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-xs mb-2 block">About GRASA</span>

          {/* Vision & Mission */}
          <div 
            className="bg-[#f4f4f2] p-4 rounded-2xl cursor-pointer hover:bg-[#ebecdf] hover:border-[#1b1b1b] border border-transparent flex items-center justify-between group transition-all"
            onClick={() => {
              setOpen(false);
              router.push("/vision-mission");
            }}
          >
            <span className="font-bold text-[#1b1b1b]">Our Vision & Mission</span>
            <span className="text-[#d6d1c4] group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
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
            <span className="text-[#d6d1c4] group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
          </div>

          <div className="h-px bg-[#d6d1c4] my-6"></div>

          <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-xs mb-2 block">Support</span>

          {/* Call Us */}
          <a 
            href="tel:+919870263399" 
            className="flex items-center justify-between bg-white border border-[#d6d1c4] p-4 rounded-2xl cursor-pointer hover:border-[#1b1b1b] text-[#1b1b1b] group transition-all shadow-sm"
          >
            <span className="font-bold">Call Us Now 📞</span>
            <span className="text-[#d6d1c4] group-hover:text-[#1b1b1b] group-hover:translate-x-1 transition-all">→</span>
          </a>

          {/* WhatsApp */}
          <a 
            href="https://wa.me/919870263399" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-white border border-[#d6d1c4] p-4 rounded-2xl cursor-pointer hover:border-[#25D366] hover:text-[#25D366] text-[#1b1b1b] group transition-all shadow-sm"
          >
            <span className="font-bold">Chat on WhatsApp</span>
            <span className="text-[#d6d1c4] group-hover:text-[#25D366] group-hover:translate-x-1 transition-all">→</span>
          </a>

          {/* All Products Button */}
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





