import Image from "next/image";
import HeroSection from "@/components/layout/HeroSection";

const services = [
  {
    id: 1,
    title: "Mist Auto A/C",
    description:
      "Specialized air conditioning service and repair for all vehicle types with genuine parts and expert technicians.",
    badge: "AUTO SERVICE",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
    colorFrom: "from-sky-400",
    colorTo: "to-blue-600",
    accentColor: "text-sky-600",
    image:
      "https://images.unsplash.com/photo-1487754180144-c332a6674e4d?w=800&q=80",
  },
  {
    id: 2,
    title: "Domestic A/C & Refrigerator",
    description:
      "Professional maintenance and repair for home air conditioning and refrigeration units with certified expertise.",
    badge: "HOME SERVICE",
    badgeBg: "bg-cyan-100",
    badgeText: "text-cyan-700",
    colorFrom: "from-cyan-400",
    colorTo: "to-teal-600",
    accentColor: "text-cyan-600",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
  },
  {
    id: 3,
    title: "Spare Parts & Accessories",
    description:
      "Genuine spare parts and premium accessories for all AC and refrigeration systems at competitive prices.",
    badge: "PARTS & ACC",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    colorFrom: "from-blue-400",
    colorTo: "to-indigo-600",
    accentColor: "text-blue-600",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    id: 4,
    title: "Brand New AC Unit",
    description:
      "Supply and professional installation of premium new air conditioning units for vehicles and homes.",
    badge: "NEW UNITS",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    colorFrom: "from-emerald-400",
    colorTo: "to-green-600",
    accentColor: "text-emerald-600",
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&q=80",
  },
  {
    id: 5,
    title: "Auto Scanning",
    description:
      "Advanced diagnostic scanning and analysis to identify AC system issues with precision and accuracy.",
    badge: "DIAGNOSTICS",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    colorFrom: "from-purple-400",
    colorTo: "to-violet-600",
    accentColor: "text-purple-600",
    image:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
  },
  {
    id: 6,
    title: "Industrial Ref & AC",
    description:
      "Specialized solutions for industrial refrigeration and air conditioning systems with technical expertise.",
    badge: "INDUSTRIAL",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
    colorFrom: "from-orange-400",
    colorTo: "to-red-600",
    accentColor: "text-orange-600",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695aada4d?w=800&q=80",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <section className="w-full bg-sky-50">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Your Premium Auto AC Specialists
          </h2>
          <p className="mt-2 text-sm text-slate-600 md:text-base">
            Expert Auto AC services for all makes and models, with genuine parts
            and premium specialists.
          </p>
        </div>
      </section>

      {/* Key Services Section */}
      <section className="w-full bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-6">
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Image Background */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <div
                    className={`mb-2 inline-block rounded-full ${service.badgeBg} px-3 py-1`}
                  >
                    <span
                      className={`text-xs font-semibold ${service.badgeText}`}
                    >
                      {service.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-slate-600">{service.description}</p>
                  <div
                    className={`mt-4 flex items-center ${service.accentColor} font-semibold group-hover:translate-x-2 transition-transform duration-300`}
                  >
                    Learn more →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-900">
            Welcome to Mist Auto A/C
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            Professional air conditioning service for your vehicle
          </p>
        </div>
      </div>
    </div>
  );
}
