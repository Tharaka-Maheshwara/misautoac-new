"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import LogoutConfirmationModal from "../forms/LogoutConfirmationModal";

type DropdownKey = "services" | "spare-parts";

type DropdownItem = {
  label: string;
  href: string;
  description: string;
};

const serviceDropdownItems: DropdownItem[] = [
  {
    label: "Auto A/C",
    href: "/services/auto-ac",
    description: "Diagnostics, repair and maintenance",
  },
  {
    label: "Refrigerator",
    href: "/services/refrigerator",
    description: "Reliable domestic cooling solutions",
  },
  {
    label: "Washing Machine",
    href: "/services/washing-machine",
    description: "Professional inspection and repair",
  },
  {
    label: "Industrial",
    href: "/services/industrial",
    description: "Cooling support for your business",
  },
];

const sparePartsDropdownItems: DropdownItem[] = [
  {
    label: "Auto A/C",
    href: "/spare-parts/auto-ac",
    description: "Quality parts for vehicle A/C systems",
  },
  {
    label: "Room A/C",
    href: "/spare-parts/room-ac",
    description: "Components for residential A/C units",
  },
  {
    label: "Refrigerator",
    href: "/spare-parts/refrigerator",
    description: "Replacement parts for cooling systems",
  },
  {
    label: "Washing Machine",
    href: "/spare-parts/washing-machine",
    description: "Dependable parts for everyday repairs",
  },
  {
    label: "Refrigerant & Accessories",
    href: "/spare-parts/refrigerant-and-accessories",
    description: "Refrigerants, tools and accessories",
  },
];

function ChevronIcon({ open = false }: { open?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.25}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14m-5-5 5 5-5 5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [desktopDropdown, setDesktopDropdown] = useState<DropdownKey | null>(
    null,
  );
  const [mobileDropdown, setMobileDropdown] = useState<DropdownKey | null>(
    null,
  );

  const dropdownCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopNavRef = useRef<HTMLElement | null>(null);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  const displayName = (() => {
    if (!user) return "";
    if (user.displayName) return user.displayName;

    if (user.email) {
      const emailName = user.email.split("@")[0];
      const readableName = emailName.replace(/[._-]+/g, " ").trim();
      return readableName
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }

    return "User";
  })();

  const userInitials = (() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
      0,
    )}`.toUpperCase();
  })();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadUserRole = async () => {
      if (!user) {
        setUserRole(null);
        return;
      }

      try {
        const profileSnapshot = await getDoc(doc(db, "Users", user.uid));
        const profileData = profileSnapshot.exists()
          ? (profileSnapshot.data() as { role?: string })
          : null;

        setUserRole(profileData?.role ?? "User");
      } catch (error) {
        console.error("Could not load the nav role:", error);
        setUserRole(null);
      }
    };

    void loadUserRole();
  }, [user]);

  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || isLogoutModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isLogoutModalOpen]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }

      if (desktopNavRef.current && !desktopNavRef.current.contains(target)) {
        setDesktopDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMobileMenuOpen(false);
      setDesktopDropdown(null);
      setMobileDropdown(null);
      setIsUserMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (dropdownCloseTimer.current) {
        clearTimeout(dropdownCloseTimer.current);
      }
    };
  }, []);

  const openDesktopDropdown = (key: DropdownKey) => {
    if (dropdownCloseTimer.current) {
      clearTimeout(dropdownCloseTimer.current);
    }
    setDesktopDropdown(key);
  };

  const scheduleDesktopDropdownClose = () => {
    dropdownCloseTimer.current = setTimeout(() => {
      setDesktopDropdown(null);
    }, 160);
  };

  const toggleDesktopDropdown = (key: DropdownKey) => {
    setDesktopDropdown((current) => (current === key ? null : key));
  };

  const toggleMobileDropdown = (key: DropdownKey) => {
    setMobileDropdown((current) => (current === key ? null : key));
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      setIsLogoutModalOpen(false);
      setIsMobileMenuOpen(false);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const desktopLinkClass = (href: string) =>
    `relative rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
      isActive(href)
        ? "bg-white text-blue-700 shadow-[0_6px_18px_-8px_rgba(37,99,235,0.55)] ring-1 ring-slate-200/80"
        : "text-slate-600 hover:bg-white/80 hover:text-slate-950"
    }`;

  const desktopDropdownButtonClass = (rootPath: string) =>
    `flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
      isActive(rootPath)
        ? "bg-white text-blue-700 shadow-[0_6px_18px_-8px_rgba(37,99,235,0.55)] ring-1 ring-slate-200/80"
        : "text-slate-600 hover:bg-white/80 hover:text-slate-950"
    }`;

  const mobileLinkClass = (href: string) =>
    `group flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition-all duration-200 ${
      isActive(href)
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const renderDesktopDropdown = (
    key: DropdownKey,
    title: string,
    eyebrow: string,
    items: DropdownItem[],
    widthClass: string,
  ) => {
    const isOpen = desktopDropdown === key;

    return (
      <div
        className={`absolute left-1/2 top-[calc(100%+14px)] ${widthClass} -translate-x-1/2 origin-top transition-all duration-200 ${
          isOpen
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.38)] backdrop-blur-xl">
          <div className="rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-5 py-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-300">
              {eyebrow}
            </p>
            <p className="mt-1 text-lg font-bold tracking-tight">{title}</p>
          </div>

          <ul className="mt-1 grid gap-1 p-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors duration-200 hover:bg-blue-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="min-w-0">
                    <span className="block text-[14px] font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                      {item.description}
                    </span>
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-200 group-hover:border-blue-200 group-hover:bg-blue-600 group-hover:text-white">
                    <ArrowIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderMobileDropdown = (
    key: DropdownKey,
    label: string,
    rootPath: string,
    items: DropdownItem[],
  ) => {
    const isOpen = mobileDropdown === key;
    const active = isActive(rootPath);

    return (
      <div>
        <button
          type="button"
          onClick={() => toggleMobileDropdown(key)}
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-[15px] font-semibold transition-all duration-200 ${
            active
              ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
          }`}
          aria-expanded={isOpen}
        >
          <span>{label}</span>
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              active
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <ChevronIcon open={isOpen} />
          </span>
        </button>

        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
            isOpen
              ? "mt-2 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="ml-4 space-y-1 border-l border-slate-200 pl-3">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-xl px-3 py-2.5 transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    <span className="block text-sm font-bold">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="h-1 bg-linear-to-r from-cyan-400 via-blue-600 to-indigo-600" />

        <div
          className={`border-b transition-all duration-300 ${
            isScrolled
              ? "border-slate-200/80 bg-white/90 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.5)] backdrop-blur-xl"
              : "border-transparent bg-white/95"
          }`}
        >
          <div
            className={`mx-auto flex w-full max-w-384 items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
              isScrolled ? "h-16.5" : "h-20.5"
            }`}
          >
            <Link
              href="/"
              className="group flex min-w-0 shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4"
              aria-label="Mist Auto A/C home"
            >
              <span
                  className={`relative shrink-0 overflow-hidden rounded-2xl border border-white bg-white shadow-[0_10px_28px_-12px_rgba(37,99,235,0.55)] ring-1 ring-slate-200 transition-all duration-300 group-hover:-translate-y-0.5 ${
                  isScrolled ? "h-11 w-11" : "h-12 w-12 sm:h-14 sm:w-14"
                }`}
              >
                <Image
                  src="/logo/mist-auto-logo.jpeg"
                  alt="Mist Auto A/C logo"
                  fill
                  sizes="56px"
                  className="object-cover"
                  priority
                />
              </span>

              <span className="min-w-0 leading-none">
                <span
                  className={`block truncate font-extrabold tracking-[-0.035em] text-slate-950 transition-all duration-300 ${
                    isScrolled ? "text-[17px]" : "text-lg sm:text-xl"
                  }`}
                >
                  Mist Auto
                </span>
                <span className="mt-1.5 block text-[9px] font-bold uppercase tracking-[0.19em] text-blue-600 sm:text-[10px]">
                  A/C Service
                </span>
              </span>
            </Link>

            <nav
              ref={desktopNavRef}
              aria-label="Primary navigation"
              className="absolute left-1/2 hidden -translate-x-1/2 xl:block"
            >
              <ul className="flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-slate-100/75 p-1.5 shadow-inner shadow-white/70 backdrop-blur">
                <li>
                  <Link href="/" className={desktopLinkClass("/")}>
                    Home
                  </Link>
                </li>

                <li
                  className="relative"
                  onMouseEnter={() => openDesktopDropdown("services")}
                  onMouseLeave={scheduleDesktopDropdownClose}
                >
                  <button
                    type="button"
                    className={desktopDropdownButtonClass("/services")}
                    onClick={() => toggleDesktopDropdown("services")}
                    aria-haspopup="menu"
                    aria-expanded={desktopDropdown === "services"}
                  >
                    Services
                    <ChevronIcon open={desktopDropdown === "services"} />
                  </button>
                  {renderDesktopDropdown(
                    "services",
                    "Our Services",
                    "Expert care",
                    serviceDropdownItems,
                    "w-[360px]",
                  )}
                </li>

                <li>
                  <Link href="/about" className={desktopLinkClass("/about")}>
                    About Us
                  </Link>
                </li>

                <li
                  className="relative"
                  onMouseEnter={() => openDesktopDropdown("spare-parts")}
                  onMouseLeave={scheduleDesktopDropdownClose}
                >
                  <button
                    type="button"
                    className={desktopDropdownButtonClass("/spare-parts")}
                    onClick={() => toggleDesktopDropdown("spare-parts")}
                    aria-haspopup="menu"
                    aria-expanded={desktopDropdown === "spare-parts"}
                  >
                    Spare Parts
                    <ChevronIcon open={desktopDropdown === "spare-parts"} />
                  </button>
                  {renderDesktopDropdown(
                    "spare-parts",
                    "Quality Spare Parts",
                    "Genuine solutions",
                    sparePartsDropdownItems,
                    "w-[390px]",
                  )}
                </li>

                <li>
                  <Link
                    href="/contact"
                    className={desktopLinkClass("/contact")}
                  >
                    Contact
                  </Link>
                </li>

                {userRole === "Admin" ? (
                  <li>
                    <Link href="/admin" className={desktopLinkClass("/admin")}>
                      Admin Panel
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>

            <div className="hidden shrink-0 items-center gap-2 xl:flex">
              {user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((current) => !current)}
                    className="group flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    aria-haspopup="menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-sm font-extrabold text-white shadow-md shadow-blue-600/20">
                      {userInitials}
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    </span>
                    <span className="hidden min-w-0 text-left 2xl:block">
                      <span className="block max-w-28 truncate text-sm font-bold text-slate-800">
                        {displayName}
                      </span>
                      <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        My account
                      </span>
                    </span>
                    <span className="text-slate-400 group-hover:text-slate-700">
                      <ChevronIcon open={isUserMenuOpen} />
                    </span>
                  </button>

                  <div
                    className={`absolute right-0 top-[calc(100%+12px)] w-72 origin-top-right transition-all duration-200 ${
                      isUserMenuOpen
                        ? "visible translate-y-0 scale-100 opacity-100"
                        : "invisible -translate-y-2 scale-95 opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.4)] backdrop-blur-xl">
                      <div className="rounded-2xl bg-linear-to-br from-slate-950 to-blue-950 p-4 text-white">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-base font-extrabold ring-1 ring-white/15">
                            {userInitials}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold">
                              {displayName}
                            </span>
                            <span className="mt-1 block truncate text-xs text-slate-300">
                              {user.email}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-1 space-y-1 p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            router.push("/profile");
                          }}
                          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                        >
                          My Profile
                          <ArrowIcon />
                        </button>
                        {userRole === "Admin" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              router.push("/admin");
                            }}
                            className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-cyan-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900"
                          >
                            Admin Dashboard
                            <ArrowIcon />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            router.push("/feedback");
                          }}
                          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                        >
                          Rate Us
                          <ArrowIcon />
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsLogoutModalOpen(true);
                          }}
                          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                        >
                          Logout
                          <ArrowIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:translate-y-0"
                  >
                    Sign Up
                    <span className="transition-transform group-hover:translate-x-0.5">
                      <ArrowIcon />
                    </span>
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 xl:hidden"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-3.5 self-end rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-60 bg-slate-950/55 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 right-0 z-70 flex w-90 max-w-[92vw] flex-col border-l border-white/10 bg-white shadow-[-30px_0_80px_-35px_rgba(15,23,42,0.6)] transition-transform duration-300 ease-out xl:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-5 pb-5 pt-6 text-white">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden rounded-2xl bg-white ring-1 ring-white/20">
                <Image
                  src="/logo/mist-auto-logo.jpeg"
                  alt="Mist Auto A/C logo"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span>
                <span className="block text-base font-extrabold tracking-tight">
                  Mist Auto
                </span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300">
                  A/C Service
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close navigation menu"
            >
              <CloseIcon />
            </button>
          </div>
          <p className="relative mt-5 max-w-65 text-sm leading-6 text-slate-300">
            Professional cooling services and trusted spare parts, all in one
            place.
          </p>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-5"
        >
          <div className="space-y-1.5">
            <Link href="/" className={mobileLinkClass("/")}>
              Home
              <ArrowIcon />
            </Link>

            {renderMobileDropdown(
              "services",
              "Services",
              "/services",
              serviceDropdownItems,
            )}

            <Link href="/about" className={mobileLinkClass("/about")}>
              About Us
              <ArrowIcon />
            </Link>

            {renderMobileDropdown(
              "spare-parts",
              "Spare Parts",
              "/spare-parts",
              sparePartsDropdownItems,
            )}

            <Link href="/contact" className={mobileLinkClass("/contact")}>
              Contact
              <ArrowIcon />
            </Link>

            {userRole === "Admin" ? (
              <Link href="/admin" className={mobileLinkClass("/admin")}>
                Admin Panel
                <ArrowIcon />
              </Link>
            ) : null}
          </div>
        </nav>

        <div className="border-t border-slate-200 bg-slate-50/80 p-4">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-sm font-extrabold text-white">
                  {userInitials}
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-900">
                    {displayName}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {user.email}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/profile");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/feedback");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Rate Us
                </button>
              </div>

              {userRole === "Admin" ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/admin");
                  }}
                  className="w-full rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-bold text-cyan-800 transition-colors hover:bg-cyan-100"
                >
                  Admin Dashboard
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 ring-1 ring-red-100 transition-colors hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/auth/login"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-transform active:scale-[0.98]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>

      <div className="h-21.5 bg-white" aria-hidden="true" />

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}