# 📦 Inventory Management System

A full-stack web application to manage products, inventory, and stock history.

---

# 🚀 Features

* 🔐 Authentication (Login / Signup with JWT)
* 📦 Product Management (CRUD)
* 🔎 Advanced Search & Filtering

  * Name search
  * Price / Cost / Quantity filters with:

    * `>10`, `<50`, `>=20`, `<=100`, `10-50`
* 📊 Sorting (price, cost, quantity, profit, name)
* 📈 Profit calculation (auto)
* 📜 Inventory History tracking
* 🔄 Inventory adjustments (increase/decrease quantity)

---

# 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* Fetch API

### Backend

* Node.js
* Express.js
* Sequelize ORM

### Database

* MySQL (XAMPP / MAMP)

---

# 📁 Project Structure

```
project/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── product.model.js
│   │   └── inventory.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   └── inventory.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── app/
│   │   └── dashboard/
│   ├── lib/
│   │   └── api.js
│   └── .env.local
│
└── README.md
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Project

```bash
git clone <your-repo-url>
cd project
```

---

## 2️⃣ Database Setup (XAMPP / MAMP)

### Start:

* Apache ✅
* MySQL ✅

### Open:

```
http://localhost/phpmyadmin
```

### Create Database:

```
inventory_db
```

---

## 3️⃣ Run SQL Script

```sql
-- PRODUCTS TABLE
CREATE TABLE products (
  productid INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  cost FLOAT,
  price FLOAT,
  quantity INT
);

-- INVENTORY HISTORY TABLE
CREATE TABLE inventory_changes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  quantity_change INT,
  source VARCHAR(50),
  old_quantity INT,
  new_quantity INT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- USERS TABLE
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  password VARCHAR(255)
);
```

---

## 4️⃣ Backend Setup

### Go to backend folder:

```bash
cd backend
npm install
```

### Create `.env`

```
PORT=4000

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=inventory_db

JWT_SECRET=your_secret_key
```

### Run backend:

```bash
npm start
```

You should see:

```
DB Connected ✅
Server running on port 4000
```

---

## 5️⃣ Frontend Setup

### Go to frontend:

```bash
cd frontend
npm install
```

### Create `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Run frontend:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 🔐 Authentication

* User must login to access dashboard pages
* JWT token stored in cookies
* Protected routes redirect to `/login`

---

# 📦 API Endpoints

## Auth

```
POST /api/auth/signup
POST /api/auth/login
```

---

## Products

```
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Example Query:

```
/api/products?page=1&limit=20&name=phone&price=>100&cost=10-50&quantity>=5
```

---

## Inventory

### Get history:

```
GET /api/inventory/:productId
```

---

### Add inventory change:

```
POST /api/inventory
```

### Example body:

```json
{
  "product_id": 23,
  "quantity_change": -3,
  "source": "manual_update"
}
```

---

# 🧪 Postman Test Examples

## Get Inventory

```
GET http://localhost:4000/api/inventory/23
```

---

## Add Inventory Change

```
POST http://localhost:4000/api/inventory
Content-Type: application/json

{
  "product_id": 23,
  "quantity_change": 5,
  "source": "manual_update"
}
```

---

# 📊 Profit Calculation

```
profit % = ((price - cost) / cost) * 100
```

* Automatically calculated in backend
* Displayed in frontend table

---

# 🔒 Environment Variables

Never hardcode credentials.

Use:

* `.env` (backend)
* `.env.local` (frontend)

---




