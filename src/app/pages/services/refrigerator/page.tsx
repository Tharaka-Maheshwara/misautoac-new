
import ServiceCard from "@/components/common/ServiceCard";
import SubServiceCard from "@/components/common/SubServiceCard";
import type { Metadata } from "next";

// Icons
const IconCog = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 00-1.5 4.13m18 0a7.5 7.5 0 00-1.5-4.13M12 4.5v-1.5m0 18v-1.5m-4.13-15H6.37m11.26 0h-1.5m-11.26 15H6.37m11.26 0h-1.5" /></svg>;
const IconDroplet = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.343a10.45 10.45 0 018.247 4.513c.27.4.453.83.605 1.277a.75.75 0 01-1.4.498 8.95 8.95 0 00-14.904 0 .75.75 0 01-1.4-.498c.152-.447.335-.877.605-1.277A10.45 10.45 0 0112 6.343z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a6.75 6.75 0 00-6.75 6.75h13.5a6.75 6.75 0 00-6.75-6.75z" /></svg>;
const IconThermometer = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a.75.75 0 01.75.75v11.516a4.5 4.5 0 01-3.98 4.48-4.5 4.5 0 01-5.02-3.98A4.5 4.5 0 0112 2.25z" /></svg>;
const IconCube = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;

export const metadata: Metadata = {
    title: "Refrigerator Repair Services",
    description: "Professional repair and maintenance services for all types of domestic and commercial refrigerators. We ensure your appliances run efficiently.",
};

const refrigeratorService = {
    title: "Refrigerator Repair",
    description:
        "Our skilled technicians provide fast and reliable repair and maintenance services for all brands of domestic and commercial refrigerators. From fixing cooling issues to compressor problems, we use high-quality spare parts to ensure the longevity and efficiency of your appliance. We handle everything from standard fridges to deep freezers.",
    badge: "HOME & COMMERCIAL",
    badgeBg: "bg-cyan-100",
    badgeText: "text-cyan-700",
    image: "/Key Services Image/domestic_ac.png",
};

const subServices = [
    {
        icon: <IconCog />,
        title: "Compressor Repair",
        description: "Expert diagnostics and repair for faulty compressors to restore your fridge's cooling.",
    },
    {
        icon: <IconDroplet />,
        title: "Gas Leak & Refilling",
        description: "We safely detect and repair refrigerant leaks, followed by a professional gas refill.",
    },
    {
        icon: <IconThermometer />,
        title: "Thermostat & Cooling Issues",
        description: "Solving all temperature regulation problems, from faulty thermostats to inconsistent cooling.",
    },
    {
        icon: <IconCube />,
        title: "Freezer & Ice Maker Repair",
        description: "Specialized repairs for freezer compartments and automated ice maker systems.",
    },
];

export default function RefrigeratorPage() {
    return (
        <main className="w-full bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        {refrigeratorService.title}
                    </h1>
                    <div className="mt-4 h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-teal-600 mx-auto rounded-full"></div>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-600">
                        Reliable and efficient refrigerator repairs to keep your food fresh.
                    </p>
                </div>

                {/* Service Card */}
                <div className="mx-auto max-w-3xl">
                    <ServiceCard
                        title={refrigeratorService.title}
                        description={refrigeratorService.description}
                        badge={refrigeratorService.badge}
                        badgeBg={refrigeratorService.badgeBg}
                        badgeText={refrigeratorService.badgeText}
                        image={refrigeratorService.image}
                    />
                </div>

                {/* Sub-Services Section */}
                <div className="mt-24">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                            Our Refrigerator Specialties
                        </h2>
                        <div className="mt-3 h-1 w-20 bg-gradient-to-r from-cyan-500 to-teal-600 mx-auto"></div>
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
