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
  const [hasStoredResult, setHasStoredResult] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { cart } = useCart();
  const cartCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);

  useEffect(() => {
    setMounted(true);

    const checkAuth = () => {
      const cookies = document.cookie.split("; ");
      const token = cookies.find((row) => row.startsWith("token="));
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("focus", checkAuth);

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
    document.cookie = "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    setUserDropdownOpen(false);
    router.push("/login");
  };

  return (
    <>
      <header className="w-full bg-white fixed top-0 left-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between w-[90%] md:w-[95%] mx-auto px-4 sm:px-6 lg:px-8 h-[72px]">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
            <Image
              src="/logo.png"
              alt="Grasa Logo"
              width={100}
              height={16}
              priority
              className="object-contain h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/products" className="text-sm font-medium text-gray-700 hover:text-accent transition-colors">Products</a>
            <a href="/blogs" className="text-sm font-medium text-gray-700 hover:text-accent transition-colors">Blog</a>
            <a href="/science" className="text-sm font-medium text-gray-700 hover:text-accent transition-colors">Science</a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Desktop CTA Button */}
            <button 
              onClick={() => router.push("/longevity-test")}
              className={`hidden sm:block bg-accent text-foreground font-semibold px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 ${!mounted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              {hasStoredResult ? "RETAKE TEST ™" : "START TEST ™"}
            </button>

            {/* Cart Icon */}
            <button
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => router.push("/cart")}
              aria-label="Shopping cart"
            >
              <FiShoppingCart className="w-6 h-6 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account */}
            <div className="relative">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User account"
              >
                <FiUser className="w-6 h-6 text-foreground" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg border border-gray-200 shadow-xl p-3 flex flex-col gap-2 z-50">
                    {isLoggedIn ? (
                      <>
                        <a
                          href="/profile"
                          className="w-full text-center text-sm font-medium text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          My Profile
                        </a>
                        <a
                          href="/shop/orders"
                          className="w-full text-center text-sm font-medium text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          My Orders
                        </a>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-center text-sm font-medium text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <a
                        href="/login"
                        className="w-full text-center text-sm font-medium text-accent py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Login
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? (
                <FiX className="w-6 h-6 text-foreground" />
              ) : (
                <FiMenu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {open && (
        <div
          className="fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-[72px] right-0 h-[calc(100vh-72px)] w-full sm:w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto p-6 space-y-4">
          {/* CTA Button for Mobile */}
          <button 
            onClick={() => {
              setOpen(false);
              router.push("/longevity-test");
            }}
            className="w-full bg-accent text-foreground font-semibold py-3 rounded-lg text-sm hover:shadow-lg transition-all mb-4"
          >
            {hasStoredResult ? "RETAKE TEST ™" : "START TEST ™"}
          </button>

          {/* Navigation Links */}
          <a 
            href="/products"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Products
          </a>

          <a 
            href="/blogs"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Blog
          </a>

          <a 
            href="/science"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Science
          </a>

          <a 
            href="/vision-mission"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Vision & Mission
          </a>

          <hr className="my-4 border-gray-200" />

          {/* Contact Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</h3>
            
            <a 
              href="tel:+919870263399" 
              className="flex items-center gap-3 text-sm text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>📞</span>
              <span>Call Us Now</span>
            </a>

            <a 
              href="https://wa.me/919870263399" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
