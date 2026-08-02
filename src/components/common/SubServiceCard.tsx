
import { ReactNode } from "react";

interface SubServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function SubServiceCard({ icon, title, description }: SubServiceCardProps) {
  return (
    <div className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-lg border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 cursor-default">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-800 transition-colors duration-300 group-hover:text-blue-700">
        {title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
