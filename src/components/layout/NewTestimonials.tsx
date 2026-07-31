"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { getFeedbacks } from "@/lib/firebase";

interface Feedback {
  id: string;
  name: string;
  message: string;
  rating: number;
}

const getInitials = (name: string) => {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  if (!nameParts.length) return "?";
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

  return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(
    0,
  )}`.toUpperCase();
};

function RatingStars({ rating }: { rating: number }) {
  const safeRating = Math.min(5, Math.max(0, Number(rating) || 0));
  const highlightedStars = Math.round(safeRating);

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${safeRating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          aria-hidden="true"
          className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${
            index < highlightedStars ? "text-amber-400" : "text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCardSkeleton() {
  return (
    <div className="keen-slider__slide py-2">
      <div className="flex min-h-[250px] animate-pulse flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:min-h-[270px] sm:p-6">
        <div className="h-9 w-9 rounded-xl bg-slate-200" />

        <div className="mt-5 space-y-2.5">
          <div className="h-3.5 w-full rounded-full bg-slate-200" />
          <div className="h-3.5 w-11/12 rounded-full bg-slate-200" />
          <div className="h-3.5 w-4/5 rounded-full bg-slate-200" />
        </div>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="mb-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-4 w-4 rounded bg-slate-200" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-28 rounded-full bg-slate-200" />
              <div className="h-3 w-20 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewTestimonials() {
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
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 14 },
      },
      "(max-width: 767px)": {
        slides: { perView: 1, spacing: 12 },
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

  useEffect(() => {
    let isMounted = true;

    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const fetchedData = (await getFeedbacks(3)) as Feedback[];

        if (isMounted) {
          setFeedbacks(Array.isArray(fetchedData) ? fetchedData : []);
        }
      } catch (fetchError) {
        console.error("Error fetching feedbacks:", fetchError);

        if (isMounted) {
          setFeedbacks([]);
          setError("Could not load testimonials at this time.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchFeedbacks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      instanceRef.current?.update();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [feedbacks, isLoading, error, instanceRef]);

  const canMoveBackward = currentSlide > 0;
  const canMoveForward = currentSlide < maxSlide;
  const showNavigation = isSliderReady && !isLoading && !error && maxSlide > 0;

  return (
    <section className="relative w-full overflow-hidden bg-white py-14 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-cyan-100/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-700">
            <StarIcon className="h-4 w-4 text-amber-400" />
            Customer reviews
          </span>

          <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-3xl lg:text-4xl">
            What Our Customers Say
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 sm:w-20" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div ref={sliderRef} className="keen-slider">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TestimonialCardSkeleton key={index} />
              ))
            ) : error ? (
              <div className="keen-slider__slide py-2">
                <div className="flex min-h-48 items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-5 text-center text-sm font-semibold text-red-600">
                  {error}
                </div>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="keen-slider__slide py-2">
                <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-center text-sm font-semibold text-slate-500">
                  Be the first to leave a review!
                </div>
              </div>
            ) : (
              feedbacks.map((feedback, index) => (
                <article key={feedback.id} className="keen-slider__slide py-2">
                  <div className="group relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_22px_55px_-30px_rgba(37,99,235,0.3)] sm:min-h-[270px] sm:p-6">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />

                    <div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-2xl font-black leading-none text-blue-600 ring-1 ring-blue-100">
                        “
                      </span>
                      <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-[15px]">
                        {feedback.message}
                      </p>
                    </div>

                    <div className="mt-auto border-t border-slate-100 pt-4">
                      <RatingStars rating={feedback.rating} />

                      <div className="mt-3 flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-extrabold text-white shadow-md ${
                            index % 3 === 0
                              ? "from-blue-600 to-indigo-600"
                              : index % 3 === 1
                                ? "from-cyan-500 to-blue-600"
                                : "from-violet-600 to-purple-600"
                          }`}
                        >
                          {getInitials(feedback.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {feedback.name || "Anonymous Customer"}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-black text-emerald-600">
                              ✓
                            </span>
                            Valued customer
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {showNavigation && (
            <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => instanceRef.current?.moveToIdx(index)}
                    className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      currentSlide === index
                        ? "w-7 bg-blue-600"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:h-11 sm:w-11 sm:rounded-2xl"
                  aria-label="Previous testimonials"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    instanceRef.current?.next();
                  }}
                  disabled={!canMoveForward}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:pointer-events-none disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:h-11 sm:w-11 sm:rounded-2xl"
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