
import ServiceCard from "@/components/common/ServiceCard";
import SubServiceCard from "@/components/common/SubServiceCard";
import type { Metadata } from "next";

// Icons
const IconBuilding = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6" /></svg>;
const IconSnowflake = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.293 2.293-2.293 2.293-2.293-2.293L12 2zm0 18l2.293-2.293-2.293-2.293-2.293 2.293L12 20zm-8-8l2.293 2.293-2.293 2.293L2 12zm18 0l-2.293 2.293 2.293 2.293L22 12zM12 6.75l3.182 3.182-3.182 3.182-3.182-3.182L12 6.75z" /></svg>;
const IconCubeTransparent = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 16.875l9-5.25 9 5.25" /></svg>;
const IconWind = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 3.75zM17.25 6a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM6 7.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 016 7.5zM21 12a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM12 15.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM17.25 18a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM6 19.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" /></svg>;

export const metadata: Metadata = {
    title: "Industrial Refrigeration & AC Services",
    description: "Heavy-duty refrigeration and air conditioning solutions for industrial and commercial clients. We specialize in large-scale installations, maintenance, and repairs.",
};

const industrialService = {
    title: "Industrial Refrigeration & AC",
    description:
        "We provide robust, large-scale air conditioning and refrigeration services for factories, warehouses, and other commercial businesses. Our expertise covers central cooling systems, industrial chillers, and large-scale refrigeration units. We focus on delivering energy-efficient solutions and preventative maintenance to ensure your operations run without interruption.",
    badge: "INDUSTRIAL",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
    image: "/Key Services Image/industrial_ac.jpg",
};

const subServices = [
    {
        icon: <IconBuilding />,
        title: "Central AC Plant Maintenance",
        description: "Comprehensive maintenance and repair for central AC plants in large commercial buildings.",
    },
    {
        icon: <IconSnowflake />,
        title: "Industrial Chiller Repair",
        description: "Specialized service for all types of industrial chillers, ensuring process cooling efficiency.",
    },
    {
        icon: <IconCubeTransparent />,
        title: "Cold Room & Freezer Systems",
        description: "Installation and servicing of walk-in cold rooms and large-scale freezer systems.",
    },
    {
        icon: <IconWind />,
        title: "Ventilation & Air Handling",
        description: "Maintenance of Air Handling Units (AHUs) and ventilation systems for optimal air quality.",
    },
];

export default function IndustrialPage() {
    return (
        <main className="w-full bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        {industrialService.title}
                    </h1>
                    <div className="mt-4 h-1.5 w-24 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full"></div>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-600">
                        Powerful and reliable cooling solutions for your business.
                    </p>
                </div>

                {/* Service Card */}
                <div className="mx-auto max-w-3xl">
                    <ServiceCard
                        title={industrialService.title}
                        description={industrialService.description}
                        badge={industrialService.badge}
                        badgeBg={industrialService.badgeBg}
                        badgeText={industrialService.badgeText}
                        image={industrialService.image}
                    />
                </div>

                {/* Sub-Services Section */}
                <div className="mt-24">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                            Our Industrial Specialties
                        </h2>
                        <div className="mt-3 h-1 w-20 bg-gradient-to-r from-orange-500 to-red-600 mx-auto"></div>
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
