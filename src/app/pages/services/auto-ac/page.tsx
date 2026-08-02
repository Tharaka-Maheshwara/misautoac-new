
import ServiceCard from "@/components/common/ServiceCard";
import SubServiceCard from "@/components/common/SubServiceCard";
import type { Metadata } from "next";

// Icons (replace with actual icons, e.g., from heroicons)
const IconWind = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 3.75zM17.25 6a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM6 7.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 016 7.5zM21 12a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM12 15.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM17.25 18a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM6 19.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" /></svg>;
const IconDroplet = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.343a10.45 10.45 0 018.247 4.513c.27.4.453.83.605 1.277a.75.75 0 01-1.4.498 8.95 8.95 0 00-14.904 0 .75.75 0 01-1.4-.498c.152-.447.335-.877.605-1.277A10.45 10.45 0 0112 6.343z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a6.75 6.75 0 00-6.75 6.75h13.5a6.75 6.75 0 00-6.75-6.75z" /></svg>;
const IconCog = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 00-1.5 4.13m18 0a7.5 7.5 0 00-1.5-4.13M12 4.5v-1.5m0 18v-1.5m-4.13-15H6.37m11.26 0h-1.5m-11.26 15H6.37m11.26 0h-1.5" /></svg>;
const IconSearch = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;


export const metadata: Metadata = {
    title: "Auto AC Services",
    description: "Expert auto air conditioning repair, maintenance, and services. We use high-quality parts to ensure your vehicle's AC runs smoothly.",
};

const autoAcService = {
    title: "Auto AC Services",
    description:
        "We provide expert air conditioning system repairs and services for all types of cars, from sedans to SUVs. Our certified technicians use only high-quality, genuine spare parts to provide a durable and reliable solution for all your auto AC needs. Whether it's a simple regas, leak detection, or a full system overhaul, we have you covered.",
    badge: "AUTO AC",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
    image: "/Key Services Image/mist_auto_ac.png",
};

const subServices = [
    {
        icon: <IconDroplet />,
        title: "AC Gas Refill & Recharge",
        description: "We restore your AC's cooling power with high-quality refrigerant, ensuring optimal performance.",
    },
    {
        icon: <IconSearch />,
        title: "Leak Detection & Repair",
        description: "Using advanced tools, we accurately find and fix any leaks in your car's AC system.",
    },
    {
        icon: <IconCog />,
        title: "Compressor Service",
        description: "Expert repair and replacement services for your AC compressor, the heart of the system.",
    },
    {
        icon: <IconWind />,
        title: "Blower Motor & Fan Repair",
        description: "We fix issues with blower motors and fans to ensure strong and consistent airflow.",
    },
];

export default function AutoAcPage() {
    return (
        <main className="w-full bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        {autoAcService.title}
                    </h1>
                    <div className="mt-4 h-1.5 w-24 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto rounded-full"></div>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-600">
                        Keep your cool on the road. Professional AC services for all vehicle types.
                    </p>
                </div>

                {/* Main Service Card */}
                <div className="mx-auto max-w-3xl">
                    <ServiceCard
                        title={autoAcService.title}
                        description={autoAcService.description}
                        badge={autoAcService.badge}
                        badgeBg={autoAcService.badgeBg}
                        badgeText={autoAcService.badgeText}
                        image={autoAcService.image}
                    />
                </div>

                {/* Sub-Services Section */}
                <div className="mt-24">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                            Our Auto AC Specialties
                        </h2>
                        <div className="mt-3 h-1 w-20 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto"></div>
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
