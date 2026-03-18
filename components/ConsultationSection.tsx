// "use client";

// import { useState } from "react";
// import { FiPhone } from "react-icons/fi";
// import { Stethoscope, Pill, ClipboardList, Clock } from "lucide-react";

// export default function ConsultationSection() {
//   const [concern, setConcern] = useState("");

//   return (
//     <section id="consultation-form" className="w-full bg-[#ebecdf] py-10 scroll-mt-20">
//       <div className="max-w-[1400px] mx-auto px-12 grid lg:grid-cols-2 gap-12 items-start">

//         {/* LEFT CONTENT */}
//         <div>

//           <h2 className="text-[34px] leading-[32px] font-bold text-[#1b1b1b] mb-6">
//             Talk to our clinician first.
//             <br />
//             Decide after.
//           </h2>

//           <div className="w-12 h-[3px] bg-[#1d5c46] mb-6"></div>

//           <p className="text-[#5c5c5c] max-w-lg mb-10 text-md leading-tight">
//             No one sells you a programme on this call. We just want to
//             understand your situation — and tell you honestly if GRASA can help.
//           </p>

//           <div className="space-y-3">

//             {/* ITEM */}
//             <div className="flex gap-4">
//               <div className="w-12 h-12 rounded-xl bg-[#cde2d5] flex items-center justify-center">
//                 <Stethoscope size={20} />
//               </div>
//               <div>
//                 <p className="font-semibold text-md">
//                   We review your blood reports
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   Share your latest sugar, cholesterol, and liver reports. We
//                   tell you what they mean for you.
//                 </p>
//               </div>
//             </div>

//             {/* ITEM */}
//             <div className="flex gap-4">
//               <div className="w-12 h-12 rounded-xl bg-[#cde2d5] flex items-center justify-center">
//                 <Pill size={20} />
//               </div>
//               <div>
//                 <p className="font-semibold text-md">
//                   We check your medicines
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   GRASA works alongside your current medicines. We confirm this
//                   on the call. Zero risk.
//                 </p>
//               </div>
//             </div>

//             {/* ITEM */}
//             <div className="flex gap-4">
//               <div className="w-12 h-12 rounded-xl bg-[#cde2d5] flex items-center justify-center">
//                 <ClipboardList size={20} />
//               </div>
//               <div>
//                 <p className="font-semibold text-md">
//                   We recommend the right programme
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   Only if GRASA makes sense for you. We'll say so clearly if it
//                   doesn't.
//                 </p>
//               </div>
//             </div>

//             {/* ITEM */}
//             <div className="flex gap-4">
//               <div className="w-12 h-12 rounded-xl bg-[#cde2d5] flex items-center justify-center">
//                 <Clock size={20} />
//               </div>
//               <div>
//                 <p className="font-semibold text-md">
//                   20 minutes. Free. No obligation.
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   We call you back within 24 hours — at a time that works for
//                   you.
//                 </p>
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* RIGHT FORM CARD */}
//         <div className="bg-[#f4f4f2] rounded-xl p-4 shadow-sm border border-[#d6d1c4]">

//           <span className="inline-block bg-[#cde2d5] text-[#1d5c46] text-sm px-4 py-2 rounded-full mb-6 font-semibold">
//             ✦ 100% FREE CONSULTATION
//           </span>

//           <h3 className="text-2xl font-bold mb-2">
//             Book your free call
//           </h3>

//           <p className="text-gray-600 mb-8">
//             We'll call you back within 24 hours.
//           </p>

//           <form className="space-y-6">

//             {/* NAME + PHONE */}
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 placeholder="Full name"
//                 className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white"
//               />

//               <input
//                 type="text"
//                 placeholder="+91 98XXX XXXXX"
//                 className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white"
//               />
//             </div>

//             {/* AGE + CONCERN */}
//             <div className="grid grid-cols-2 gap-4">

//               <input
//                 type="number"
//                 placeholder="e.g. 45"
//                 className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white"
//               />

//               <select
//                 value={concern}
//                 onChange={(e) => setConcern(e.target.value)}
//                 className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white"
//               >
//                 <option>Select your concern</option>
//                 <option>Sugar / Diabetes</option>
//                 <option>Fatty liver</option>
//                 <option>High cholesterol</option>
//                 <option>Bloating / digestion</option>
//                 <option>Weight / energy</option>
//                 <option>Multiple issues</option>
//               </select>

//             </div>

//             {/* TIME */}
//             <input
//               type="text"
//               placeholder="When can we call?"
//               className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white"
//             />

//             {/* BUTTON */}
//             <div className="flex justify-center">
//                 <button
//                     type="submit"
//                     className="w-full max-w-[85%] bg-[#C5D82D] text-gray-900 py-4 rounded-md font-semibold hover:opacity-90 transition"
//                 >
//                     Book My Free Call
//                 </button>
//                 </div>

