import SparePartCard from "@/components/common/SparePartCard";
import { sparePartsData } from "@/lib/spare-parts-data";

export default function WashingMachineSparePartsPage() {
  const washingMachineParts = sparePartsData.filter(
    (part) => part.category === "Washing Machine"
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Washing Machine Spare Parts
        </h1>
        <p className="mt-4 text-base text-gray-500">
          High-quality spare parts to fix your washing machine.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {washingMachineParts.map((part) => (
            <SparePartCard
              key={part.id}
              name={part.name}
              imageUrl={part.imageUrl}
              price={part.price}
              category={part.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
