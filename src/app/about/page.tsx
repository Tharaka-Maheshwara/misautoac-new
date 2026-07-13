"use client";

import PrecisionCoolingSection from "@/components/layout/PrecisionCoolingSection";
import WhoAreWeSection from "@/components/layout/WhoAreWeSection";
import TeamSection from "@/components/layout/TeamSection";
import CtaSection from "@/components/layout/CtaSection";
import TestimonialsSection from "@/components/layout/TestimonialsSection"; // Changed import
import { useAuth } from "@/context/AuthContext";

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <main className="flex flex-1 flex-col w-full">
      <PrecisionCoolingSection />
      <WhoAreWeSection />
      <TeamSection />
      {user && <TestimonialsSection />} 
      <CtaSection />
    </main>
  );
}