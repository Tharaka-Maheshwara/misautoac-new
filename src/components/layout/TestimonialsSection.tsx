"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFeedbacks } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
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
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
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

const formatDate = (timestamp: { seconds: number }) => {
  if (!timestamp?.seconds) return "";
  return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// --- Skeleton Components for Loading State ---
const TestimonialCardSkeleton = () => (
  <div className="keen-slider__slide p-2">
    <div className="h-full rounded-lg border border-slate-200 bg-white p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-10 w-10 rounded-full bg-slate-200"></div>
        <div className="flex-1">
          <div className="h-5 w-3/4 rounded bg-slate-200 mb-2"></div>
          <div className="h-4 w-1/2 rounded bg-slate-200"></div>
        </div>
      </div>
      <div className="h-4 w-full rounded bg-slate-200 mb-2"></div>
      <div className="h-4 w-5/6 rounded bg-slate-200"></div>
    </div>
  </div>
);

// --- Main Component ---
export default function TestimonialsSection() {
  const { user } = useAuth(); // Get user status
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 3,
      spacing: 24,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 16 },
      },
      "(max-width: 768px)": {
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

        if (fetchedData.length > 0) {
          const totalRating = fetchedData.reduce(
            (acc, curr) => acc + curr.rating,
            0
          );
          setAverageRating(totalRating / fetchedData.length);
        }
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Could not load testimonials at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderStars = (rating: number, starSize = "h-5 w-5") => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className={`${starSize} text-yellow-400`} />
        ))}
        {[...Array(5 - fullStars)].map((_, i) => (
          <StarIcon
            key={`empty-${i}`}
            className={`${starSize} text-gray-300`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-4">
            <span className="p-3 bg-yellow-100 rounded-full">
              <StarIcon className="h-8 w-8 text-yellow-500" />
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What our clients say
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Real feedback from people who've used our service.
          </p>
        </div>

        {/* Summary Box */}
        <div className="mt-16 mx-auto max-w-5xl">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <p className="text-5xl font-bold text-gray-900">
                {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
              </p>
              <div>
                {renderStars(averageRating, "h-6 w-6")}
                <p className="mt-1 text-sm text-gray-600">
                  Based on {feedbacks.length} ratings
                </p>
              </div>
            </div>
            <Link
              href={user ? "/feedback" : "/auth/login"}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-x-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <StarIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              {user ? "Leave your rating" : "Sign in to rate"}
            </Link>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="mt-16 relative">
          <div ref={sliderRef} className="keen-slider">
            {isLoading ? (
              [...Array(3)].map((_, i) => <TestimonialCardSkeleton key={i} />)
            ) : error ? (
              <div className="keen-slider__slide text-center text-red-500 col-span-full">
                {error}
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="keen-slider__slide text-center text-gray-500 col-span-full py-12">
                No feedback yet. Be the first to leave a rating!
              </div>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb.id} className="keen-slider__slide group">
                  <div className="h-full rounded-lg border border-gray-200 bg-white p-6 flex flex-col transition-shadow duration-300 group-hover:shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-11 w-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-md shrink-0">
                        {getInitials(fb.name)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{fb.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {renderStars(fb.rating, "h-4 w-4")}
                          <span className="text-gray-400">•</span>
                          <span>{formatDate(fb.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {fb.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Carousel Arrows */}
          {instanceRef.current && feedbacks.length > 3 && (
            <>
              <button
                onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
                className="absolute top-1/2 -translate-y-1/2 -left-3 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                disabled={isLoading}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
                className="absolute top-1/2 -translate-y-1/2 -right-3 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                disabled={isLoading}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
