export default function Award() {
    return(
        <>
            <section className="py-10 px-6 bg-white border-y border-[#d6d1c4]">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      {/* Award visual (UPDATED WITH IMAGE) */}
      <div className="relative">
  <div className="bg-[#f4f4f2]  overflow-hidden min-h-[360px] relative shadow-sm">

    <img
      src="https://res.cloudinary.com/daunsn0z7/image/upload/v1777271129/medicaps/social_img/lcst0w40cahkkvsduxpe.jpg"
      alt="Rashtriya Ratna Samman 2026"
      className="w-full h-full object-cover "
    />

    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-3xl" /> */}

  </div>
</div>

      {/* Award copy (UNCHANGED) */}
      <div>
        <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-6 inline-block">
          National Recognition
        </span>

        <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-6">
          Nationally recognised.{" "} Rashtriya Ratna Samman 2026.
        </h2>

        <p className="text-lg text-[#5c5c5c] font-medium leading-relaxed mb-8">
          In 2026, GRASA was honoured with India&apos;s most prestigious startup recognition — the Rashtriya Ratna Samman — in the category of Emerging Health Tech &amp; Nutrition Innovation Startup of the Year.
        </p>

        <div className="bg-[#f4f4f2] border border-[#d6d1c4] p-6 rounded-3xl relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C5D82D]" />
          <p className="text-[#1b1b1b] font-bold text-base leading-snug">
            Presented by{" "}
            <span className="text-[#849411]">Ms. Kangana Ranaut, MP</span>, this national award recognises GRASA&apos;s pioneering work in making food-based metabolic intervention accessible, guided, and measurable for every Indian.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            "Health Tech Innovation",
            "Nutrition Science",
            "Fermented Millets",
            "Delhi NCR",
          ].map((tag, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full border border-[#d6d1c4] bg-white text-[#5c5c5c] text-xs font-bold uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>
        </>
    )
}