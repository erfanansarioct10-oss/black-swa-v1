import postgres from 'postgres';

const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
const sql = postgres(connectionString);

async function run() {
  console.log('Seeding sample quotes directly into local database...');

  const [q1] = await sql`
    INSERT INTO quotes (
      reference_id, lookup_token, full_name, email, phone, company_name, budget_range, timeline, project_scope, status
    ) VALUES (
      'RFQ-20260801-B8B6',
      'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      'Lion',
      'lion.lionoct10@gmail.com',
      '9876543210',
      'Noori Digital',
      'Under NPR 500,000',
      'Immediate (< 1 month)',
      'High-priority diagnostic imaging and encoding server deployment.',
      'pending'
    )
    RETURNING id;
  `;

  if (q1?.id) {
    await sql`
      INSERT INTO quote_items (quote_id, product_id, product_title, category, quantity, notes)
      VALUES
        (${q1.id}, 'med-workstation-v1', 'UltraHD Medical Imaging Workstation - MedVision X1', 'Medical Hardware', 2, 'Dual redundant PSU, DICOM 3.0 display calibration'),
        (${q1.id}, 'broadcast-encoder-8k', 'Live Broadcast Video Encoding Server 8K', 'Broadcast Hardware', 1, 'Dual 10GbE SFP+ ports');
    `;
  }

  const [q2] = await sql`
    INSERT INTO quotes (
      reference_id, lookup_token, full_name, email, phone, company_name, budget_range, timeline, project_scope, status
    ) VALUES (
      'RFQ-20260801-9F2C',
      'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      'Dr. Alexander Vance',
      'a.vance@stjude-health.org',
      '+1 (555) 019-2834',
      'St. Jude Medical Center',
      'NPR 2,500,000 - NPR 10,000,000',
      '1 - 3 months',
      'Telehealth gateway installation across 5 regional clinics.',
      'under_review'
    )
    RETURNING id;
  `;

  if (q2?.id) {
    await sql`
      INSERT INTO quote_items (quote_id, product_id, product_title, category, quantity, notes)
      VALUES
        (${q2.id}, 'telehealth-gateway-pro', 'Enterprise Telehealth Hardware Gateway Pro', 'Medical Tech', 5, 'Wall-mount hardware kits included');
    `;
  }

  console.log('Database seeded successfully with sample quote records!');
  await sql.end();
}

run().catch(console.error);
