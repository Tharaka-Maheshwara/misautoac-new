"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import SignupModal from "../forms/SignupModal";
import LoginModal from "../forms/LoginModal";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/pages/services" },
  { label: "About Us", href: "/pages/about" },
  { label: "Spare Parts", href: "/pages/spare-parts" },
  { label: "Contact", href: "/pages/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/60"
            : "bg-white border-b border-slate-200"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
          {/* ===== LEFT: Logo & Name ===== */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Mist Auto A/C - Home"
          >
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-full ring-2 ring-blue-100">
              <Image
                src="/logo/mist-auto-logo.jpeg"
                alt="Mist Auto A/C Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="leading-tight">
              <span className="block text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Mist Auto
              </span>
              <span className="block text-xs font-semibold text-blue-600 tracking-wide uppercase">
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
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative block rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ===== RIGHT: Auth Buttons (Desktop) ===== */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            >
              Login
            </button>
            <button
              onClick={() => setIsSignupOpen(true)}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-300 active:scale-95"
            >
              Sign Up
            </button>
          </div>

          {/* ===== HAMBURGER BUTTON (Mobile / Tablet) ===== */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="flex flex-col items-center justify-center gap-[5px]">
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 origin-center ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-[7px]"
                    : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 origin-center ${
                  isMobileMenuOpen
                    ? "-rotate-45 -translate-y-[7px]"
                    : ""
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
        className={`fixed top-0 right-0 z-50 h-full w-72 max-w-[80vw] bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
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
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Nav Links */}
        <div className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Drawer Divider */}
        <div className="mx-4 border-t border-slate-100" />

        {/* Drawer Auth Buttons */}
        <div className="flex flex-col gap-2 px-4 py-4">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsLoginOpen(true);
            }}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSignupOpen(true);
            }}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-95"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* ===== SPACER (pushes content below fixed navbar) ===== */}
      <div className="h-16 sm:h-[72px]" />

      {/* ===== MODALS ===== */}
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
  );
}
