'use client';

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    image: "/hero_slide_1.jpg",
    badge: "🔧 Expert Technicians",
    title: "Stay Cool on the Road",
    subtitle: "Expert Auto AC Services for All Makes and Models.",
  },
  {
    image: "/hero_slide_2.jpg",
    badge: "❄️ Premium Cooling",
    title: "Maximum Comfort, Every Drive",
    subtitle: "Precision AC diagnosis, repair & refrigerant recharge services.",
  },
  {
    image: "/hero_slide_3.jpg",
    badge: "⚙️ Advanced Equipment",
    title: "Professional Grade Service",
    subtitle: "State-of-the-art tools for your vehicle's air conditioning system.",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 500);
    },
    [animating]
  );

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [current, goToSlide]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-content-enter { animation: fadeSlideUp 0.7s ease forwards; }

        .slide-bg {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 0.8s ease, transform 6s ease;
          transform: scale(1.05);
        }
        .slide-bg.active {
          opacity: 1;
          transform: scale(1);
        }
        .slide-bg.inactive {
          opacity: 0;
          transform: scale(1.08);
        }

        .hero-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(8px);
          color: white; border-radius: 50%;
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 20;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .hero-arrow:hover {
          background: rgba(37,99,235,0.7);
          border-color: rgba(37,99,235,0.9);
          transform: translateY(-50%) scale(1.1);
        }

        .dot {
          width: 10px; height: 10px; border-radius: 999px;
          background: rgba(255,255,255,0.4);
          border: 1.5px solid rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.35s ease;
        }
        .dot.active {
          background: #2563eb;
          border-color: #2563eb;
          width: 28px;
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(37,99,235,0.25);
          border: 1px solid rgba(37,99,235,0.5);
          backdrop-filter: blur(10px);
          color: #93c5fd;
          padding: 6px 16px; border-radius: 999px;
          font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 18px;
        }

        .progress-bar {
          position: absolute; bottom: 0; left: 0;
          height: 3px; background: #2563eb;
          animation: progress 5s linear infinite;
          z-index: 30;
        }
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "80vh" }}
        aria-label="Hero Image Slider"
      >
        {/* Slides */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`slide-bg ${i === current ? "active" : "inactive"}`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
        ))}

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,40,0.75) 0%, rgba(0,10,60,0.55) 50%, rgba(0,0,20,0.70) 100%)",
          }}
        />

        {/* Subtle top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 z-20"
          style={{ height: "2px", background: "linear-gradient(90deg,transparent,#3b82f6,transparent)" }}
        />

        {/* Progress bar */}
        <div className="progress-bar" key={current} />

        {/* Arrow: Previous */}
        <button
          className="hero-arrow"
          style={{ left: "20px" }}
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Arrow: Next */}
        <button
          className="hero-arrow"
          style={{ right: "20px" }}
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Content */}
        <div
          className="relative z-20 flex flex-col items-center justify-center text-center text-white px-6"
          style={{ minHeight: "80vh", paddingTop: "80px", paddingBottom: "80px" }}
        >
          <div key={current} className="hero-content-enter max-w-3xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center">
              <span className="hero-badge">{slides[current].badge}</span>
            </div>

            {/* Title */}
            <h1
              className="font-bold leading-tight mb-5"
              style={{
                fontSize: "clamp(2.4rem, 6vw, 4rem)",
                textShadow: "0 4px 24px rgba(0,0,80,0.5)",
                letterSpacing: "-0.02em",
              }}
            >
              {slides[current].title}
            </h1>

            {/* Subtitle */}
            <p
              className="mb-10 text-blue-100 mx-auto"
              style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", maxWidth: "540px", lineHeight: 1.7 }}
            >
              {slides[current].subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pages/contact"
                className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 8px 28px rgba(37,99,235,0.45)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(37,99,235,0.6)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(37,99,235,0.45)"; }}
              >
                Book Appointment
              </Link>
              <Link
                href="/pages/services"
                className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1.5px solid rgba(255,255,255,0.4)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
              >
                View Services
              </Link>
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        <div
          className="absolute z-30 flex gap-2 items-center"
          style={{ bottom: "28px", left: "50%", transform: "translateX(-50%)" }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === current ? "active" : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
