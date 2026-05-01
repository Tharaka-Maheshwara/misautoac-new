import PrecisionCoolingSection from "@/components/layout/PrecisionCoolingSection";

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col w-full">
      <PrecisionCoolingSection />
      
      <div className="py-20 px-8 flex items-center justify-center">
        <h1 className="text-3xl font-semibold">About Us</h1>
      </div>
    </main>
  );
}
