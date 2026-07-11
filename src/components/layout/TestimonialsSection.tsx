"use client";

import { useState, useEffect } from "react";
import { getFeedbacks } from "@/lib/firebase";

// Define the structure for a feedback item
interface Feedback {
  id: string;
  name: string;
  message: string;
  rating: number;
  // photoURL could be added here if we fetch it from the Users collection
}

// Skeleton component for loading state
const TestimonialSkeleton = () => (
  <div className="flex flex-col justify-between rounded-2xl bg-white p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border border-slate-100">
    <div>
      <div className="h-10 w-10 bg-slate-200 rounded-md mb-6 animate-pulse"></div>
      <div className="h-4 bg-slate-200 rounded w-full mb-2 animate-pulse"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6 mb-2 animate-pulse"></div>
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-8 animate-pulse"></div>
      <div className="flex space-x-1 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-5 w-5 bg-slate-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>
    <div className="flex items-center">
      <div className="mr-4 h-14 w-14 rounded-full bg-slate-200 animate-pulse"></div>
      <div>
        <div className="h-5 w-24 bg-slate-200 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function TestimonialsSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const fetchedData = await getFeedbacks(6); // Fetch latest 6 feedbacks
        setFeedbacks(fetchedData as Feedback[]);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Could not load testimonials at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const nextSlide = () => {
    if (feedbacks.length === 0) return;
    setCurrentIndex((prev) => (prev + 2 >= feedbacks.length ? 0 : prev + 2));
  };

  const prevSlide = () => {
    if (feedbacks.length === 0) return;
    setCurrentIndex((prev) =>
      prev - 2 < 0 ? Math.max(0, feedbacks.length - 2) : prev - 2
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <TestimonialSkeleton />
          <TestimonialSkeleton />
        </>
      );
    }

    if (error) {
      return (
        <div className="md:col-span-2 text-center text-red-500 bg-red-50 p-8 rounded-2xl">
          {error}
        </div>
      );
    }

    if (feedbacks.length === 0) {
      return (
        <div className="md:col-span-2 text-center text-slate-600 bg-slate-50 p-8 rounded-2xl">
          No customer feedback available yet. Be the first to leave a review!
        </div>
      );
    }

    return feedbacks
      .slice(currentIndex, currentIndex + 2)
      .map((testimonial) => (
        <div
          key={testimonial.id}
          className="flex flex-col justify-between rounded-2xl bg-white p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border border-slate-100 text-left transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl cursor-default"
        >
          <div>
            <div className="mb-6 text-[#3b82f6] opacity-80">
              <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="mb-8 text-slate-600 text-lg leading-relaxed">
              {testimonial.message}
            </p>
            <div className="mb-8 flex space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < testimonial.rating ? "fill-current" : "fill-current text-gray-300"}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4 h-14 w-14 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1e66c9] shadow-inner flex items-center justify-center text-white font-bold text-xl">
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {testimonial.name}
              </h4>
              <p className="text-sm font-medium text-[#1e66c9]">
                Valued Customer
              </p>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <section className="w-full bg-white py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 text-center">
        <h2 className="mb-14 text-3xl font-bold text-slate-900 sm:text-4xl">
          What Our Customers Say
        </h2>
        <div className="relative flex items-center justify-center">
          <button
            onClick={prevSlide}
            disabled={isLoading || feedbacks.length <= 2}
            className="absolute -left-4 md:-left-8 lg:-left-12 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-[#1e66c9] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-6 w-6 pr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 min-h-[450px]">
            {renderContent()}
          </div>
          <button
            onClick={nextSlide}
            disabled={isLoading || feedbacks.length <= 2}
            className="absolute -right-4 md:-right-8 lg:-right-12 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-[#1e66c9] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-6 w-6 pl-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {!isLoading && !error && feedbacks.length > 0 && (
          <div className="mt-12 flex justify-center space-x-2">
            {Array.from({ length: Math.ceil(feedbacks.length / 2) }).map(
              (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx * 2)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx * 2
                      ? "w-8 bg-[#1e66c9]"
                      : "w-2.5 bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                ></button>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
