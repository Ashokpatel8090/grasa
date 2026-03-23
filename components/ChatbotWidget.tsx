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
//       {/* ================= GLOW RING KEYFRAMES (inline style tag) ================= */}
//       <style>{`
//         @keyframes grasa-ripple {
//           0%   { transform: scale(1); opacity: 0.65; }
//           100% { transform: scale(2.5); opacity: 0; }
//         }
//         .grasa-ring-1 {
//           animation: grasa-ripple 2.5s ease-out infinite;
//         }
//         .grasa-ring-2 {
//           animation: grasa-ripple 2.5s ease-out infinite;
//           animation-delay: 1.1s;
//         }
//       `}</style>

//       <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">

//         {/* ================= PILL TRIGGER (RESPONSIVE) ================= */}
//         {!open && (
//           <button
//             onClick={() => setOpen(true)}
//             className="group relative flex items-center transition-all duration-300 hover:scale-105 active:scale-95 outline-none"
//           >
//             {/* THE PILL:
//                 - hidden: Hidden on Mobile & Tablet
//                 - lg:flex: Visible only on Desktop (min-width: 1024px)
//             */}
//             <div className="hidden lg:flex flex-col justify-center bg-[#f4f4f2] border border-[#d6d1c4] h-16 pl-8 pr-16 rounded-full shadow-lg -mr-12 transition-all">
//               <span className="text-[10px] leading-none uppercase tracking-wider text-[#5c5c5c] font-bold mb-1 block">
//                 Live Chat
//               </span>
//               <div className="flex items-center min-w-[200px]">
//                 <span className="text-[15px] font-bold text-[#1b1b1b] whitespace-nowrap">
//                   {displayText}
//                 </span>
//               </div>
//             </div>

//             {/* THE ICON WRAPPER — relative so rings are positioned inside it */}
//             <div className="relative z-10 flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20">

//               {/* ── GLOW RING 1 ── */}
//               <span
//                 className="grasa-ring-1 pointer-events-none absolute inset-0 rounded-full border-2 border-[#C5D82D]"
//               />

//               {/* ── GLOW RING 2 (delayed) ── */}
//               <span
//                 className="grasa-ring-2 pointer-events-none absolute inset-0 rounded-full border-2 border-[#C5D82D]"
//               />

//               {/* ── ORIGINAL ICON CIRCLE ── */}
//               <div className="relative w-full h-full bg-[#f4f4f2] rounded-full border border-[#d6d1c4] shadow-xl transition-transform duration-300 group-hover:rotate-6 flex items-center justify-center">
//                 <div className="relative w-12 h-12 lg:w-16 lg:h-16">
//                   <Image
//                     src="/logo.png"
//                     alt="GRASA"
//                     fill
//                     priority
//                     className="object-contain p-1"
//                   />
//                 </div>
//               </div>

//             </div>
//           </button>
//         )}

