// "use client";

// import { useEffect, useState } from "react";
// import { PhoneCall } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function FloatingConsultationButton() {
//   const [visible, setVisible] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const handleScroll = () => {
//       setVisible(window.scrollY > 200);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleClick = () => {
//     router.push("/consultations");
//   };

//   return (
//     <div
//       className={`fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-50 transition-all duration-500 ${
//         visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//       }`}
//     >
//       <button
//         onClick={handleClick}
//         className="group flex items-center gap-3 bg-gradient-to-r from-[#E8C96A] to-[#C4972A] text-black font-medium px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
//       >
//         <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 flex items-center justify-center">
//           <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
//         </div>

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // 👉 Always visible on homepage
      if (pathname === "/") {
        setVisible(true);
      } else {
        setVisible(window.scrollY > 150);
      }
    };

    handleScroll(); // 👈 run on load

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleClick = () => {
    router.push("/consultations");
  };

  return (
    <div
      className={`fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[999] transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <button
        onClick={handleClick}
        className="group flex items-center gap-3 
        bg-gradient-to-r from-[#E8C96A] via-[#D4AF37] to-[#C4972A] 
        text-black font-medium 
        px-4 py-3 sm:px-5 sm:py-3.5 
        rounded-full shadow-xl 
        hover:scale-105 hover:shadow-[0_0_20px_rgba(232,201,106,0.35)] 
        active:scale-95 
        transition-all duration-300"
      >
        {/* Icon */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 flex items-center justify-center">
          <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
        </div>

        {/* Text */}
        <span className="text-sm sm:text-base whitespace-nowrap">
          Book Consultation
        </span>
      </button>
    </div>
  );
}