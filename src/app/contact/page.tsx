"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import {
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";

type SubmitStatus = "idle" | "success" | "error";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    setFormData((previous) => ({
      ...previous,
      fullName: user.displayName || "",
      email: user.email || "",
    }));
  }, [user]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }));

    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setSubmitMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const fullName = formData.fullName.trim();
    const customerEmail = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!fullName || !customerEmail || !message) {
      setSubmitStatus("error");
      setSubmitMessage("Please complete your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      const serviceId = process.env.NEXT_PUBLIC_CONTACT_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_CONTACT_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_CONTACT_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("Contact EmailJS environment variables are missing.");
      }

      const submittedAt = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Colombo",
      }).format(new Date());

      await emailjs.send(
        serviceId,
        templateId,
        {
          full_name: fullName,
          customer_email: customerEmail,
          phone: phone || "Not provided",
          message,
          submitted_at: submittedAt,

          // Compatibility with EmailJS's original Contact Us template.
          name: fullName,
          email: customerEmail,
          title: "Website contact enquiry",
          time: submittedAt,
        },
        { publicKey },
      );

      setSubmitStatus("success");
      setSubmitMessage(
        "Your message has been sent successfully. We will contact you soon.",
      );
      setFormData({
        fullName: user?.displayName || "",
        email: user?.email || "",
        phone: "",
        message: "",
      });
    } catch (error: unknown) {
      const emailError = error as { status?: number; text?: string };

      console.error("Contact email failed:", {
        status: emailError?.status,
        message:
          emailError?.text ??
          (error instanceof Error ? error.message : "Unknown EmailJS error"),
      });

      setSubmitStatus("error");
      setSubmitMessage(
        "Your message could not be sent. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef3f9] text-slate-900">
      {/* Brand-matched hero */}
      <section className="relative isolate overflow-hidden bg-[#0f172a] px-6 pb-28 pt-24 text-white sm:pb-32 sm:pt-28 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.26),transparent_34%),radial-gradient(circle_at_85%_65%,rgba(14,165,233,0.16),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
            Contact Support
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Let&apos;s get your comfort
            <span className="block bg-gradient-to-r from-blue-300 to-sky-400 bg-clip-text text-transparent">
              back on the road.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Send our vehicle air-conditioning specialists a message. Share what
            you are experiencing, and the Mist Auto A/C team will respond as
            soon as possible.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-slate-300 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-blue-400" />
              Expert technical guidance
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-blue-400" />
              Your information stays private
            </span>
          </div>
        </div>
      </section>

      {/* Contact content */}
      <section className="relative z-10 -mt-16 px-4 pb-20 sm:-mt-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)] lg:grid-cols-[1.35fr_0.85fr]">
          {/* Form panel */}
          <div className="p-6 sm:p-9 lg:p-12">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.08)]">
                <PaperAirplaneIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Message our team
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#14304b] sm:text-3xl">
                  How can we help?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Complete the form below and we&apos;ll get back to you
                  shortly.
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    autoComplete="name"
                    required
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    required
                    className={inputClassName}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+94 7X XXX XXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  autoComplete="tel"
                  className={inputClassName}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Your Message <span className="text-blue-600">*</span>
                  </label>
                  <span className="text-xs text-slate-400">
                    {formData.message.length}/1000
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  maxLength={1000}
                  placeholder="Tell us about the issue with your vehicle A/C..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className={`${inputClassName} min-h-40 resize-y`}
                />
              </div>

              {submitStatus !== "idle" && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm leading-6 ${
                    submitStatus === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <span>{submitMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(37,99,235,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_18px_34px_-12px_rgba(37,99,235,0.9)] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <PaperAirplaneIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Information panel */}
          <aside className="relative overflow-hidden bg-[#0f172a] p-7 text-white sm:p-10 lg:p-12">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">
                Mist Auto A/C
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight">
                Get in touch directly
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Prefer to contact us directly? Use any of the options below.
              </p>

              <div className="mt-9 space-y-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300 ring-1 ring-white/10">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-white">
                      Mist Auto A/C Service Centre
                      <br />
                      Sri Lanka
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300 ring-1 ring-white/10">
                    <PhoneIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Phone
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Contact us for assistance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300 ring-1 ring-white/10">
                    <EnvelopeIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Email
                    </p>
                    <a
                      href="mailto:tharakamahesh806@gmail.com"
                      className="mt-1 block break-all text-sm font-semibold text-white transition hover:text-blue-300"
                    >
                      tharakamahesh806@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300 ring-1 ring-white/10">
                    <ClockIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Working Hours
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-white">
                      Monday – Saturday
                      <br />
                      8:00 AM – 6:00 PM
                    </p>
                    <p className="mt-1 text-xs font-semibold text-rose-300">
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                  <div>
                    <p className="text-sm font-bold">Secure contact form</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Your details are only used to respond to your service
                      enquiry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}