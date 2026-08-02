"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export interface QuoteCartItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  notes?: string;
}

interface QuoteCartContextType {
  items: QuoteCartItem[];
  itemCount: number;
  mounted: boolean;
  addItem: (product: { id: string; name: string; sku: string; category: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "blackswan_quote_cart";

function isQuoteCartItem(value: unknown): value is QuoteCartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.sku === "string" &&
    typeof item.category === "string" &&
    typeof item.quantity === "number" &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity > 0 &&
    (item.notes === undefined || typeof item.notes === "string")
  );
}

const subscribeQuoteCart = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("quote-cart-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("quote-cart-change", callback);
  };
};

const getQuoteCartSnapshot = (): string => {
  if (typeof window === "undefined") return "[]";
  try {
    return localStorage.getItem(STORAGE_KEY) || "[]";
  } catch {
    return "[]";
  }
};

const getQuoteCartServerSnapshot = (): string => "[]";

const QuoteCartContext = createContext<QuoteCartContextType | undefined>(undefined);

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const rawCart = useSyncExternalStore(
    subscribeQuoteCart,
    getQuoteCartSnapshot,
    getQuoteCartServerSnapshot
  );

  const mounted = useSyncExternalStore(
    subscribeQuoteCart,
    () => true,
    () => false
  );

  const items = React.useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(rawCart);
      return Array.isArray(parsed) ? parsed.filter(isQuoteCartItem) : [];
    } catch {
      return [];
    }
  }, [rawCart]);

  const saveItemsToStorage = (newItems: QuoteCartItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event("quote-cart-change"));
    } catch (e) {
      console.error("Failed to save quote cart items to localStorage:", e);
    }
  };

  const getCurrentItemsSnapshot = (): QuoteCartItem[] => {
    try {
      const snapshot = getQuoteCartSnapshot();
      const parsed: unknown = JSON.parse(snapshot);
      return Array.isArray(parsed) ? parsed.filter(isQuoteCartItem) : [];
    } catch {
      return [];
    }
  };

  const addItem = (product: { id: string; name: string; sku: string; category: string }) => {
    const current = getCurrentItemsSnapshot();
    const existing = current.find((item) => item.id === product.id);
    let updated: QuoteCartItem[];
    if (existing) {
      updated = current.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [...current, { ...product, quantity: 1 }];
    }
    saveItemsToStorage(updated);
  };

  const removeItem = (id: string) => {
    const current = getCurrentItemsSnapshot();
    const updated = current.filter((item) => item.id !== id);
    saveItemsToStorage(updated);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const current = getCurrentItemsSnapshot();
    const updated = current.map((item) => (item.id === id ? { ...item, quantity } : item));
    saveItemsToStorage(updated);
  };

  const updateNotes = (id: string, notes: string) => {
    const current = getCurrentItemsSnapshot();
    const updated = current.map((item) => (item.id === id ? { ...item, notes } : item));
    saveItemsToStorage(updated);
  };

  const clearCart = () => {
    saveItemsToStorage([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <QuoteCartContext.Provider
      value={{
        items,
        itemCount,
        mounted,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
      }}
    >
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);
  if (!context) {
    throw new Error("useQuoteCart must be used within a QuoteCartProvider");
  }
  return context;
}
