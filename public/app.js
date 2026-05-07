const state = {
  products: [],
  cart: { items: [], subtotal: 0, shipping: 0, total: 0 },
  category: "All Products",
  log: [],
  profile: JSON.parse(localStorage.getItem("electromartProfile") || "null") || {
    name: "Dana Student",
    email: "dana@student.edu",
    phone: "+1 555 0100",
    city: "Los Angeles"
  }
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

async function api(path, options = {}) {
  const method = options.method || "GET";
  const started = performance.now();
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json();
  const ms = Math.round(performance.now() - started);
  state.log.unshift(`${method} ${path} -> ${response.status} (${ms}ms)`);
  renderApiLog();
  if (!response.ok) throw new Error(data.error || "API request failed");
  return data;
}

function showView(id) {
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === id));
  $$(".nav").forEach((button) => button.classList.toggle("active", button.dataset.view === id));
  $(".shell").classList.toggle("welcome-mode", id === "welcome");
  if (id === "dashboard") loadDashboard();
  if (id === "cart" || id === "checkout") loadCart();
}

function renderProducts() {
  const grid = $("#productGrid");
  const query = $("#search").value.trim().toLowerCase();
  const products = state.products.filter((product) => {
    const inCategory = state.category === "All Products" || product.category === state.category;
    const inSearch = !query || `${product.name} ${product.category}`.toLowerCase().includes(query);
    return inCategory && inSearch;
  });

  grid.innerHTML = "";
  products.forEach((product) => {
    const card = $("#productTemplate").content.cloneNode(true);
    card.querySelector("img").src = product.image;
    card.querySelector("img").alt = product.name;
    card.querySelector("span").textContent = product.category;
    card.querySelector("h3").textContent = product.name;
    card.querySelector("p").textContent = product.description;
    card.querySelector("strong").textContent = money.format(product.price);
    card.querySelector("small").textContent = `${product.stock} left`;
    card.querySelector("button").addEventListener("click", () => addToCart(product.id));
    grid.append(card);
  });
}

function renderCategories() {
  const categories = ["All Products", ...new Set(state.products.map((product) => product.category))];
  $("#categories").innerHTML = categories.map((category) => `<button class="${category === state.category ? "active" : ""}">${category}</button>`).join("");
  $$("#categories button").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.textContent;
      renderCategories();
      renderProducts();
    });
  });
}

async function addToCart(productId) {
  state.cart = await api("/api/cart", { method: "POST", body: { productId, qty: 1 } });
  renderCart();
  showView("cart");
}

async function loadCart() {
  state.cart = await api("/api/cart");
  renderCart();
}

function renderCart() {
  $("#cartBadge").textContent = state.cart.items.reduce((sum, item) => sum + item.qty, 0);
  $("#subtotal").textContent = money.format(state.cart.subtotal);
  $("#shipping").textContent = money.format(state.cart.shipping);
  $("#total").textContent = money.format(state.cart.total);
  $("#checkoutTotal").textContent = money.format(state.cart.total);
  const list = $("#cartItems");
  if (!state.cart.items.length) {
    list.innerHTML = `<div class="panel"><h3>Your cart is empty</h3><p class="muted">Add a product to demonstrate catalog-to-cart API communication.</p></div>`;
    return;
  }
  list.innerHTML = state.cart.items.map((item) => `
    <article class="cart-item">
      <img src="${item.product.image}" alt="${item.product.name}">
      <div>
        <h3>${item.product.name}</h3>
        <p class="muted">${item.product.category} • ${money.format(item.product.price)} each</p>
      </div>
      <div class="qty">
        <button data-qty="${item.productId}" data-next="${item.qty - 1}">-</button>
        <strong>${item.qty}</strong>
        <button data-qty="${item.productId}" data-next="${item.qty + 1}">+</button>
        <button data-remove="${item.productId}">Remove</button>
      </div>
    </article>
  `).join("");
  $$("[data-qty]").forEach((button) => button.addEventListener("click", () => updateQty(button.dataset.qty, button.dataset.next)));
  $$("[data-remove]").forEach((button) => button.addEventListener("click", () => removeItem(button.dataset.remove)));
}

async function updateQty(productId, qty) {
  state.cart = await api("/api/cart", { method: "PATCH", body: { productId, qty: Number(qty) || 1 } });
  renderCart();
}

async function removeItem(productId) {
  state.cart = await api(`/api/cart?productId=${encodeURIComponent(productId)}`, { method: "DELETE" });
  renderCart();
}

