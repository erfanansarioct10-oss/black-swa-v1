CREATE TABLE "contact_inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"company_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"service_slug" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_contact_inquiries_email" ON "contact_inquiries" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_contact_inquiries_status" ON "contact_inquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_quote_items_quote_id" ON "quote_items" USING btree ("quote_id");--> statement-breakpoint
CREATE INDEX "idx_quotes_clerk_user_id" ON "quotes" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "idx_quotes_status" ON "quotes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_quotes_upper_reference_id" ON "quotes" USING btree (upper("reference_id"));--> statement-breakpoint
CREATE INDEX "idx_quotes_lower_email" ON "quotes" USING btree (lower("email"));