import Image from "next/image";
import HeroSection from "@/components/layout/HeroSection";
import TestimonialsSection from "@/components/layout/TestimonialsSection";

const services = [
  {
    id: 1,
    title: "Mist Auto A/C",
    description:
      "Air conditioning system repairs and services for any type of car. Only high-quality spare parts are used to provide a durable solution for all repairsif you need more details click here....",
    badge: "AUTO SERVICE",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
    colorFrom: "from-sky-400",
    colorTo: "to-blue-600",
    accentColor: "text-sky-600",
    image: "/Key Services Image/mist_auto_ac.png",
  },
  {
    id: 2,
    title: "Domestic A/C & Refrigerator",
    description:
      "Repair and maintenance services for domestic air conditioners and refrigerators. We provide high-quality spare parts to ensure the longevity of your appliances For more details, click here....",
    badge: "HOME SERVICE",
    badgeBg: "bg-cyan-100",
    badgeText: "text-cyan-700",
    colorFrom: "from-cyan-400",
    colorTo: "to-teal-600",
    accentColor: "text-cyan-600",
    image: "/Key Services Image/domestic_ac.png",
  },
  {
    id: 3,
    title: "Spare Parts & Accessories",
    description:
      "We offer a wide range of high-quality spare parts and accessories for all types of auto, domestic, and industrial air conditioning and refrigeration systems. For more details, click here...",
    badge: "PARTS & ACC",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    colorFrom: "from-blue-400",
    colorTo: "to-indigo-600",
    accentColor: "text-blue-600",
    image: "/Key Services Image/spare_parts.png",
  },
  {
    id: 4,
    title: "Brand New AC Unit",
    description:
      "We provide and install brand new, high-efficiency A/C units from leading brands to suit your home or business needs, complete with a warranty. For more details, click here...",
    badge: "NEW UNITS",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    colorFrom: "from-emerald-400",
    colorTo: "to-green-600",
    accentColor: "text-emerald-600",
    image: "/Key Services Image/new_ac_unit.jpg",
  },
  {
    id: 5,
    title: "Auto Scanning",
    description:
      "Using the latest diagnostic tools, we perform comprehensive auto scanning to accurately identify any electronic or system faults in your vehicle's A/C system. For more details, click here...",
    badge: "DIAGNOSTICS",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    colorFrom: "from-purple-400",
    colorTo: "to-violet-600",
    accentColor: "text-purple-600",
    image: "/Key Services Image/auto_scanning.jpg",
  },
  {
    id: 6,
    title: "Industrial Ref & AC",
    description:
      "Large-scale air conditioning and refrigeration services for factories and businesses For more details, click here...",
    badge: "INDUSTRIAL",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
    colorFrom: "from-orange-400",
    colorTo: "to-red-600",
    accentColor: "text-orange-600",
    image: "/Key Services Image/industrial_ac.jpg",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      {/* Key Services Section */}
      <section className="w-full bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="mx-auto max-w-[1500px] px-6 md:px-12">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Key Services
            </h2>
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto"></div>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-600">
              Comprehensive AC and refrigeration solutions for every need.
              Expert service with professional standards.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col"
              >
                {/* Image Background */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="relative p-8 flex flex-col flex-grow">
                  <div className="mb-4">
                    <div
                      className={`inline-block rounded-full ${service.badgeBg} px-4 py-1.5`}
                    >
                      <span
                        className={`text-xs font-bold tracking-wide uppercase ${service.badgeText}`}
                      >
                        {service.badge}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed flex-grow text-base">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12 text-center">
          <div className="mb-20 flex flex-col items-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Why{" "}
              <span className="relative inline-block text-slate-900">
                Choose
                <span className="absolute -bottom-3 left-0 right-0 h-1.5 rounded-full bg-blue-500"></span>
              </span>{" "}
              Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* 10+ Years of Experience */}
            <div className="group flex flex-col items-center p-6 rounded-2xl bg-white shadow-xl border border-slate-100 cursor-default">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 group-hover:bg-amber-100 transition-colors duration-300">
                <svg
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 3c-1.74 0-3.416.5-4.928 1.33A10.902 10.902 0 0012 5.05a10.9 10.9 0 00-4.572-1.72C5.916 2.5 4.24 2 2.5 2v1.5c0 1.956.884 3.708 2.25 4.86.345.29.704.55 1.076.786a9.01 9.01 0 003.568 1.34V15a2 2 0 002 2h2a2 2 0 002-2v-4.514a9.01 9.01 0 003.568-1.34c.372-.236.731-.496 1.076-.786A6.47 6.47 0 0021.5 3.5V2c-1.74 0-3.416.5-4.928 1.33z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 21h8M12 17v4"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                10+ Years of Experience
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Over a decade of trusted experience in the field.
              </p>
            </div>

            {/* Skilled Technicians */}
            <div className="group flex flex-col items-center p-6 rounded-2xl bg-white shadow-xl border border-slate-100 cursor-default">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors duration-300">
                <svg
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Skilled Technicians
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Service from trained and experienced technicians.
              </p>
            </div>

            {/* High-Quality Parts */}
            <div className="group flex flex-col items-center p-6 rounded-2xl bg-white shadow-xl border border-slate-100 cursor-default">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-50 text-purple-500 group-hover:bg-purple-100 transition-colors duration-300">
                <svg
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                High-Quality Parts
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Only quality parts for durability and long life.
              </p>
            </div>

            {/* Guaranteed Service */}
            <div className="group flex flex-col items-center p-6 rounded-2xl bg-white shadow-xl border border-slate-100 cursor-default">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-50 text-teal-500 group-hover:bg-teal-100 transition-colors duration-300">
                <svg
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Guaranteed Service
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                A friendly service that ensures customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
    </div>
  );
}
