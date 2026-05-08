'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQComponent = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'Who is GRASA for?',
      answer: "Anyone with blood sugar or weight concerns, or anyone whose parents or grandparents had these issues. Also for people who feel slower, tireder, or less sharp as they age — and want to turn that around. Age 25+. If you're pregnant, on dialysis, or have cancer, we're not the fit right now.",
    },
    {
      question: 'Does this mean I stop my medicines?',
      answer: "No. GRASA works alongside your current prescription — we never ask you to stop or change anything. We track your body's response throughout. If your numbers improve significantly, your doctor may choose to adjust your dose — but that decision is always theirs.",
    },
    {
      question: 'What happens on the free call?',
      answer: 'A 20-minute call with a GRASA doctor. Tell us how you feel — or share your blood reports if you have them. We listen, explain what we see, and tell you honestly whether GRASA makes sense for your body right now. Nothing is sold on this call.',
    },
    {
      question: 'What is the food that gets delivered? Is it like a diet?',
      answer: "It's not a diet. The food we send — atta, flatbread, cookies, snack bars — looks and tastes like normal food. It's made from ancient Indian grains prepared in a specific way that helps your body perform better from the inside. FSSAI certified, made fresh, delivered 3 times a week.",
    },
    {
      question: 'How does the food arrive? What do I do with it?',
      answer: "Fresh packets arrive at your home 3 times a week — Monday, Wednesday, Friday. Your health coach will tell you exactly how to use each item, how much, and when. It fits into your existing meals — you don't need to overhaul the way you eat.",
    },
    {
      question: "What if I don't notice a difference in 6 weeks?",
      answer: "We review your Week 6 check together. If things aren't moving the way we expected, we'll tell you why and what we'd suggest next. We don't ask you to continue something that isn't working.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="w-full bg-[#ebecdf] py-12 px-4 sm:px-6 lg:px-12 font-sans "
    >
      {/* Restricting the max width slightly more than 1400px helps 
        reading legibility on ultrawide monitors so eyes don't have to 
        travel too far left to right.
      */}
      <div className="max-w-[1000px] mx-auto">

        {/* Section Header - Styled to match the screenshot */}
        <div className="mb-12 text-center">
          <span className="inline-block text-[#1b1b1b] text-sm uppercase tracking-wider font-bold mb-3">
            Common Questions
          </span>
          <h2 className="font-serif text-5xl  font-bold leading-tight text-[#1b1b1b] tracking-tight">
            Things people ask before they start.
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="border-t border-[#d6d1c4]">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border-b border-[#d6d1c4] transition-all duration-300 ${
                  isOpen ? 'bg-[#f4f4f2] md:px-6 px-3' : ''
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-4 sm:py-5 md:py-6 px-0 flex items-center justify-between text-left transition-colors duration-200 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-bold text-[15px] sm:text-base md:text-lg pr-4 sm:pr-6 transition-colors duration-200 leading-snug ${
                      isOpen ? 'text-[#1b1b1b]' : 'text-[#1b1b1b] group-hover:text-[#5a6b00]'
                    }`}
                  >
                    {item.question}
                  </span>

                  {/* +/− toggle */}
                  <div
                    className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isOpen
                        ? 'bg-[#1b1b1b] text-[#C5D82D] rotate-180'
                        : 'bg-[#C5D82D] text-[#1b1b1b] group-hover:bg-[#d4e840] group-hover:scale-105'
                    }`}
                  >
                    <span
                      className={`text-lg sm:text-xl font-bold leading-none transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                      style={{ display: 'block', marginTop: '-1px' }}
                    >
                      +
                    </span>
                  </div>
                </button>

                {/* Animated answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-[#5c5c5c] font-medium leading-relaxed text-[14px] sm:text-[15px] pb-5 sm:pb-6 pt-0 max-w-3xl">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQComponent;