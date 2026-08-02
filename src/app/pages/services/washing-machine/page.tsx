
import ServiceCard from "@/components/common/ServiceCard";
import SubServiceCard from "@/components/common/SubServiceCard";
import type { Metadata } from "next";

// Icons
const IconCog = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 00-1.5 4.13m18 0a7.5 7.5 0 00-1.5-4.13M12 4.5v-1.5m0 18v-1.5m-4.13-15H6.37m11.26 0h-1.5m-11.26 15H6.37m11.26 0h-1.5" /></svg>;
const IconWrench = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>;
const IconChip = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l3.75-3.75m0 0h3.75m-3.75 0V6m11.25 3.75l-3.75 3.75m0 0H15m3.75 0V6m-3.75 7.5v3.75m0 0h-3.75m3.75 0l-3.75 3.75M9.75 13.5v3.75m0 0H6m3.75 0l-3.75 3.75" /></svg>;
const IconDoor = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3v10.5a3 3 0 01-3 3h-6a3 3 0 01-3-3V8.25a3 3 0 013-3h6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export const metadata: Metadata = {
    title: "Washing Machine Repair Services",
    description: "Expert repair services for all brands of washing machines. We handle everything from drum issues to electronic faults, ensuring your laundry is back on track.",
};

const washingMachineService = {
    title: "Washing Machine Repair",
    description:
        "We offer comprehensive repair services for all types and brands of washing machines, including top-load, front-load, and automatic models. Our experienced technicians can diagnose and fix a wide range of issues, such as drum malfunctions, drainage problems, and electronic faults. We use quality parts to guarantee a lasting repair and get your appliance running smoothly again.",
    badge: "HOME APPLIANCE",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-700",
    image: "/Key Services Image/spare_parts.png", // Placeholder image
};

const subServices = [
    {
        icon: <IconCog />,
        title: "Drum & Motor Repair",
        description: "Fixing noisy drums, motor failures, and belt issues for all washing machine models.",
    },
    {
        icon: <IconWrench />,
        title: "Drainage & Pump Issues",
        description: "Clearing blockages and repairing or replacing faulty drain pumps to prevent water damage.",
    },
    {
        icon: <IconChip />,
        title: "Electronic Panel & PCB Repair",
        description: "Diagnosing and fixing control board and electronic panel malfunctions.",
    },
    {
        icon: <IconDoor />,
        title: "Door Seal & Gasket Replacement",
        description: "Replacing worn or leaky door seals to prevent leaks and ensure a proper wash cycle.",
    },
];

export default function WashingMachinePage() {
    return (
        <main className="w-full bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        {washingMachineService.title}
                    </h1>
                    <div className="mt-4 h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-600">
                        Fast and effective solutions to all your washing machine problems.
                    </p>
                </div>

                {/* Service Card */}
                <div className="mx-auto max-w-3xl">
                    <ServiceCard
                        title={washingMachineService.title}
                        description={washingMachineService.description}
                        badge={washingMachineService.badge}
                        badgeBg={washingMachineService.badgeBg}
                        badgeText={washingMachineService.badgeText}
                        image={washingMachineService.image}
                    />
                </div>

                {/* Sub-Services Section */}
                <div className="mt-24">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                            Our Washing Machine Specialties
                        </h2>
                        <div className="mt-3 h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {subServices.map((service) => (
                            <SubServiceCard
                                key={service.title}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
