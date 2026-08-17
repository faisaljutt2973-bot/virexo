# VIREXO - Premium Boys' E-Commerce Platform

A complete, modern, full-stack MERN e-commerce website designed exclusively for boys and men. Built with React, Node.js, Express, MongoDB, and Tailwind CSS.

**Tagline:** "Style Made for Him."

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Fake Store API Integration](#fake-store-api-integration)
- [Admin Setup](#admin-setup)
- [API Documentation](#api-documentation)
- [Product Categories](#product-categories)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

### Frontend Features
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **User Authentication** - Secure registration and login with JWT
- ✅ **Product Catalog** - Browse products with advanced filtering and search
- ✅ **Shopping Cart** - Add/remove products, manage quantities
- ✅ **Wishlist** - Save favorite products for later
- ✅ **Checkout** - Complete order with shipping details
- ✅ **User Dashboard** - View profile, orders, and account settings
- ✅ **Product Details** - Comprehensive product information with images, sizes, colors
- ✅ **Reviews & Ratings** - View product ratings

### Backend Features
- ✅ **REST API** - Clean, well-organized API endpoints
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - bcrypt for secure password storage
- ✅ **Role-Based Access Control** - User and Admin roles
- ✅ **MongoDB Integration** - NoSQL database with Mongoose models
- ✅ **Order Management** - Create, track, and manage orders
- ✅ **Product Management** - CRUD operations for products
- ✅ **Category System** - Dynamic product categories
- ✅ **Fake Store API Integration** - Import boys/men products from external source

### Admin Features
- ✅ **Admin Dashboard** - Overview of sales, users, products, orders
- ✅ **Product Management** - Add, edit, delete products
- ✅ **Order Management** - View orders, update status
- ✅ **Category Management** - Create and manage product categories
- ✅ **User Management** - View users and manage roles
- ✅ **Import Products** - Bulk import from Fake Store API

---

## 🛠 Technology Stack

### Frontend
- **React.js 19** - UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS v3** - Utility-first CSS framework
- **React Toastify** - Notifications
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Axios** - External API calls
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
Virexo/
├── src/                          # Frontend source
│   ├── components/               # Reusable components
│   ├── pages/                    # Page components
│   ├── layouts/                  # Layout wrappers
│   ├── context/                  # React Context providers
│   ├── services/                 # API services
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
│
├── server/                       # Backend source
│   ├── models/                   # Mongoose models
│   ├── controllers/              # Route handlers
│   ├── routes/                   # API routes
│   ├── middleware/               # Express middleware
│   ├── services/                 # Business logic
│   ├── server.js                 # Express app setup
│   └── .env                      # Backend environment variables
│
├── package.json                  # Frontend dependencies
├── .env                          # Frontend environment variables
└── README.md                     # This file
```

---

## 💾 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local or cloud instance)

### Clone & Install

```bash
# Navigate to project directory
cd "c:\Users\myown\Downloads\First store\Virexo"

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

---

## ⚙️ Configuration

### Frontend Configuration
Edit `.env` in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend Configuration
Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/virexo
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FAKE_STORE_API_URL=https://fakestoreapi.com
```

**Important:** Change `JWT_SECRET` to a secure random string for production!

---

## 🚀 Running the Application

### Terminal 1: Start MongoDB
```bash
mongod
```

### Terminal 2: Start Backend
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:5000`

### Terminal 3: Start Frontend
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

---

## 🗄️ Database Setup

Start MongoDB and the application will automatically create collections as needed.

---

## 📦 Fake Store API Integration

The application integrates with the **Fake Store API** to import boys/men-focused products.

### Importing Products

```bash
POST /api/products/import/fakestore
Authorization: Bearer [admin_token]
```

---

## 👨‍💼 Admin Setup

### Create First Admin User

1. Register as regular user at `/register`
2. Promote to admin using MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```
3. Access admin dashboard at `/admin`

---

## 🔌 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)

---

## 🛍️ Product Categories

- Shirts, T-Shirts, Pants, Jeans
- Hoodies, Jackets, Sweaters
- Casual & Formal Wear
- Shalwar Kameez & Traditional Wear
- Shoes, Sneakers, Sandals
- Accessories, Watches, Bags, Perfumes
- And more...

---

## 🔐 Security Features

- ✅ JWT Authentication
- ✅ Password Hashing with bcryptjs
- ✅ Protected Routes & Admin Authorization
- ✅ CORS Configuration
- ✅ Environment Variables for sensitive data

---

## 🧪 Quick Test

```bash
# 1. Register at /register
# 2. Browse products at /shop
# 3. Add to cart & checkout
# 4. View orders in dashboard
# 5. Login as admin at /admin (after promoting user)
```

---

## ✅ Quick Start Summary

```bash
# 1. Install dependencies
npm install && cd server && npm install && cd ..

# 2. Start MongoDB, Backend, and Frontend (in separate terminals)

# 3. Open http://localhost:5173

# 4. Test all features!
```

---

**Version:** 1.0.0  
**Status:** ✅ Complete & Functional  

**Enjoy building with VIREXO!** 🚀
