export interface SparePart {
  id: number;
  name: string;
  category:
    | "Auto AC"
    | "Room AC"
    | "Refrigerator"
    | "Washing Machine"
    | "Refrigerant & Accessories";
  price: string;
  imageUrl: string;
}

export const sparePartsData: SparePart[] = [
  // Auto AC Parts
  {
    id: 1,
    name: "Car AC Compressor",
    category: "Auto AC",
    price: "Rs. 25,000",
    imageUrl: "/Key Services Image/new_ac_unit.jpg",
  },
  {
    id: 2,
    name: "Car AC Condenser",
    category: "Auto AC",
    price: "Rs. 15,000",
    imageUrl: "/Hero Section images/engine-bg.jpg",
  },
  {
    id: 3,
    name: "Blower Motor",
    category: "Auto AC",
    price: "Rs. 8,500",
    imageUrl: "/Key Services Image/auto_scanning.jpg",
  },
  {
    id: 4,
    name: "Expansion Valve",
    category: "Auto AC",
    price: "Rs. 4,000",
    imageUrl: "/Key Services Image/spare_parts.png",
  },

  // Room AC Parts
  {
    id: 5,
    name: "Split AC Indoor Unit",
    category: "Room AC",
    price: "Rs. 35,000",
    imageUrl: "/Key Services Image/domestic_ac.png",
  },
  {
    id: 6,
    name: "AC Remote Control",
    category: "Room AC",
    price: "Rs. 2,500",
    imageUrl: "/Key Services Image/new_ac_unit.jpg",
  },
  {
    id: 7,
    name: "Outdoor Unit Fan",
    category: "Room AC",
    price: "Rs. 7,000",
    imageUrl: "/Key Services Image/industrial_ac.jpg",
  },
  {
    id: 8,
    name: "AC Capacitor",
    category: "Room AC",
    price: "Rs. 3,000",
    imageUrl: "/Key Services Image/spare_parts.png",
  },

  // Refrigerator Parts
  {
    id: 9,
    name: "Refrigerator Compressor",
    category: "Refrigerator",
    price: "Rs. 18,000",
    imageUrl: "/Hero Section images/hero_slide_1.jpg",
  },
  {
    id: 10,
    name: "Thermostat",
    category: "Refrigerator",
    price: "Rs. 3,500",
    imageUrl: "/Hero Section images/hero_slide_2.jpg",
  },
  {
    id: 11,
    name: "Door Gasket",
    category: "Refrigerator",
    price: "Rs. 4,000",
    imageUrl: "/Hero Section images/hero_slide_3.jpg",
  },
  {
    id: 12,
    name: "Defrost Timer",
    category: "Refrigerator",
    price: "Rs. 2,800",
    imageUrl: "/Hero Section images/hero_slide_4.jpg",
  },

  // Washing Machine Parts
  {
    id: 13,
    name: "Washing Machine Motor",
    category: "Washing Machine",
    price: "Rs. 12,000",
    imageUrl: "/Key Services Image/mist_auto_ac.png",
  },
  {
    id: 14,
    name: "Inlet Valve",
    category: "Washing Machine",
    price: "Rs. 2,500",
    imageUrl: "/Key Services Image/spare_parts.png",
  },
  {
    id: 15,
    name: "Drain Pump",
    category: "Washing Machine",
    price: "Rs. 3,800",
    imageUrl: "/Key Services Image/new_ac_unit.jpg",
  },
  {
    id: 16,
    name: "PCB Board",
    category: "Washing Machine",
    price: "Rs. 9,000",
    imageUrl: "/Key Services Image/auto_scanning.jpg",
  },

  // Refrigerant & Accessories
  {
    id: 17,
    name: "R134a Refrigerant Can",
    category: "Refrigerant & Accessories",
    price: "Rs. 1,500",
    imageUrl: "/Key Services Image/domestic_ac.png",
  },
  {
    id: 18,
    name: "Manifold Gauge Set",
    category: "Refrigerant & Accessories",
    price: "Rs. 12,500",
    imageUrl: "/Key Services Image/industrial_ac.jpg",
  },
  {
    id: 19,
    name: "Copper Tubing",
    category: "Refrigerant & Accessories",
    price: "Rs. 800/meter",
    imageUrl: "/Hero Section images/engine-bg.jpg",
  },
  {
    id: 20,
    name: "Leak Detector",
    category: "Refrigerant & Accessories",
    price: "Rs. 6,000",
    imageUrl: "/Key Services Image/auto_scanning.jpg",
  },
];
