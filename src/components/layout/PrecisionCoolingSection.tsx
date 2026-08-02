import Image from "next/image";

export default function PrecisionCoolingSection() {
  return (
    <section className="relative w-full py-32 md:py-48 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Hero%20Section%20images/engine-bg.jpg"
          alt="Car engine cooling system"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Blue Overlays */}
        <div className="absolute inset-0 bg-[#0d2240]/60 z-10 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#05142b]/90 via-[#05142b]/70 to-transparent z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-[1500px] px-6 md:px-12 h-full flex flex-col justify-center">
        <div className="max-w-4xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-wide">
            Precision Cooling for the<br />Modern Road
          </h2>
          <p className="text-lg md:text-xl text-blue-100/90 leading-relaxed font-medium tracking-wide">
            Engineering comfort through specialized automotive climate control expertise and mechanical excellence.
          </p>
        </div>
      </div>
    </section>
  );
}
