// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter, usePathname } from "next/navigation";
// import { useCart } from "@/components/grasa/CartContext";

// import {
//   FiMenu,
//   FiX,
//   FiUser,
//   FiShoppingCart,
// } from "react-icons/fi";

// export default function Header() {
//   const [open, setOpen] = useState(false);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const router = useRouter();
//   const pathname = usePathname();

//   const { cart } = useCart(); // 🛒 cart context

//   // Added 'any' type to item to prevent potential build errors if CartContext isn't strictly typed
//   const cartCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);

//   useEffect(() => {
//     const checkAuth = () => {
//       const cookies = document.cookie.split("; ");
//       const token = cookies.find((row) => row.startsWith("token="));
//       setIsLoggedIn(!!token);
//     };

//     checkAuth();
//     window.addEventListener("focus", checkAuth);
//     return () => window.removeEventListener("focus", checkAuth);
//   }, []);

//   // Generic function to handle smooth scrolling to any hash ID
//   // Added ': string' type to fix the build error
//   const handleScrollTo = (id: string) => {
//     setOpen(false);

//     if (pathname !== "/") {
//       router.push(`/#${id}`);
//       return;
//     }

//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const handleLogout = () => {
//     document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     document.cookie =
//       "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

//     setIsLoggedIn(false);
//     setUserDropdownOpen(false);
//     router.push("/login");
//   };

//   return (
//     <>
//       <header className="w-full bg-white fixed top-0 left-0 z-50 border-b border-gray-100">
//         <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px]">

//           {/* Logo */}
//           <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
//             <Image
//               src="/logo.png"
//               alt="Grasa Logo"
//               width={100}
//               height={16}
//               priority
//               className="object-contain p-2"
//             />
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-4 sm:gap-6">

//             {/* DESKTOP CTA */}
//             <button 
//               onClick={() => handleScrollTo("consultation-form")}
//               className="hidden sm:block border-2 border-black cursor-pointer rounded-full px-5 sm:px-7 py-2 text-xs sm:text-sm font-semibold text-black hover:bg-black hover:text-white transition"
//             >
//               TAKE THE LONGEVITY TEST ™
              
//               {/* BOOK YOUR FREE LONGEVITY TEST ™ */}
//             </button>

//             {/* CART ICON */}
//             <div
//               className="relative cursor-pointer"
//               onClick={() => router.push("/cart")}
//             >
//               <FiShoppingCart className="w-6 h-6 text-black" />

//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-lime-500 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </div>

//             <div className="relative">
//               <FiUser
//                 className="text-black w-10 h-10 flex items-center justify-center cursor-pointer bg-gray-400 rounded-full p-2"
//                 onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//               />

//               {userDropdownOpen && (
//                 <>
//                   <div
//                     className="fixed inset-0 z-10"
//                     onClick={() => setUserDropdownOpen(false)}
//                   ></div>

//                   <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-lg p-2 flex flex-col gap-2 z-50">
//                     {isLoggedIn ? (
//                       <>
//                         <a
//                           href="/profile"
//                           className="w-full font-semibold text-center text-sm border rounded-md py-1.5 hover:bg-gray-100 transition"
//                         >
//                           My Profile
//                         </a>

//                         <a
//                           href="/shop/orders"
//                           className="w-full font-semibold text-center text-sm border rounded-md py-1.5 hover:bg-gray-100 transition"
//                         >
//                           My Orders
//                         </a>

//                         <button
//                           onClick={handleLogout}
//                           className="w-full font-semibold text-center text-sm border rounded-md py-1.5 hover:bg-gray-100 transition"
//                         >
//                           Logout
//                         </button>
//                       </>
//                     ) : (
//                       <a
//                         href="/login"
//                         className="w-full font-semibold text-center text-sm border rounded-md py-1.5 hover:bg-gray-100 transition"
//                       >
//                         Login
//                       </a>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>
              
//             {/* MENU */}
//             <div
//               className="cursor-pointer"
//               onClick={() => setOpen(!open)}
//             >
//               {open ? (
//                 <FiX className="w-6 h-6 text-black" />
//               ) : (
//                 <FiMenu className="w-6 h-6 text-black" />
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* OVERLAY */}
//       {open && (
//         <div
//           className="fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] bg-black/30 z-40"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* SIDEBAR */}
//       <div
//         className={`fixed top-[60px] right-0 h-[calc(100vh-60px)] w-full sm:w-[420px] bg-white shadow-xl z-50 transform transition-transform duration-300 ${
//           open ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="h-full overflow-y-auto p-6 space-y-4">

