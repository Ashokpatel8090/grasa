// "use client";

// import { useEffect, useState, FormEvent } from "react";
// import axios from "axios";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { BASE_URL } from "@/components/config/api";



// /* ---------------- COOKIE READER (safe inside useEffect) ---------------- */
// const readCookie = (name: string) => {
//   if (typeof document === "undefined") return ""; // ❗ prevents SSR crash
//   const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
//   return match ? match[2] : "";
// };

// export default function SupportPage() {
//   const [subject, setSubject] = useState("");
//   const [description, setDescription] = useState("");
//   const [priority, setPriority] = useState("Low");
//   const [loading, setLoading] = useState(false);
//   const [tickets, setTickets] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [token, setToken] = useState(""); // ❗ token stored safely here

//   /* ---------------- GET TOKEN ON CLIENT ONLY ---------------- */
//   useEffect(() => {
//     const t = readCookie("token");
//     setToken(t);
//   }, []);

//   /* ---------------- FETCH TICKETS ---------------- */
//   const fetchTickets = async () => {
//     if (!token) return;
//     try {
//       const res = await axios.get(`${BASE_URL}/api/support/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTickets(res.data);
//     } catch (err) {
//       alert("Failed to load tickets");
//     }
//   };

//   useEffect(() => {
//     if (token) fetchTickets();
//   }, [token]);

