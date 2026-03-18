// "use client"
// import React from "react"

// const HeroSection = () => {
//   return (
//     <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10 ">
//       <div className="max-w-7xl mx-auto">

//         {/* Hero Container */}
//         <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px] flex items-center px-6 sm:px-10 md:px-14 lg:px-20 shadow-xl">

//           {/* Background Image */}
//           <div
//             className="absolute inset-0 bg-cover bg-center z-0"
//             style={{
//               // backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2000')`,
//               backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url('/bg2.png')`,

//             }}
//           />

//           {/* Content */}
//           <div className="relative z-10 max-w-xl lg:max-w-2xl text-white">

//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[1.1] mb-6 md:mb-8 tracking-tight">
//               Know the root cause <br className="hidden sm:block"/>
//               of your digestive problems.
//             </h1>

//             <button
//               onClick={() =>
//                 document
//                   .getElementById("consultation-form")
//                   ?.scrollIntoView({ behavior: "smooth" })
//               }
//               className="bg-[#C5D82D] text-black font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:scale-105 transition-transform uppercase tracking-tight"
//             >
//               TAKE THE LONGEVITY TEST ™
//             </button>

            

//           </div>
//         </div>

//         {/* Floating Stats Cards */}
//         <div className="relative z-20 -mt-10 sm:-mt-12 px-2 sm:px-4 md:px-10">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">

//             {/* Card 1 */}
//             <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
//               <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">
//                 10K+
//               </h3>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
//                 Happy Customers
//               </p>
//             </div>

//             {/* Card 2 */}
//             <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
//               <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">
//                 95%
//               </h3>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
//                 Saw Results*
//               </p>
//             </div>

//             {/* Card 3 */}
//             <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">

//               <div className="flex items-center space-x-2">
//                 <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
//                   4.8
//                 </h3>

//                 <div className="flex text-black">
//                   <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 20 20">
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </svg>
//                 </div>
//               </div>

//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
//                  Rating
//               </p>

//             </div>

//           </div>
//         </div>

//       </div>
//     </section>
//   )
// }

// export default HeroSection







"use client"
import React from "react"

const HeroSection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10 ">
      <div className="max-w-7xl mx-auto">

        {/* Hero Container */}
        {/* CHANGED: Replaced 'items-center' with 'items-start pt-16 sm:pt-24 md:pt-32 lg:pt-36' to move content higher */}
        <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px] flex items-start pt-16 sm:pt-24 md:pt-32 lg:pt-36 px-6 sm:px-10 md:px-14 lg:px-20 shadow-xl">

          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              // backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2000')`,
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url('/bg2.png')`,

            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-xl lg:max-w-2xl text-white">

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[1.1] mb-6 md:mb-8 tracking-tight">
              Know the root cause <br className="hidden sm:block"/>
              of your digestive problems.
            </h1>

            <button
              onClick={() =>
                document
                  .getElementById("longevity-assessment")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-[#C5D82D] text-black font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:scale-105 transition-transform uppercase tracking-tight shadow-md"
            >
              TAKE THE LONGEVITY TEST ™
            </button>

          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="relative z-20 -mt-10 sm:-mt-12 px-2 sm:px-4 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">

            {/* Card 1 */}
            <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
              <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">
                10K+
              </h3>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
                Happy Customers
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
              <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">
                95%
              </h3>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
                Saw Results*
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">

              <div className="flex items-center space-x-2">
                <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  4.8
                </h3>

                <div className="flex text-black">
                  <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
                 Rating
              </p>

            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection