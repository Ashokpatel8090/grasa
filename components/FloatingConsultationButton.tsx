

// "use client";

// import { useEffect, useState } from "react";
// import { PhoneCall } from "lucide-react";
// import { useRouter, usePathname } from "next/navigation";

// export default function FloatingConsultationButton() {
//   const [visible, setVisible] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const handleScroll = () => {
//       // 👉 Always visible on homepage
//       if (pathname === "/") {
//         setVisible(true);
//       } else {
//         setVisible(window.scrollY > 150);
//       }
//     };

//     handleScroll(); // 👈 run on load

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [pathname]);

//   const handleClick = () => {
//     router.push("/consultations");
//   };

//   return (
//     <div
//       className={`fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[999] transition-all duration-500 ${
//         visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//       }`}
//     >
//       <button
//   onClick={handleClick}
//   className="group flex items-center gap-3 
//   bg-white/80 backdrop-blur-md 
//   text-[#1b1b1b] font-medium 
//   px-2 py-3 sm:px-5 sm:py-3.5 
//   rounded-full shadow-lg 
//   border border-[#C5D82D]/40
//   hover:bg-[#C5D82D]/20 hover:scale-105 
//   active:scale-95 
//   transition-all duration-300"
// >
//   {/* Icon */}
//   <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full 
//     bg-gradient-to-r from-[#C5D82D] to-[#8ca21f] 
//     flex items-center justify-center 
//     shadow-sm group-hover:scale-110 transition-transform duration-300">
    
//     <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-[#1b1b1b]" />
//   </div>

//   <span className="text-sm sm:text-base whitespace-nowrap">
//     Book Consultation
//   </span>
// </button>
//     </div>
//   );
// }











// "use client";

// import { useEffect, useState } from "react";
// import { PhoneCall } from "lucide-react";
// import { useRouter, usePathname } from "next/navigation";

// export default function FloatingConsultationButton() {
//   const [visible, setVisible] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const handleScroll = () => {
//       // 👉 Always visible on homepage
//       if (pathname === "/") {
//         setVisible(true);
//       } else {
//         setVisible(window.scrollY > 150);
//       }
//     };

//     handleScroll(); // 👈 run on load

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [pathname]);

//   const handleClick = () => {
//     router.push("/consultations");
//   };

//   return (
//     <div
//       className={`fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[999] transition-all duration-500 ${
//         visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//       }`}
//     >
//       <button
//         onClick={handleClick}
//         className="group flex items-center gap-3 
//         bg-gradient-to-r from-[#E8C96A] via-[#D4AF37] to-[#C4972A] 
//         text-black font-medium 
//         px-4 py-3 sm:px-5 sm:py-3.5 
//         rounded-full shadow-xl 
//         hover:scale-105 hover:shadow-[0_0_20px_rgba(232,201,106,0.35)] 
//         active:scale-95 
//         transition-all duration-300"
//       >
//         {/* Icon */}
//         <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 flex items-center justify-center">
//           <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
//         </div>

//         {/* Text */}
//         <span className="text-sm sm:text-base whitespace-nowrap">
//           Book Consultation
//         </span>
//       </button>
//     </div>
//   );
// }








"use client";

import { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function FloatingConsultationButton() {
  const [visible, setVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Scroll visibility logic
  useEffect(() => {
    const handleScroll = () => {
      // 👉 Always visible on homepage
      if (pathname === "/") {
        setVisible(true);
      } else {
        setVisible(window.scrollY > 150);
      }
    };

    handleScroll(); // run on load

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Expansion cycle logic (Expand for 5s, collapse for 10s -> 15s total cycle)
  useEffect(() => {
    let timeoutId;

    const runCycle = () => {
      setIsExpanded(true); // Open button
      
      // Close button after 5 seconds
      timeoutId = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
    };

    runCycle(); // Run immediately on mount
    const intervalId = setInterval(runCycle, 15000); // Repeat every 15 seconds

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  const handleClick = () => {
    router.push("/consultations");
  };

  // Show text if it's currently in the expanded timer phase OR if the user is hovering over it
  const showText = isExpanded || isHovered;

  return (
    <div
      className={`fixed bottom-5 sm:bottom-6 z-[999] transition-all duration-500 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      } ${
        showText 
          ? "-left-2 sm:-left-4 translate-x-0" 
          : "left-0 -translate-x-[12%]" // 👈 Sticks to the left edge and pulls exactly 50% off-screen
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleClick}
        className={`group flex items-center bg-gradient-to-r from-[#E8C96A] via-[#D4AF37] to-[#C4972A] text-black font-medium rounded-r-full rounded-l-none shadow-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(232,201,106,0.35)] active:scale-95 transition-all duration-500 ease-in-out overflow-hidden ${
          showText
            ? "px-4 py-3 sm:px-5 sm:py-3.5 gap-3"
            : "p-3 sm:p-3.5 gap-0" 
        }`}
      >
        {/* Icon (Always Visible) */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0">
          <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
        </div>

        {/* Text (Expands and Collapses) */}
        <div
          className={`transition-all duration-500 ease-in-out flex items-center overflow-hidden ${
            showText ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          <span className="text-sm sm:text-base whitespace-nowrap pr-1">
            Book Consultation
          </span>
        </div>
      </button>
    </div>
  );
}