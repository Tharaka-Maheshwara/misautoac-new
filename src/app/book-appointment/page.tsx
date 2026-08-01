"use client";

// Professional appointment flow UI - updated service, vehicle, and summary sections.

import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { db } from "@/lib/firebase";
import {
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  runTransaction,
  doc,
} from "firebase/firestore";

type VehicleIllustrationProps = {
  type: string;
  selected: boolean;
};

function VehicleIllustration({ type, selected }: VehicleIllustrationProps) {
  const gradientId = `vehicle-${type.toLowerCase().replace(/\s+/g, "-")}`;
  const colors: Record<string, [string, string]> = {
    Car: ["#2563eb", "#1d4ed8"],
    SUV: ["#0f766e", "#115e59"],
    Truck: ["#ea580c", "#c2410c"],
    Van: ["#7c3aed", "#5b21b6"],
    "Sports Car": ["#dc2626", "#991b1b"],
    Luxury: ["#111827", "#334155"],
    Electric: ["#0891b2", "#0369a1"],
    Hybrid: ["#16a34a", "#15803d"],
    Other: ["#64748b", "#475569"],
  };
  const [startColor, endColor] = colors[type] ?? colors.Other;

  const bodyPaths: Record<string, string> = {
    Car: "M20 68 31 51c4-7 11-11 20-12h82c12 0 21 5 28 15l28 5c8 1 13 6 13 13v7H18v-7c0-2 1-3 2-4Z",
    SUV: "M18 67 29 42c3-7 9-10 17-10h105c8 0 14 4 18 11l13 17 12 3c6 2 9 6 9 12v5H17v-8c0-2 0-3 1-5Z",
    Truck:
      "M18 69V45h93v15h19l10-17h31l17 20 8 2c5 2 7 5 7 10v5H17v-7c0-2 0-3 1-4Z",
    Van: "M20 68V30c0-5 4-9 9-9h120c9 0 15 4 20 11l19 27 7 5c4 3 6 6 6 11v5H18v-8c0-2 1-3 2-4Z",
    "Sports Car":
      "M18 70 31 59l40-8 27-14h42l26 18 24 5c8 2 12 6 12 13v6H17v-6l1-3Z",
    Luxury:
      "M18 68 32 49c5-7 12-10 21-11h79c12 0 22 5 30 17l26 5c9 2 14 6 14 13v7H17v-8l1-4Z",
    Electric:
      "M20 68 31 51c4-7 11-11 20-12h82c12 0 21 5 28 15l28 5c8 1 13 6 13 13v7H18v-7c0-2 1-3 2-4Z",
    Hybrid:
      "M20 68 31 51c4-7 11-11 20-12h82c12 0 21 5 28 15l28 5c8 1 13 6 13 13v7H18v-7c0-2 1-3 2-4Z",
    Other:
      "M20 68 31 51c4-7 11-11 20-12h82c12 0 21 5 28 15l28 5c8 1 13 6 13 13v7H18v-7c0-2 1-3 2-4Z",
  };

  const windowPaths: Record<string, string> = {
    SUV: "M43 39h48v19H36l7-19Zm55 0h49c6 0 11 3 14 8l8 11H98V39Z",
    Truck: "M142 49h26l11 13h-42l5-13Z",
    Van: "M34 29h56v29H30V34c0-3 1-5 4-5Zm64 0h49c7 0 11 3 15 9l13 20H98V29Z",
    "Sports Car": "M77 52 101 42h36l17 13-77-3Z",
    default:
      "M48 46c3-3 7-4 12-4h35v16H39l9-12Zm54-4h28c9 0 16 4 22 13l2 3h-52V42Z",
  };

  const rearWheelX = type === "Truck" ? 54 : 55;
  const frontWheelX = type === "Truck" ? 174 : 166;

  return (
    <svg
      viewBox="0 0 220 105"
      className="h-full w-full"
      role="img"
      aria-label={`${type} vector illustration`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={startColor} />
          <stop offset="1" stopColor={endColor} />
        </linearGradient>
        <linearGradient id={`${gradientId}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbeafe" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="91" rx="88" ry="7" fill="#0f172a" opacity="0.14" />
      <path
        d={bodyPaths[type] ?? bodyPaths.Other}
        fill={`url(#${gradientId})`}
        stroke={selected ? "#ffffff" : "#1e293b"}
        strokeWidth="1.5"
      />
      <path
        d={windowPaths[type] ?? windowPaths.default}
        fill={`url(#${gradientId}-glass)`}
        stroke="#e2e8f0"
        strokeWidth="1"
      />
      <path d="M23 68h176" stroke="#ffffff" strokeOpacity="0.32" />
      <rect x="22" y="67" width="8" height="5" rx="2" fill="#fef08a" />
      <rect x="191" y="67" width="8" height="5" rx="2" fill="#fecaca" />

      {[rearWheelX, frontWheelX].map((wheelX) => (
        <g key={wheelX}>
          <circle cx={wheelX} cy="79" r="13" fill="#0f172a" />
          <circle cx={wheelX} cy="79" r="7" fill="#94a3b8" />
          <circle cx={wheelX} cy="79" r="3" fill="#e2e8f0" />
        </g>
      ))}

      {type === "Electric" && (
        <path d="m112 48-9 14h7l-2 11 12-17h-8l3-8h-3Z" fill="#fef08a" />
      )}
      {type === "Hybrid" && (
        <path
          d="M105 67c13 0 22-7 24-18-12 0-22 5-24 18Zm0 0c-1-8-6-13-14-15 0 8 4 14 14 15Z"
          fill="#bbf7d0"
        />
      )}
      {type === "Other" && (
        <text
          x="110"
          y="67"
          textAnchor="middle"
          fill="#fff"
          fontSize="22"
          fontWeight="800"
        >
          ?
        </text>
      )}
    </svg>
  );
}

export default function BookAppointmentPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const activeStep = Number(currentStep);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
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
  const [emailStatus, setEmailStatus] = useState<"idle" | "sent" | "failed">(
    "idle",
  );
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

  useEffect(() => {
    const bookingFlow = document.getElementById("booking-flow");
    if (!bookingFlow) return;

    const timer = window.setTimeout(() => {
      bookingFlow.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [currentStep]);

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
          collection(db, "BookedSlots"),
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

  const calendarDays = Array.from(
    { length: startingDayOfWeek },
    () => null,
  ).concat(
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
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  // --- End Calendar Logic ---

  const handleServiceSelection = (serviceId: number) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
    setErrors((p) => ({ ...p, service: undefined }));
  };

  const handleBookingConfirmation = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setEmailStatus("idle");

    const serviceTitles = services
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => service.title);

    try {
      const createdBookingRef = await runTransaction(
        db,
        async (transaction) => {
          // Read the shared counter before performing any writes. Keeping the
          // counter update inside this transaction prevents duplicate booking
          // references when two customers submit at the same time.
          const counterRef = doc(db, "Counters", "appointments");
          const counterSnapshot = await transaction.get(counterRef);
          const lastBookingNumber = counterSnapshot.exists()
            ? Number(counterSnapshot.data().lastBookingNumber ?? 0)
            : 0;
          const nextBookingNumber = lastBookingNumber + 1;
          const sequentialBookingRef = `Mist_Auto_${String(
            nextBookingNumber,
          ).padStart(3, "0")}`;

          // 1. Create the private appointment document
          const appointmentRef = doc(collection(db, "Appointments"));
          const appointmentData = {
            bookingRef: sequentialBookingRef,
            services: serviceTitles,
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
          transaction.set(appointmentRef, appointmentData);

          // 2. Create the public booked slot document
          const bookedSlotData = {
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
          };
          const bookedSlotRef = doc(collection(db, "BookedSlots"));
          transaction.set(bookedSlotRef, bookedSlotData);

          // 3. Save the number used for the next appointment transaction.
          transaction.set(
            counterRef,
            {
              lastBookingNumber: nextBookingNumber,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          );

          return sequentialBookingRef;
        },
      );

      setBookingRef(createdBookingRef);

      // The appointment is already saved at this point. Client and admin
      // emails are sent independently, so an email failure never rolls back
      // or incorrectly reports the successful Firebase booking.
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const clientTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const adminTemplateId = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        booking_ref: createdBookingRef,
        customer_name: fullName.trim(),
        customer_email: emailAddress.trim(),
        customer_phone: phoneNumber.trim(),
        appointment_date:
          selectedDate?.toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }) ?? "Not specified",
        appointment_time: selectedTime ?? "Not specified",
        services: serviceTitles.map((service) => `- ${service}`).join("\n"),
        vehicle_type: selectedVehicleType ?? "Not specified",
        make_model: makeModel.trim() || "Not specified",
        vehicle_year: year.trim() || "Not specified",
        notes: additionalNotes.trim() || "No additional notes provided.",
      };

      const missingEmailConfig = [
        ["NEXT_PUBLIC_EMAILJS_SERVICE_ID", serviceId],
        ["NEXT_PUBLIC_EMAILJS_TEMPLATE_ID", clientTemplateId],
        ["NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID", adminTemplateId],
        ["NEXT_PUBLIC_EMAILJS_PUBLIC_KEY", publicKey],
      ]
        .filter(([, value]) => !value)
        .map(([name]) => name);

      if (missingEmailConfig.length > 0) {
        console.error(
          `EmailJS configuration missing: ${missingEmailConfig.join(", ")}`,
        );
        setEmailStatus("failed");
      } else {
        const [clientEmailResult, adminEmailResult] = await Promise.allSettled([
          emailjs.send(
            serviceId as string,
            clientTemplateId as string,
            templateParams,
            { publicKey: publicKey as string },
          ),
          emailjs.send(
            serviceId as string,
            adminTemplateId as string,
            templateParams,
            { publicKey: publicKey as string },
          ),
        ]);

        if (clientEmailResult.status === "fulfilled") {
          setEmailStatus("sent");
        } else {
          const clientError = clientEmailResult.reason as {
            status?: number;
            text?: string;
          };
          console.error("Client confirmation email failed:", {
            status: clientError?.status,
            message:
              clientError?.text ??
              (clientEmailResult.reason instanceof Error
                ? clientEmailResult.reason.message
                : "Unknown EmailJS error"),
          });
          setEmailStatus("failed");
        }

        if (adminEmailResult.status === "rejected") {
          const adminError = adminEmailResult.reason as {
            status?: number;
            text?: string;
          };
          console.error("Admin appointment notification email failed:", {
            status: adminError?.status,
            message:
              adminError?.text ??
              (adminEmailResult.reason instanceof Error
                ? adminEmailResult.reason.message
                : "Unknown EmailJS error"),
          });
        }
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error("Error in booking transaction: ", error);
      setSubmissionError("Could not save your appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const vehicleTypes = [
    {
      id: "Car",
      code: "CAR",
      description: "Sedan & hatchback",
      path: "M3 16v-3l2-5h14l2 5v3H3Zm3-3h12M6 16v2m12-2v2",
    },
    {
      id: "SUV",
      code: "SUV",
      description: "SUV & crossover",
      path: "M3 16V9l3-4h11l4 5v6H3Zm3-6h11M6 16v2m12-2v2",
    },
    {
      id: "Truck",
      code: "TRK",
      description: "Pickup & utility",
      path: "M3 7h11v9H3V7Zm11 4h4l3 3v2h-7v-5ZM6 16v2m12-2v2",
    },
    {
      id: "Van",
      code: "VAN",
      description: "Passenger & cargo",
      path: "M4 5h12l4 5v12H4V5Zm3 3h7m3 2h3M7 17v2m10-2v2",
    },
    {
      id: "Sports Car",
      code: "SPT",
      description: "Performance vehicle",
      path: "M2 16v-3l5-4h9l6 4v3H2Zm5-3h10M6 16v2m12-2v2",
    },
    {
      id: "Luxury",
      code: "LUX",
      description: "Premium vehicle",
      path: "M3 16v-3l3-6h12l3 6v3H3Zm4-4h10M7 16v2m10-2v2M10 7l2-2 2 2",
    },
    {
      id: "Electric",
      code: "EV",
      description: "Fully electric",
      path: "M13 2 6 13h5l-1 9 8-12h-5V2Z",
    },
    {
      id: "Hybrid",
      code: "HYB",
      description: "Hybrid powertrain",
      path: "M7 4h10v16H7V4Zm3-2h4m-3 6-2 4h3l-1 4 4-6h-3l1-2",
    },
    {
      id: "Other",
      code: "OTH",
      description: "Another vehicle type",
      path: "M12 3v18M3 12h18M5.5 5.5l13 13m0-13-13 13",
    },
  ];

  const services = [
    {
      id: 1,
      title: "AC Repair & Maintenance",
      desc: "Full inspection & repair of all AC components",
      time: "1-2 hrs",
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
      time: "2-3 hrs",
      icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    },
    {
      id: 5,
      title: "Electrical System Repair",
      desc: "Wiring, relays & control module diagnostics",
      time: "1-2 hrs",
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
      time: "3-4 hrs",
      icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    },
  ];

  const bookingSteps = [
    { number: 1, title: "Service", subtitle: "Choose services" },
    { number: 2, title: "Vehicle", subtitle: "Vehicle & schedule" },
    { number: 3, title: "Details", subtitle: "Contact information" },
    { number: 4, title: "Review", subtitle: "Confirm booking" },
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
            service, pick a slot, and we'll handle the rest - guaranteed.
          </p>
        </div>
      </section>

      {/* Interactive Booking Section */}
      <section
        id="booking-flow"
        className="relative z-10 scroll-mt-20 flex-1 bg-gray-50 px-4 py-12 md:px-12"
      >
        <div className="max-w-7xl mx-auto mt-0 relative z-20">
          {/* Stepper */}
          <div className="mb-12 overflow-x-auto pb-4">
            <div className="mx-auto flex min-w-[650px] max-w-4xl items-start rounded-3xl border border-slate-200/80 bg-white px-7 py-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.5),inset_0_1px_0_white] sm:px-10">
              {bookingSteps.map((step, index) => {
                const isCompleted = currentStep > step.number;
                const isActive = currentStep === step.number;

                return (
                  <React.Fragment key={step.number}>
                    <div className="relative flex w-28 shrink-0 flex-col items-center text-center sm:w-36">
                      <div
                        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-extrabold transition-all duration-300 ${
                          isCompleted
                            ? "bg-emerald-500 text-white shadow-[0_10px_22px_-8px_rgba(16,185,129,0.75)] ring-4 ring-emerald-100"
                            : isActive
                              ? "scale-110 bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-[0_12px_26px_-8px_rgba(37,99,235,0.85)] ring-4 ring-blue-100"
                              : "border border-slate-200 bg-slate-50 text-slate-400 shadow-sm"
                        }`}
                      >
                        {isCompleted ? (
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="m5 12 4 4L19 7"
                            />
                          </svg>
                        ) : (
                          step.number
                        )}
                      </div>

                      <p
                        className={`mt-4 text-sm font-extrabold ${
                          isCompleted
                            ? "text-emerald-700"
                            : isActive
                              ? "text-blue-700"
                              : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p
                        className={`mt-1 whitespace-nowrap text-[11px] ${isActive || isCompleted ? "text-slate-500" : "text-slate-400"}`}
                      >
                        {step.subtitle}
                      </p>

                      {isActive && (
                        <span className="mt-3 rounded-full bg-blue-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-blue-600">
                          Current step
                        </span>
                      )}
                    </div>

                    {index < bookingSteps.length - 1 && (
                      <div className="relative mt-6 h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                            currentStep > step.number
                              ? "w-full bg-linear-to-r from-emerald-400 to-blue-500"
                              : "w-0 bg-blue-500"
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Container */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              {currentStep === 1 && (
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.5),0_3px_8px_rgba(15,23,42,0.08)] sm:p-7 md:p-8">
                  <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
                  <div className="relative mb-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-[0_12px_24px_-9px_rgba(37,99,235,0.8),inset_0_1px_0_rgba(255,255,255,0.35)]">
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
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                        Step 01 - Service selection
                      </p>
                      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Select a Service
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Choose one or more services for your vehicle.
                      </p>
                    </div>
                  </div>

                  <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2">
                    {services.map((svc) => {
                      const isSelected = selectedServices.includes(svc.id);
                      return (
                        <button
                          type="button"
                          key={svc.id}
                          onClick={() => handleServiceSelection(svc.id)}
                          aria-pressed={isSelected}
                          className={`group relative flex min-h-32 gap-4 overflow-hidden rounded-2xl border p-4 text-left outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-blue-500/20 sm:p-5 ${
                            isSelected
                              ? "-translate-y-1 border-blue-500 bg-linear-to-br from-blue-50 via-white to-blue-100/80 shadow-[0_18px_34px_-17px_rgba(37,99,235,0.65),inset_0_1px_0_white] ring-1 ring-blue-500/10"
                              : "border-slate-200 bg-linear-to-br from-white to-slate-50 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.7),inset_0_1px_0_white] hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_18px_32px_-18px_rgba(37,99,235,0.45),inset_0_1px_0_white]"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-[0_8px_18px_-7px_rgba(37,99,235,0.8)] ring-4 ring-blue-100"
                                : "border border-slate-200 bg-white text-slate-500 shadow-sm group-hover:border-blue-200 group-hover:text-blue-600"
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
                              className={`pr-7 text-sm font-bold leading-5 sm:text-base ${isSelected ? "text-blue-950" : "text-slate-900"}`}
                            >
                              {svc.title}
                            </h3>
                            <p className="mt-1.5 mb-3 text-xs leading-5 text-slate-500">
                              {svc.desc}
                            </p>
                            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-500 shadow-sm">
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
                          {isSelected && (
                            <div className="absolute top-3 right-3 rounded-full bg-blue-600 p-0.5 text-white shadow-md ring-4 ring-blue-100">
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
                        </button>
                      );
                    })}
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

                  <div className="relative mt-8 flex flex-col items-stretch justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
                    <p className="text-xs font-medium text-slate-500">
                      {selectedServices.length > 0
                        ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} selected`
                        : "Select at least one service to continue"}
                    </p>
                    <button
                      onClick={() => {
                        if (selectedServices.length === 0) {
                          setErrors((p) => ({
                            ...p,
                            service:
                              "Please select at least one service to continue.",
                          }));
                          return;
                        }
                        setErrors((p) => ({ ...p, service: undefined }));
                        setCurrentStep(2);
                      }}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-11px_rgba(37,99,235,0.85),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                      Continue
                      <svg
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
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
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.45),0_2px_5px_rgba(15,23,42,0.08)] sm:p-7 md:p-8">
                      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />
                      <div className="relative mb-7 flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-[0_10px_22px_-8px_rgba(37,99,235,0.75),inset_0_1px_0_rgba(255,255,255,0.35)]">
                          <svg
                            className="h-6 w-6"
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
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                            Step 02 - Vehicle details
                          </p>
                          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                            Your Vehicle
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Choose the option that best describes your vehicle.
                          </p>
                        </div>
                      </div>

                      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {vehicleTypes.map((t) => (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => {
                              setSelectedVehicleType(t.id);
                              setErrors((p) => ({ ...p, vehicle: undefined }));
                            }}
                            aria-pressed={selectedVehicleType === t.id}
                            className={`group relative min-h-36 overflow-hidden rounded-2xl border p-3 text-left outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-blue-500/20 sm:min-h-40 ${
                              selectedVehicleType === t.id
                                ? "-translate-y-1 border-blue-500 bg-linear-to-br from-blue-50 via-white to-blue-100/80 shadow-[0_16px_30px_-14px_rgba(37,99,235,0.55),inset_0_1px_0_white] ring-1 ring-blue-500/10"
                                : "border-slate-200 bg-linear-to-br from-white to-slate-50 shadow-[0_8px_18px_-16px_rgba(15,23,42,0.65),inset_0_1px_0_white] hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_16px_28px_-16px_rgba(37,99,235,0.38),inset_0_1px_0_white]"
                            }`}
                          >
                            <span
                              className={`relative mb-3 flex h-20 w-full items-center justify-center overflow-hidden rounded-xl border shadow-sm transition-all sm:h-24 ${
                                selectedVehicleType === t.id
                                  ? "border-blue-500 bg-linear-to-br from-blue-500 to-blue-700 text-white"
                                  : "border-slate-200 bg-linear-to-br from-white to-slate-100 text-slate-600"
                              }`}
                            >
                              <span className="h-full w-full transition-transform duration-300 group-hover:scale-105">
                                <VehicleIllustration
                                  type={t.id}
                                  selected={selectedVehicleType === t.id}
                                />
                              </span>
                              <span className="absolute right-2 bottom-2 rounded-md bg-white/90 px-2 py-1 text-[9px] font-black tracking-wider text-slate-700 shadow-sm sm:text-[10px]">
                                {t.code}
                              </span>
                            </span>
                            <span className="block px-1 text-xs font-bold text-slate-900 sm:text-sm">
                              {t.id}
                            </span>
                            <span className="mt-1 hidden px-1 text-[10px] leading-4 text-slate-500 sm:block">
                              {t.description}
                            </span>

                            {selectedVehicleType === t.id && (
                              <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                                <svg
                                  className="h-3 w-3"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <path
                                    d="m5 10 3 3 7-7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      {errors.vehicle && (
                        <div className="relative mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          {errors.vehicle}
                        </div>
                      )}

                      <div className="relative mt-7 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Make / Model
                          </label>
                          <div className="group relative">
                            <svg
                              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.8}
                                d="M3 13l2-5h14l2 5v6h-2v-2H5v2H3v-6Zm3.5 1.5h.01m10.99 0h.01M6 8l1.5-3h9L18 8"
                              />
                            </svg>
                            <input
                              type="text"
                              placeholder="e.g. Toyota Camry"
                              value={makeModel}
                              onChange={(e) => setMakeModel(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3.5 pr-4 pl-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Year
                          </label>
                          <div className="group relative">
                            <svg
                              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.8}
                                d="M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"
                              />
                            </svg>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={4}
                              placeholder="e.g. 2021"
                              value={year}
                              onChange={(e) => setYear(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3.5 pr-4 pl-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.5),0_3px_8px_rgba(15,23,42,0.08)] sm:p-7 md:p-8">
                      <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />
                      <div className="relative mb-7 flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-[0_12px_24px_-9px_rgba(37,99,235,0.8),inset_0_1px_0_rgba(255,255,255,0.35)]">
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
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                            Schedule your visit
                          </p>
                          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                            Pick a Date & Time
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Choose your preferred appointment slot
                          </p>
                        </div>
                      </div>

                      <div className="relative grid gap-6 md:grid-cols-2">
                        <div className="w-full">
                          <p className="text-sm font-bold text-gray-800 mb-3">
                            Preferred Date *
                          </p>
                          <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.65),inset_0_1px_0_white] sm:p-5">
                            <div className="flex justify-between items-center mb-4">
                              <button
                                onClick={handlePrevMonth}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
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
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
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
                                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-all ${
                                      isPast
                                        ? "pointer-events-none text-slate-300"
                                        : "cursor-pointer text-slate-700 hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700"
                                    } ${
                                      isSelected
                                        ? "bg-linear-to-br from-blue-500 to-blue-700 font-bold text-white shadow-[0_8px_16px_-6px_rgba(37,99,235,0.8)] ring-2 ring-blue-100"
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

                        <div className="w-full">
                          <p className="text-sm font-bold text-gray-800 mb-3">
                            Available Times *
                          </p>
                          <div className="grid grid-cols-2 gap-3">
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
                                    className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center text-sm font-semibold outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-blue-500/20 ${
                                      selectedTime === time
                                        ? "-translate-y-0.5 border-blue-600 bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-[0_10px_20px_-8px_rgba(37,99,235,0.8)]"
                                        : isBooked
                                          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through"
                                          : "border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
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
                  <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.5),0_3px_8px_rgba(15,23,42,0.08)] sm:p-7 md:p-8">
                    <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />
                    <div className="relative mb-7 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-[0_12px_24px_-9px_rgba(37,99,235,0.8),inset_0_1px_0_rgba(255,255,255,0.35)]">
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
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                          Contact details
                        </p>
                        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                          Personal Information
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          We&apos;ll use this to confirm your booking
                        </p>
                      </div>
                    </div>

                    <div className="relative space-y-5">
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
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3.5 pr-4 pl-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
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
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3.5 pr-4 pl-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
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
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3.5 pr-4 pl-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
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
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 py-3.5 pr-4 pl-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-4 text-sm leading-6 text-blue-900 shadow-sm">
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

                    <div className="relative mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
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
                        className="group flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-8 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-11px_rgba(37,99,235,0.85)] transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
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
                  <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.5),0_3px_8px_rgba(15,23,42,0.08)] sm:p-7 md:p-8">
                    <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />
                    <div className="relative mb-7 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-[0_12px_24px_-9px_rgba(37,99,235,0.8),inset_0_1px_0_rgba(255,255,255,0.35)]">
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
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                          Final verification
                        </p>
                        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                          Review Your Booking
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Please verify your details before confirming
                        </p>
                      </div>
                    </div>

                    <div className="relative mb-8 grid grid-cols-1 gap-4">
                      {/* Service Card */}
                      <div className="flex min-h-28 items-start justify-between rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 shadow-[0_10px_22px_-19px_rgba(15,23,42,0.65),inset_0_1px_0_white] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
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
                              Services
                            </p>
                            <p className="font-semibold text-gray-900">
                              {selectedServices.length > 0
                                ? services
                                    .filter((s) =>
                                      selectedServices.includes(s.id),
                                    )
                                    .map((s) => s.title)
                                    .join(", ")
                                : "Not selected"}
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
                      <div className="flex min-h-28 items-start justify-between rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 shadow-[0_10px_22px_-19px_rgba(15,23,42,0.65),inset_0_1px_0_white] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
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
                              {selectedVehicleType}
                            </p>
                            {makeModel && (
                              <p className="text-xs text-gray-600 mt-1">
                                {makeModel} {year ? `- ${year}` : ""}
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
                      <div className="flex min-h-28 items-start justify-between rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 shadow-[0_10px_22px_-19px_rgba(15,23,42,0.65),inset_0_1px_0_white] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
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
                                : "Not selected"}
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
                      <div className="flex min-h-28 items-start justify-between rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 shadow-[0_10px_22px_-19px_rgba(15,23,42,0.65),inset_0_1px_0_white] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
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
                              {selectedTime ?? "Not selected"}
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
                      <div className="flex min-h-28 items-start justify-between rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 shadow-[0_10px_22px_-19px_rgba(15,23,42,0.65),inset_0_1px_0_white] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
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
                              {fullName || "Not provided"}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {emailAddress || "Not provided"}
                            </p>
                            <p className="text-xs text-gray-600">
                              {phoneNumber || "Not provided"}
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
                        <div className="flex min-h-28 items-start justify-between rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 shadow-[0_10px_22px_-19px_rgba(15,23,42,0.65),inset_0_1px_0_white] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
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
            <div className="flex w-full flex-col gap-6 lg:sticky lg:top-6 lg:w-1/3">
              {/* Booking Summary Box */}
              <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_22px_48px_-28px_rgba(15,23,42,0.5),0_3px_8px_rgba(15,23,42,0.08)]">
                <div className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-slate-900 p-6 text-white">
                  <div className="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5-3a9 9 0 1 1-16 0 9 9 0 0 1 16 0Z"
                      />
                    </svg>
                  </div>
                  <h3 className="relative text-xl font-extrabold tracking-tight">
                    Booking Summary
                  </h3>
                  <p className="relative mt-1 text-sm text-blue-100">
                    Your selections so far
                  </p>
                </div>
                <div className="flex flex-col gap-6 p-6">
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
                        Services
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedServices.length > 0
                          ? services
                              .filter((s) => selectedServices.includes(s.id))
                              .map((s) => s.title)
                              .join(", ")
                          : "Not selected"}
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
                        {selectedVehicleType ?? "Not selected"}
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
                          : "Not selected"}
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
                        {selectedTime ?? "Not selected"}
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
                        {fullName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Est. Duration
                    </p>
                    <p className="rounded-lg bg-white px-3 py-1.5 text-xs font-extrabold text-blue-700 shadow-sm ring-1 ring-blue-100">
                      {selectedServices.length > 0
                        ? services
                            .filter((s) => selectedServices.includes(s.id))
                            .map((s) => s.time)
                            .join(", ")
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* What to Expect Box */}
              <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-6 shadow-[0_16px_36px_-28px_rgba(37,99,235,0.65)]">
                <div className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-blue-100/80 blur-2xl" />
                <h4 className="relative mb-4 flex items-center gap-2 font-extrabold text-blue-950">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </span>
                  What to Expect
                </h4>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md sm:p-6">
          <div className="relative max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-[32px] border border-white/15 bg-white shadow-[0_40px_110px_-28px_rgba(2,6,23,0.85)]">
            <div className="relative overflow-hidden bg-linear-to-br from-[#0f172a] via-[#172554] to-blue-700 px-6 pt-8 pb-16 text-center text-white sm:px-10 sm:pt-10">
              <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
              <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="relative mb-5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-blue-200">
                <span className="h-px w-8 bg-blue-300/50" />
                Mist Auto A/C
                <span className="h-px w-8 bg-blue-300/50" />
              </div>

              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400 text-white shadow-[0_18px_42px_-12px_rgba(52,211,153,0.85)] ring-8 ring-white/10">
                <svg
                  className="h-10 w-10"
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

              <p className="relative mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                Appointment secured
              </p>
              <h2 className="relative mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Booking Confirmed
              </h2>
              <p className="relative text-sm leading-6 text-blue-100">
                Your service appointment is successfully scheduled.
              </p>
            </div>

            <div className="relative -mt-8 px-5 pb-6 sm:px-8 sm:pb-8">
              {/* Booking Details Box */}
              <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_48px_-26px_rgba(15,23,42,0.55)] sm:p-6">
                <div className="mb-5 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 p-4 text-center ring-1 ring-blue-100">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                    Booking Reference
                  </span>
                  <span className="mt-2 block text-2xl font-black tracking-[0.08em] text-blue-700 sm:text-3xl">
                    {bookingRef}
                  </span>
                </div>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:col-span-2">
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
                      {services
                        .filter((s) => selectedServices.includes(s.id))
                        .map((s) => s.title)
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
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
                      {selectedVehicleType}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
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
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
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
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
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
                    <span className="text-gray-700 font-medium">
                      {fullName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Confirmation Message */}
              <div
                className={`mb-6 rounded-2xl border p-4 shadow-sm ${
                  emailStatus === "sent"
                    ? "border-green-200 bg-green-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                {emailStatus === "sent" ? (
                  <p className="text-xs leading-relaxed text-green-800">
                    <span className="font-semibold">
                      A confirmation email has been sent to{" "}
                    </span>
                    <span className="font-bold">{emailAddress}</span>.
                  </p>
                ) : (
                  <p className="text-xs leading-relaxed text-amber-800">
                    <span className="font-semibold">
                      Your appointment was saved successfully,
                    </span>{" "}
                    but the confirmation email could not be sent. Please keep
                    your booking reference: {bookingRef}.
                  </p>
                )}
              </div>

              {/* Action Buttons: primary + clear Close (side-by-side for clarity) */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setCurrentStep(1);
                    setSelectedServices([]);
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
                    setEmailStatus("idle");
                  }}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_26px_-11px_rgba(37,99,235,0.85)] transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800"
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
                    setSelectedServices([]);
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
                    setEmailStatus("idle");
                  }}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
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
        </div>
      )}
    </div>
  );
}
