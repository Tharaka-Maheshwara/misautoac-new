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

      {/* Key Services Section */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Key Services
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Comprehensive solutions for all your cooling needs.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Service Item 1 */}
            <div className="rounded-lg bg-sky-50 p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-slate-800">Mist Auto A/C</h3>
              <p className="mt-2 text-slate-600">
                Specialized services for all types of vehicle air conditioning systems.
              </p>
            </div>

            {/* Service Item 2 */}
            <div className="rounded-lg bg-sky-50 p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-slate-800">Domestic A/C & Refrigerator</h3>
              <p className="mt-2 text-slate-600">
                Expert repair and maintenance for home air conditioners and refrigerators.
              </p>
            </div>

            {/* Service Item 3 */}
            <div className="rounded-lg bg-sky-50 p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-slate-800">Spare Parts & Accessories</h3>
              <p className="mt-2 text-slate-600">
                Genuine spare parts and accessories for all AC and refrigeration units.
              </p>
            </div>

            {/* Service Item 4 */}
            <div className="rounded-lg bg-sky-50 p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-slate-800">Brand New AC Unit</h3>
              <p className="mt-2 text-slate-600">
                Installation and sales of high-quality brand new AC units.
              </p>
            </div>

            {/* Service Item 5 */}
            <div className="rounded-lg bg-sky-50 p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-slate-800">Auto Scanning</h3>
              <p className="mt-2 text-slate-600">
                Advanced auto scanning and diagnostics for precise issue identification.
              </p>
            </div>

            {/* Service Item 6 */}
            <div className="rounded-lg bg-sky-50 p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-slate-800">Industrial Ref & AC</h3>
              <p className="mt-2 text-slate-600">
                Specialized services for industrial refrigeration and air conditioning systems.
              </p>
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
