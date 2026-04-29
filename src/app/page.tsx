import HeroSection from "@/components/layout/HeroSection";

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
