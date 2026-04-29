import HeroSection from "@/components/layout/HeroSection";

const keyServices = [
  "Mist Auto A/C",
  "Domestic A/C & Refrigerator",
  "Spare Parts & Accessories",
  "Brand New AC Unit",
  "Auto Scanning",
  "Industrial Ref & AC",
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

      <section className="w-full bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              Our Expertise
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              Key Services
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
              Complete cooling and refrigeration solutions delivered by
              experienced technicians with trusted parts.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {keyServices.map((service) => (
              <div
                key={service}
                className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:border-sky-300 hover:bg-sky-50 md:text-base"
              >
                {service}
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
