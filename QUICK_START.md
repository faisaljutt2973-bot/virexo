# 🚀 VIREXO Quick Reference Card

## START HERE 👇

### 1. First Time Setup
```bash
# Install all dependencies
npm install
cd server && npm install && cd ..
```

### 2. Start Services (Use 3 Terminals)
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend API
cd server
npm run dev

# Terminal 3: Frontend App
npm run dev
```

### 3. Open Browser
```
http://localhost:5173
```

---

## 🧪 Test the App

1. **Register User** → Go to `/register`
2. **Browse Products** → Click "Shop" in navbar
3. **Add to Cart** → Click "Add to Cart" on any product
4. **Checkout** → Click cart icon → "Proceed to Checkout"
5. **Admin Dashboard** → Go to `/admin` (need admin role)

---

## 🔑 Endpoints Cheat Sheet

### AUTH
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### PRODUCTS
```
GET    /api/products
GET    /api/products/:id
POST   /api/products (Admin)
PUT    /api/products/:id (Admin)
DELETE /api/products/:id (Admin)
```

### ORDERS
```
POST   /api/orders
GET    /api/orders
GET    /api/orders/all (Admin)
PUT    /api/orders/:id/status (Admin)
```

### CATEGORIES
```
GET    /api/categories
POST   /api/categories (Admin)
```

---

## 📝 Environment Setup

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

### Backend `server/.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/virexo
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

## 👨‍💼 Make Yourself Admin

1. Register at `/register`
2. Start MongoDB & get it running
3. Connect to MongoDB and run:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```
4. Now you can access `/admin`

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main routes & setup |
| `src/context/AuthContext.jsx` | User auth state |
| `src/context/CartContext.jsx` | Shopping cart state |
| `server/server.js` | Express app setup |
| `server/models/` | MongoDB schemas |
| `server/routes/` | API endpoints |
| `server/controllers/` | Business logic |

---

## 🔍 Debugging Tips

**App won't start?**
```
✓ Is MongoDB running? (mongod)
✓ Is backend running? (npm run dev in server)
✓ Check http://localhost:5000/api/health
```

**Can't connect to API?**
```
✓ Check VITE_API_URL in .env
✓ Check backend is on port 5000
✓ Check CORS is enabled
```

**Products not showing?**
```
✓ Check MongoDB is running
✓ Check backend is running
✓ Check browser console for errors
```

**Can't access admin panel?**
```
✓ Login as user first
✓ Promote user to admin in MongoDB
✓ Refresh page
```

---

## 🎨 Customize These

### Colors
- Edit `tailwind.config.js`
- Update color scheme in `src/index.css`

### Logo/Branding
- Update Navbar.jsx
- Update Footer.jsx
- Replace colors in components

### Add Products
- Manual: Admin panel → "+ Add Product"
- Bulk: `/api/products/import/fakestore` endpoint

### Change Product Categories
- Edit in `server/models/Category.js`
- Add/remove from MongoDB

---

## 📊 Database Models

```
User
├─ name, email, password (hashed)
├─ phone, address
├─ role (user/admin)
└─ wishlist []

Product
├─ title, description, price
├─ category, brand, images
├─ stock, rating
└─ isFeatured, isNew

Order
├─ user, products
├─ shippingAddress
├─ total, status
└─ createdAt, updatedAt

Category
├─ name, description
└─ icon, image

Review
├─ user, product
├─ rating, comment
└─ createdAt
```

---

## ✨ Features Matrix

| Feature | Implemented | Status |
|---------|-------------|--------|
| User Auth | ✅ | Ready |
| Product Catalog | ✅ | Ready |
| Shopping Cart | ✅ | Ready |
| Wishlist | ✅ | Ready |
| Checkout | ✅ | Ready |
| Orders | ✅ | Ready |
| Admin Panel | ✅ | Ready |
| Product Search | ✅ | Ready |
| Filtering | ✅ | Ready |
| User Dashboard | ✅ | Ready |
| Responsive Design | ✅ | Ready |

---

## 📚 Documentation

- **README.md** - Full documentation
- **BUILD_SUMMARY.md** - Build overview
- **This file** - Quick reference
- **API endpoints** - In README.md

---

## 🆘 Need Help?

1. Check README.md for full documentation
2. Check browser console (F12) for errors
3. Check terminal for backend errors
4. Review API responses in Network tab (F12)
5. Check MongoDB connection

---

## 🎯 You're All Set!

```bash
npm install                    # 1. Install
mongod                        # 2. Start DB (Terminal 1)
cd server && npm run dev      # 3. Start Backend (Terminal 2)
npm run dev                   # 4. Start Frontend (Terminal 3)
Open http://localhost:5173    # 5. Browse!
```

**That's it! Happy coding! 🚀**

---

### Quick Links
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Admin: `http://localhost:5173/admin`
- Shop: `http://localhost:5173/shop`
- Cart: `http://localhost:5173/cart`

**Version:** 1.0.0  
**Status:** ✅ Complete & Ready to Use  
**Last Updated:** August 2024
