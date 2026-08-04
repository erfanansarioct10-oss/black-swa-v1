import type { QuoteItemSchemaType, CreateQuoteSchemaType } from "@/schemas/quote";

export type QuoteStatus =
  | "pending"
  | "under_review"
  | "manager_assigned"
  | "quoted"
  | "completed"
  | "rejected";

export interface QuoteItem {
  id: string;
  quoteId: string;
  productId: string;
  productTitle: string;
  category: string;
  quantity: number;
  unitPrice?: number;
  discountPercentage?: number;
  totalPrice?: number;
  notes?: string | null;
  createdAt: Date;
}

export interface Quote {
  id: string;
  referenceId: string;
  lookupToken: string;
  clerkUserId?: string | null;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  projectScope?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  status: QuoteStatus;
  assignedManagerId?: string | null;
  adminNotes?: string | null;
  subtotal?: number;
  vatAmount?: number;
  shippingCost?: number;
  discountTotal?: number;
  grandTotal?: number;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteWithItems extends Quote {
  items: QuoteItem[];
}

export type CreateQuoteItemInput = QuoteItemSchemaType;
export type CreateQuoteInput = CreateQuoteSchemaType;

export type ActionResponse<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };
