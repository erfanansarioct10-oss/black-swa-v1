-- Migration: Add per-stage SLA tracking timestamps to quotes table
ALTER TABLE "quotes" 
ADD COLUMN IF NOT EXISTS "assigned_at" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "quoted_at" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "completed_at" timestamp with time zone;
