import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="w-full bg-slate-50 py-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between bg-slate-200 rounded-2xl p-8 md:p-12">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002855] mb-3">
              Ready for a Cooler Drive?
            </h2>
            <p className="text-lg text-slate-600">
              Book your comprehensive AC health check today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/contact"
              className="px-8 py-3 bg-[#002855] text-white font-medium rounded-md hover:bg-[#003f8a] transition-colors text-center shadow-sm"
            >
              Book Now
            </Link>
            <Link
              href="/services"
              className="px-8 py-3 bg-transparent text-[#002855] font-medium rounded-md border border-[#002855] hover:bg-slate-300 transition-colors text-center"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
