const API = "http://localhost:5000";

document.getElementById("user").innerText =
  "User: " + localStorage.getItem("user");

// Load products
async function loadProducts() {
  const res = await fetch(`${API}/products`);
  const data = await res.json();

  const container = document.getElementById("products");

  data.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>
        <p>${p.price} ETB</p>
        <button onclick="order('${p.name}')">Order</button>
      </div>
    `;
  });
}

loadProducts();

// Order function
function order(productName) {
  alert("Order placed for " + productName);

  fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      product: productName,
      user: localStorage.getItem("user")
    })
  });
}

// logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}