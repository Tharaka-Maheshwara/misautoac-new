"use client";

import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Jaron",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 2,
    name: "Jeon",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 3,
    name: "Michael",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 4,
    name: "Sarah",
    text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 2 >= testimonials.length ? 0 : prev + 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 2 < 0 ? Math.max(0, testimonials.length - 2) : prev - 2));
  };

  return (
    <section className="w-full bg-[#f4f9ff] py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 text-center">
        <h2 className="mb-14 text-3xl font-bold text-slate-900 sm:text-4xl">
          What Our Customers Say
        </h2>

        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute -left-4 md:-left-8 lg:-left-12 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-[#1e66c9] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none"
          >
            <svg className="h-6 w-6 pr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
            {testimonials.slice(currentIndex, currentIndex + 2).map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex flex-col justify-between rounded-2xl bg-white p-10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] text-left transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl cursor-default"
              >
                <div>
                  {/* Quote Icon */}
                  <div className="mb-6 text-[#3b82f6] opacity-80">
                    <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="mb-8 text-slate-600 text-lg leading-relaxed">
                    {testimonial.text}
                  </p>
                  
                  {/* Star Rating */}
                  <div className="mb-8 flex space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                {/* Profile */}
                <div className="flex items-center">
                  <div className="mr-4 h-14 w-14 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1e66c9] shadow-inner"></div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm font-medium text-[#1e66c9]">Testimonial</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute -right-4 md:-right-8 lg:-right-12 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-[#1e66c9] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none"
          >
            <svg className="h-6 w-6 pl-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="mt-12 flex justify-center space-x-2">
          {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx * 2)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === idx * 2 ? "w-8 bg-[#1e66c9]" : "w-2.5 bg-slate-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
