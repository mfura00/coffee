const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const calculateHealthScore = (caffeine, calories, antioxidants, sugar, fat) => {
  let score = 50;
  score -= Math.min(caffeine / 10, 20);
  score -= Math.min(calories / 20, 15);
  score -= Math.min(sugar / 5, 10);
  score -= Math.min(fat / 3, 10);
  score += Math.min(antioxidants * 0.7, 20);
  return Math.max(0, Math.min(100, Math.round(score)));
};

const seedData = async () => {
  console.log('Connected to Neon PostgreSQL');

  const adminCheck = await pool.query("SELECT id FROM users WHERE email = 'admin@gmail.com'");
  if (!adminCheck.rows.length) {
    const hashedPw = await bcrypt.hash('1234', 12);
    await pool.query('INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)', ['Admin', 'admin@gmail.com', hashedPw, 'admin']);
    console.log('Seeded: Default admin user (admin@gmail.com / 1234)');
  }

  const menuItems = [
    { name: 'Espresso', category: 'espresso', description: 'Rich and bold single shot espresso', price: 4500, featured: true, ingredients: ['Arabica beans'], sizes: [{ name: 'Single', price: 4500 }, { name: 'Double', price: 5800 }], image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop' },
    { name: 'Cappuccino', category: 'espresso', description: 'Espresso with steamed milk foam', price: 5800, featured: true, ingredients: ['Espresso', 'Steamed milk', 'Milk foam'], sizes: [{ name: 'Small', price: 5200 }, { name: 'Medium', price: 5800 }, { name: 'Large', price: 7200 }], image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
    { name: 'Latte', category: 'espresso', description: 'Smooth espresso with steamed milk', price: 6200, featured: true, ingredients: ['Espresso', 'Steamed milk'], sizes: [{ name: 'Small', price: 5500 }, { name: 'Medium', price: 6200 }, { name: 'Large', price: 7500 }], image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop' },
    { name: 'Mocha', category: 'specialty', description: 'Espresso with chocolate and steamed milk', price: 6800, ingredients: ['Espresso', 'Chocolate', 'Steamed milk', 'Whipped cream'], sizes: [{ name: 'Small', price: 6200 }, { name: 'Medium', price: 6800 }, { name: 'Large', price: 8100 }], image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=300&fit=crop' },
    { name: 'Cold Brew', category: 'cold', description: 'Slow steeped for 20 hours, smooth and strong', price: 5800, featured: true, ingredients: ['Cold brew coffee', 'Water'], sizes: [{ name: 'Regular', price: 5800 }, { name: 'Large', price: 7200 }], image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
    { name: 'Iced Americano', category: 'cold', description: 'Espresso shots over ice with water', price: 4800, ingredients: ['Espresso', 'Cold water', 'Ice'], sizes: [{ name: 'Regular', price: 4800 }, { name: 'Large', price: 6200 }], image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop' },
    { name: 'Pour Over', category: 'brewed', description: 'Single origin hand-poured coffee', price: 5200, ingredients: ['Single origin beans', 'Hot water'], sizes: [{ name: 'Regular', price: 5200 }], image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400&h=300&fit=crop' },
    { name: 'Matcha Latte', category: 'specialty', description: 'Ceremonial grade matcha with steamed milk', price: 7200, ingredients: ['Matcha powder', 'Steamed milk', 'Vanilla'], sizes: [{ name: 'Small', price: 6500 }, { name: 'Medium', price: 7200 }, { name: 'Large', price: 8500 }], image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop' },
    { name: 'Blueberry Muffin', category: 'pastry', description: 'Fresh baked blueberry muffin', price: 4500, ingredients: ['Flour', 'Blueberries', 'Sugar', 'Butter', 'Eggs'], sizes: [], image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' },
    { name: 'Croissant', category: 'pastry', description: 'Buttery flaky French croissant', price: 3800, ingredients: ['Flour', 'Butter', 'Yeast', 'Sugar', 'Salt'], sizes: [], image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop' },
  ];

  const healthData = [
    { caffeine: 63, calories: 3, antioxidants: 85, sugar: 0, fat: 0, summary: 'Low calorie, high antioxidant. Excellent in moderation.' },
    { caffeine: 63, calories: 120, antioxidants: 80, sugar: 8, fat: 6, summary: 'Moderate calories from milk, good antioxidant level.' },
    { caffeine: 63, calories: 180, antioxidants: 75, sugar: 14, fat: 10, summary: 'Higher calories due to milk content.' },
    { caffeine: 63, calories: 290, antioxidants: 85, sugar: 25, fat: 15, summary: 'Higher in sugar and calories from chocolate.' },
    { caffeine: 150, calories: 5, antioxidants: 90, sugar: 0, fat: 0, summary: 'High caffeine and antioxidants, virtually no calories.' },
    { caffeine: 126, calories: 10, antioxidants: 82, sugar: 0, fat: 0, summary: 'Low calorie, good antioxidant boost.' },
    { caffeine: 95, calories: 2, antioxidants: 88, sugar: 0, fat: 0, summary: 'Pure coffee experience, rich in antioxidants.' },
    { caffeine: 70, calories: 160, antioxidants: 95, sugar: 18, fat: 8, summary: 'Very high antioxidants, moderate caffeine.' },
    { caffeine: 0, calories: 380, antioxidants: 30, sugar: 28, fat: 16, summary: 'Treat in moderation, higher sugar and fat.' },
    { caffeine: 0, calories: 310, antioxidants: 5, sugar: 8, fat: 18, summary: 'Classic pastry, best as an occasional treat.' },
  ];

  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];
    const existing = await pool.query('SELECT id FROM menu_items WHERE name = $1', [item.name]);
    if (existing.rows.length) continue;
    const result = await pool.query(
      'INSERT INTO menu_items (name, category, description, price, featured, ingredients, sizes, image) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [item.name, item.category, item.description, item.price, i < 5, JSON.stringify(item.ingredients), JSON.stringify(item.sizes), item.image]
    );
    const h = healthData[i];
    const healthScore = calculateHealthScore(h.caffeine, h.calories, h.antioxidants, h.sugar, h.fat);
    await pool.query(
      'INSERT INTO health_ratings ("menuItemId", caffeine, calories, antioxidants, sugar, fat, "healthScore", summary) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [result.rows[0].id, h.caffeine, h.calories, h.antioxidants, h.sugar, h.fat, healthScore, h.summary]
    );
    console.log(`Seeded: ${item.name}`);
  }
  console.log('Seed complete!');
  await pool.end();
};

seedData().catch(err => { console.error(err); process.exit(1); });
