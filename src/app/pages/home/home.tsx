import Image from "next/image";
import HeroSection from "@/components/layout/HeroSection";

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
    image:
      "/Key Services Image/mist_auto_ac.png",
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
    image:
      "/Key Services Image/domestic_ac.png",
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
    image:
      "/Key Services Image/spare_parts.png",
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
    image:
      "/Key Services Image/new_ac_unit.jpg",
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
    image:
      "/Key Services Image/auto_scanning.jpg",
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
    image:
      "/Key Services Image/industrial_ac.jpg",
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
