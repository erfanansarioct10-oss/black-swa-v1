import Link from "next/link";
import { Package, Filter, Search, PlusCircle } from "lucide-react";

const sampleProducts = [
  {
    id: "prod-1",
    name: "ANSI Centrifugal Slurry Pump - Heavy Duty",
    category: "Pumps",
    sku: "BS-PUMP-800X",
    desc: "Corrosion-resistant alloy casing for high-solids fluid transfer in severe mining and process applications.",
  },
  {
    id: "prod-2",
    name: "Dual Cartridge Mechanical Seal - API 682",
    category: "Seals",
    sku: "BS-SEAL-682D",
    desc: "Self-aligning dual cartridge seal engineered for hazardous chemical containment and high thermal stability.",
  },
  {
    id: "prod-3",
    name: "High-Pressure Hydraulic Control Valve 4000 PSI",
    category: "Valves",
    sku: "BS-VALVE-4K",
    desc: "Stainless steel forged body with pneumatic actuator for rapid shutoff and throttling precision.",
  },
  {
    id: "prod-4",
    name: "Spherical Roller Bearing Assembly",
    category: "Bearings",
    sku: "BS-BRG-9900",
    desc: "Heavy radial and axial load capacity designed for mining conveyers and crushers.",
  },
];

export default function ProductsPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      {/* Page Header */}
      <div className="space-y-4 text-center sm:text-left border-b border-border pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Equipment Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Industrial Products & Components
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          Browse our certified heavy equipment inventory. Add products to your Quote Cart to receive customized B2B pricing and delivery schedules.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/40 border border-border rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by SKU or keyword..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Category:</span>
          </div>
          <select className="px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">All Categories</option>
            <option value="pumps">Pumps</option>
            <option value="seals">Seals</option>
            <option value="valves">Valves</option>
            <option value="bearings">Bearings</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleProducts.map((prod) => (
          <div
            key={prod.id}
            className="group p-5 bg-card border border-border rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-full h-40 bg-accent/60 rounded-lg flex items-center justify-center text-muted-foreground">
                <Package className="h-12 w-12 stroke-1" />
              </div>
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-accent text-foreground rounded-full">
                {prod.category}
              </span>
              <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                {prod.name}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                SKU: {prod.sku}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {prod.desc}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-border flex items-center justify-between">
              <Link
                href="/quote"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add to Quote Cart</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
