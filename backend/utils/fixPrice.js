// Fix: Rwandan Drip price was doubled (4500 RWF × 1300 = 5,850,000), restore to 5200 RWF
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  // Fix Rwandan Drip price
  const result = await pool.query(
    "UPDATE menu_items SET price = 5200 WHERE LOWER(TRIM(name)) = 'rwandan drip' RETURNING id, name, price"
  );
  if (result.rows.length) {
    console.log(`Fixed ${result.rows[0].name}: price = RWF ${result.rows[0].price}`);
  } else {
    console.log('Rwandan Drip not found');
  }

  // Show all current items
  const { rows } = await pool.query('SELECT id, name, price FROM menu_items ORDER BY id');
  console.log('\nCurrent menu items:');
  for (const r of rows) {
    console.log(`  ${r.id}. ${r.name} — RWF ${Number(r.price).toLocaleString()}`);
  }

  await pool.end();
}
main().catch(err => { console.error(err); process.exit(1); });
