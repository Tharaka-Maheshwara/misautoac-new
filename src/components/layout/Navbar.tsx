"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import SignupModal from "../forms/SignupModal";
import LoginModal from "../forms/LoginModal";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { auth } from "@/lib/firebase"; // Import auth
import { signOut } from "firebase/auth"; // Import signOut

// Dropdown Items Data
const serviceDropdownItems = [
  { label: "Auto AC", href: "/pages/services/auto-ac" },
  { label: "Refrigerator", href: "/pages/services/refrigerator" },
  { label: "Washing Machine", href: "/pages/services/washing-machine" },
  { label: "Industrial", href: "/pages/services/industrial" },
];

const sparePartsDropdownItems = [
  { label: "Auto AC", href: "/pages/spare-parts/auto-ac" },
  { label: "Room AC", href: "/pages/spare-parts/room-ac" },
  { label: "Refrigerator", href: "/pages/spare-parts/refrigerator" },
  { label: "Washing Machine", href: "/pages/spare-parts/washing-machine" },
  {
    label: "Refrigerant & Accessories",
    href: "/pages/spare-parts/refrigerant-and-accessories",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth(); // Get user from AuthContext
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Dropdown states for Services
  const [isServicesDesktopOpen, setIsServicesDesktopOpen] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);

  // Dropdown states for Spare Parts
  const [isSparePartsDesktopOpen, setIsSparePartsDesktopOpen] = useState(false);
  const [isSparePartsMobileOpen, setIsSparePartsMobileOpen] = useState(false);

  const closeServicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeSparePartsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Auth state will be updated by onAuthStateChanged in AuthProvider
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Track scroll position for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesMobileOpen(false);
    setIsServicesDesktopOpen(false);
    setIsSparePartsMobileOpen(false);
    setIsSparePartsDesktopOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Hover delay handling for Services dropdown
  const handleServicesMouseEnter = () => {
    if (closeServicesTimeoutRef.current)
      clearTimeout(closeServicesTimeoutRef.current);
    setIsServicesDesktopOpen(true);
  };

  const handleServicesMouseLeave = () => {
    closeServicesTimeoutRef.current = setTimeout(() => {
      setIsServicesDesktopOpen(false);
    }, 150);
  };

  // Hover delay handling for Spare Parts dropdown
  const handleSparePartsMouseEnter = () => {
    if (closeSparePartsTimeoutRef.current)
      clearTimeout(closeSparePartsTimeoutRef.current);
    setIsSparePartsDesktopOpen(true);
  };

  const handleSparePartsMouseLeave = () => {
    closeSparePartsTimeoutRef.current = setTimeout(() => {
      setIsSparePartsDesktopOpen(false);
    }, 150);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/60"
            : "bg-white border-b border-slate-200"
        }`}
      >
        <div
          className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            isScrolled ? "py-2" : "py-4"
          }`}
        >
          {/* ===== LEFT: Logo & Name ===== */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Mist Auto A/C - Home"
          >
            <div
              className={`relative overflow-hidden rounded-full ring-2 ring-blue-100 transition-all duration-300 ${
                isScrolled
                  ? "h-12 w-12 sm:h-14 sm:w-14"
                  : "h-16 w-16 sm:h-20 sm:w-20"
              }`}
            >
              <Image
                src="/logo/mist-auto-logo.jpeg"
                alt="Mist Auto A/C Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="leading-tight transition-all duration-300">
              <span
                className={`block font-bold text-slate-900 tracking-tight transition-all duration-300 ${
                  isScrolled ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
                }`}
              >
                Mist Auto
              </span>
              <span
                className={`block font-semibold text-blue-600 tracking-wide uppercase transition-all duration-300 ${
                  isScrolled ? "text-xs" : "text-sm"
                }`}
              >
                A/C Service
              </span>
            </span>
          </Link>

          {/* ===== CENTER: Navigation Links (Desktop) ===== */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center"
          >
            <ul className="flex items-center gap-1">
              {/* 1. Home Link */}
              <li>
                <Link
                  href="/"
                  className={`relative block rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ${
                    pathname === "/"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  Home
                </Link>
              </li>

              {/* 2. Services Dropdown Link */}
              <li
                className="relative"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ${
                    pathname.startsWith("/pages/services")
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <span>Services</span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isServicesDesktopOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Services Dropdown Menu Overlay */}
                <div
                  className={`absolute left-0 mt-2 w-64 rounded-xl bg-white p-3 shadow-xl border border-slate-100 transition-all duration-200 origin-top ${
                    isServicesDesktopOpen
                      ? "opacity-100 scale-100 pointer-events-auto visibility-visible"
                      : "opacity-0 scale-95 pointer-events-none visibility-hidden"
                  }`}
                >
                  <ul className="flex flex-col gap-1">
                    {serviceDropdownItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-4 py-2.5 text-[15px] font-bold text-slate-800 transition-colors duration-150 hover:bg-slate-50 hover:text-blue-600"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* 3. About Us Link */}
              <li>
                <Link
                  href="/pages/about"
                  className={`relative block rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ${
                    pathname === "/pages/about"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  About Us
                </Link>
              </li>

              {/* 4. Spare Parts Dropdown Link */}
              <li
                className="relative"
                onMouseEnter={handleSparePartsMouseEnter}
                onMouseLeave={handleSparePartsMouseLeave}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ${
                    pathname.startsWith("/pages/spare-parts")
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <span>Spare Parts</span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isSparePartsDesktopOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Spare Parts Dropdown Menu Overlay */}
                <div
                  className={`absolute left-0 mt-2 w-72 rounded-xl bg-white p-3 shadow-xl border border-slate-100 transition-all duration-200 origin-top ${
                    isSparePartsDesktopOpen
                      ? "opacity-100 scale-100 pointer-events-auto visibility-visible"
                      : "opacity-0 scale-95 pointer-events-none visibility-hidden"
                  }`}
                >
                  <ul className="flex flex-col gap-1">
                    {sparePartsDropdownItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-4 py-2.5 text-[15px] font-bold text-slate-800 transition-colors duration-150 hover:bg-slate-50 hover:text-blue-600"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* 5. Contact Link */}
              <li>
                <Link
                  href="/pages/contact"
                  className={`relative block rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ${
                    pathname === "/pages/contact"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* ===== RIGHT: Auth Buttons (Desktop) ===== */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <span className="text-sm text-slate-600 mr-2 hidden sm:block">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-2 text-base font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="rounded-lg px-4 py-2 text-base font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-base font-semibold text-white shadow-sm shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-300 active:scale-95"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* ===== HAMBURGER BUTTON (Mobile / Tablet) ===== */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="flex flex-col items-center justify-center gap-1.25">
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.75" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.75" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ===== MOBILE MENU DRAWER ===== */}
      <nav
        aria-label="Mobile navigation"
        className={`fixed top-0 right-0 z-50 h-full w-72 max-w-[80vw] bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-lg font-bold text-slate-900">Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Drawer Nav Links */}
        <div className="flex flex-col gap-1 px-4 py-4">
          {/* Home */}
          <Link
            href="/"
            className={`flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
              pathname === "/"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-700 hover:bg-blue-50"
            }`}
          >
            Home
          </Link>

          {/* Services Accordion Toggle */}
          <div>
            <button
              onClick={() => setIsServicesMobileOpen((prev) => !prev)}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
                pathname.startsWith("/pages/services")
                  ? "bg-slate-100 text-blue-700 font-semibold"
                  : "text-slate-700 hover:bg-blue-50"
              }`}
            >
              <span>Services</span>
              <svg
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  isServicesMobileOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Services Mobile Submenu Items */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isServicesMobileOpen
                  ? "max-h-60 opacity-100 mt-1 pl-4"
                  : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              <ul className="flex flex-col gap-1 border-l-2 border-slate-100 pl-2">
                {serviceDropdownItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-md px-4 py-2 text-[15px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* About Us */}
          <Link
            href="/pages/about"
            className={`flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
              pathname === "/pages/about"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-700 hover:bg-blue-50"
            }`}
          >
            About Us
          </Link>

          {/* Spare Parts Accordion Toggle */}
          <div>
            <button
              onClick={() => setIsSparePartsMobileOpen((prev) => !prev)}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
                pathname.startsWith("/pages/spare-parts")
                  ? "bg-slate-100 text-blue-700 font-semibold"
                  : "text-slate-700 hover:bg-blue-50"
              }`}
            >
              <span>Spare Parts</span>
              <svg
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  isSparePartsMobileOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Spare Parts Mobile Submenu Items */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isSparePartsMobileOpen
                  ? "max-h-72 opacity-100 mt-1 pl-4"
                  : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              <ul className="flex flex-col gap-1 border-l-2 border-slate-100 pl-2">
                {sparePartsDropdownItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-md px-4 py-2 text-[15px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <Link
            href="/pages/contact"
            className={`flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
              pathname === "/pages/contact"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-700 hover:bg-blue-50"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Drawer Divider */}
        <div className="mx-4 border-t border-slate-100" />

        {/* Drawer Auth Buttons */}
        <div className="flex flex-col gap-2 px-4 py-4">
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:border-slate-300"
            >
              Logout ({user.email})
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLoginOpen(true);
                }}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSignupOpen(true);
                }}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-95"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ===== SPACER ===== */}
      <div className="h-24 sm:h-28" />

      {/* ===== MODALS ===== */}
      {!user && (
        <>
          <SignupModal
            isOpen={isSignupOpen}
            onClose={() => setIsSignupOpen(false)}
            onSwitchToLogin={() => {
              setIsSignupOpen(false);
              setIsLoginOpen(true);
            }}
          />
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSwitchToSignup={() => {
              setIsLoginOpen(false);
              setIsSignupOpen(true);
            }}
          />
        </>
      )}
    </>
  );
}
