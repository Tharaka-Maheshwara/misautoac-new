"use client";

import { useState, useEffect } from "react";
import { getFeedbacks } from "@/lib/firebase";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

// Define the structure for a feedback item
interface Feedback {
  id: string;
  name: string;
  message: string;
  rating: number;
}

// --- Helper Functions ---
const getInitials = (name: string) => {
  if (!name) return "?";
  const nameParts = name.split(" ");
  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${
      nameParts[nameParts.length - 1][0]
    }`.toUpperCase();
  }
  return name[0]?.toUpperCase() || "?";
};

// --- Skeleton Components for Loading State ---
const TestimonialCardSkeleton = () => (
  <div className="keen-slider__slide p-4">
    <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-8 shadow-lg animate-pulse">
      <div className="h-8 w-8 rounded-full bg-slate-200 mb-4"></div>
      <div className="h-4 w-full rounded bg-slate-200 mb-2"></div>
      <div className="h-4 w-5/6 rounded bg-slate-200 mb-6"></div>
      <div className="flex items-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-5 w-5 rounded-full bg-slate-200"></div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-200"></div>
        <div className="flex-1">
          <div className="h-5 w-3/4 rounded bg-slate-200 mb-2"></div>
          <div className="h-4 w-1/2 rounded bg-slate-200"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---
export default function NewTestimonials() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 2,
      spacing: 24,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 1, spacing: 16 },
      },
    },
  });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const fetchedData = (await getFeedbacks(9)) as Feedback[];
        setFeedbacks(fetchedData);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Could not load testimonials at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-5 h-5 ${
              i < fullStars ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Our Customers Say
          </h2>
          <div className="mt-4 h-1 w-20 bg-blue-500 mx-auto"></div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {isLoading ? (
              [...Array(2)].map((_, i) => <TestimonialCardSkeleton key={i} />)
            ) : error ? (
              <div className="keen-slider__slide text-center text-red-500 col-span-full">
                {error}
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="keen-slider__slide text-center text-gray-500 col-span-full">
                Be the first to leave a review!
              </div>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb.id} className="keen-slider__slide p-4">
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-8 shadow-lg">
                    <div>
                      <span className="text-5xl font-bold text-blue-500">“</span>
                      <p className="mt-4 text-base text-gray-600">
                        {fb.message}
                      </p>
                    </div>
                    <div className="mt-8">
                      {renderStars(fb.rating)}
                      <div className="mt-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
                          {getInitials(fb.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {fb.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Valued Customer
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Carousel Arrows */}
          {instanceRef.current && feedbacks.length > 2 && (
            <>
              <button
                onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
                className="absolute top-1/2 -translate-y-1/2 -left-4 h-10 w-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-gray-600 hover:bg-slate-50 disabled:opacity-50"
                disabled={isLoading}
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
                className="absolute top-1/2 -translate-y-1/2 -right-4 h-10 w-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-gray-600 hover:bg-slate-50 disabled:opacity-50"
                disabled={isLoading}
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
