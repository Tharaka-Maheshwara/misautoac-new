import Image from "next/image";

const teamMembers = [
  {
    id: 1,
    name: "Marcus Thorne",
    role: "LEAD TECHNICIAN",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600",
  },
  {
    id: 2,
    name: "Elena Rodriguez",
    role: "SERVICE MANAGER",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600",
  },
  {
    id: 3,
    name: "David Chen",
    role: "DIAGNOSTICS SPECIALIST",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600",
  },
];

export default function TeamSection() {
  return (
    <section className="w-full bg-slate-50 py-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#061834] mb-4">Meet Our Team</h2>
          <p className="text-lg text-slate-500 font-medium tracking-wide">
            The experts behind the chill.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100"
            >
              {/* Image Container */}
              <div className="relative h-80 w-full overflow-hidden bg-slate-200">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Info Container */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#061834] mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
