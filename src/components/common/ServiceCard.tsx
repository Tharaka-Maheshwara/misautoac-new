
import Image from "next/image";

interface ServiceCardProps {
  title: string;
  description: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  image: string;
}

export default function ServiceCard({
  title,
  description,
  badge,
  badgeBg,
  badgeText,
  image,
}: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
      {/* Image Background */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-200 shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <div className="relative p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <div
            className={`inline-block rounded-full ${badgeBg} px-4 py-1.5`}
          >
            <span
              className={`text-xs font-bold tracking-wide uppercase ${badgeText}`}
            >
              {badge}
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-600 leading-relaxed flex-grow text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
