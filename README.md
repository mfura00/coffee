# Brew & Bean Coffee Shop

Full-stack coffee shop website with React frontend and Node.js/Express backend using Firebase Firestore.

## Features

- **Frontend**: React + Vite, responsive UI, dark/light mode
- **Backend**: Node.js + Express REST API
- **Database**: Firebase Firestore
- **Auth**: JWT-based authentication with bcrypt password hashing
- **Pages**: Home, About, Menu, Health Benefits, Orders, Contact, Login/Register, Admin Dashboard, Profile
- **Health Rating System**: Each drink has a calculated health score (0-100) based on caffeine, calories, antioxidants, sugar, and fat

## Project Structure

```
coffee-shop/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── firebase.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   ├── healthController.js
│   │   ├── menuController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── contact.js
│   │   ├── health.js
│   │   ├── menu.js
│   │   └── orders.js
│   ├── utils/
│   │   └── seedData.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── coffee-logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── HealthRating.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── HealthBenefits.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- Firebase project with Firestore enabled

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Firestore Database** in the project
4. Go to **Project Settings > Service Accounts**
5. Click **Generate New Private Key** and download the JSON file
6. Save it as `serviceAccountKey.json` in the `backend/` folder

### 2. Backend Setup
```bash
cd backend
npm install
cp ../.env.example ../.env
# Edit .env with your values
npm run seed  # Populate Firestore with menu items and health ratings
npm run dev   # Start dev server on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Start Vite dev server on port 5173
```

### 4. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (auth required)
- `PUT /api/auth/profile` - Update profile (auth required)

### Menu
- `GET /api/menu` - Get all menu items (query: category, featured, available)
- `GET /api/menu/:id` - Get single item
- `POST /api/menu` - Create item (admin)
- `PUT /api/menu/:id` - Update item (admin)
- `DELETE /api/menu/:id` - Delete item (admin)

### Orders
- `POST /api/orders` - Create order (auth)
- `GET /api/orders` - Get my orders (auth)
- `GET /api/orders/all` - Get all orders (admin)
- `GET /api/orders/:id` - Get order (auth)
- `PUT /api/orders/:id/status` - Update status (admin)

### Health Ratings
- `GET /api/health` - Get all health ratings
- `GET /api/health/:id` - Get rating for menu item
- `PUT /api/health/:id` - Create/update rating (admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get messages (admin)
- `PUT /api/contact/:id/read` - Mark as read (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats (admin)
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users/:id/role` - Update user role (admin)

## Default Admin
After running the seed script, register a user and manually set their role to `admin` in Firestore to access the admin dashboard.
