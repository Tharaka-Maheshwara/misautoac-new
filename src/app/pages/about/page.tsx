import PrecisionCoolingSection from "@/components/layout/PrecisionCoolingSection";
import WhoAreWeSection from "@/components/layout/WhoAreWeSection";
import TeamSection from "@/components/layout/TeamSection";
import CtaSection from "@/components/layout/CtaSection";

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col w-full">
      <PrecisionCoolingSection />
      <WhoAreWeSection />
      <TeamSection />
      <CtaSection />
    </main>
  );
}
