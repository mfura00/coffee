const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const fix = async () => {
  const res = await pool.query("SELECT id, name, image FROM menu_items WHERE image LIKE '%localhost%' OR image LIKE '%/uploads/%' OR image LIKE 'http://%'");
  console.log(`Found ${res.rows.length} items with old local URLs`);
  for (const row of res.rows) {
    await pool.query('UPDATE menu_items SET image = $1, images = $2 WHERE id = $3', ['', '[]', row.id]);
    console.log(`Cleared: ${row.name} (${row.image})`);
  }
  console.log('Done! Refresh your site — images will show default placeholders.');
  await pool.end();
};

fix().catch(err => { console.error(err); process.exit(1); });