//           <div 
//             className="bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200"
//             onClick={() => handleScrollTo("regimen-plans")}
//           >
//             My Recommended Plan
//           </div>

//           <a 
//             href="tel:+919870263399" 
//             className="block bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200 text-black"
//           >
//            Call Us Now 📞
//           </a>

//           <a 
//             href="https://wa.me/919870263399" 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className="block bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200 text-black"
//           >
//             Chat on WhatsApp
//           </a>

//           <p className="text-xs font-semibold text-gray-400 uppercase mt-6">
//             More
//           </p>

//           <p 
//             className="cursor-pointer hover:text-lime-600"
//             onClick={() => {
//               setOpen(false);
//               router.push("/products");
//             }}
//           >
//             Products
//           </p>
//           <p 
//             className="cursor-pointer hover:text-lime-600"
//             onClick={() => {
//               setOpen(false);
//               router.push("/blogs");
//             }}
//           >
//             Blog
//           </p>

//           <div
//             className="bg-gray-100 p-4 rounded-xl text-center font-semibold cursor-pointer hover:bg-gray-200 mt-6"
//             onClick={() => {
//               setOpen(false);
//               router.push("/products");
//             }}
//           >
//             All Products
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }








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
              className={`hidden sm:block border-2 border-black cursor-pointer rounded-full px-5 sm:px-7 py-2 text-xs sm:text-sm font-semibold text-black hover:bg-black hover:text-white transition ${!mounted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              {hasStoredResult ? "RETAKE LONGEVITY TEST ™" : "TAKE THE LONGEVITY TEST ™"}
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
      {/* SIDEBAR */}
<div
  className={`fixed top-[60px] right-0 h-[calc(100vh-60px)] w-full sm:w-[420px] bg-white shadow-xl z-50 transform transition-transform duration-300 ${
    open ? "translate-x-0" : "translate-x-full"
  }`}
>
  <div className="h-full overflow-y-auto p-6 space-y-4">

    {/* Recommended Plan */}
    <div 
      className="bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200 flex items-center justify-between group transition-all"
      onClick={() => {
        setOpen(false); // Close sidebar before scrolling
        // Ensure handleScrollTo exists in your component or use router.push("/#regimen-plans")
        router.push("/#regimen-plans"); 
      }}
    >
      <span className="font-medium">My Recommended Plan</span>
      <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
    </div>

    {/* NEW: Vision & Mission */}
    <div 
      className="bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200 flex items-center justify-between group transition-all"
      onClick={() => {
        setOpen(false);
        router.push("/vision-mission");
      }}
    >
      <div className="flex items-center gap-2">
        <span>Our Vision & Mission</span>
      </div>
      <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
    </div>


    <div 
      className="bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200 flex items-center justify-between group transition-all"
      onClick={() => {
        setOpen(false);
        router.push("/Science");
      }}
    >
      <div className="flex items-center gap-2">
        <span>Science</span>
      </div>
      <span className="text-gray-400 group-hover:translate-x-1 font-bold transition-transform">→</span>
    </div>

    {/* Call Us */}
    <a 
      href="tel:+919870263399" 
      className="flex items-center justify-between bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200 text-black group transition-all"
    >
      <span>Call Us Now 📞</span>
      <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
    </a>

    {/* WhatsApp */}
    <a 
      href="https://wa.me/919870263399" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-between bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200 text-black group transition-all"
    >
      <span>Chat on WhatsApp</span>
      <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
    </a>

          <p className="text-xs font-semibold text-gray-400 uppercase mt-6">
            More
          </p>

          <p 
            className="cursor-pointer hover:text-lime-600"
            onClick={() => {
              setOpen(false);
              router.push("/products");
            }}
          >
            Products
          </p>
          <p 
            className="cursor-pointer hover:text-lime-600"
            onClick={() => {
              setOpen(false);
              router.push("/blogs");
            }}
          >
            Blog
          </p>

          <div
            className="bg-gray-100 p-4 rounded-xl text-center font-semibold cursor-pointer hover:bg-gray-200 mt-6"
            onClick={() => {
              setOpen(false);
              router.push("/products");
            }}
          >
            All Products
          </div>
        </div>
      </div>
    </>
  );
}