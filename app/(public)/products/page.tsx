"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, Filter, Search, PlusCircle, Check } from "lucide-react";
import { useQuoteCart } from "@/components/providers/quote-cart-provider";

const sampleProducts = [
  {
    id: "prod-1",
    name: "UltraHD Medical Imaging Workstation - MedVision X1",
    category: "medical",
    categoryDisplay: "Medical Hardware",
    sku: "BS-MED-8000",
    desc: "DICOM-compliant high-speed DICOM diagnostic processing node for hospital radiology departments.",
  },
  {
    id: "prod-2",
    name: "Live Broadcast Video Encoding Server 8K",
    category: "broadcast",
    categoryDisplay: "Broadcast Hardware",
    sku: "BS-BC-9000",
    desc: "Uncompressed low-latency 12G-SDI video encoding computer server for live television networks.",
  },
  {
    id: "prod-3",
    name: "Telehealth Hardware Gateway & Monitor Hub",
    category: "medical",
    categoryDisplay: "Medical Hardware",
    sku: "BS-MED-GATEWAY",
    desc: "HIPAA-compliant encrypted telemedicine computing terminal with bio-sensor telemetry interfaces.",
  },
  {
    id: "prod-4",
    name: "Studio Video Wall Processor Computer",
    category: "broadcast",
    categoryDisplay: "Broadcast Hardware",
    sku: "BS-BC-VWALL",
    desc: "Multi-GPU rackmount hardware engine driving ultra-wide broadcast studio LED displays and graphics.",
  },
];

const VALID_CATEGORIES = ["all", "medical", "broadcast"] as const;

function ProductsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const { addItem } = useQuoteCart();

  const normalizedCategoryParam = categoryParam?.toLowerCase();
  const activeCategory =
    normalizedCategoryParam &&
    (VALID_CATEGORIES as readonly string[]).includes(normalizedCategoryParam)
      ? normalizedCategoryParam
      : "all";

  const handleCategoryChange = (newCategory: string) => {
    const normalizedCategory = newCategory.toLowerCase();
    const targetCategory = (VALID_CATEGORIES as readonly string[]).includes(normalizedCategory)
      ? normalizedCategory
      : "all";

    const params = new URLSearchParams(searchParams.toString());
    if (targetCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", targetCategory);
    }
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  };

  const filteredProducts = sampleProducts.filter((prod) => {
    const matchesCategory =
      activeCategory === "all" || prod.category.toLowerCase() === activeCategory;

    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (prod: typeof sampleProducts[0]) => {
    addItem({
      id: prod.id,
      name: prod.name,
      sku: prod.sku,
      category: prod.categoryDisplay,
    });

    setAddedIds((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [prod.id]: false }));
    }, 1500);
  };

  return (
    <div className="space-y-10">
      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/40 border border-border rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            aria-label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by SKU or keyword..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Category:</span>
          </div>
          <select
            aria-label="Product category"
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            <option value="medical">Medical Hardware</option>
            <option value="broadcast">Broadcast Hardware</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-muted/20 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground text-sm">
            No products found matching your search or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              handleCategoryChange("all");
            }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const isAdded = addedIds[prod.id];
            return (
              <div
                key={prod.id}
                className="group p-5 bg-card border border-border rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-full h-40 bg-accent/60 rounded-lg flex items-center justify-center text-muted-foreground">
                    <Package className="h-12 w-12 stroke-1" />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-accent text-foreground rounded-full">
                    {prod.categoryDisplay}
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
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      isAdded
                        ? "bg-primary/20 text-primary"
                        : "bg-primary text-primary-foreground hover:opacity-90 shadow-xs"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add to Quote Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      {/* Page Header */}
      <div className="space-y-4 text-center sm:text-left border-b border-border pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Equipment Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Medical & Broadcast Hardware
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          Browse our certified medical technology hardware and broadcasting computing infrastructure. Add hardware systems to your Quote Cart for custom corporate pricing.
        </p>
      </div>

      <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading catalog...</div>}>
        <ProductsCatalogContent />
      </Suspense>
    </div>
  );
}
