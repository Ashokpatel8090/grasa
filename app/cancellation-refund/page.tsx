// "use client"

// export default function RefundCancellationPolicy() {
//   return (
//     <section className="max-w-5xl mx-auto px-6 py-16">
//       <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center">
//         Refund, Cancellation & Delivery Policy
//       </h1>

//       {/* Refund Policy */}
//       <div className="mb-10">
//         <h2 className="text-2xl font-semibold mb-3">
//           1. Refund Policy
//         </h2>
//         <p className="text-gray-700 leading-relaxed">
//           Users are eligible for a refund on applicable services or products
//           if the request is raised within <strong>14 days</strong> of the
//           purchase or service commencement, subject to the terms and
//           conditions outlined in our separate Terms of Service document.
//           Please refer to the Terms of Service for complete details on
//           eligibility and refund processing.
//         </p>
//       </div>

//       {/* Cancellation Policy */}
//       <div className="mb-10">
//         <h2 className="text-2xl font-semibold mb-3">
//           2. Cancellation Policy
//         </h2>
//         <p className="text-gray-700 leading-relaxed">
//             Users may cancel an order within <strong>24 hours</strong> after placing
//             an order and once the order has been successfully confirmed. Cancellation
//             requests made after this period may not be eligible, depending on the
//             processing stage of the product or service.
//             </p>

//       </div>

//       {/* Shipping / Delivery Policy */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-3">
//           3. Shipping / Delivery Policy
//         </h2>
//         <p className="text-gray-700 leading-relaxed">
//           For physical products or services requiring delivery, the estimated
//           delivery timeframe is generally within <strong>7 days</strong> from
//           order confirmation, subject to availability and logistics. Specific
//           delivery timelines will be communicated at the time of purchase.
//         </p>
//       </div>
//     </section>
//   )
// }




"use client"

import { Shield } from "lucide-react"

export default function RefundCancellationPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-[roboto]">
            Refund, Cancellation & Delivery Policy
          </h1>

          <p className="font-[poppins] font-bold text-xl text-slate-700">
            GRASAFOODS
          </p>

          {/* Dates */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
            <span>Effective Date: June 12, 2025</span>
            <span>Last Updated: Feb 13, 2026</span>
          </div>
        </header>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">

          {/* Refund Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              1. Refund Policy
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Users are eligible for a refund on applicable services or
              products if the request is raised within <strong>14 days</strong> of the
              purchase or service commencement, subject to the terms and
              conditions outlined in our separate Terms of Service document.
              Please refer to the Terms of Service for complete details on
              eligibility and refund processing.
            </p>
          </section>

          {/* Cancellation Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              2. Cancellation Policy
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Users may cancel an order within <strong>24 hours</strong> after placing
              an order and once the order has been successfully confirmed.
              Cancellation requests made after this period may not be eligible,
              depending on the processing stage of the product or service.
            </p>
          </section>

          {/* Delivery Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              3. Shipping / Delivery Policy
            </h2>
            <p className="text-slate-700 leading-relaxed">
              For physical products or services requiring delivery, the estimated
              delivery timeframe is generally within <strong>7 days</strong> from
              order confirmation, subject to availability and logistics. Specific
              delivery timelines will be communicated at the time of purchase.
            </p>
          </section>

        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>© 2026 GRASA SUPER FOODS BEVERAGES PVT. LTD. All rights reserved.</p>
        </footer>

      </div>
    </div>
  )
}
