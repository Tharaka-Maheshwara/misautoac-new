"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
      <div className="flex items-center gap-4 mb-3">
        <div className="h-12 w-12 rounded-full bg-slate-200"></div>
        <div className="flex-1">
          <div className="h-5 w-3/4 rounded bg-slate-200 mb-2"></div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 w-5 rounded-full bg-slate-200"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-4 w-1/3 rounded bg-slate-200 mb-4"></div>
      <div className="h-4 w-full rounded bg-slate-200 mb-2"></div>
      <div className="h-4 w-5/6 rounded bg-slate-200"></div>
    </div>
  </div>
);

// --- Main Component ---
export default function TestimonialsSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 3,
      spacing: 16,
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
        const fetchedData = (await getFeedbacks(9)) as Feedback[]; // Fetch more for the carousel
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
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className={`${starSize} text-yellow-400`} />
        ))}
        {/* Note: The image doesn't show half stars, but this is a common feature.
            For exact replication, we can round to nearest full star.
            The image shows 4.3 with 4 full stars and one empty. So we floor it.
        */}
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
    <section className="w-full bg-slate-50 py-20 sm:py-28">
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
        <div className="mt-12 mx-auto max-w-4xl">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <p className="text-5xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </p>
              <div>
                {renderStars(averageRating, "h-6 w-6")}
                <p className="mt-1 text-sm text-gray-600">
                  Based on {feedbacks.length} ratings
                </p>
              </div>
            </div>
            <Link
              href="/feedback"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-x-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <StarIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Leave your rating
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
              <div className="keen-slider__slide text-center text-gray-500 col-span-full">
                No feedback yet.
              </div>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb.id} className="keen-slider__slide p-2">
                  <div className="h-full rounded-lg border border-slate-200 bg-white p-6 flex flex-col">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg shrink-0">
                        {getInitials(fb.name)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{fb.name}</h3>
                        {renderStars(fb.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 ml-16">
                      {formatDate(fb.createdAt)}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {`"${fb.message}"`}
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