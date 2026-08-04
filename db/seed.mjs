import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
const sql = postgres(connectionString);

async function run() {
  console.log('No seed data configured. Database is intentionally clean.');
  await sql.end();
}

run().catch((err) => {
  console.error('Seeding script error:', err);
  process.exitCode = 1;
});

