const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const IMAGE_MAP = {
  'Espresso': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&h=600&fit=crop',
  'Cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=600&fit=crop',
  'Latte': 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&h=600&fit=crop',
  'Mocha': 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&h=600&fit=crop',
  'Cold Brew': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop',
  'Iced Americano': 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&h=600&fit=crop',
  'Pour Over': 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&h=600&fit=crop',
  'Matcha Latte': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&h=600&fit=crop',
  'Blueberry Muffin': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop',
  'Croissant': 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&h=600&fit=crop',
  'Rwandan Drip': 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&h=600&fit=crop',
};

async function main() {
  const { rows } = await pool.query('SELECT id, name, image, images FROM menu_items ORDER BY id');
  for (const item of rows) {
    const url = IMAGE_MAP[item.name];
    if (!url) {
      console.log(`  Skipping ${item.name} (no image)`);
      continue;
    }
    // Only update if images is empty or doesn't have this URL
    const currentImages = item.images || [];
    if (currentImages.length > 0 && currentImages[0] === url) {
      console.log(`  ✓ ${item.name} already has correct image`);
      continue;
    }
    await pool.query(
      'UPDATE menu_items SET image = $1, images = $2 WHERE id = $3',
      [url, JSON.stringify([url]), item.id]
    );
    console.log(`  ✓ ${item.name} → image set`);
  }

  console.log('\n✅ Done!');
  await pool.end();
}
main().catch(err => { console.error(err); process.exit(1); });
