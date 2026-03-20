
// "use client";

// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import { Send, X, Sparkles } from "lucide-react";

// type Message = {
//   sender: "user" | "bot";
//   text: string;
// };

// export default function ChatbotWidget() {
//   const [open, setOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [messages, setMessages] = useState<Message[]>([
//     { sender: "bot", text: "Hi! I'm your GRASA assistant. How can I help you improve your gut health today?" },
//   ]);

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   /* ================= ROTATING TYPING MESSAGES ================= */
//   const rotatingMessages = [
//     "Ask about gut health benefits...",
//     "Explore GRASA millet products...",
//     "Learn healthy daily nutrition tips...",
//   ];

//   const [displayText, setDisplayText] = useState("");
//   const [msgIndex, setMsgIndex] = useState(0);

//   useEffect(() => {
//     let charIndex = 0;
//     const currentMsg = rotatingMessages[msgIndex];
//     setDisplayText("");

//     const typing = setInterval(() => {
//       charIndex++;
//       setDisplayText(currentMsg.slice(0, charIndex));
//       if (charIndex === currentMsg.length) {
//         clearInterval(typing);
//         setTimeout(() => {
//           setMsgIndex((prev) => (prev + 1) % rotatingMessages.length);
//         }, 3000);
//       }
//     }, 50);

//     return () => clearInterval(typing);
//   }, [msgIndex]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;
//     const userMessage: Message = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch("https://grasachat.srv1067874.hstgr.cloud/ask/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userMessage.text }),
//       });
//       const data = await res.json();
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: data.reply || "I'm having trouble connecting. Try again?" },
//       ]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Server is currently offline. Please try again later." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
        
//         {/* ================= PILL TRIGGER (INTEGRATED UI) ================= */}
//         {!open && (
//           <button
//             onClick={() => setOpen(true)}
//             className="group relative flex items-center transition-all duration-300 hover:scale-105 active:scale-95 outline-none"
//           >
//             {/* The Pill / Text Container (Tucked behind the icon) */}
//             <div className="flex flex-col justify-center bg-white border border-gray-100 h-16 pl-8 pr-16 rounded-full shadow-2xl -mr-12 transition-all group-hover:shadow-green-900/10 group-hover:border-green-100">
//                 <span className="text-[10px] leading-none uppercase tracking-widest text-gray-400 font-bold mb-1 block">
//                   Live Chat
//                 </span>
//                 <div className="flex items-center min-w-[200px]">
//                   <span className="text-[15px] font-semibold text-gray-700 whitespace-nowrap">
//                     {displayText}
//                   </span>
//                   {/* Blinking Cursor for 'Typing' Feel */}
//                   {/* <span className="ml-1 w-1 h-4 bg-green-500 rounded-full animate-pulse" /> */}
//                 </div>
//             </div>

//             {/* Large Overlapping Icon Container */}
//             <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-white rounded-full border-2 border-white shadow-2xl transition-transform duration-300 group-hover:rotate-6">
//               <div className="relative w-18 h-18">
//                 <Image 
//                   src="/logo.png" 
//                   alt="GRASA" 
//                   fill
//                   priority
//                   className="object-contain p-1" 
//                 />
//               </div>
//               {/* Green Online Indicator dot on the icon */}
//               {/* <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" /> */}
//             </div>
//           </button>
//         )}

//         {/* ================= CHAT WINDOW ================= */}
//         {open && (
//           <div className="w-[90vw] sm:w-[400px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-[#1a6609] to-[#258a0d] p-5 flex justify-between items-center text-white">
//               <div className="flex items-center gap-3">
//                 <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
//                   <Image src="/logo.png" alt="logo" width={24} height={24} className="brightness-0 invert" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg leading-tight">GRASA AI</h3>
//                   <div className="flex items-center gap-1.5">
//                     <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//                     <span className="text-xs text-green-100 font-medium">Always Online</span>
//                   </div>
//                 </div>
//               </div>
//               <button onClick={() => setOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#fcfdfc]">
//               {messages.map((msg, i) => (
//                 <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//                   <div className={`max-w-[80%] px-4 py-3 text-sm shadow-sm ${
//                       msg.sender === "user" ? "bg-[#1e770a] text-white rounded-2xl rounded-tr-none" : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none"
//                     }`}>
//                     {msg.text}
//                   </div>
//                 </div>
//               ))}
//               {loading && (
//                 <div className="flex items-center gap-2 text-[#1e770a]">
//                   <Sparkles size={14} className="animate-spin" />
//                   <span className="text-xs font-semibold italic">Assistant is typing...</span>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Area */}
//             <div className="p-4 bg-white border-t border-gray-100">
//               <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-1.5 focus-within:border-[#1e770a] focus-within:ring-2 focus-within:ring-green-50 transition-all">
//                 <input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   placeholder="Type your message..."
//                   className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-gray-700 placeholder:text-gray-400"
//                 />
//                 <button
//                   onClick={sendMessage}
//                   disabled={loading || !input.trim()}
//                   className="bg-[#1e770a] hover:bg-[#1a6609] text-white p-2.5 rounded-xl transition-all disabled:opacity-30 disabled:grayscale"
//                 >
//                   <Send size={18} />
//                 </button>
//               </div>
//               <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">Powered by GRASA Health AI</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }





