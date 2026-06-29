const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = require('pg');

// ── DB Init ──
const initDb = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const schema = fs.readFileSync(path.join(__dirname, 'config', 'schema.sql'), 'utf8');
  const statements = schema.split(';').filter(s => s.trim());
  for (const stmt of statements) await pool.query(stmt);
  await pool.end();
  console.log('Database tables ready');
};

// ── App ──
const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));

// ── Uploads ──
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ── Cloudinary ──
const cloudinary = require('cloudinary').v2;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary configured');
}

// ── Image upload endpoint ──
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataUri = 'data:' + req.file.mimetype + ';base64,' + b64;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'brew-bean',
        resource_type: 'image',
      });
      return res.json({ url: result.secure_url, public_id: result.public_id });
    }
    // Fallback: save locally
    const ext = path.extname(req.file.originalname);
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    fs.writeFileSync(path.join(uploadsDir, filename), req.file.buffer);
    res.json({ url: `${req.protocol}://${req.get('host')}/uploads/${filename}` });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// ── Subscribe / Discount ──
const db = require('./config/database');
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const existing = await db.query('SELECT id FROM subscribers WHERE email = $1', [email]);
    if (existing.rows.length) return res.json({ message: 'Already subscribed! Your 10% discount code: BREW10' });
    await db.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);
    res.status(201).json({ message: 'Subscribed! Your 10% discount code: BREW10', code: 'BREW10' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Rate limit ──
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { message: 'Too many requests' } });
app.use('/api/auth', limiter);

// ── Routes ──
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/health', require('./routes/health'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/images', require('./routes/images'));

app.get('/api/healthcheck', (req, res) => res.json({ status: 'ok' }));

// ── Serve frontend in production ──
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  console.log('Serving frontend from dist/');
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return;
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
});

// ── Start ──
const PORT = process.env.PORT || 5000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => { console.error('Failed to init DB:', err.message); process.exit(1); });