//         {/* ================= CHAT WINDOW ================= */}
//         {open && (
//           <div className="w-[90vw] sm:w-[400px] h-[600px] max-h-[85vh] bg-[#f4f4f2] rounded-3xl shadow-2xl border border-[#d6d1c4] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
//             {/* Header */}
//             <div className="bg-[#1b1b1b] p-5 flex justify-between items-center text-white">
//               <div className="flex items-center gap-3">
//                 <div className="bg-white p-1 rounded-xl backdrop-blur-sm">
//                   <Image src="/logo.png" alt="logo" width={30} height={30}  />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg leading-tight text-white">GRASA AI</h3>
//                   <div className="flex items-center gap-1.5">
//                     <span className="w-2 h-2 bg-[#C5D82D] rounded-full animate-pulse" />
//                     <span className="text-xs text-[#C5D82D] font-bold tracking-wide uppercase">Always Online</span>
//                   </div>
//                 </div>
//               </div>
//               <button onClick={() => setOpen(false)} className="hover:bg-white/8 bg-white/10 p-2 rounded-full transition-colors text-[#C5D82D]">
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#ebecdf]">
//               {messages.map((msg, i) => (
//                 <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//                   <div className={`max-w-[80%] px-4 py-3 text-[15px] shadow-sm font-medium ${
//                       msg.sender === "user"
//                         ? "bg-[#1b1b1b] text-white rounded-2xl rounded-tr-none"
//                         : "bg-white border border-[#d6d1c4] text-[#1b1b1b] rounded-2xl rounded-tl-none"
//                     }`}>
//                     {msg.text}
//                   </div>
//                 </div>
//               ))}
//               {loading && (
//                 <div className="flex items-center gap-2 text-[#1b1b1b]">
//                   <Sparkles size={14} className="animate-spin text-[#606c04]" />
//                   <span className="text-xs font-bold text-[#5c5c5c] uppercase tracking-wider">Assistant is typing...</span>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Area */}
//             <div className="p-4 bg-[#f4f4f2] border-t border-[#d6d1c4]">
//               <div className="flex items-center gap-2 bg-white border border-[#d6d1c4] rounded-2xl p-1.5 focus-within:border-[#1b1b1b] focus-within:ring-1 focus-within:ring-[#1b1b1b] transition-all">
//                 <input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   placeholder="Type your message..."
//                   className="flex-1 bg-transparent px-3 py-2 text-[15px] outline-none text-[#1b1b1b] placeholder:text-[#5c5c5c] font-medium"
//                 />
//                 <button
//                   onClick={sendMessage}
//                   disabled={loading || !input.trim()}
//                   className="bg-[#C5D82D] hover:opacity-90 text-[#1b1b1b] p-2.5 rounded-xl transition-all disabled:opacity-50"
//                 >
//                   <Send size={18} className="fill-current" />
//                 </button>
//               </div>
//               <p className="text-[10px] text-center text-[#5c5c5c] mt-3 font-bold uppercase tracking-wider">Powered by GRASA Health AI</p>
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
// import { Send, X, Sparkles, Mic, Volume2, VolumeOff } from "lucide-react";

// type Message = {
//   sender: "user" | "bot";
//   text: string;
// };

// export default function ChatbotWidget() {
//   const [open, setOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
  
//   // Track which message index is currently being spoken
//   const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

//   const [messages, setMessages] = useState<Message[]>([
//     { sender: "bot", text: "Hi! I'm your GRASA assistant. How can I help you improve your gut health today?" },
//   ]);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const recognitionRef = useRef<any>(null);

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

//   /* ================= PRELOAD VOICES ================= */
//   // Browsers load voices asynchronously, so we force a fetch on mount
//   useEffect(() => {
//     const loadVoices = () => {
//       if (typeof window !== "undefined" && window.speechSynthesis) {
//         window.speechSynthesis.getVoices();
//       }
//     };
//     loadVoices();
//     if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
//       window.speechSynthesis.onvoiceschanged = loadVoices;
//     }
//   }, []);

//   /* ================= TEXT TO SPEECH LOGIC ================= */
//   const toggleSpeech = (text: string, index: number) => {
//     if (typeof window === "undefined" || !window.speechSynthesis) {
//       alert("Your browser does not support text-to-speech.");
//       return;
//     }

//     // If clicking the currently speaking message, stop it
//     if (speakingIndex === index) {
//       window.speechSynthesis.cancel();
//       setSpeakingIndex(null);
//       return;
//     }

//     // Cancel any other ongoing speech
//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
    
//     // Attempt to find an Indian English voice for better clarity in your context
//     const voices = window.speechSynthesis.getVoices();
//     const indianVoice = voices.find(v => v.lang === 'en-IN' || v.lang.includes('IN'));
    
//     if (indianVoice) {
//       utterance.voice = indianVoice;
//     }

//     // Adjust rate and pitch slightly if needed to make it sound more natural
//     utterance.rate = 0.95; 
//     utterance.pitch = 1.0;

//     // Clear the speaking state when the audio finishes or is interrupted
//     utterance.onend = () => setSpeakingIndex(null);
//     utterance.onerror = () => setSpeakingIndex(null);

//     setSpeakingIndex(index);
//     window.speechSynthesis.speak(utterance);
//   };

//   /* ================= SPEECH TO TEXT LOGIC ================= */
//   const toggleListening = () => {
//     if (isListening) {
//       recognitionRef.current?.stop();
//       setIsListening(false);
//       return;
//     }

//     // @ts-expect-error - SpeechRecognition is not fully typed in standard TS lib
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
//     if (!SpeechRecognition) {
//       alert("Your browser does not support speech recognition. Please try Chrome or Safari.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;
//     recognition.continuous = false;
//     recognition.interimResults = true;

