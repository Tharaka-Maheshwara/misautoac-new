"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useAuth } from "@/context/AuthContext";
import { getFeedbacks } from "@/lib/firebase";

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

const AVATAR_GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-violet-600 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-500",
];

const getInitials = (name: string) => {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  if (!nameParts.length) return "?";
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

  return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(
    0,
  )}`.toUpperCase();
};

const formatDate = (timestamp?: { seconds: number }) => {
  if (!timestamp?.seconds) return "Recently";

  return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const clampRating = (rating: number) =>
  Math.min(5, Math.max(0, Number(rating) || 0));

function RatingStars({
  rating,
  sizeClass = "h-5 w-5",
}: {
  rating: number;
  sizeClass?: string;
}) {
  const safeRating = clampRating(rating);
  const highlightedStars = Math.round(safeRating);

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${safeRating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          aria-hidden="true"
          className={`${sizeClass} ${
            index < highlightedStars
              ? "text-amber-400 drop-shadow-[0_1px_1px_rgba(245,158,11,0.2)]"
              : "text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCardSkeleton() {
  return (
    <div className="keen-slider__slide py-2">
      <div className="flex min-h-[295px] animate-pulse flex-col rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] sm:p-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-slate-200" />
          <div className="h-3.5 w-24 rounded-full bg-slate-200" />
        </div>

        <div className="mt-5 space-y-2.5">
          <div className="h-4 w-full rounded-full bg-slate-200" />
          <div className="h-4 w-11/12 rounded-full bg-slate-200" />
          <div className="h-4 w-4/5 rounded-full bg-slate-200" />
        </div>

        <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
          <div className="h-10 w-10 rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded-full bg-slate-200" />
            <div className="h-3 w-24 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);
  const [isSliderReady, setIsSliderReady] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    mode: "snap",
    renderMode: "performance",
    rubberband: false,
    slides: {
      perView: 3,
      spacing: 20,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 18 },
      },
      "(max-width: 640px)": {
        slides: { perView: 1, spacing: 14 },
      },
    },
    created(slider) {
      setIsSliderReady(true);
      setCurrentSlide(slider.track.details.rel);
      setMaxSlide(slider.track.details.maxIdx);
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
      setMaxSlide(slider.track.details.maxIdx);
    },
    updated(slider) {
      setCurrentSlide(slider.track.details.rel);
      setMaxSlide(slider.track.details.maxIdx);
    },
  });

  const loadFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedData = (await getFeedbacks(9)) as Feedback[];
      setFeedbacks(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (loadError) {
      console.error("Error fetching feedbacks:", loadError);
      setFeedbacks([]);
      setError("We couldn't load the customer reviews right now.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeedbacks();
  }, [loadFeedbacks]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      instanceRef.current?.update();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [feedbacks, isLoading, error, instanceRef]);

  const averageRating = useMemo(() => {
    if (!feedbacks.length) return 0;

    const totalRating = feedbacks.reduce(
      (total, feedback) => total + clampRating(feedback.rating),
      0,
    );

    return totalRating / feedbacks.length;
  }, [feedbacks]);

  const canMoveBackward = currentSlide > 0;
  const canMoveForward = currentSlide < maxSlide;
  const showNavigation = isSliderReady && !isLoading && !error && maxSlide > 0;

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50 px-4 py-2 shadow-sm shadow-blue-100/40">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              ★
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
              Customer experiences
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">
            Trusted by customers who
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              expect quality service
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Genuine feedback from customers who chose Mist Auto A/C for
            professional service, dependable support and lasting results.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl sm:mt-14">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_70px_-38px_rgba(15,23,42,0.4)] lg:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-6 lg:p-7">
              <div className="flex min-w-[170px] items-center gap-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-5 py-4 text-white shadow-lg shadow-slate-900/15">
                <span className="text-4xl font-black tracking-tight sm:text-5xl">
                  {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                </span>
                <span className="h-10 w-px bg-white/15" />
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
                    out of
                  </span>
                  <span className="mt-1 block text-xl font-extrabold">5.0</span>
                </span>
              </div>

              <div className="min-w-0">
                <RatingStars rating={averageRating} sizeClass="h-6 w-6" />
                <p className="mt-2 font-bold text-slate-900">
                  Excellent customer rating
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Based on {feedbacks.length} recent customer
                  {feedbacks.length === 1 ? " review" : " reviews"}
                </p>
              </div>
            </div>

            <div className="flex items-center border-t border-slate-200 bg-slate-50/80 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-7">
              <Link
                href={user ? "/feedback" : "/auth/login"}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 lg:w-auto"
              >
                <StarIcon className="h-5 w-5" aria-hidden="true" />
                {user ? "Share your experience" : "Sign in to leave a review"}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-12 max-w-6xl sm:mt-14">
          <div ref={sliderRef} className="keen-slider">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TestimonialCardSkeleton key={index} />
              ))
            ) : error ? (
              <div className="keen-slider__slide py-2">
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[1.75rem] border border-red-200 bg-white px-6 py-10 text-center shadow-sm">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-500">
                    !
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    Reviews are temporarily unavailable
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    {error} Please check your connection and try again.
                  </p>
                  <button
                    type="button"
                    onClick={() => void loadFeedbacks()}
                    className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="keen-slider__slide py-2">
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[1.75rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-500">
                    ★
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    Be the first to share your experience
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Your feedback helps us improve our service and helps other
                    customers make a confident choice.
                  </p>
                  <Link
                    href={user ? "/feedback" : "/auth/login"}
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    {user ? "Write a review" : "Sign in to review"}
                  </Link>
                </div>
              </div>
            ) : (
              feedbacks.map((feedback, index) => (
                <article key={feedback.id} className="keen-slider__slide py-2">
                  <div className="group relative flex min-h-[295px] h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_26px_65px_-30px_rgba(37,99,235,0.32)] sm:p-6">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl font-black leading-none text-blue-600 ring-1 ring-blue-100">
                        “
                      </span>

                      <div className="text-right">
                        <RatingStars
                          rating={feedback.rating}
                          sizeClass="h-4 w-4"
                        />
                        <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                          {formatDate(feedback.createdAt)}
                        </p>
                      </div>
                    </div>

                    <blockquote className="mt-5 flex-1">
                      <p className="text-sm leading-6 text-slate-600 sm:text-[15px]">
                        {feedback.message}
                      </p>
                    </blockquote>

                    <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                          AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]
                        } text-sm font-extrabold text-white shadow-lg shadow-slate-900/10`}
                      >
                        {getInitials(feedback.name)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-extrabold text-slate-900">
                          {feedback.name || "Anonymous Customer"}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-600">
                            ✓
                          </span>
                          Verified feedback
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {showNavigation && (
            <div className="mt-6 flex items-center justify-center gap-4 sm:justify-between">
              <div className="hidden items-center gap-2 sm:flex">
                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => instanceRef.current?.moveToIdx(index)}
                    className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      currentSlide === index
                        ? "w-8 bg-blue-600"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to testimonial group ${index + 1}`}
                    aria-current={currentSlide === index ? "true" : undefined}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    instanceRef.current?.prev();
                  }}
                  disabled={!canMoveBackward}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  aria-label="Previous testimonials"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <span className="min-w-16 text-center text-xs font-bold text-slate-400 sm:hidden">
                  {currentSlide + 1} / {maxSlide + 1}
                </span>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    instanceRef.current?.next();
                  }}
                  disabled={!canMoveForward}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  aria-label="Next testimonials"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}