"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, Filter, Search, PlusCircle, Check } from "lucide-react";
import { useQuoteCart } from "@/components/providers/quote-cart-provider";
import { SAMPLE_PRODUCTS } from "@/constants/products";

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
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }
    const queryStr = params.toString();
    router.push(`/products${queryStr ? `?${queryStr}` : ""}`, { scroll: false });
  };

  const filteredProducts = SAMPLE_PRODUCTS.filter((prod) => {
    const matchesCategory =
      activeCategory === "all" || prod.category === activeCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToQuote = (prod: (typeof SAMPLE_PRODUCTS)[number]) => {
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
    <div className="space-y-8">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU, or specs..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {[
            { id: "all", label: "All Equipment" },
            { id: "medical", label: "Medical Tech" },
            { id: "broadcast", label: "Broadcast Hardware" },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border p-8 space-y-4">
          <Package className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-bold text-foreground">No Products Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No equipment matches your selected filter criteria. Try adjusting your search query or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              handleCategoryChange("all");
            }}
            className="px-4 py-2 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/80"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((prod) => {
            const isAdded = !!addedIds[prod.id];
            return (
              <div
                key={prod.id}
                className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:border-foreground/20 transition-all space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-muted text-muted-foreground">
                      {prod.categoryDisplay}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      SKU: {prod.sku}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground leading-snug">
                    {prod.name}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {prod.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    In Stock • Custom Options
                  </span>

                  <button
                    onClick={() => handleAddToQuote(prod)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-foreground text-background hover:opacity-90"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Added to Quote</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add to Quote</span>
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

export function ProductCatalog() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted-foreground bg-card rounded-xl border border-border">
          Loading hardware catalog...
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
