"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Salad, ClipboardList, Clock, Check } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { BASE_URL } from "@/components/config/api";



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
      const response = await fetch(`${BASE_URL}/nt/ctbook`, {
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
          <span className="inline-block text-[#1b1b1b] text-sm uppercase tracking-wider font-bold mb-3">
            Free Conversation
          </span>
          
          <h2 className="text-[34px] leading-[40px] font-bold text-[#1b1b1b] mb-4">
            Not sure where to start?
            <br />
            Talk to us first.
          </h2>

          <div className="w-12 h-[3px] bg-[#1b1b1b] mb-4"></div>

          <p className="text-[#5c5c5c] max-w-lg mb-8 text-md leading-relaxed">
            No programme is sold on this call. We understand your situation and tell you honestly if GRASA can help.
          </p>

          <div className="space-y-6">
            {/* ITEM 1 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C5D82D] flex items-center justify-center shrink-0">
                <MessageCircle size={20} className="text-[#1b1b1b]" />
              </div>
              <div>
                <p className="font-semibold text-md text-[#1b1b1b]">Tell us how you feel</p>
                <p className="text-gray-600 text-sm mt-1">
                  No reports or tests needed to start
                </p>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C5D82D] flex items-center justify-center shrink-0">
                <Salad size={20} className="text-[#1b1b1b]" />
              </div>
              <div>
                <p className="font-semibold text-md text-[#1b1b1b]">We understand your health picture</p>
                <p className="text-gray-600 text-sm mt-1">
                  Your lifestyle, habits, and goals
                </p>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C5D82D] flex items-center justify-center shrink-0">
                <ClipboardList size={20} className="text-[#1b1b1b]" />
              </div>
              <div>
                <p className="font-semibold text-md text-[#1b1b1b]">We suggest what makes sense for you</p>
                <p className="text-gray-600 text-sm mt-1">
                  Honestly — including if GRASA isn't the right fit
                </p>
              </div>
            </div>

            {/* ITEM 4 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C5D82D] flex items-center justify-center shrink-0">
                <Clock size={20} className="text-[#1b1b1b]" />
              </div>
              <div>
                <p className="font-semibold text-md text-[#1b1b1b]">20 minutes. Free. No pressure.</p>
                <p className="text-gray-600 text-sm mt-1">
                  We call back within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM CARD */}
        <div className="bg-[#f4f4f2] rounded-xl p-6 shadow-sm border border-[#d6d1c4]">
          {status === "success" ? (
            /* SUCCESS STATE UI */
            <div className="flex flex-col items-center text-center py-3">
              {/* Checkmark Icon */}
              <div className="w-16 h-16 bg-[#cde2d5] text-[#1b1b1b] rounded-full flex items-center justify-center mb-6">
                <Check size={32} />
              </div>

              <h3 className="text-2xl lg:text-[22px] font-bold text-[#1b1b1b] mb-3">
                Done! We'll call you within 24 hours.
              </h3>

              <p className="text-[#5c5c5c] mb-4 text-sm">
                You'll get a WhatsApp confirmation from us shortly. Here's what happens next:
              </p>

              {/* Steps List */}
              <div className="flex flex-col gap-4 text-left w-full mb-2">
                <div className="flex items-center gap-1">
                  <div className="w-9 h-9 bg-[#ebecdf] rounded-lg flex items-center justify-center shrink-0 text-md">
                    📱
                  </div>
                  <p className="text-[#1b1b1b] text-base">WhatsApp confirmation sent to your number</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-[#ebecdf] rounded-lg flex items-center justify-center shrink-0 text-md">
                    🥗
                  </div>
                  <p className="text-[#1b1b1b] text-base">Our nutritionist reviews your answers before the call</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-[#ebecdf] rounded-lg flex items-center justify-center shrink-0 text-md">
                    📞
                  </div>
                  <p className="text-[#1b1b1b] text-base">20-minute call — honest, free, nothing sold</p>
                </div>
              </div>

              {/* WhatsApp Button */}
              {/* <a
                href="https://wa.me/919870263399"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#C5D82D] text-gray-900 py-4 rounded-md font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2 mb-6"
              >
                 Message Us Now on WhatsApp
              </a> */}


              <a
                href="https://wa.me/919870263399"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#C5D82D] text-gray-900 py-4 rounded-md font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2 mb-6"
              >
                <FaWhatsapp className="text-xl" />
                Message Us Now on WhatsApp
              </a>

              {/* Footer text */}
              <p className="text-[#5c5c5c] text-sm">
                Can't wait? Call directly: <span className="font-bold text-[#1b1b1b]">+91 98702 63399</span>
              </p>
            </div>
          ) : (
            /* DEFAULT FORM UI */
            <>
              <span className="inline-block bg-[#C5D82D] text-[#1b1b1b] uppercase text-sm px-4 py-2 rounded-full mb-4 font-semibold">
                ✦ Free · No Obligation
              </span>

              <h3 className="text-2xl font-bold mb-2">Talk to us — it's free</h3>
              <p className="text-gray-600 mb-8">
                Tell us a little. We call you back within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* NAME + PHONE */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1b1b1b]"
                  />

                  <input
                    type="tel"
                    name="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+91 98XXX XXXXX"
                    className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1b1b1b]"
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
                    className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1b1b1b]"
                  />

                  <input
                    type="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1b1b1b]"
                  />
                </div>

                {/* NOTES */}
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any specific concerns? (e.g., Interested in weight loss plan, diabetes management)"
                  className="border border-[#d6d1c4] rounded-lg px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1b1b1b] resize-none"
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
                    className="w-full max-w-[85%] bg-[#C5D82D] text-gray-900 py-4 rounded-md font-bold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {status === "loading" ? "Booking..." : "Call Me Back — It's Free →"}
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  🔒 Your details are private. We do not spam.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}