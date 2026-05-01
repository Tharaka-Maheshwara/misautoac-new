import Image from "next/image";

export default function WhoAreWeSection() {
  return (
    <section className="w-full py-24 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <div className="mb-6 inline-block rounded-full bg-blue-100 px-4 py-1.5 w-fit">
              <span className="text-sm font-bold tracking-wide text-blue-700">EST. 2014</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#061834] mb-8">
              Who Are We?
            </h2>
            
            <div className="space-y-6">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Mist Air Condition is a leading name in air conditioning and refrigeration repairs in Sri Lanka. With over 10 years of experience, we are committed to providing the highest quality service for any type of AC and refrigeration system.
              </p>
              
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Our main goal is to provide a reliable and lasting solution to your needs through our skilled and experienced technicians, using only high-quality spare parts.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="p-4 md:p-6 bg-slate-50 rounded-[2rem]">
              <div className="relative h-[350px] md:h-[450px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/Hero%20Section%20images/hero_slide_1.jpg"
                  alt="About Mist Auto A/C"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
