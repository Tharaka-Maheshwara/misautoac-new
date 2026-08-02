"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  PhoneIcon,
  PlusIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type AppointmentRecord = {
  id: string;
  bookingRef?: string;
  services?: string[];
  vehicleType?: string;
  makeModel?: string;
  year?: string;
  appointmentDate?: unknown;
  appointmentTime?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
  status?: string;
  createdAt?: unknown;
};

type AppointmentStatus =
  | "All"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Cancelled";

type DateView = "all" | "today" | "month" | "range";

type ReservedTime = {
  time: string;
  source: "Admin" | "Client";
};

const statusOptions: AppointmentStatus[] = [
  "All",
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
];

const APPOINTMENTS_PER_PAGE = 10;

const BOOKING_TIMES = [
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
];

const statusTone: Record<string, string> = {
  Scheduled: "border-blue-200 bg-blue-50 text-blue-700",
  "In Progress": "border-amber-200 bg-amber-50 text-amber-700",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cancelled: "border-rose-200 bg-rose-50 text-rose-700",
  Draft: "border-slate-200 bg-slate-50 text-slate-700",
};

function toDate(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const converted = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(converted.getTime()) ? null : converted;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof (value as { seconds?: unknown }).seconds === "number"
  ) {
    const converted = new Date((value as { seconds: number }).seconds * 1000);
    return Number.isNaN(converted.getTime()) ? null : converted;
  }

  if (typeof value === "string" || typeof value === "number") {
    const converted = new Date(value);
    return Number.isNaN(converted.getTime()) ? null : converted;
  }

  return null;
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function parseDateInput(value: string, end = false) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return end ? endOfDay(date) : startOfDay(date);
}

