-- Migration: Create proposal_versions table for proposal versioning and expiration tracking
CREATE TABLE IF NOT EXISTS proposal_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  subtotal INTEGER NOT NULL DEFAULT 0,
  vat_amount INTEGER NOT NULL DEFAULT 0,
  shipping_cost INTEGER NOT NULL DEFAULT 0,
  discount_total INTEGER NOT NULL DEFAULT 0,
  grand_total INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NPR',
  validity_days INTEGER NOT NULL DEFAULT 30,
  expires_at TIMESTAMPTZ,
  custom_message TEXT,
  terms_and_conditions TEXT,
  dispatched_at TIMESTAMPTZ,
  dispatched_by_clerk_user_id TEXT,
  viewed_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  snapshot_data TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_proposal_versions_quote_id ON proposal_versions(quote_id);
CREATE INDEX IF NOT EXISTS idx_proposal_versions_version ON proposal_versions(quote_id, version_number);

-- Enable Row Level Security
ALTER TABLE proposal_versions ENABLE ROW LEVEL SECURITY;

-- Security Policy: Authenticated users can read proposal versions
CREATE POLICY "Enable read access for authenticated users" ON proposal_versions
  FOR SELECT TO authenticated USING (true);
