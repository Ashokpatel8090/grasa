// "use client";

// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";

// type Message = {
//   sender: "user" | "bot";
//   text: string;
// };

// export default function ChatbotWidget() {
//   const [open, setOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [messages, setMessages] = useState<Message[]>([
//     { sender: "bot", text: "Hi! Ask me about gut health or GRASA products." },
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
//         }, 2000);
//       }
//     }, 100);

//     return () => clearInterval(typing);
//   }, [msgIndex]);

//   /* ================= AUTO SCROLL ================= */

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   /* ================= SEND MESSAGE ================= */

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage: Message = { sender: "user", text: input };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(
//         "https://grasachat.srv1067874.hstgr.cloud/ask/chat",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ message: userMessage.text }),
//         }
//       );

//       const data = await res.json();

//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: data.reply || "Something went wrong." },
//       ]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Server error. Please try again." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* ================= FLOATING CHAT BUBBLE ================= */}

//       <div className="fixed bottom-6 right-6 z-[9999] flex items-center">

//         {/* Text Bubble */}

//         <div
//           onClick={() => setOpen(!open)}
//           className="bg-white border-2 border-gray-300 text-gray-800
//           w-[260px] h-[48px] flex items-center
//           px-2 rounded-full shadow-lg cursor-text
//           hover:shadow-xl transition-all duration-300 mr-[-25px]"
//         >
//           <span className="text-sm p-2 font-medium whitespace-nowrap overflow-hidden">
//             {displayText}
//             {/* <span className="animate-pulse ml-1">|</span> */}
//           </span>
//         </div>

//         {/* Round Logo */}

//         <button
//           onClick={() => setOpen(!open)}
//           className="w-16 h-16 rounded-full border-2 border-gray-300 
//           bg-gray-200 cursor-pointer flex items-center justify-center shadow-lg hover:scale-105 transition"
//         >
//           <Image src="/logo.png" alt="Chat" width={34} height={34} />
//         </button>
//       </div>

//       {/* ================= CHAT WINDOW ================= */}

//       {open && (
//         <div
//           className="fixed bottom-22 right-6 z-[9999] 
//           w-[92vw] sm:w-[360px] 
//           h-[80%] max-h-[80%]
//           bg-white rounded-2xl shadow-2xl border 
//           flex flex-col overflow-hidden"
//         >
//           {/* ================= HEADER ================= */}

//           <div className="bg-[#1e770a] text-white px-4 py-3 flex justify-between items-center">

//             <div className="flex items-center gap-2">
//               <Image
//                 src="/logo.png"
//                 alt="logo"
//                 width={32}
//                 height={32}
//                 className="bg-white rounded-full p-1"
//               />
//               <span className="font-semibold">GRASA Support</span>
//             </div>

//             <button
//               onClick={() => setOpen(false)}
//               className="w-8 h-8 flex items-center justify-center font-bold bg-gray-300 rounded-full hover:bg-gray-400 transition"
//             >
//               ✕
//             </button>

//           </div>

//           {/* ================= MESSAGES ================= */}

//           <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">

//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`flex ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >

//                 <div
//                   className={`px-4 py-2 rounded-xl text-sm max-w-[85%] ${
//                     msg.sender === "user"
//                       ? "bg-gray-700 text-white"
//                       : "bg-white border"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>

//               </div>
//             ))}

//             {loading && (
//               <div className="text-xs text-gray-500">🌱 Thinking...</div>
//             )}

//             <div ref={messagesEndRef} />

//           </div>

//           {/* ================= INPUT ================= */}

//           <div className="border-t p-3 flex gap-2 bg-white">

//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Ask something..."
//               className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e770a]/30"
//             />

//             <button
//               onClick={sendMessage}
//               disabled={loading}
//               className="bg-[#1e770a] text-white px-4 rounded-lg text-sm disabled:opacity-50"
//             >
//               Send
//             </button>

//           </div>
//         </div>
//       )}
//     </>
//   );
// }








// "use client";

// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import { Send, X, MessageCircle, Sparkles } from "lucide-react";

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

//   /* ================= AUTO SCROLL ================= */

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   /* ================= SEND MESSAGE ================= */

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage: Message = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(
//         "https://grasachat.srv1067874.hstgr.cloud/ask/chat",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ message: userMessage.text }),
//         }
//       );
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
//       {/* ================= FLOATING TRIGGER ================= */}
//       <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
        
    

//         {/* Unified Pill Trigger */}
// {!open && (
//   <button
//     onClick={() => setOpen(true)}
//     className="group flex flex-row-reverse items-center bg-white/90 backdrop-blur-md border border-gray-200 p-1.5 pl-6 rounded-full shadow-2xl hover:shadow-green-100 transition-all duration-500 ease-out hover:scale-105 active:scale-95"
//   >
//     {/* Image now on the right */}
//     <div className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-inner ml-3">
//   <Image 
//     src="/logo.png" 
//     alt="GRASA" 
//     width={32} 
//     height={32} 
//     className="object-contain" 
//   />
// </div>

//     {/* Text now on the left */}
//     <div className="flex flex-col items-end">
//       <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Live Chat</span>
//       <span className="text-sm font-semibold text-gray-700">{displayText}</span>
//     </div>
//   </button>
// )}

//         {/* ================= CHAT WINDOW ================= */}
//         {open && (
//           <div
//             className="w-[90vw] sm:w-[400px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
//           >
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
//               <button
//                 onClick={() => setOpen(false)}
//                 className="hover:bg-white/10 p-2 rounded-full transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#fcfdfc]">
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`max-w-[80%] px-4 py-3 text-sm shadow-sm ${
//                       msg.sender === "user"
//                         ? "bg-[#1e770a] text-white rounded-2xl rounded-tr-none"
//                         : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none"
//                     }`}
//                   >
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
//               <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
//                 Powered by GRASA Health AI
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }






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
//       <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
        