//             <p className="text-sm text-gray-500 text-center">
//               🔒 Your details are private. We do not spam.
//             </p>

//           </form>
//         </div>

//       </div>
//     </section>
//   );
// }





"use client";

import { useState, useEffect } from "react";
import { Stethoscope, Pill, ClipboardList, Clock } from "lucide-react";

export default function ConsultationSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    date: "",
    time: "",
    notes: "",
  });

  const [status, setStatus] = useState("idle"); // "idle", "loading", "success", "error"

  // Calculate exactly 2 hours from current time on component mount
  useEffect(() => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 2);

    // Format Date to YYYY-MM-DD
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, "0");
    const day = String(futureDate.getDate()).padStart(2, "0");
    const defaultDate = `${year}-${month}-${day}`;

    // Format Time to HH:mm
    const hours = String(futureDate.getHours()).padStart(2, "0");
    const mins = String(futureDate.getMinutes()).padStart(2, "0");
    const defaultTime = `${hours}:${mins}`;

    setFormData((prev) => ({
      ...prev,
      date: defaultDate,
      time: defaultTime,
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("https://medicaps.cloud/nt/ctbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          phone_number: "",
          date: formData.date, // keep the default date
          time: formData.time, // keep the default time
          notes: "",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setStatus("error");
    }
  };

  return (
    <section id="consultation-form" className="w-full bg-[#ebecdf] py-10 scroll-mt-20">
      <div className="max-w-[1400px] mx-auto px-12 grid lg:grid-cols-2 gap-12 items-start">
        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-[34px] leading-[32px] font-bold text-[#1b1b1b] mb-6">
            Talk to our clinician first.
            <br />
            Decide after.
          </h2>

          <div className="w-12 h-[3px] bg-[#1d5c46] mb-6"></div>

          <p className="text-[#5c5c5c] max-w-lg mb-10 text-md leading-tight">
            No one sells you a programme on this call. We just want to
            understand your situation — and tell you honestly if GRASA can help.
          </p>

          <div className="space-y-3">
            {/* ITEM */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#cde2d5] flex items-center justify-center">
                <Stethoscope size={20} />
              </div>
              <div>
                <p className="font-semibold text-md">We review your blood reports</p>
                <p className="text-gray-600 text-sm">
                  Share your latest sugar, cholesterol, and liver reports. We
                  tell you what they mean for you.
                </p>
              </div>
            </div>

            {/* ITEM */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#cde2d5] flex items-center justify-center">
                <Pill size={20} />
              </div>
              <div>
                <p className="font-semibold text-md">We check your medicines</p>
                <p className="text-gray-600 text-sm">
                  GRASA works alongside your current medicines. We confirm this
                  on the call. Zero risk.
                </p>
              </div>
            </div>

            {/* ITEM */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#cde2d5] flex items-center justify-center">
                <ClipboardList size={20} />
              </div>
              <div>
                <p className="font-semibold text-md">We recommend the right programme</p>
                <p className="text-gray-600 text-sm">
                  Only if GRASA makes sense for you. We'll say so clearly if it
                  doesn't.
                </p>
              </div>
            </div>

            {/* ITEM */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#cde2d5] flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-semibold text-md">20 minutes. Free. No obligation.</p>
                <p className="text-gray-600 text-sm">
                  We call you back within 24 hours — at a time that works for you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM CARD */}
        <div className="bg-[#f4f4f2] rounded-xl p-6 shadow-sm border border-[#d6d1c4]">
          <span className="inline-block bg-[#cde2d5] text-[#1d5c46] text-sm px-4 py-2 rounded-full mb-6 font-semibold">
            ✦ 100% FREE CONSULTATION
          </span>

          <h3 className="text-2xl font-bold mb-2">Book your free call</h3>
          <p className="text-gray-600 mb-8">
            We'll call you back around your selected time.
          </p>

          {status === "success" ? (
            <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center font-medium">
              Thank you! Your consultation has been booked successfully. Our clinician will connect with you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME + PHONE */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1d5c46]"
                />

                <input
                  type="tel"
                  name="phone_number"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+91 98XXX XXXXX"
                  className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1d5c46]"
                />
              </div>

              {/* DATE + TIME */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1d5c46]"
                />

                <input
                  type="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1d5c46]"
                />
              </div>

              {/* NOTES */}
              <textarea
                name="notes"
                rows="2"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific concerns? (e.g., Interested in weight loss plan, diabetes management)"
                className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1d5c46] resize-none"
              ></textarea>

              {status === "error" && (
                <p className="text-red-600 text-sm text-center">
                  Something went wrong. Please try again.
                </p>
              )}

              {/* BUTTON */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full max-w-[85%] bg-[#C5D82D] text-gray-900 py-4 rounded-md font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {status === "loading" ? "Booking..." : "Book My Free Call"}
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center">
                🔒 Your details are private. We do not spam.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}