async function checkout(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const shipping = Object.fromEntries(form.entries());
  const payment = {
    type: shipping.paymentType,
    last4: String(shipping.cardNumber || "").replace(/\D/g, "").slice(-4),
    expiry: shipping.expiry
  };
  const result = await api("/api/checkout", {
    method: "POST",
    body: { customer: shipping.customer, shipping, payment }
  });
  $("#checkoutNote").textContent = `${result.order.id} saved. ${payment.type} payment ending ${payment.last4 || "demo"} approved, inventory reduced, and notification queued.`;
  state.cart = await api("/api/cart");
  renderCart();
  await loadProducts();
  showView("dashboard");
}

async function loadDashboard() {
  const data = await api("/api/dashboard");
  $("#revenue").textContent = money.format(data.revenue);
  $("#ordersToday").textContent = data.ordersToday;
  $("#activeUsers").textContent = data.activeUsers.toLocaleString();
  $("#recentOrders").innerHTML = data.recentOrders.map((order) => `
    <div class="row"><span>${order.id} • ${order.customer}</span><strong>${money.format(order.total)}</strong></div>
  `).join("");
  $("#lowStock").innerHTML = data.lowStock.map((item) => `
    <div class="row"><span>${item.name}</span><strong>${item.stock} left</strong></div>
  `).join("") || `<p class="muted">No low stock products.</p>`;
  $("#events").innerHTML = data.events.map((event) => `
    <div class="row"><span>${event.module}: ${event.message}</span><strong>${event.time}</strong></div>
  `).join("");
}

function renderApiLog() {
  const log = $("#apiLog");
  if (!log) return;
  log.innerHTML = state.log.slice(0, 10).map((line) => `<code>${line}</code>`).join("");
}

function saveProfile(profile) {
  state.profile = profile;
  localStorage.setItem("electromartProfile", JSON.stringify(profile));
  renderProfile();
}

function renderProfile() {
  $("#profileSummary").innerHTML = `
    <div class="profile-line"><span>Name</span><strong>${state.profile.name}</strong></div>
    <div class="profile-line"><span>Email</span><strong>${state.profile.email}</strong></div>
    <div class="profile-line"><span>Phone</span><strong>${state.profile.phone}</strong></div>
    <div class="profile-line"><span>Default City</span><strong>${state.profile.city}</strong></div>
  `;
  const profileForm = $("#profileForm");
  profileForm.elements.name.value = state.profile.name;
  profileForm.elements.email.value = state.profile.email;
  profileForm.elements.phone.value = state.profile.phone;
  profileForm.elements.city.value = state.profile.city;
  const checkoutForm = $("#checkoutForm");
  checkoutForm.elements.customer.value = state.profile.name;
  checkoutForm.elements.city.value = state.profile.city;
  checkoutForm.elements.phone.value = state.profile.phone;
}

function login(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  saveProfile({
    ...state.profile,
    email: form.get("email"),
    name: state.profile.name || "Dana Student"
  });
  $("#loginNote").textContent = "Signed in. Profile is ready for checkout.";
  showView("shop");
}

function signup() {
  saveProfile({
    name: "New ElectroMart User",
    email: "newuser@student.edu",
    phone: "+1 555 0199",
    city: "Los Angeles"
  });
  $("#loginNote").textContent = "Demo account created. You can edit it from Profile.";
  showView("profile");
}

function logout() {
  $("#loginNote").textContent = "Logged out. Sign in again to continue.";
  showView("welcome");
}

function updateProfile(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  saveProfile(Object.fromEntries(form.entries()));
}

async function loadProducts() {
  const data = await api("/api/products");
  state.products = data.products;
  renderCategories();
  renderProducts();
}

async function init() {
  $$(".nav").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
  $$("[data-jump]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.jump)));
  $("#search").addEventListener("input", renderProducts);
  $("#loginForm").addEventListener("submit", login);
  $("#signupButton").addEventListener("click", signup);
  $("#logoutButton").addEventListener("click", logout);
  $("#profileForm").addEventListener("submit", updateProfile);
  $("#checkoutForm").addEventListener("submit", checkout);
  $("#resetDemo").addEventListener("click", async () => {
    await loadProducts();
    await loadCart();
    await loadDashboard();
  });
  showView("welcome");
  renderProfile();
  await loadProducts();
  await loadCart();
}

init();