//         {/* ================= PILL TRIGGER (UI FIXED) ================= */}
//         {!open && (
//           <button
//             onClick={() => setOpen(true)}
//             className="group relative flex items-center bg-white/95 backdrop-blur-sm border border-gray-200 h-12 pl-6 pr-2 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
//           >
//             {/* Typing Text Container */}
//             <div className="flex flex-col items-start mr-10">
//               <span className="text-[10px] leading-none uppercase tracking-tighter text-gray-400 font-bold mb-0.5">Live Chat</span>
//               <span className="text-[13px] font-medium text-gray-700 whitespace-nowrap overflow-hidden">
//                 {displayText}
//               </span>
//             </div>

//             {/* Large Icon Container - Partially Overlapping as per SS1 */}
//             <div className="absolute -right-1 flex items-center justify-center w-14 h-14 bg-white rounded-full border border-gray-100 shadow-lg group-hover:bg-green-50 transition-colors">
//               <div className="relative w-10 h-10">
//                 <Image 
//                   src="/logo.png" 
//                   alt="GRASA" 
//                   fill
//                   className="object-contain p-1" 
//                 />
//               </div>
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
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
        
        {/* ================= PILL TRIGGER (INTEGRATED UI) ================= */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="group relative flex items-center transition-all duration-300 hover:scale-105 active:scale-95 outline-none"
          >
            {/* The Pill / Text Container (Tucked behind the icon) */}
            <div className="flex flex-col justify-center bg-white border border-gray-100 h-16 pl-8 pr-16 rounded-full shadow-2xl -mr-12 transition-all group-hover:shadow-green-900/10 group-hover:border-green-100">
                <span className="text-[10px] leading-none uppercase tracking-widest text-gray-400 font-bold mb-1 block">
                  Live Chat
                </span>
                <div className="flex items-center min-w-[200px]">
                  <span className="text-[15px] font-semibold text-gray-700 whitespace-nowrap">
                    {displayText}
                  </span>
                  {/* Blinking Cursor for 'Typing' Feel */}
                  {/* <span className="ml-1 w-1 h-4 bg-green-500 rounded-full animate-pulse" /> */}
                </div>
            </div>

            {/* Large Overlapping Icon Container */}
            <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-white rounded-full border-2 border-white shadow-2xl transition-transform duration-300 group-hover:rotate-6">
              <div className="relative w-18 h-18">
                <Image 
                  src="/logo.png" 
                  alt="GRASA" 
                  fill
                  priority
                  className="object-contain p-1" 
                />
              </div>
              {/* Green Online Indicator dot on the icon */}
              {/* <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" /> */}
            </div>
          </button>
        )}

        {/* ================= CHAT WINDOW ================= */}
        {open && (
          <div className="w-[90vw] sm:w-[400px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1a6609] to-[#258a0d] p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Image src="/logo.png" alt="logo" width={24} height={24} className="brightness-0 invert" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">GRASA AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-100 font-medium">Always Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#fcfdfc]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-3 text-sm shadow-sm ${
                      msg.sender === "user" ? "bg-[#1e770a] text-white rounded-2xl rounded-tr-none" : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-[#1e770a]">
                  <Sparkles size={14} className="animate-spin" />
                  <span className="text-xs font-semibold italic">Assistant is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-1.5 focus-within:border-[#1e770a] focus-within:ring-2 focus-within:ring-green-50 transition-all">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-[#1e770a] hover:bg-[#1a6609] text-white p-2.5 rounded-xl transition-all disabled:opacity-30 disabled:grayscale"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">Powered by GRASA Health AI</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}