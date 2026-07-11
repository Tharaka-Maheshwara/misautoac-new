"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function BookAppointmentPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const activeStep = Number(currentStep);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(
    null,
  );
  const [makeModel, setMakeModel] = useState("");
  const [year, setYear] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState<boolean>(false);

  const [viewDate, setViewDate] = useState(new Date());

  const [errors, setErrors] = useState<{
    service?: string;
    vehicle?: string;
    date?: string;
    time?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  }>({});

  // --- Fetch Booked Times ---
  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!selectedDate) return;

      setIsLoadingTimes(true);
      setBookedTimes([]);
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const q = query(
          collection(db, "Appointments"),
          where("appointmentDate", ">=", startOfDay),
          where("appointmentDate", "<=", endOfDay),
        );

        const querySnapshot = await getDocs(q);
        const times = querySnapshot.docs.map(
          (doc) => doc.data().appointmentTime,
        );
        setBookedTimes(times);
      } catch (error) {
        console.error("Error fetching booked times:", error);
        // Optionally show an error to the user
      } finally {
        setIsLoadingTimes(false);
      }
    };

    fetchBookedTimes();
  }, [selectedDate]);

  // --- Calendar Logic ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1,
  );
  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();

  const startingDayOfWeek = firstDayOfMonth.getDay();

  const calendarDays = Array.from({ length: startingDayOfWeek }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth(),
        i + 1,
      );
      return dayDate;
    }),
  );

  const handlePrevMonth = () => {
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };
  // --- End Calendar Logic ---

  const handleBookingConfirmation = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    const serviceTitle =
      services.find((s) => s.id === selectedService)?.title || "N/A";

    const appointmentData = {
      service: serviceTitle,
      vehicleType: selectedVehicleType,
      makeModel,
      year,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      customerName: fullName,
      customerEmail: emailAddress,
      customerPhone: phoneNumber,
      notes: additionalNotes,
      status: "Scheduled",
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(
        collection(db, "Appointments"),
        appointmentData,
      );
      setBookingRef(docRef.id);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      setSubmissionError(
        "Could not save your appointment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const vehicleTypes = [
    { id: "Car", icon: "🚗" },
    { id: "SUV", icon: "🚙" },
    { id: "Truck", icon: "🛻" },
    { id: "Van", icon: "🚐" },
    { id: "Sports Car", icon: "🏎️" },
    { id: "Luxury", icon: "🚘" },
    { id: "Electric", icon: "⚡" },
    { id: "Hybrid", icon: "🔋" },
    { id: "Other", icon: "✨" },
  ];

  const services = [
    {
      id: 1,
      title: "AC Repair & Maintenance",
      desc: "Full inspection & repair of all AC components",
      time: "1–2 hrs",
      icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
    },
    {
      id: 2,
      title: "Gas Refill & Recharge",
      desc: "Refrigerant top-up and system pressure check",
      time: "45 min",
      icon: "M12 2v10a4 4 0 1 0 0 8 4 4 0 0 0 4-4V12.63A4 4 0 0 0 12 2zm0 16a2 2 0 0 1-2-2v-5h4v5a2 2 0 0 1-2 2z",
    },
    {
      id: 3,
      title: "AC Diagnostics",
      desc: "Comprehensive system scan and fault analysis",
      time: "30 min",
      icon: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    },
    {
      id: 4,
      title: "Compressor Replacement",
      desc: "OEM-grade compressor swap with warranty",
      time: "2–3 hrs",
      icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    },
    {
      id: 5,
      title: "Electrical System Repair",
      desc: "Wiring, relays & control module diagnostics",
      time: "1–2 hrs",
      icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    },
    {
      id: 6,
      title: "Cabin Air Filter Service",
      desc: "Replace & clean the cabin air filtration system",
      time: "20 min",
      icon: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    },
    {
      id: 7,
      title: "Evaporator Service",
      desc: "Deep clean and leak test of evaporator core",
      time: "2 hrs",
      icon: "M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2",
    },
    {
      id: 8,
      title: "Complete System Installation",
      desc: "Brand-new AC unit install from scratch",
      time: "3–4 hrs",
      icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section
        className="relative text-white pt-24 pb-20 px-6 md:px-12 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/Hero Section images/hero_slide_1.jpg')",
        }}
      >
        {/* Background Overlays for the blue tint */}
        <div className="absolute inset-0 bg-[#1e3a8a]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e40af]/90 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start text-left">
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-sm md:text-base backdrop-blur-sm mb-6 shadow-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Online Appointment Booking
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">
            Book Your AC <span className="text-[#93c5fd]">Service</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mb-12 leading-relaxed drop-shadow">
            Schedule a certified auto AC service in minutes. Choose your
            service, pick a slot, and we'll handle the rest — guaranteed.
          </p>
        </div>
      </section>

      {/* Interactive Booking Section */}
      <section className="flex-1 bg-gray-50 py-12 px-4 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto mt-0 relative z-20">
          {/* Stepper */}
          <div className="flex items-center justify-center mb-12 flex-nowrap px-4 overflow-x-auto overflow-y-hidden pb-4">
            <div
              className={`flex flex-col items-center ${currentStep < 1 ? "opacity-50" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-100" : "bg-white border-2 border-gray-300 text-gray-500"}`}
              >
                {currentStep > 1 ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  "1"
                )}
              </div>
              <p
                className={`mt-3 text-sm font-bold ${currentStep >= 1 ? "text-gray-800" : "text-gray-600"}`}
              >
                Service
              </p>
              <p className="text-xs text-gray-500 whitespace-nowrap">
                Select service type
              </p>
            </div>
            <div
              className={`w-16 md:w-32 h-[1px] mx-2 -mt-8 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"}`}
            ></div>

            <div
              className={`flex flex-col items-center ${currentStep < 2 ? "opacity-50" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-100" : "bg-white border-2 border-gray-300 text-gray-500"}`}
              >
                {currentStep > 2 ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  "2"
                )}
              </div>
              <p
                className={`mt-3 text-sm font-semibold ${currentStep >= 2 ? "text-gray-800" : "text-gray-600"}`}
              >
                Vehicle
              </p>
              <p className="text-xs text-gray-500 whitespace-nowrap">
                Your vehicle & schedule
              </p>
            </div>
            <div
              className={`w-16 md:w-32 h-[1px] mx-2 -mt-8 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"}`}
            ></div>

            <div
              className={`flex flex-col items-center ${currentStep < 3 ? "opacity-50" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-100" : "bg-white border-2 border-gray-300 text-gray-500"}`}
              >
                {currentStep > 3 ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  "3"
                )}
              </div>
              <p
                className={`mt-3 text-sm font-semibold ${currentStep >= 3 ? "text-gray-800" : "text-gray-600"}`}
              >
                Details
              </p>
              <p className="text-xs text-gray-500 whitespace-nowrap">
                Personal information
              </p>
            </div>
            <div
              className={`w-16 md:w-32 h-[1px] mx-2 -mt-8 ${currentStep >= 4 ? "bg-blue-600" : "bg-gray-300"}`}
            ></div>

            <div
              className={`flex flex-col items-center ${currentStep < 4 ? "opacity-50" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 4 ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-100" : "bg-white border-2 border-gray-300 text-gray-500"}`}
              >
                4
              </div>
              <p
                className={`mt-3 text-sm font-semibold ${currentStep >= 4 ? "text-gray-800" : "text-gray-600"}`}
              >
                Review
              </p>
              <p className="text-xs text-gray-500 whitespace-nowrap">
                Confirm your booking
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Container */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Select a Service
                      </h2>
                      <p className="text-gray-500">
                        What would you like us to do?
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        onClick={() => {
                          setSelectedService(svc.id);
                          setErrors((p) => ({ ...p, service: undefined }));
                        }}
                        className={`cursor-pointer border-2 rounded-xl p-4 flex gap-4 transition-all relative ${
                          selectedService === svc.id
                            ? "border-indigo-400 bg-indigo-50/50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center mt-1 ${
                            selectedService === svc.id
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={svc.icon}
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-semibold ${selectedService === svc.id ? "text-indigo-900" : "text-gray-900"}`}
                          >
                            {svc.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 mb-2 leading-relaxed">
                            {svc.desc}
                          </p>
                          <div className="flex items-center text-xs text-gray-400 font-medium">
                            <svg
                              className="w-3.5 h-3.5 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {svc.time}
                          </div>
                        </div>
                        {selectedService === svc.id && (
                          <div className="absolute right-4 top-4 text-indigo-500 bg-white rounded-full">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {errors.service && (
                    <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-4a1 1 0 00-.993.883L9 7v4a1 1 0 001.993.117L11 11V7a1 1 0 00-1-1zm0 9a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 15z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>{errors.service}</div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => {
                        if (!selectedService) {
                          setErrors((p) => ({
                            ...p,
                            service: "Please select a service to continue.",
                          }));
                          return;
                        }
                        setErrors((p) => ({ ...p, service: undefined }));
                        setCurrentStep(2);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md flex items-center gap-2 transition-all"
                    >
                      Continue
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <>
                {currentStep === 2 && (
                  <>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex-col">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            Your Vehicle
                          </h2>
                          <p className="text-sm text-gray-500">
                            Select your vehicle type
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {vehicleTypes.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setSelectedVehicleType(t.id);
                              setErrors((p) => ({ ...p, vehicle: undefined }));
                            }}
                            className={`cursor-pointer rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                              selectedVehicleType === t.id
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : "bg-white hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            <span className="text-2xl">{t.icon}</span>
                            <span className="text-xs font-semibold">
                              {t.id}
                            </span>
                          </div>
                        ))}
                        {errors.vehicle && (
                          <div className="mt-3 text-sm text-red-600">
                            {errors.vehicle}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Make / Model
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Toyota Camry"
                            value={makeModel}
                            onChange={(e) => setMakeModel(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 2021"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex-col">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            Pick a Date & Time
                          </h2>
                          <p className="text-sm text-gray-500">
                            Choose your preferred appointment slot
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2">
                          <p className="text-sm font-bold text-gray-800 mb-3">
                            Preferred Date *
                          </p>
                          <div className="border border-gray-200 rounded-xl p-4 bg-white">
                            <div className="flex justify-between items-center mb-4">
                              <button
                                onClick={handlePrevMonth}
                                className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={
                                  viewDate.getFullYear() ===
                                    today.getFullYear() &&
                                  viewDate.getMonth() === today.getMonth()
                                }
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </button>
                              <span className="font-semibold text-sm text-gray-800">
                                {viewDate.toLocaleString("default", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                              <button
                                onClick={handleNextMonth}
                                className="p-1 hover:bg-gray-100 rounded text-gray-600"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                                (d) => (
                                  <div
                                    key={d}
                                    className="text-[10px] uppercase font-bold text-gray-400"
                                  >
                                    {d}
                                  </div>
                                ),
                              )}
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center">
                              {calendarDays.map((day, index) => {
                                if (!day) {
                                  return <div key={`empty-${index}`}></div>;
                                }
                                const isPast = day < today;
                                const isSelected =
                                  selectedDate?.getTime() === day.getTime();

                                return (
                                  <div
                                    key={day.toISOString()}
                                    onClick={() => {
                                      if (!isPast) {
                                        setSelectedDate(day);
                                        setSelectedTime(null); // Reset time when date changes
                                        setErrors((p) => ({
                                          ...p,
                                          date: undefined,
                                        }));
                                      }
                                    }}
                                    className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm ${
                                      isPast
                                        ? "text-gray-300 pointer-events-none"
                                        : "cursor-pointer hover:bg-blue-50 text-gray-700"
                                    } ${
                                      isSelected
                                        ? "bg-blue-600 text-white font-bold shadow-md"
                                        : ""
                                    }`}
                                  >
                                    {day.getDate()}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {errors.date && (
                            <div className="mt-2 text-sm text-red-600">
                              {errors.date}
                            </div>
                          )}
                        </div>

                        <div className="w-full md:w-1/2">
                          <p className="text-sm font-bold text-gray-800 mb-3">
                            Available Times *
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {isLoadingTimes && (
                              <div className="col-span-2 text-center text-gray-500">
                                Loading times...
                              </div>
                            )}
                            {!isLoadingTimes &&
                              [
                                "8:00 AM",
                                "9:00 AM",
                                "10:00 AM",
                                "11:00 AM",
                                "12:00 PM",
                                "1:00 PM",
                                "2:00 PM",
                                "3:00 PM",
                                "4:00 PM",
                                "5:00 PM",
                              ].map((time) => {
                                const isBooked = bookedTimes.includes(time);
                                return (
                                  <button
                                    key={time}
                                    disabled={isBooked}
                                    onClick={() => {
                                      if (!isBooked) {
                                        setSelectedTime(time);
                                        setErrors((p) => ({
                                          ...p,
                                          time: undefined,
                                        }));
                                      }
                                    }}
                                    className={`border rounded-lg p-2.5 text-center text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                                      selectedTime === time
                                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                        : isBooked
                                          ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
                                          : "border-gray-200 bg-white hover:border-blue-300 text-gray-700"
                                    }`}
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    {time}
                                  </button>
                                );
                              })}
                            {errors.time && (
                              <div className="mt-2 text-sm text-red-600">
                                {errors.time}
                              </div>
                            )}
                          </div>
                          {!isLoadingTimes && bookedTimes.length > 0 && (
                            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-3">
                              <p className="font-bold text-sm">
                                Already Booked:
                              </p>
                              <p className="text-xs">
                                {bookedTimes.join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-6 rounded-full transition-all flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back
                      </button>
                      <button
                        onClick={() => {
                          let hasError = false;
                          const newErrors: typeof errors = {};
                          if (!selectedVehicleType) {
                            newErrors.vehicle =
                              "Please select your vehicle type.";
                            hasError = true;
                          }
                          if (!selectedDate) {
                            newErrors.date = "Please choose a preferred date.";
                            hasError = true;
                          }
                          if (!selectedTime) {
                            newErrors.time =
                              "Please choose an available time slot.";
                            hasError = true;
                          }
                          if (hasError) {
                            setErrors((p) => ({ ...p, ...newErrors }));
                            return;
                          }
                          setErrors((p) => ({
                            ...p,
                            vehicle: undefined,
                            date: undefined,
                            time: undefined,
                          }));
                          setCurrentStep(3);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-full shadow-md flex items-center gap-2 transition-all"
                      >
                        Continue
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                )}

                {activeStep === 3 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Personal Information
                        </h2>
                        <p className="text-sm text-gray-500">
                          We&apos;ll use this to confirm your booking
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </span>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              setErrors((p) => ({ ...p, fullName: undefined }));
                            }}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black placeholder:text-gray-400"
                          />
                          {errors.fullName && (
                            <div className="mt-2 text-sm text-red-600">
                              {errors.fullName}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </span>
                            <input
                              type="email"
                              placeholder="john@example.com"
                              value={emailAddress}
                              onChange={(e) => {
                                setEmailAddress(e.target.value);
                                setErrors((p) => ({ ...p, email: undefined }));
                              }}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black placeholder:text-gray-400"
                            />
                            {errors.email && (
                              <div className="mt-2 text-sm text-red-600">
                                {errors.email}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.518 4.55a1 1 0 01-.272 1.03L8.27 10.728a11.042 11.042 0 005.452 5.452l1.464-1.204a1 1 0 011.03-.272l4.55 1.518a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C10.297 21 3 13.703 3 5V5z"
                                />
                              </svg>
                            </span>
                            <input
                              type="tel"
                              placeholder="+1 (234) 567-890"
                              value={phoneNumber}
                              onChange={(e) => {
                                setPhoneNumber(e.target.value);
                                setErrors((p) => ({ ...p, phone: undefined }));
                              }}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black placeholder:text-gray-400"
                            />
                            {errors.phone && (
                              <div className="mt-2 text-sm text-red-600">
                                {errors.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Additional Notes{" "}
                          <span className="text-gray-500 font-normal">
                            (Optional)
                          </span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-4 text-gray-400 pointer-events-none">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 8h10M7 12h6m-8 8h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </span>
                          <textarea
                            placeholder="Any specific concerns or requirements..."
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            rows={4}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black placeholder:text-gray-400 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800 flex items-start gap-3">
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M12 18a6 6 0 100-12 6 6 0 000 12z"
                        />
                      </svg>
                      <p>
                        Your information is kept private and secure. We only use
                        it to manage your appointment and send relevant updates.
                      </p>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-6 rounded-full transition-all flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back
                      </button>
                      <button
                        onClick={() => {
                          let hasError = false;
                          const newErrors: typeof errors = {};
                          if (!fullName.trim()) {
                            newErrors.fullName = "Please enter your full name.";
                            hasError = true;
                          }
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          if (
                            !emailAddress.trim() ||
                            !emailRegex.test(emailAddress)
                          ) {
                            newErrors.email =
                              "Please provide a valid email address.";
                            hasError = true;
                          }
                          const phoneRegex = /^[0-9+()\-\s]{7,}$/;
                          if (
                            !phoneNumber.trim() ||
                            !phoneRegex.test(phoneNumber)
                          ) {
                            newErrors.phone =
                              "Please provide a valid phone number.";
                            hasError = true;
                          }
                          if (hasError) {
                            setErrors((p) => ({ ...p, ...newErrors }));
                            return;
                          }
                          setErrors((p) => ({
                            ...p,
                            fullName: undefined,
                            email: undefined,
                            phone: undefined,
                          }));
                          setCurrentStep(4);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-full shadow-md flex items-center gap-2 transition-all"
                      >
                        Review Booking
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m7-4a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Review Your Booking
                        </h2>
                        <p className="text-sm text-gray-500">
                          Please verify your details before confirming
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {/* Service Card */}
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                              Service
                            </p>
                            <p className="font-semibold text-gray-900">
                              {selectedService
                                ? services.find((s) => s.id === selectedService)
                                    ?.title
                                : "—"}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {selectedService
                                ? services.find((s) => s.id === selectedService)
                                    ?.time
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Vehicle Card */}
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                              Vehicle
                            </p>
                            <p className="font-semibold text-gray-900">
                              {
                                vehicleTypes.find(
                                  (vehicle) =>
                                    vehicle.id === selectedVehicleType,
                                )?.icon
                              }{" "}
                              {selectedVehicleType}
                            </p>
                            {makeModel && (
                              <p className="text-xs text-gray-600 mt-1">
                                {makeModel} {year ? `• ${year}` : ""}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Date Card */}
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                              Date
                            </p>
                            <p className="font-semibold text-gray-900">
                              {selectedDate
                                ? `${selectedDate.toLocaleString("default", { month: "long" })} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Time Card */}
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                              Time
                            </p>
                            <p className="font-semibold text-gray-900">
                              {selectedTime ?? "—"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Contact Card */}
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                              Contact
                            </p>
                            <p className="font-semibold text-gray-900">
                              {fullName || "—"}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {emailAddress || "—"}
                            </p>
                            <p className="text-xs text-gray-600">
                              {phoneNumber || "—"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Notes Card */}
                      {additionalNotes && (
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-between items-start">
                          <div className="flex gap-4 flex-1">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 8h10M7 12h6m-8 8h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                                Notes
                              </p>
                              <p className="text-sm text-gray-900">
                                {additionalNotes}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setCurrentStep(3)}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    {submissionError && (
                      <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-6">
                        {submissionError}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setCurrentStep(3)}
                        disabled={isSubmitting}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-6 rounded-full transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back
                      </button>
                      <button
                        onClick={handleBookingConfirmation}
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-full shadow-md flex items-center gap-2 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Confirm Appointment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            </div>

            {/* Right Container: Summary */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              {/* Booking Summary Box */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 p-6 text-white">
                  <h3 className="text-xl font-bold">Booking Summary</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Your selections so far
                  </p>
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-0.5 uppercase tracking-wide">
                        Service
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedService
                          ? services.find((s) => s.id === selectedService)
                              ?.title
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-0.5 uppercase tracking-wide">
                        Vehicle
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {
                          vehicleTypes.find(
                            (vehicle) => vehicle.id === selectedVehicleType,
                          )?.icon
                        }{" "}
                        {selectedVehicleType ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-0.5 uppercase tracking-wide">
                        Date
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedDate
                          ? `${selectedDate.toLocaleString("default", { month: "long" })} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-0.5 uppercase tracking-wide">
                        Time
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedTime ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-0.5 uppercase tracking-wide">
                        Name
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {fullName || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 mt-2 pt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Est. Duration</p>
                    <p className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {selectedService
                        ? services.find((s) => s.id === selectedService)?.time
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* What to Expect Box */}
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <h4 className="font-bold text-blue-900 mb-4">What to Expect</h4>
                <ul className="space-y-3">
                  <li className="flex items-start text-sm text-blue-800">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Confirmation email within 30 min
                  </li>
                  <li className="flex items-start text-sm text-blue-800">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Reminder call 24 hrs before visit
                  </li>
                  <li className="flex items-start text-sm text-blue-800">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Free diagnostic included
                  </li>
                  <li className="flex items-start text-sm text-blue-800">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Flexible rescheduling anytime
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            {/* Top Blue Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl"></div>

            {/* Success Icon */}
            <div className="flex justify-center mb-6 pt-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Your appointment has been scheduled successfully.
            </p>

            {/* Booking Details Box */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  Booking Reference
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {bookingRef}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-blue-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {selectedService
                      ? services.find((s) => s.id === selectedService)?.title
                      : "Service"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-blue-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {
                      vehicleTypes.find((v) => v.id === selectedVehicleType)
                        ?.icon
                    }{" "}
                    {selectedVehicleType}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-blue-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {selectedDate
                      ? `${selectedDate.toLocaleString("default", { month: "long" })} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-blue-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {selectedTime}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-blue-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">{fullName}</span>
                </div>
              </div>
            </div>

            {/* Email Confirmation Message */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-900">
                  A confirmation email has been sent to{" "}
                </span>
                <span className="font-semibold text-blue-600">
                  {emailAddress}
                </span>
                <span className="text-gray-600">
                  . We'll also call you 24 hours before your appointment.
                </span>
              </p>
            </div>

            {/* Action Buttons: primary + clear Close (side-by-side for clarity) */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setCurrentStep(1);
                  setSelectedService(null);
                  setSelectedVehicleType(null);
                  setMakeModel("");
                  setYear("");
                  setFullName("");
                  setEmailAddress("");
                  setPhoneNumber("");
                  setAdditionalNotes("");
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setBookingRef("");
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v14m7-7H5"
                  />
                </svg>
                Book Another Appointment
              </button>

              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setCurrentStep(1);
                  setSelectedService(null);
                  setSelectedVehicleType(null);
                  setMakeModel("");
                  setYear("");
                  setFullName("");
                  setEmailAddress("");
                  setPhoneNumber("");
                  setAdditionalNotes("");
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setBookingRef("");
                }}
                className="flex-1 bg-white border-2 border-blue-200 hover:border-blue-300 text-blue-600 font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2"
                aria-label="Close and reset form"
              >
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}