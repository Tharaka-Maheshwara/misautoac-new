import PrecisionCoolingSection from "@/components/layout/PrecisionCoolingSection";
import WhoAreWeSection from "@/components/layout/WhoAreWeSection";
import TeamSection from "@/components/layout/TeamSection";
import CtaSection from "@/components/layout/CtaSection";
import CustomerFeedbackForm from "@/components/forms/CustomerFeedbackForm";

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col w-full">
      <PrecisionCoolingSection />
      <WhoAreWeSection />
      <TeamSection />
      <CustomerFeedbackForm />
      <CtaSection />
    </main>
  );
}
