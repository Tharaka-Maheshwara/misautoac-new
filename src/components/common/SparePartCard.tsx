import Image from "next/image";
import Link from "next/link";

interface SparePartCardProps {
  name: string;
  imageUrl: string;
  price: string;
  category: string;
}

export default function SparePartCard({
  name,
  imageUrl,
  price,
  category,
}: SparePartCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
      <div className="aspect-w-3 aspect-h-2 bg-gray-200 sm:aspect-none sm:h-48">
        <Image
          src={imageUrl}
          alt={name}
          width={300}
          height={200}
          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-base font-bold text-gray-900">
          <Link href="#">
            <span aria-hidden="true" className="absolute inset-0" />
            {name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500">{category}</p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-medium text-gray-900">{price}</p>
        </div>
      </div>
    </div>
  );
}
