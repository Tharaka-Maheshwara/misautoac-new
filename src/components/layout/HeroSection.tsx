'use client';

import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative w-full min-h-96 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero-bg.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Stay Cool on the Road
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mb-8">
          Expert Auto AC Services for All Makes and Models.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/pages/contact"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition hover:bg-blue-500"
          >
            Book Appointment
          </Link>
          <Link
            href="/pages/services"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-blue-600 shadow-md transition hover:bg-gray-100"
          >
            View Services
          </Link>
        </div>
      </div>
    </section>
  );
}
