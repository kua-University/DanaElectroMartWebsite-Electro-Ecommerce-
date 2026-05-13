// Get current logged-in user
function getUser() {
  return localStorage.getItem("user");
}

// Check if user is logged in
function isLoggedIn() {
  return getUser() !== null;
}

// Protect pages (redirect if not logged in)
function protectPage() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

// Login user
function loginUser(username) {
  localStorage.setItem("user", username);
  window.location.href = "dashboard.html";
}

// Logout user
function logoutUser() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}