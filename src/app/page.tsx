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
        <div className="mx-auto max-w-6xl px-6 py-10 text-center md:py-14">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Your Premium Auto AC Specialists
          </h2>
          <p className="mt-2 text-sm text-slate-600 md:text-base">
            Expert Auto AC services for all makes and models, with genuine parts
            and premium specialists.
          </p>
          <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-900 md:text-2xl">
              Key Services
            </h3>
            <div className="mt-5 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
            {keyServices.map((service) => (
              <div
                key={service}
                className="rounded-xl border border-sky-100 bg-white px-5 py-4 text-sm font-medium text-slate-800 shadow-sm md:text-base"
              >
                {service}
              </div>
            ))}
            </div>
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