function formatDateInput(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value: unknown) {
  const date = toDate(value);
  if (!date) return "Date unavailable";

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCreatedDate(value: unknown) {
  const date = toDate(value);
  if (!date) return "Unknown";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildSearchIndex(appointment: AppointmentRecord) {
  return [
    appointment.bookingRef,
    appointment.customerName,
    appointment.customerEmail,
    appointment.customerPhone,
    appointment.vehicleType,
    appointment.makeModel,
    appointment.year,
    appointment.status,
    appointment.services?.join(" "),
    appointment.notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dateView, setDateView] = useState<DateView>("all");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentRecord | null>(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [reservationReason, setReservationReason] = useState("");
  const [isSavingReservation, setIsSavingReservation] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservedTimes, setReservedTimes] = useState<ReservedTime[]>([]);
  const [isLoadingReservedTimes, setIsLoadingReservedTimes] = useState(false);
  const [reservedTimesError, setReservedTimesError] = useState<string | null>(
    null,
  );

  async function loadAppointments() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const appointmentsQuery = query(
        collection(db, "Appointments"),
        orderBy("createdAt", "desc"),
        limit(500),
      );
      const snapshot = await getDocs(appointmentsQuery);
      const items = snapshot.docs.map((appointmentDoc) => ({
        id: appointmentDoc.id,
        ...(appointmentDoc.data() as Omit<AppointmentRecord, "id">),
      }));
      setAppointments(items);
    } catch (error) {
      console.error("Could not load appointments:", error);
      setErrorMessage(
        "Appointments could not be loaded. Verify your Admin role and Firestore rules, then try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setAppointments([]);
        setIsAuthReady(true);
        router.replace("/auth/login");
        return;
      }

      try {
        const profileSnapshot = await getDoc(doc(db, "Users", currentUser.uid));
        const profileData = profileSnapshot.exists()
          ? (profileSnapshot.data() as { role?: string })
          : null;
        const nextRole = profileData?.role ?? "User";
        setRole(nextRole);

        if (nextRole === "Admin" || nextRole === "Super Admin") {
          await loadAppointments();
        }
      } catch (error) {
        console.error("Could not load admin profile:", error);
        setRole("User");
      } finally {
        setIsAuthReady(true);
      }
    });

    return unsubscribe;
  }, [router]);

  const dateCounts = useMemo(() => {
    const now = new Date();
    let today = 0;
    let month = 0;

    appointments.forEach((appointment) => {
      const date = toDate(appointment.appointmentDate);
      if (!date) return;
      if (isSameDay(date, now)) today += 1;
      if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      ) {
        month += 1;
      }
    });

    return { all: appointments.length, today, month };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    const search = searchTerm.trim().toLowerCase();
    const start = parseDateInput(rangeStart);
    const end = parseDateInput(rangeEnd, true);

    return appointments.filter((appointment) => {
      const appointmentDate = toDate(appointment.appointmentDate);

      let matchesDate = true;
      if (dateView === "today") {
        matchesDate = Boolean(
          appointmentDate && isSameDay(appointmentDate, now),
        );
      } else if (dateView === "month") {
        matchesDate = Boolean(
          appointmentDate &&
          appointmentDate.getFullYear() === now.getFullYear() &&
          appointmentDate.getMonth() === now.getMonth(),
        );
      } else if (dateView === "range") {
        matchesDate = Boolean(
          appointmentDate &&
          start &&
          end &&
          appointmentDate >= start &&
          appointmentDate <= end,
        );
      }

      const matchesStatus =
        statusFilter === "All" || appointment.status === statusFilter;
      const matchesSearch =
        search.length === 0 || buildSearchIndex(appointment).includes(search);

      return matchesDate && matchesStatus && matchesSearch;
    });
  }, [appointments, dateView, rangeStart, rangeEnd, searchTerm, statusFilter]);

  const rangeIsIncomplete = dateView === "range" && (!rangeStart || !rangeEnd);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAppointments.length / APPOINTMENTS_PER_PAGE),
  );

  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * APPOINTMENTS_PER_PAGE;
    return filteredAppointments.slice(
      startIndex,
      startIndex + APPOINTMENTS_PER_PAGE,
    );
  }, [filteredAppointments, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [dateView, rangeStart, rangeEnd, searchTerm, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function clearFilters() {
    setDateView("all");
    setRangeStart("");
    setRangeEnd("");
    setSearchTerm("");
    setStatusFilter("All");
  }

  function openReservationModal() {
    setReservationDate("");
    setReservationTime("");
    setReservationReason("");
    setReservationError(null);
    setReservationSuccess(false);
    setReservedTimes([]);
    setReservedTimesError(null);
    setIsReserveModalOpen(true);
  }

  function closeReservationModal() {
    if (isSavingReservation) return;
    setIsReserveModalOpen(false);
  }

  async function reserveTimeSlot() {
    setReservationError(null);
    setReservationSuccess(false);

    if (!reservationDate || !reservationTime) {
      setReservationError("Select both a date and an appointment time.");
      return;
    }

    const selectedDate = parseDateInput(reservationDate);
    if (!selectedDate) {
      setReservationError("The selected date is invalid.");
      return;
    }

    if (selectedDate < startOfDay(new Date())) {
      setReservationError("A past date cannot be reserved.");
      return;
    }

    if (!firebaseUser) {
      setReservationError("You must be signed in to reserve a time slot.");
      return;
    }

    setIsSavingReservation(true);

    try {
      const dayStart = startOfDay(selectedDate);
      const dayEnd = endOfDay(selectedDate);
      const existingSlotsQuery = query(
        collection(db, "BookedSlots"),
        where("appointmentDate", ">=", dayStart),
        where("appointmentDate", "<=", dayEnd),
      );
      const existingSlots = await getDocs(existingSlotsQuery);
      const isAlreadyBooked = existingSlots.docs.some(
        (slotDocument) =>
          slotDocument.data().appointmentTime === reservationTime,
      );

      if (isAlreadyBooked) {
        setReservationError(
          `${reservationTime} is already booked on the selected date.`,
        );
        return;
      }

      await addDoc(collection(db, "BookedSlots"), {
        appointmentDate: selectedDate,
        appointmentTime: reservationTime,
        source: "Admin",
        type: "Admin Reservation",
        reason: reservationReason.trim(),
        blockedBy: firebaseUser.uid,
        createdAt: serverTimestamp(),
      });

      const newlyReservedTime = reservationTime;
      setReservationSuccess(true);
      setReservedTimes((current) => {
        if (current.some((slot) => slot.time === newlyReservedTime)) {
          return current;
        }
        return [
          ...current,
          { time: newlyReservedTime, source: "Admin" as const },
        ];
      });
      setReservationTime("");
    } catch (error) {
      console.error("Could not reserve appointment time:", error);
      setReservationError(
        "The time slot could not be reserved. Check the BookedSlots Firestore rules and try again.",
      );
    } finally {
      setIsSavingReservation(false);
    }
  }

  useEffect(() => {
    if (!isReserveModalOpen || !reservationDate) {
      setReservedTimes([]);
      setReservedTimesError(null);
      setIsLoadingReservedTimes(false);
      return;
    }

    let isCancelled = false;

    async function loadReservedTimes() {
      const selectedDate = parseDateInput(reservationDate);
      if (!selectedDate) return;

      setIsLoadingReservedTimes(true);
      setReservedTimesError(null);
      setReservedTimes([]);

      try {
        const slotsQuery = query(
          collection(db, "BookedSlots"),
          where("appointmentDate", ">=", startOfDay(selectedDate)),
          where("appointmentDate", "<=", endOfDay(selectedDate)),
        );
        const snapshot = await getDocs(slotsQuery);

        const slotsByTime = new Map<string, ReservedTime>();
        snapshot.docs.forEach((slotDocument) => {
          const data = slotDocument.data() as {
            appointmentTime?: string;
            source?: string;
            type?: string;
          };
          if (!data.appointmentTime) return;

          const source: ReservedTime["source"] =
            data.source === "Admin" || data.type === "Admin Reservation"
              ? "Admin"
              : "Client";
          slotsByTime.set(data.appointmentTime, {
            time: data.appointmentTime,
            source,
          });
        });

        if (!isCancelled) setReservedTimes(Array.from(slotsByTime.values()));
      } catch (error) {
        console.error("Could not load reserved times:", error);
        if (!isCancelled) {
          setReservedTimesError(
            "Booked times could not be checked. Please refresh and try again.",
          );
        }
      } finally {
        if (!isCancelled) setIsLoadingReservedTimes(false);
      }
    }

    void loadReservedTimes();

    return () => {
      isCancelled = true;
    };
  }, [isReserveModalOpen, reservationDate]);

  useEffect(() => {
    if (!selectedAppointment && !isReserveModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedAppointment(null);
        if (!isSavingReservation) setIsReserveModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedAppointment, isReserveModalOpen, isSavingReservation]);

  if (!isAuthReady) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-lg shadow-slate-200/60">
          <ArrowPathIcon className="h-5 w-5 animate-spin text-blue-600" />
          Loading admin workspace...
        </div>
      </main>
    );
  }

  if (!firebaseUser) return null;

  if (role !== "Admin" && role !== "Super Admin") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-16">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <ShieldCheckIcon className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-950">
            Admin access required
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your Firestore user profile must have the role Admin or Super Admin
            to view appointment information.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Return home
          </Link>
        </div>
      </main>
    );
  }

  const dateTabs: Array<{
    id: Exclude<DateView, "range">;
    title: string;
    description: string;
    count: number;
  }> = [
    {
      id: "all",
      title: "All Appointments",
      description: "Complete appointment history",
      count: dateCounts.all,
    },
    {
      id: "today",
      title: "Today",
      description: "Appointments scheduled today",
      count: dateCounts.today,
    },
    {
      id: "month",
      title: "This Month",
      description: "Current month schedule",
      count: dateCounts.month,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-4 py-7 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Mist Auto A/C Administration
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Appointment Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View and organise every customer appointment in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {firebaseUser.email}
              </p>
              <p className="text-xs text-slate-500">{role}</p>
            </div>
            <button
              type="button"
              onClick={openReservationModal}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
            >
              <PlusIcon className="h-5 w-5" />
              Reserve time slot
            </button>
            <Link
              href="/book-appointment"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              Booking page
            </Link>
            <button
              type="button"
              onClick={loadAppointments}
              disabled={isLoading}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dateTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDateView(tab.id)}
              className={`group rounded-2xl border p-5 text-left transition-all ${
                dateView === tab.id
                  ? "border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-sm font-bold ${
                      dateView === tab.id ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {tab.title}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      dateView === tab.id ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {tab.description}
                  </p>
                </div>
                <span
                  className={`rounded-xl px-3 py-1.5 text-xl font-black ${
                    dateView === tab.id
                      ? "bg-white/15 text-white"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {tab.count}
                </span>
              </div>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setDateView("range")}
            className={`rounded-2xl border p-5 text-left transition-all ${
              dateView === "range"
                ? "border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/60"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold">Selected Date Range</p>
                <p
                  className={`mt-1 text-xs ${
                    dateView === "range" ? "text-blue-100" : "text-slate-500"
                  }`}
                >
                  Choose a custom period
                </p>
              </div>
              <div
                className={`rounded-xl p-2.5 ${
                  dateView === "range"
                    ? "bg-white/15 text-white"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                <CalendarDaysIcon className="h-6 w-6" />
              </div>
            </div>
          </button>
        </section>

        {dateView === "range" ? (
          <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Custom date range</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Select both a start date and an end date to display
                  appointments.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    From
                  </span>
                  <input
                    type="date"
                    value={rangeStart}
                    max={rangeEnd || undefined}
                    onChange={(event) => setRangeStart(event.target.value)}
                    className="h-11 min-w-52 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    To
                  </span>
                  <input
                    type="date"
                    value={rangeEnd}
                    min={rangeStart || undefined}
                    onChange={(event) => setRangeEnd(event.target.value)}
                    className="h-11 min-w-52 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              </div>
            </div>
          </section>
        ) : null}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                    Appointment List
                  </h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {filteredAppointments.length} results
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-500">
                  Customer, vehicle, service and schedule information.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 sm:min-w-80">
                  <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-slate-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search customer, reference, vehicle..."
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </label>

                <label className="relative flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
                  <FunnelIcon className="h-5 w-5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as AppointmentStatus)
                    }
                    className="min-w-36 appearance-none bg-transparent pr-6 text-sm font-semibold text-slate-700 outline-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status === "All" ? "All statuses" : status}
                      </option>
                    ))}
                  </select>
                  <ChevronRightIcon className="pointer-events-none absolute right-3 h-4 w-4 rotate-90 text-slate-400" />
                </label>

                {(searchTerm ||
                  statusFilter !== "All" ||
                  dateView !== "all") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {errorMessage ? (
            <div className="m-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:m-6">
              <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">Unable to load appointments</p>
                <p className="mt-1">{errorMessage}</p>
              </div>
            </div>
          ) : null}

          {rangeIsIncomplete ? (
            <div className="m-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-sm font-medium text-amber-800 sm:m-6">
              Select both dates above to view appointments for a custom period.
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      <th className="px-6 py-4">Booking reference</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Appointment</th>
                      <th className="px-6 py-4">Vehicle</th>
                      <th className="px-6 py-4">Services</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <ArrowPathIcon className="mx-auto h-7 w-7 animate-spin text-blue-600" />
                          <p className="mt-3 text-sm font-medium text-slate-500">
                            Loading appointments...
                          </p>
                        </td>
                      </tr>
                    ) : filteredAppointments.length ? (
                      paginatedAppointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`View appointment ${appointment.bookingRef ?? appointment.id}`}
                          onClick={() => setSelectedAppointment(appointment)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedAppointment(appointment);
                            }
                          }}
                          className="cursor-pointer align-top transition hover:bg-blue-50/60 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                          <td className="px-6 py-5">
                            <p className="font-bold text-blue-700">
                              {appointment.bookingRef ?? "Not assigned"}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Created {formatCreatedDate(appointment.createdAt)}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-start gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                <UserIcon className="h-5 w-5" />
                              </span>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900">
                                  {appointment.customerName ??
                                    "Unknown customer"}
                                </p>
                                <p className="mt-1 max-w-52 truncate text-xs text-slate-500">
                                  {appointment.customerEmail ??
                                    "Email unavailable"}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {appointment.customerPhone ??
                                    "Phone unavailable"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-semibold text-slate-800">
                              {formatDate(appointment.appointmentDate)}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <ClockIcon className="h-4 w-4" />
                              {appointment.appointmentTime ??
                                "Time unavailable"}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-start gap-2">
                              <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                              <div>
                                <p className="font-semibold text-slate-800">
                                  {appointment.vehicleType ?? "Not specified"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {[appointment.makeModel, appointment.year]
                                    .filter(Boolean)
                                    .join(" • ") || "Details unavailable"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex max-w-64 flex-wrap gap-1.5">
                              {(appointment.services ?? []).length ? (
                                appointment.services?.map((service) => (
                                  <span
                                    key={service}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                                  >
                                    {service}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-slate-400">
                                  No services
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${
                                statusTone[appointment.status ?? ""] ??
                                "border-slate-200 bg-slate-50 text-slate-700"
                              }`}
                            >
                              {appointment.status ?? "Unknown"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <EmptyTable />
                    )}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 lg:hidden">
                {isLoading ? (
                  <div className="px-5 py-16 text-center">
                    <ArrowPathIcon className="mx-auto h-7 w-7 animate-spin text-blue-600" />
                    <p className="mt-3 text-sm text-slate-500">
                      Loading appointments...
                    </p>
                  </div>
                ) : filteredAppointments.length ? (
                  paginatedAppointments.map((appointment) => (
                    <article
                      key={appointment.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`View appointment ${appointment.bookingRef ?? appointment.id}`}
                      onClick={() => setSelectedAppointment(appointment)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedAppointment(appointment);
                        }
                      }}
                      className="cursor-pointer p-5 transition hover:bg-blue-50/50 focus:bg-blue-50 focus:outline-none"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-blue-700">
                            {appointment.bookingRef ?? "Not assigned"}
                          </p>
                          <h3 className="mt-1 text-base font-bold text-slate-950">
                            {appointment.customerName ?? "Unknown customer"}
                          </h3>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                            statusTone[appointment.status ?? ""] ??
                            "border-slate-200 bg-slate-50 text-slate-700"
                          }`}
                        >
                          {appointment.status ?? "Unknown"}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
                        <div className="flex gap-2">
                          <CalendarDaysIcon className="h-5 w-5 shrink-0 text-blue-600" />
                          <div>
                            <p className="font-semibold text-slate-800">
                              {formatDate(appointment.appointmentDate)}
                            </p>
                            <p className="mt-0.5 text-xs">
                              {appointment.appointmentTime ??
                                "Time unavailable"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <TruckIcon className="h-5 w-5 shrink-0 text-blue-600" />
                          <div>
                            <p className="font-semibold text-slate-800">
                              {appointment.vehicleType ?? "Not specified"}
                            </p>
                            <p className="mt-0.5 text-xs">
                              {[appointment.makeModel, appointment.year]
                                .filter(Boolean)
                                .join(" • ") || "Details unavailable"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-slate-500">
                        <p className="flex items-center gap-2">
                          <EnvelopeIcon className="h-4 w-4" />
                          <span className="truncate">
                            {appointment.customerEmail ?? "Email unavailable"}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4" />
                          {appointment.customerPhone ?? "Phone unavailable"}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(appointment.services ?? []).map((service) => (
                          <span
                            key={service}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="px-5 py-16">
                    <EmptyState />
                  </div>
                )}
              </div>

              {filteredAppointments.length > 0 ? (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredAppointments.length}
                  onPageChange={setCurrentPage}
                />
              ) : null}
            </>
          )}
        </section>
      </div>

      {selectedAppointment ? (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      ) : null}

      {isReserveModalOpen ? (
        <ReserveTimeSlotModal
          date={reservationDate}
          time={reservationTime}
          reason={reservationReason}
          error={reservationError}
          success={reservationSuccess}
          isSaving={isSavingReservation}
          reservedTimes={reservedTimes}
          isLoadingReservedTimes={isLoadingReservedTimes}
          reservedTimesError={reservedTimesError}
          onDateChange={(value) => {
            setReservationDate(value);
            setReservationTime("");
            setReservationError(null);
            setReservationSuccess(false);
          }}
          onTimeChange={(value) => {
            setReservationTime(value);
            setReservationError(null);
            setReservationSuccess(false);
          }}
          onReasonChange={setReservationReason}
          onSave={reserveTimeSlot}
          onClose={closeReservationModal}
        />
      ) : null}
    </main>
  );
}

type ReserveTimeSlotModalProps = {
  date: string;
  time: string;
  reason: string;
  error: string | null;
  success: boolean;
  isSaving: boolean;
  reservedTimes: ReservedTime[];
  isLoadingReservedTimes: boolean;
  reservedTimesError: string | null;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
};

function ReserveTimeSlotModal({
  date,
  time,
  reason,
  error,
  success,
  isSaving,
  reservedTimes,
  isLoadingReservedTimes,
  reservedTimesError,
  onDateChange,
  onTimeChange,
  onReasonChange,
  onSave,
  onClose,
}: ReserveTimeSlotModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reserve-slot-title"
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl"
      >
        <div className="border-b border-slate-200 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                <LockClosedIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Admin reservation
                </p>
                <h2
                  id="reserve-slot-title"
                  className="mt-1 text-2xl font-black text-slate-950"
                >
                  Reserve a time slot
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Customers will see this time as already booked.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              aria-label="Close reservation window"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800">
              Select date <span className="text-rose-500">*</span>
            </span>
            <div className="relative">
              <CalendarDaysIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600" />
              <input
                type="date"
                min={formatDateInput()}
                value={date}
                onChange={(event) => onDateChange(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </label>

          <div>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-slate-800">
                Select time <span className="text-rose-500">*</span>
              </p>
              {date && !isLoadingReservedTimes ? (
                <p className="text-xs font-semibold text-slate-500">
                  {reservedTimes.length} of {BOOKING_TIMES.length} times already
                  booked
                </p>
              ) : null}
            </div>

            {isLoadingReservedTimes ? (
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm font-medium text-blue-700">
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                Checking existing client and admin bookings...
              </div>
            ) : null}

            {reservedTimesError ? (
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
                {reservedTimesError}
              </div>
            ) : null}

            {!date ? (
              <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800">
                Select a date first to check available times.
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
              {BOOKING_TIMES.map((availableTime) => {
                const reservedSlot = reservedTimes.find(
                  (slot) => slot.time === availableTime,
                );
                const isUnavailable = Boolean(reservedSlot);

                return (
                  <button
                    key={availableTime}
                    type="button"
                    disabled={
                      !date ||
                      isUnavailable ||
                      isLoadingReservedTimes ||
                      Boolean(reservedTimesError)
                    }
                    onClick={() => onTimeChange(availableTime)}
                    className={`flex min-h-14 flex-col items-center justify-center rounded-xl border px-2 py-2 text-sm font-bold transition ${
                      isUnavailable
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : time === availableTime
                          ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {isUnavailable ? (
                        <LockClosedIcon className="h-4 w-4" />
                      ) : (
                        <ClockIcon className="h-4 w-4" />
                      )}
                      {availableTime}
                    </span>
                    {reservedSlot ? (
                      <span className="mt-1 text-[9px] font-black uppercase tracking-wider">
                        {reservedSlot.source === "Admin"
                          ? "Admin reserved"
                          : "Client booked"}
                      </span>
                    ) : (
                      <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider opacity-70">
                        Available
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {date && !isLoadingReservedTimes && !reservedTimesError ? (
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  Available / selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  Already booked — cannot select
                </span>
              </div>
            ) : null}
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800">
              Internal reason{" "}
              <span className="font-normal text-slate-400">(Optional)</span>
            </span>
            <textarea
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Example: Workshop maintenance or staff meeting"
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          {error ? (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          {success ? (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">Time slot reserved successfully.</p>
                <p className="mt-1">
                  The client booking page will now display this time as booked.
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={
                isSaving ||
                isLoadingReservedTimes ||
                Boolean(reservedTimesError) ||
                !date ||
                !time
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <LockClosedIcon className="h-5 w-5" />
              )}
              {isSaving ? "Reserving..." : "Reserve time slot"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

type AppointmentDetailsModalProps = {
  appointment: AppointmentRecord;
  onClose: () => void;
};

function AppointmentDetailsModal({
  appointment,
  onClose,
}: AppointmentDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-dialog-title"
        className="max-h-[94vh] w-full overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:max-w-3xl sm:rounded-3xl"
      >
        <div className="relative overflow-hidden bg-slate-950 px-5 py-6 text-white sm:px-7">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="relative flex items-start justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-300/25 bg-blue-400/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100">
                  Appointment details
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                    statusTone[appointment.status ?? ""] ??
                    "border-white/20 bg-white/10 text-white"
                  }`}
                >
                  {appointment.status ?? "Unknown"}
                </span>
              </div>
              <h2
                id="appointment-dialog-title"
                className="mt-4 text-2xl font-black tracking-tight sm:text-3xl"
              >
                {appointment.bookingRef ?? "Appointment record"}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Created {formatCreatedDate(appointment.createdAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close appointment details"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(94vh-136px)] overflow-y-auto p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailCard
              icon={<CalendarDaysIcon className="h-5 w-5" />}
              label="Appointment date"
              value={formatDate(appointment.appointmentDate)}
              secondary={appointment.appointmentTime ?? "Time unavailable"}
            />
            <DetailCard
              icon={<TruckIcon className="h-5 w-5" />}
              label="Vehicle"
              value={appointment.vehicleType ?? "Not specified"}
              secondary={
                [appointment.makeModel, appointment.year]
                  .filter(Boolean)
                  .join(" • ") || "Vehicle details unavailable"
              }
            />
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <UserIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Customer information
                </p>
                <p className="mt-1 font-bold text-slate-950">
                  {appointment.customerName ?? "Unknown customer"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <EnvelopeIcon className="h-5 w-5 shrink-0 text-blue-600" />
                <span className="truncate">
                  {appointment.customerEmail ?? "Email unavailable"}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <PhoneIcon className="h-5 w-5 shrink-0 text-blue-600" />
                {appointment.customerPhone ?? "Phone unavailable"}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-slate-950">Selected services</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(appointment.services ?? []).length ? (
                  appointment.services?.map((service) => (
                    <span
                      key={service}
                      className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                    >
                      {service}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No services recorded.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-slate-950">Additional notes</h3>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {appointment.notes?.trim() || "No additional notes provided."}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

type DetailCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  secondary: string;
};

function DetailCard({ icon, label, value, secondary }: DetailCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-1.5 font-bold text-slate-950">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{secondary}</p>
        </div>
      </div>
    </div>
  );
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const firstItem = (currentPage - 1) * APPOINTMENTS_PER_PAGE + 1;
  const lastItem = Math.min(currentPage * APPOINTMENTS_PER_PAGE, totalItems);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).filter(
    (page) =>
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
  );

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-center text-sm text-slate-500 sm:text-left">
        Showing <span className="font-bold text-slate-800">{firstItem}</span> to{" "}
        <span className="font-bold text-slate-800">{lastItem}</span> of{" "}
        <span className="font-bold text-slate-800">{totalItems}</span>{" "}
        appointments
      </p>

      <nav
        aria-label="Appointment pagination"
        className="flex items-center justify-center gap-1.5"
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <div className="hidden items-center gap-1.5 sm:flex">
          {visiblePages.map((page, index) => {
            const previousPage = visiblePages[index - 1];
            const showEllipsis = previousPage && page - previousPage > 1;

            return (
              <div key={page} className="flex items-center gap-1.5">
                {showEllipsis ? (
                  <span className="px-1 text-sm text-slate-400">…</span>
                ) : null}
                <button
                  type="button"
                  aria-current={page === currentPage ? "page" : undefined}
                  onClick={() => onPageChange(page)}
                  className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${
                    page === currentPage
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                  }`}
                >
                  {page}
                </button>
              </div>
            );
          })}
        </div>

        <span className="px-2 text-xs font-bold text-slate-600 sm:hidden">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </nav>
    </div>
  );
}

function EmptyTable() {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-16">
        <EmptyState />
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-sm text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <DocumentTextIcon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No appointments found
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        There are no appointments matching the selected date, status or search.
      </p>
    </div>
  );
}