//     recognition.onstart = () => {
//       setIsListening(true);
//     };

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     recognition.onresult = (event: any) => {
//       const transcript = Array.from(event.results)
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         .map((result: any) => result[0])
//         .map((result) => result.transcript)
//         .join("");
      
//       setInput(transcript);
//     };

//     recognition.onerror = (event: { error: string }) => {
//       console.error("Speech recognition error:", event.error);
//       setIsListening(false);
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//     };

//     recognition.start();
//   };

//   /* ================= SEND MESSAGE LOGIC ================= */
//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;
    
//     // Stop listening if user sends message manually while it's active
//     if (isListening) {
//       recognitionRef.current?.stop();
//       setIsListening(false);
//     }

//     const userMessage: Message = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       // const res = await fetch("https://grasachat.srv1067874.hstgr.cloud/ask/chat", {
//         const res = await fetch("http://localhost:5000/ask/chat", {

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
//       {/* ================= GLOW RING KEYFRAMES ================= */}
//       <style>{`
//         @keyframes grasa-ripple {
//           0%   { transform: scale(1); opacity: 0.65; }
//           100% { transform: scale(2.5); opacity: 0; }
//         }
//         .grasa-ring-1 {
//           animation: grasa-ripple 2.5s ease-out infinite;
//         }
//         .grasa-ring-2 {
//           animation: grasa-ripple 2.5s ease-out infinite;
//           animation-delay: 1.1s;
//         }
//       `}</style>

//       <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">

//         {/* ================= PILL TRIGGER (RESPONSIVE) ================= */}
//         {!open && (
//           <button
//             onClick={() => setOpen(true)}
//             className="group relative flex items-center transition-all duration-300 hover:scale-104 active:scale-95 outline-none"
//           >
//             <div className="hidden lg:flex flex-col justify-center bg-[#f4f4f2] border border-[#d6d1c4] h-16 pl-8 pr-16 rounded-full shadow-lg -mr-12 transition-all">
//               <span className="text-[10px] leading-none uppercase tracking-wider text-[#5c5c5c] font-bold mb-1 block">
//                 Live Chat
//               </span>
//               <div className="flex items-center min-w-[200px]">
//                 <span className="text-[15px] font-bold text-[#1b1b1b] whitespace-nowrap">
//                   {displayText}
//                 </span>
//               </div>
//             </div>

//             <div className="relative z-10 flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20">
//               <span className="grasa-ring-1 pointer-events-none absolute inset-0 rounded-full border-2 border-[#C5D82D]" />
//               <span className="grasa-ring-2 pointer-events-none absolute inset-0 rounded-full border-2 border-[#C5D82D]" />

//               <div className="relative w-full h-full bg-[#f4f4f2] rounded-full border border-[#d6d1c4] shadow-xl transition-transform duration-300  flex items-center justify-center">
//                 <div className="relative w-20 h-20 ">
//                   <Image
//                     src="/logo.png"
//                     alt="GRASA"
//                     fill
//                     priority
//                     className="object-contain p-1"
//                   />
//                 </div>
//               </div>
//             </div>
//           </button>
//         )}

//         {/* ================= CHAT WINDOW ================= */}
//         {open && (
//           <div className="w-[90vw] sm:w-[400px] h-[600px] max-h-[85vh] bg-[#f4f4f2] rounded-3xl shadow-2xl border border-[#d6d1c4] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
//             {/* Header */}
//             <div className="bg-[#1b1b1b] p-5 flex justify-between items-center text-white">
//               <div className="flex items-center gap-3">
//                 <div className="bg-white p-1 rounded-xl backdrop-blur-sm">
//                   <Image src="/logo.png" alt="logo" width={30} height={30}  />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg leading-tight text-white">GRASA AI</h3>
//                   <div className="flex items-center gap-1.5">
//                     <span className="w-2 h-2 bg-[#C5D82D] rounded-full animate-pulse" />
//                     <span className="text-xs text-[#C5D82D] font-bold tracking-wide uppercase">Always Online</span>
//                   </div>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => {
//                   setOpen(false);
//                   window.speechSynthesis?.cancel(); // Stop speaking if window is closed
//                   setSpeakingIndex(null);
//                 }} 
//                 className="hover:bg-white/8 bg-white/10 p-2 rounded-full transition-colors text-[#C5D82D]"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#ebecdf]">
//               {messages.map((msg, i) => (
//                 <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//                   <div className={`relative max-w-[80%] px-4 py-3 text-[14px] shadow-sm font-medium ${
//                       msg.sender === "user"
//                         ? "bg-[#1b1b1b] text-white rounded-2xl rounded-tr-none"
//                         : "bg-white border border-[#d6d1c4] text-[#1b1b1b] rounded-2xl rounded-tl-none pr-10"
//                     }`}>
                    
//                     <span>{msg.text}</span>
                    
//                     {/* TTS Speaker Icon for Bot Messages */}
//                     {msg.sender === "bot" && (
//                       <button
//                         onClick={() => toggleSpeech(msg.text, i)}
//                         className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-all ${
//                           speakingIndex === i 
//                             ? "text-red-500 bg-red-50 hover:bg-red-100" 
//                             : "text-[#5c5c5c] hover:text-[#1b1b1b] hover:bg-gray-100"
//                         }`}
//                         title={speakingIndex === i ? "Stop speaking" : "Read aloud"}
//                         aria-label={speakingIndex === i ? "Stop speaking" : "Read aloud"}
//                       >
//                         {speakingIndex === i ? <VolumeOff size={16} /> : <Volume2 size={16} />}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               {loading && (
//                 <div className="flex items-center gap-2 text-[#1b1b1b]">
//                   <Sparkles size={14} className="animate-spin text-[#606c04]" />
//                   <span className="text-xs font-bold text-[#5c5c5c] uppercase tracking-wider">Assistant is thinking...</span>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Area */}
//             <div className="p-4 bg-[#f4f4f2] border-t border-[#d6d1c4]">
//               <div className="flex items-center gap-2 bg-white border border-[#d6d1c4] rounded-2xl p-1.5 focus-within:border-[#1b1b1b] focus-within:ring-1 focus-within:ring-[#1b1b1b] transition-all">
                
//                 <input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   placeholder={isListening ? "Listening..." : "Type your message..."}
//                   className="flex-1 bg-transparent px-3 py-2 text-[15px] outline-none text-[#1b1b1b] placeholder:text-[#5c5c5c] font-medium"
//                 />

//                 {/* Microphone Button */}
//                 <button
//                   onClick={toggleListening}
//                   className={`p-2.5 rounded-xl transition-all ${
//                     isListening 
//                       ? "bg-red-100 text-red-500 animate-pulse" 
//                       : "bg-gray-100 text-[#5c5c5c] hover:bg-gray-200"
//                   }`}
//                   title="Speech to text"
//                 >
//                   <Mic size={18} />
//                 </button>

//                 {/* Send Button */}
//                 <button
//                   onClick={sendMessage}
//                   disabled={loading || !input.trim()}
//                   className="bg-[#C5D82D] hover:opacity-90 text-[#1b1b1b] p-2.5 rounded-xl transition-all disabled:opacity-50"
//                 >
//                   <Send size={18} className="fill-current" />
//                 </button>
//               </div>
//               <p className="text-[10px] text-center text-[#5c5c5c] mt-3 font-bold uppercase tracking-wider">Powered by IDC INDIA</p>
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
import { Send, X, Sparkles, Mic, Volume2, VolumeOff } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Track which message index is currently being spoken
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi! I'm your GRASA assistant. How can I help you improve your gut health today?" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

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

  /* ================= PRELOAD VOICES ================= */
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
    };
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  /* ================= TEXT TO SPEECH LOGIC ================= */
  const toggleSpeech = (text: string, index: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Your browser does not support text-to-speech.");
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    // 1. Pronunciation fix for GRASA
    // 2. Remove markdown asterisks (**) so the bot doesn't say "asterisk asterisk"
    const spokenText = text
      .replace(/GRASA/gi, "Graasa")
      .replace(/\*\*/g, ""); 
      
    const utterance = new SpeechSynthesisUtterance(spokenText);
    const voices = window.speechSynthesis.getVoices();
    
    // FEMALE VOICE SELECTION LOGIC
    let selectedVoice = voices.find(v => 
      (v.lang.includes('IN') || v.lang === 'en-IN') && 
      (/female|woman|neerja|veena/i.test(v.name))
    );

    if (!selectedVoice) {
      selectedVoice = voices.find(v => /female|woman|zira|samantha|victoria|karen/i.test(v.name));
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.includes('IN'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.95; 
    utterance.pitch = 1.1; 

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  /* ================= SPEECH TO TEXT LOGIC ================= */
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // @ts-expect-error - SpeechRecognition is not fully typed in standard TS lib
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Please try Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("");
      
      setInput(transcript);
    };

    recognition.onerror = (event: { error: string }) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  /* ================= SEND MESSAGE LOGIC ================= */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // const res = await fetch("https://grasachat.srv1067874.hstgr.cloud/ask/chat", {
      const res = await fetch("http://localhost:5000/ask/chat", {
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

  /* ================= MARKDOWN & NEWLINE FORMATTER ================= */
  const formatText = (text: string) => {
    // 1. Force a newline before numbers followed by a dot (e.g., " 1.", " 2.") 
    // if the backend sends it as a single continuous string.
    const textWithNewlines = text.replace(/ (\d+\. )/g, '\n$1');

    // 2. Split the text by the newlines so we can render them as separate block elements
    return textWithNewlines.split('\n').map((line, lineIndex) => {
      
      // 3. For each line, split by the **bold** pattern
      const parts = line.split(/(\*\*.*?\*\*)/g);
      
      return (
        <div key={lineIndex} className="mb-2 last:mb-0">
          {parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              // Remove the asterisks and apply bold styling
              return (
                <strong key={index} className="font-bold text-black">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <>
      {/* ================= GLOW RING KEYFRAMES ================= */}
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
            className="group relative flex items-center transition-all duration-300 hover:scale-104 active:scale-95 outline-none"
          >
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

            <div className="relative z-10 flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20">
              <span className="grasa-ring-1 pointer-events-none absolute inset-0 rounded-full border-2 border-[#C5D82D]" />
              <span className="grasa-ring-2 pointer-events-none absolute inset-0 rounded-full border-2 border-[#C5D82D]" />

              <div className="relative w-full h-full bg-[#f4f4f2] rounded-full border border-[#d6d1c4] shadow-xl transition-transform duration-300  flex items-center justify-center">
                <div className="relative w-20 h-20 ">
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
              <button 
                onClick={() => {
                  setOpen(false);
                  window.speechSynthesis?.cancel(); // Stop speaking if window is closed
                  setSpeakingIndex(null);
                }} 
                className="hover:bg-white/8 bg-white/10 p-2 rounded-full transition-colors text-[#C5D82D]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#ebecdf]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`relative max-w-[80%] px-4 py-3 text-[14px] shadow-sm font-medium ${
                      msg.sender === "user"
                        ? "bg-[#1b1b1b] text-white rounded-2xl rounded-tr-none"
                        : "bg-white border border-[#d6d1c4] text-[#1b1b1b] rounded-2xl rounded-tl-none pr-10"
                    }`}>
                    
                    {/* Replaced raw msg.text with our formatter function */}
                    <div className="break-words leading-relaxed">
                      {formatText(msg.text)}
                    </div>
                    
                    {/* TTS Speaker Icon for Bot Messages */}
                    {msg.sender === "bot" && (
                      <button
                        onClick={() => toggleSpeech(msg.text, i)}
                        className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-all ${
                          speakingIndex === i 
                            ? "text-red-500 bg-red-50 hover:bg-red-100" 
                            : "text-[#5c5c5c] hover:text-[#1b1b1b] hover:bg-gray-100"
                        }`}
                        title={speakingIndex === i ? "Stop speaking" : "Read aloud"}
                        aria-label={speakingIndex === i ? "Stop speaking" : "Read aloud"}
                      >
                        {speakingIndex === i ? <VolumeOff size={16} /> : <Volume2 size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-[#1b1b1b]">
                  <Sparkles size={14} className="animate-spin text-[#606c04]" />
                  <span className="text-xs font-bold text-[#5c5c5c] uppercase tracking-wider">Assistant is thinking...</span>
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
                  placeholder={isListening ? "Listening..." : "Type your message..."}
                  className="flex-1 bg-transparent px-3 py-2 text-[15px] outline-none text-[#1b1b1b] placeholder:text-[#5c5c5c] font-medium"
                />

                {/* Microphone Button */}
                <button
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl transition-all ${
                    isListening 
                      ? "bg-red-100 text-red-500 animate-pulse" 
                      : "bg-gray-100 text-[#5c5c5c] hover:bg-gray-200"
                  }`}
                  title="Speech to text"
                >
                  <Mic size={18} />
                </button>

                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-[#C5D82D] hover:opacity-90 text-[#1b1b1b] p-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  <Send size={18} className="fill-current" />
                </button>
              </div>
              <p className="text-[10px] text-center text-[#5c5c5c] mt-3 font-bold uppercase tracking-wider">Powered by IDC INDIA</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}