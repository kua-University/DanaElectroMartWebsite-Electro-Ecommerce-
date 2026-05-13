const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   DATABASE SETUP (SQLite)
========================= */
const db = new sqlite3.Database('./electromart.db', (err) => {
  if (err) {
    console.log("DB Error:", err.message);
  } else {
    console.log("Connected to SQLite Database");
  }
});

// Create products table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price INTEGER
    )
  `);

  // Insert default products (only once)
  db.run(`
    INSERT INTO products (name, price)
    SELECT 'Laptop', 50000
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Laptop')
  `);

  db.run(`
    INSERT INTO products (name, price)
    SELECT 'Phone', 20000
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Phone')
  `);

  db.run(`
    INSERT INTO products (name, price)
    SELECT 'Headphones', 3000
    WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Headphones')
  `);
});

/* =========================
   ROUTES
========================= */

// Home route
app.get('/', (req, res) => {
  res.send('🛒 ElectroMart Backend Running');
});

// Get products
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

/* =========================
   ORDERS ROUTE
========================= */

app.post('/orders', (req, res) => {
  const order = req.body;

  console.log("🔥 NEW ORDER RECEIVED:");
  console.log(JSON.stringify(order, null, 2));

  if (!order || !order.cart || order.cart.length === 0) {
    return res.status(400).json({
      message: "Cart is empty"
    });
  }

  res.json({
    message: "Order received successfully",
    orderId: Date.now(),
    order
  });
});

/* =========================
   START SERVER
========================= */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});