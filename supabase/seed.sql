-- Seed initial demo quotes for local development
INSERT INTO quotes (
  id, reference_id, lookup_token, full_name, email, phone, company_name, budget_range, timeline, project_scope, status
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'RFQ-20260801-B8B6',
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'John Doe',
  'john.doe@example.com',
  '9876543210',
  'Noori Digital',
  'Under NPR 500,000',
  'Immediate (< 1 month)',
  'High-priority diagnostic imaging and encoding server deployment.',
  'pending'
) ON CONFLICT (reference_id) DO NOTHING;

INSERT INTO quote_items (quote_id, product_id, product_title, category, quantity, notes)
SELECT * FROM (VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'med-workstation-v1', 'UltraHD Medical Imaging Workstation - MedVision X1', 'Medical Hardware', 2, 'Dual redundant PSU, DICOM 3.0 display calibration'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'broadcast-encoder-8k', 'Live Broadcast Video Encoding Server 8K', 'Broadcast Hardware', 1, 'Dual 10GbE SFP+ ports')
) AS v(quote_id, product_id, product_title, category, quantity, notes)
WHERE NOT EXISTS (
  SELECT 1 FROM quote_items qi WHERE qi.quote_id = v.quote_id AND qi.product_id = v.product_id
);

INSERT INTO quotes (
  id, reference_id, lookup_token, full_name, email, phone, company_name, budget_range, timeline, project_scope, status
) VALUES (
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'RFQ-20260801-9F2C',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'Dr. Alexander Vance',
  'a.vance@example.com',
  '+1 (555) 019-2834',
  'Example Regional Medical Center',
  'NPR 2,500,000 - NPR 10,000,000',
  '1 - 3 months',
  'Telehealth gateway installation across 5 regional clinics.',
  'under_review'
) ON CONFLICT (reference_id) DO NOTHING;

INSERT INTO quote_items (quote_id, product_id, product_title, category, quantity, notes)
SELECT * FROM (VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'telehealth-gateway-pro', 'Enterprise Telehealth Hardware Gateway Pro', 'Medical Tech', 5, 'Wall-mount hardware kits included')
) AS v(quote_id, product_id, product_title, category, quantity, notes)
WHERE NOT EXISTS (
  SELECT 1 FROM quote_items qi WHERE qi.quote_id = v.quote_id AND qi.product_id = v.product_id
);