"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, X, Sparkles } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi! I'm your GRASA assistant. How can I help you improve your gut health today?" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ================= ROTATING TYPING MESSAGES ================= */
  const rotatingMessages = [
    "Ask about gut health benefits...",
    "Explore GRASA millet products...",
    "Learn healthy daily nutrition tips...",
  ];

  const [displayText, setDisplayText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    let charIndex = 0;
    const currentMsg = rotatingMessages[msgIndex];
    setDisplayText("");

    const typing = setInterval(() => {
      charIndex++;
      setDisplayText(currentMsg.slice(0, charIndex));
      if (charIndex === currentMsg.length) {
        clearInterval(typing);
        setTimeout(() => {
          setMsgIndex((prev) => (prev + 1) % rotatingMessages.length);
        }, 3000);
      }
    }, 50);

    return () => clearInterval(typing);
  }, [msgIndex]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://grasachat.srv1067874.hstgr.cloud/ask/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "I'm having trouble connecting. Try again?" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server is currently offline. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= GLOW RING KEYFRAMES (inline style tag) ================= */}
      <style>{`
        @keyframes grasa-ripple {
          0%   { transform: scale(1); opacity: 0.65; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .grasa-ring-1 {
          animation: grasa-ripple 2.5s ease-out infinite;
        }
        .grasa-ring-2 {
          animation: grasa-ripple 2.5s ease-out infinite;
          animation-delay: 1.1s;
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">

        {/* ================= PILL TRIGGER (RESPONSIVE) ================= */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="group relative flex items-center transition-all duration-300 hover:scale-105 active:scale-95 outline-none"
          >
            {/* THE PILL:
                - hidden: Hidden on Mobile & Tablet
                - lg:flex: Visible only on Desktop (min-width: 1024px)
            */}
            <div className="hidden lg:flex flex-col justify-center bg-[#f4f4f2] border border-[#d6d1c4] h-16 pl-8 pr-16 rounded-full shadow-lg -mr-12 transition-all">
              <span className="text-[10px] leading-none uppercase tracking-wider text-[#5c5c5c] font-bold mb-1 block">
                Live Chat
              </span>
              <div className="flex items-center min-w-[200px]">
                <span className="text-[15px] font-bold text-[#1b1b1b] whitespace-nowrap">
                  {displayText}
                </span>
              </div>
            </div>

            {/* THE ICON WRAPPER — relative so rings are positioned inside it */}
            <div className="relative z-10 flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20">

              {/* ── GLOW RING 1 ── */}
              <span
                className="grasa-ring-1 pointer-events-none absolute inset-0 rounded-full border-2 border-[#C5D82D]"
              />

              {/* ── GLOW RING 2 (delayed) ── */}
              <span
                className="grasa-ring-2 pointer-events-none absolute inset-0 rounded-full border-2 border-[#C5D82D]"
              />

              {/* ── ORIGINAL ICON CIRCLE ── */}
              <div className="relative w-full h-full bg-[#f4f4f2] rounded-full border border-[#d6d1c4] shadow-xl transition-transform duration-300 group-hover:rotate-6 flex items-center justify-center">
                <div className="relative w-12 h-12 lg:w-16 lg:h-16">
                  <Image
                    src="/logo.png"
                    alt="GRASA"
                    fill
                    priority
                    className="object-contain p-1"
                  />
                </div>
              </div>

            </div>
          </button>
        )}

        {/* ================= CHAT WINDOW ================= */}
        {open && (
          <div className="w-[90vw] sm:w-[400px] h-[600px] max-h-[85vh] bg-[#f4f4f2] rounded-3xl shadow-2xl border border-[#d6d1c4] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-[#1b1b1b] p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-xl backdrop-blur-sm">
                  <Image src="/logo.png" alt="logo" width={30} height={30}  />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight text-white">GRASA AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#C5D82D] rounded-full animate-pulse" />
                    <span className="text-xs text-[#C5D82D] font-bold tracking-wide uppercase">Always Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="hover:bg-white/8 bg-white/10 p-2 rounded-full transition-colors text-[#C5D82D]">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#ebecdf]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-3 text-[15px] shadow-sm font-medium ${
                      msg.sender === "user"
                        ? "bg-[#1b1b1b] text-white rounded-2xl rounded-tr-none"
                        : "bg-white border border-[#d6d1c4] text-[#1b1b1b] rounded-2xl rounded-tl-none"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-[#1b1b1b]">
                  <Sparkles size={14} className="animate-spin text-[#606c04]" />
                  <span className="text-xs font-bold text-[#5c5c5c] uppercase tracking-wider">Assistant is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#f4f4f2] border-t border-[#d6d1c4]">
              <div className="flex items-center gap-2 bg-white border border-[#d6d1c4] rounded-2xl p-1.5 focus-within:border-[#1b1b1b] focus-within:ring-1 focus-within:ring-[#1b1b1b] transition-all">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-3 py-2 text-[15px] outline-none text-[#1b1b1b] placeholder:text-[#5c5c5c] font-medium"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-[#C5D82D] hover:opacity-90 text-[#1b1b1b] p-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  <Send size={18} className="fill-current" />
                </button>
              </div>
              <p className="text-[10px] text-center text-[#5c5c5c] mt-3 font-bold uppercase tracking-wider">Powered by GRASA Health AI</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}