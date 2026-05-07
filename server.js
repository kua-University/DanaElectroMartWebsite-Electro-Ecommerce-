import http from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const dataDir = path.join(__dirname, "data");
const storePath = path.join(dataDir, "store.json");
const port = Number(process.env.PORT || 3000);

const initialStore = {
  products: [
    {
      id: "phone-x1",
      name: "Smartphone X1",
      category: "Smartphones",
      price: 999.99,
      stock: 8,
      rating: 4.8,
      image: "/assets/VprcU.jpg",
      description: "Flagship smartphone with OLED display, secure checkout support, and fast delivery eligibility."
    },
    {
      id: "laptop-pro",
      name: "NovaBook Pro 14",
      category: "Laptops",
      price: 1299,
      stock: 5,
      rating: 4.7,
      image: "/assets/HAzze.jpg",
      description: "Portable laptop bundle for students and creators, tracked through inventory and order modules."
    },
    {
      id: "airbuds",
      name: "AirBuds Lite",
      category: "Audio",
      price: 149,
      stock: 12,
      rating: 4.5,
      image: "/assets/JON2o.jpg",
      description: "Wireless audio accessory with low-latency pairing and standard or express shipping options."
    },
    {
      id: "game-hub",
      name: "Game Hub Mini",
      category: "Gaming",
      price: 259,
      stock: 4,
      rating: 4.4,
      image: "/assets/h6xS8.jpg",
      description: "Compact gaming accessory shown in the cart and fulfillment pipeline."
    }
  ],
  cart: [],
  orders: [
    { id: "ORD-1001", customer: "Dana Demo", total: 1148.99, status: "Paid", createdAt: "2026-05-02T09:00:00.000Z" }
  ],
  events: [
    { time: "09:00", module: "Notification", message: "Welcome email sent for ORD-1001" }
  ]
};

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });
  if (!existsSync(storePath)) {
    await writeFile(storePath, JSON.stringify(initialStore, null, 2));
  }
}

async function readStore() {
  await ensureStore();
  return JSON.parse(await readFile(storePath, "utf8"));
}

async function writeStore(store) {
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

function sendJson(res, status, data) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(data));
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function cartView(store) {
  const items = store.cart.map((item) => {
    const product = store.products.find((p) => p.id === item.productId);
    return { ...item, product, lineTotal: Number((product.price * item.qty).toFixed(2)) };
  });
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal > 0 ? 18 : 0;
  return { items, subtotal: Number(subtotal.toFixed(2)), shipping, total: Number((subtotal + shipping).toFixed(2)) };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const route = `${req.method} ${url.pathname}`;

  try {
    if (route === "GET /api/products") {
      const store = await readStore();
      return sendJson(res, 200, { products: store.products });
    }

    if (route === "GET /api/cart") {
      const store = await readStore();
      return sendJson(res, 200, cartView(store));
    }

    if (route === "POST /api/cart") {
      const body = await parseBody(req);
      const store = await readStore();
      const product = store.products.find((p) => p.id === body.productId);
      if (!product) return sendJson(res, 404, { error: "Product not found" });
      const existing = store.cart.find((item) => item.productId === body.productId);
      if (existing) existing.qty += Number(body.qty || 1);
      else store.cart.push({ productId: body.productId, qty: Number(body.qty || 1) });
      store.events.unshift({ time: new Date().toLocaleTimeString(), module: "Cart", message: `${product.name} added to cart` });
      await writeStore(store);
      return sendJson(res, 201, cartView(store));
    }

    if (route === "PATCH /api/cart") {
      const body = await parseBody(req);
      const store = await readStore();
      store.cart = store.cart.map((item) => item.productId === body.productId ? { ...item, qty: Math.max(1, Number(body.qty)) } : item);
      await writeStore(store);
      return sendJson(res, 200, cartView(store));
    }

    if (route === "DELETE /api/cart") {
      const productId = url.searchParams.get("productId");
      const store = await readStore();
      store.cart = store.cart.filter((item) => item.productId !== productId);
      await writeStore(store);
      return sendJson(res, 200, cartView(store));
    }

    if (route === "POST /api/checkout") {
      const body = await parseBody(req);
      const store = await readStore();
      const cart = cartView(store);
      if (!cart.items.length) return sendJson(res, 400, { error: "Cart is empty" });
      for (const item of cart.items) {
        const product = store.products.find((p) => p.id === item.productId);
        product.stock = Math.max(0, product.stock - item.qty);
      }
      const order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: body.customer || "Dana Student",
        total: cart.total,
        status: "Paid",
        shipping: body.shipping || {},
        payment: body.payment || { type: "card", last4: "4242" },
        createdAt: new Date().toISOString()
      };
      store.orders.unshift(order);
      store.cart = [];
      store.events.unshift({ time: new Date().toLocaleTimeString(), module: "Payment", message: `Stripe-style payment approved for ${order.id}` });
      store.events.unshift({ time: new Date().toLocaleTimeString(), module: "Notification", message: `Twilio-style SMS queued for ${order.customer}` });
      await writeStore(store);
      return sendJson(res, 201, { order, dashboard: dashboardView(store) });
    }

    if (route === "GET /api/dashboard") {
      const store = await readStore();
      return sendJson(res, 200, dashboardView(store));
    }

    const filePath = url.pathname === "/" ? path.join(publicDir, "index.html") : path.normalize(path.join(publicDir, url.pathname));
    if (!filePath.startsWith(publicDir)) return sendJson(res, 403, { error: "Forbidden" });
    const ext = path.extname(filePath).toLowerCase();
    const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png" }[ext] || "application/octet-stream";
    const file = await readFile(filePath);
    res.writeHead(200, { "content-type": type });
    res.end(file);
  } catch (error) {
    if (error.code === "ENOENT") return sendJson(res, 404, { error: "Not found" });
    console.error(error);
    sendJson(res, 500, { error: "Server error" });
  }
});

function dashboardView(store) {
  const revenue = store.orders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = store.products.filter((p) => p.stock <= 5).map((p) => ({ name: p.name, stock: p.stock }));
  return {
    revenue: Number(revenue.toFixed(2)),
    ordersToday: store.orders.length,
    activeUsers: 2340,
    recentOrders: store.orders.slice(0, 5),
    lowStock,
    events: store.events.slice(0, 6)
  };
}

await ensureStore();
server.listen(port, () => {
  console.log(`ElectroMart prototype running at http://localhost:${port}`);
});