//   /* ---------------- CREATE TICKET ---------------- */
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post(
//         `${BASE_URL}/api/support/`,
//         { subject, description, priority },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSubject("");
//       setDescription("");
//       setPriority("Low");
//       setShowForm(false);
//       fetchTickets();
//       alert("Ticket created successfully!");
//     } catch (error) {
//       alert("Failed to create ticket");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-6xl mx-auto mt-10">

//       {/* CREATE NEW TICKET BUTTON */}
//       <Button
//         onClick={() => setShowForm(true)}
//         className="bg-blue-600 text-white px-6 py-3 mb-6"
//       >
//         Create Ticket
//       </Button>

//       {/* POPUP FORM */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">

//             <h2 className="text-xl font-semibold mb-4">Create Support Ticket</h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Subject"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 className="w-full p-3 border rounded"
//                 required
//               />

//               <textarea
//                 placeholder="Description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full p-3 border rounded"
//                 required
//               ></textarea>

//               <select
//                 value={priority}
//                 onChange={(e) => setPriority(e.target.value)}
//                 className="w-full p-3 border rounded"
//               >
//                 <option value="Low">Low</option>
//                 <option value="Medium">Medium</option>
//                 <option value="High">High</option>
//               </select>

//               <div className="flex justify-between">
//                 <Button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="bg-gray-500 text-white px-4"
//                 >
//                   Cancel
//                 </Button>

//                 <Button
//                   type="submit"
//                   className="bg-blue-600 text-white px-6"
//                   disabled={loading}
//                 >
//                   {loading ? "Creating..." : "Create Ticket"}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* TICKET LIST */}
//       <h2 className="text-2xl font-semibold mb-4">Your Tickets</h2>

//       {tickets.length === 0 ? (
//         <p>No tickets found.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {tickets.map((ticket: any) => (
//             <Card
//               key={ticket.id}
//               className="p-4 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer rounded-xl"
//             >
//               <div className="flex justify-between items-center mb-1">
//                 <h3 className="font-semibold text-lg">{ticket.subject}</h3>
//                 <span
//                   className={`text-xs px-2 py-1 rounded-full ${
//                     ticket.priority === "High"
//                       ? "bg-red-100 text-red-700"
//                       : ticket.priority === "Medium"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-green-100 text-green-700"
//                   }`}
//                 >
//                   {ticket.priority}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-700 leading-tight mb-2">
//                 {ticket.description}
//               </p>

//               <div className="space-y-1 mt-2">
//                 <p className="text-xs text-gray-500">Status: {ticket.status}</p>
//                 <p className="text-xs text-gray-500">Created: {ticket.created_at}</p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }











"use client";

import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { BASE_URL } from "@/components/config/api";
import toast from "react-hot-toast";
import { 
  Ticket, 
  Plus, 
  X, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";

/* ---------------- COOKIE READER (safe inside useEffect) ---------------- */
const readCookie = (name: string) => {
  if (typeof document === "undefined") return ""; // ❗ prevents SSR crash
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
};

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [token, setToken] = useState(""); 

  /* ---------------- GET TOKEN ON CLIENT ONLY ---------------- */
  useEffect(() => {
    const t = readCookie("token");
    setToken(t);
  }, []);

  /* ---------------- FETCH TICKETS ---------------- */
  const fetchTickets = async () => {
    if (!token) return;
    setIsFetching(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/support/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (token) fetchTickets();
  }, [token]);

  /* ---------------- CREATE TICKET ---------------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating ticket...");

    try {
      await axios.post(
        `${BASE_URL}/api/support/`,
        { subject, description, priority },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubject("");
      setDescription("");
      setPriority("Low");
      setShowForm(false);
      fetchTickets();
      toast.success("Ticket created successfully!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to create ticket", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1000px] w-full mx-auto p-4 sm:p-6 md:p-10 font-sans">
      
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b1b1b] tracking-tight">
            Support Tickets
          </h1>
          <p className="text-[#5c5c5c] mt-2 font-medium">
            Need help? Raise a ticket and our team will assist you.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C5D82D] text-[#1b1b1b] rounded-xl font-bold shadow-sm hover:bg-[#b5c727] hover:-translate-y-0.5 active:translate-y-0 transition-all w-full sm:w-auto"
        >
          <Plus size={20} />
          Create Ticket
        </button>
      </div>

      <hr className="border-t border-[#d6d1c4] mb-10" />

      {/* ---------- TICKET LIST ---------- */}
      {isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border border-[#d6d1c4] rounded-2xl bg-white h-40 animate-pulse flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="h-5 w-1/2 bg-[#ebecdf] rounded"></div>
                <div className="h-5 w-16 bg-[#ebecdf] rounded-full"></div>
              </div>
              <div className="h-4 w-full bg-[#f4f4f2] rounded mt-2"></div>
              <div className="h-4 w-3/4 bg-[#f4f4f2] rounded"></div>
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white border border-dashed border-[#d6d1c4] rounded-3xl p-12 text-center flex flex-col items-center gap-4 transition-colors hover:bg-[#ebecdf]">
          <div className="w-16 h-16 bg-[#f4f4f2] rounded-full flex items-center justify-center text-[#a8a396]">
            <Ticket size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1b1b1b]">No tickets found</h3>
            <p className="text-[#5c5c5c] font-medium mt-1">You haven't raised any support requests yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket: any) => (
            <div
              key={ticket.id}
              className="group p-6 border border-[#d6d1c4] rounded-2xl bg-white flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#C5D82D]"
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-lg text-[#1b1b1b] line-clamp-1 group-hover:text-[#9eae24] transition-colors">
                  {ticket.subject}
                </h3>
                <span
                  className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full border ${
                    ticket.priority === "High"
                      ? "bg-[#fee2e2] text-red-700 border-[#fca5a5]"
                      : ticket.priority === "Medium"
                      ? "bg-[#fef08a] text-yellow-800 border-[#fde047]"
                      : "bg-[#dcfce7] text-green-800 border-[#86efac]"
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>

              <p className="text-sm text-[#5c5c5c] leading-relaxed line-clamp-2 flex-grow">
                {ticket.description}
              </p>

              <hr className="border-t border-[#f4f4f2]" />

              <div className="flex justify-between items-center text-xs font-semibold text-[#a8a396]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className={ticket.status?.toLowerCase() === 'closed' ? "text-green-600" : "text-blue-500"} />
                  <span className="uppercase tracking-wider">{ticket.status || "Open"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>
                    {ticket.created_at 
                      ? new Date(ticket.created_at).toLocaleDateString() 
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- CREATE TICKET MODAL ---------- */}
      {showForm && (
        <div className="fixed inset-0 bg-[#1b1b1b]/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-[#f4f4f2] border border-[#d6d1c4] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setShowForm(false)}
              className="absolute top-6 right-6 text-[#a8a396] hover:text-[#1b1b1b] transition-colors bg-white rounded-full p-1 shadow-sm border border-[#d6d1c4]"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#C5D82D] shadow-sm flex items-center justify-center shrink-0 text-[#1b1b1b]">
                <Ticket size={24} />
              </div>
              <h2 className="text-2xl font-bold text-[#1b1b1b]">New Ticket</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-[#5c5c5c] text-sm font-bold uppercase tracking-wider ml-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Issue with recent order"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-4 bg-white border border-[#d6d1c4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5D82D] transition-all text-[#1b1b1b] placeholder:text-[#a8a396] font-medium shadow-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#5c5c5c] text-sm font-bold uppercase tracking-wider ml-1">Description</label>
                <textarea
                  placeholder="Please describe your issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 bg-white border border-[#d6d1c4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5D82D] transition-all text-[#1b1b1b] placeholder:text-[#a8a396] font-medium shadow-sm min-h-[120px] resize-y"
                  required
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#5c5c5c] text-sm font-bold uppercase tracking-wider ml-1">Priority</label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-4 bg-white border border-[#d6d1c4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5D82D] transition-all text-[#1b1b1b] font-medium shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#a8a396]">
                    ▼
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 flex-col-reverse sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3.5 bg-white border border-[#d6d1c4] text-[#1b1b1b] rounded-xl font-bold hover:bg-[#ebecdf] transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 flex justify-center items-center gap-2 bg-[#C5D82D] text-[#1b1b1b] rounded-xl font-bold shadow-sm hover:bg-[#b5c727] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Ticket"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}