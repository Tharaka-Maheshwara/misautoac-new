'use client';

import Image from 'next/image';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SignupModal from '../forms/SignupModal';
import LoginModal from '../forms/LoginModal';

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

  return (
    <header className="w-full border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold text-slate-900"
          aria-label="Mist Auto A/C"
        >
          <div className="relative h-20 w-20">
            <Image
              src="/logo/mist-auto-logo.jpeg"
              alt="Mist Auto A/C Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="leading-tight">
            <span className="block text-2xl font-bold text-blue-700">Mist Auto</span>
            <span className="block text-sm font-semibold text-blue-600">A/C Service</span>
          </span>
        </Link>

        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-2 text-lg font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-lg px-4 py-2 transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md font-semibold"
                        : "hover:bg-blue-100 hover:text-blue-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="rounded-lg px-4 py-2 text-base font-medium text-slate-600 transition hover:text-slate-900"
          >
            Login
          </button>
          <button
            onClick={() => setIsSignupOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-base font-semibold text-white shadow-sm transition hover:bg-blue-500"
          >
            Sign Up
          </button>
        </div>

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
      </div>
    </header>
  );
}
