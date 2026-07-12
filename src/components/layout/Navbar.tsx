"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { auth } from "@/lib/firebase"; // Import auth
import { signOut } from "firebase/auth"; // Import signOut
import LogoutConfirmationModal from "../forms/LogoutConfirmationModal";

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Dropdown states for Services
  const [isServicesDesktopOpen, setIsServicesDesktopOpen] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);

  // Dropdown states for Spare Parts
  const [isSparePartsDesktopOpen, setIsSparePartsDesktopOpen] = useState(false);
  const [isSparePartsMobileOpen, setIsSparePartsMobileOpen] = useState(false);

  // Dropdown state for User Menu (Welcome, Name)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const closeServicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeSparePartsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Auth state will be updated by onAuthStateChanged in AuthProvider
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setIsLogoutModalOpen(false);
    setIsMobileMenuOpen(false); // Ensure mobile menu closes if open
    setIsUserMenuOpen(false);
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
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu or modals are open
  useEffect(() => {
    if (isMobileMenuOpen || isLogoutModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isLogoutModalOpen]);

  // Close user menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

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

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleMyProfile = () => {
    setIsUserMenuOpen(false);
    // Navigate to profile page — update the path if different in your app
    window.location.href = "/pages/profile";
  };

  const handleRateUs = () => {
    setIsUserMenuOpen(false);
    // Navigate to rate-us page or open a review link — update as needed
    window.location.href = "/pages/rate-us";
  };

  const getDisplayName = () => {
    if (!user) return "";
    if (user.displayName) return user.displayName;
    if (user.email) {
      const emailUsername = user.email.split("@")[0];
      const namePart = emailUsername.match(/[a-zA-Z]+/)?.[0] || emailUsername;
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return "User";
  };

  const displayName = getDisplayName();

  const getInitials = (name: string) => {
    if (!name) return "?";
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${
        nameParts[nameParts.length - 1][0]
      }`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const userInitials = getInitials(displayName);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
        }`}
      >
        <div
          className={`relative mx-auto flex w-full items-center px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            isScrolled ? "min-h-[72px]" : "min-h-[96px] sm:min-h-[112px]"
          }`}
        >
          {/* ===== LEFT: Logo & Name — pinned to the true left edge, vertically centered ===== */}
          <Link
            href="/"
            className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 flex items-center gap-2.5 shrink-0"
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
            className="hidden lg:flex items-center mx-auto"
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

          {/* ===== RIGHT: Auth Buttons (Desktop) — pinned to the true right edge ===== */}
          <div className="hidden lg:flex items-center gap-2 absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 rounded-full p-1 text-sm text-slate-600 transition-all duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-base font-semibold text-white">
                    {userInitials}
                  </div>
                  <span className="hidden sm:block font-medium text-slate-700">
                    {displayName}
                  </span>
                  <svg
                    className={`h-5 w-5 text-slate-500 transition-transform duration-200 sm:block ${
                      isUserMenuOpen ? "rotate-180" : ""
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

                {/* User Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-xl bg-white p-2 shadow-xl border border-slate-100 transition-all duration-200 origin-top-right ${
                    isUserMenuOpen
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  {/* User Info in Dropdown */}
                  <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-base font-semibold text-white">
                      {userInitials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 truncate">
                        {displayName}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <button
                        onClick={handleMyProfile}
                        className="w-full text-left block rounded-lg px-4 py-2.5 text-[15px] font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-blue-600"
                      >
                        My Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleRateUs}
                        className="w-full text-left block rounded-lg px-4 py-2.5 text-[15px] font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-blue-600"
                      >
                        Rate Us
                      </button>
                    </li>
                    <li className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsLogoutModalOpen(true);
                        }}
                        className="w-full text-left block rounded-lg px-4 py-2.5 text-[15px] font-medium text-red-600 transition-colors duration-150 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/pages/login"
                  className="rounded-lg px-4 py-2 text-base font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
                >
                  Login
                </Link>
                <Link
                  href="/pages/sign-up"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-base font-semibold text-white shadow-sm shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-300 active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ===== HAMBURGER BUTTON (Mobile / Tablet) ===== */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 ml-auto"
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
        <div className="flex flex-col gap-2 py-4">
          {user ? (
            <>
              {/* User Info Section */}
              <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-100 mb-2">
                <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-lg font-semibold text-white">
                  {userInitials}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{displayName}</p>
                  <p className="text-sm text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 px-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = "/pages/profile";
                  }}
                  className="w-full text-left rounded-lg px-4 py-2.5 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 border border-slate-200"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = "/pages/rate-us";
                  }}
                  className="w-full text-left rounded-lg px-4 py-2.5 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 border border-slate-200"
                >
                  Rate Us
                </button>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full rounded-lg bg-red-50 px-4 py-2.5 text-base font-medium text-red-700 transition-all duration-200 hover:bg-red-100 border border-red-500/50"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 px-4">
              <Link
                href="/pages/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 text-center"
              >
                Login
              </Link>
              <Link
                href="/pages/sign-up"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-95 text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ===== SPACER ===== */}
      <div className="h-24 sm:h-28 bg-white" />

      {/* ===== MODALS ===== */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}