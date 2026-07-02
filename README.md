# 🛒 DanaElectroMart E-Commerce Platform

A full-stack e-commerce web application demonstrating modern web development practices with a complete user journey from product browsing to order management.

## 📋 Overview

**DanaElectroMart** is a prototype e-commerce platform built to showcase multi-module architecture and real-world application features. This project demonstrates seamless integration between frontend user interactions and backend API communication with persistent data storage.

### ✨ Key Features

- **User Authentication** - Secure login and profile management
- **Product Catalog** - Browse, search, and filter products
- **Shopping Cart** - Add/remove items with persistent storage
- **Checkout System** - Multiple payment method selection and order submission
- **Order Management** - View order history and status
- **Admin Dashboard** - Real-time analytics, revenue tracking, inventory alerts, and module event logging
- **Data Persistence** - All data stored and retrieved from backend API

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js |
| **API** | REST API with JSON responses |
| **Database** | JSON file-based storage (`data/store.json`) |

## 🏗️ Architecture

### Modules & Components

```
User Flow:
Login/Profile → Products Catalog → Shopping Cart → Checkout → Order Management

Backend Systems:
API Layer → Data Management → Inventory Control → Admin Analytics
```

### Core Modules
- **Login/Profile Module** - User authentication and account management
- **Catalog Module** - Product listing, search, and filtering
- **Cart Module** - Shopping cart with add/remove functionality
- **Checkout Module** - Order processing and payment method selection
- **Order Module** - Order history and status tracking
- **Inventory Module** - Stock management and low stock alerts
- **Admin Dashboard** - Revenue analytics and operational insights
- **Notification System** - Order confirmations and alerts

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your system
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kua-University/DanaElectroMartWebsite-Electro-Ecommerce-
cd DanaElectroMartWebsite-Electro-Ecommerce-
```

2. **Install dependencies**
```bash
npm install
```

### Running the Application

```powershell
npm start
```

The application will start on:
```
http://localhost:4173
```

## 📱 Demo & Usage

### Complete User Journey

Follow this flow to experience all features:

1. **Login**
   - Start from the welcome page
   - Log in with your credentials

2. **Browse Products**
   - Navigate to Products section
   - Use search and filter options
   - Click "Add to Cart" to add items

3. **Manage Cart**
   - Open Cart section
   - View saved items from API
   - Edit quantities or remove items

4. **User Profile**
   - Go to Profile section
   - Update customer details
   - Save changes

5. **Checkout**
   - Navigate to Checkout
   - Select your preferred payment method
   - Submit the order form
   - Order is saved to database

6. **Admin Dashboard**
   - Access Admin section
   - View key metrics:
     - Total revenue
     - Recent orders
     - Low stock alerts
     - Module event logs

## 📊 API Endpoints

The frontend communicates with the following backend endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Fetch all products |
| POST | `/api/cart` | Add items to cart |
| GET | `/api/cart` | Retrieve saved cart |
| POST | `/api/checkout` | Submit order |
| GET | `/api/orders` | Fetch order history |
| GET | `/api/dashboard` | Get admin analytics |
| POST | `/api/profile` | Update user profile |

## 💾 Data Storage

All application data is persisted in `data/store.json` and includes:
- User accounts and profiles
- Product catalog
- Shopping carts
- Orders and transactions
- Inventory levels
- Module event logs

## 📚 Project Structure

```
DanaElectroMartWebsite-Electro-Ecommerce-/
├── public/              # Static assets
├── src/                 # Frontend source files
├── server/              # Node.js backend
├── data/
│   └── store.json       # Data persistence
├── package.json
└── README.md
```

## 🎯 What This Project Demonstrates

✅ **Full-Stack Development** - Frontend, backend, and database integration
✅ **API Development** - RESTful endpoints for multi-module communication
✅ **User Experience** - Intuitive navigation and interaction flow
✅ **Data Management** - Persistent storage and retrieval
✅ **System Architecture** - Modular design with multiple interacting components
✅ **Real-World Features** - Authentication, shopping, orders, and analytics

## 💡 Learning Outcomes

This project demonstrates proficiency in:
- Building interactive web applications
- Backend API development and management
- Frontend-backend integration
- Database design and implementation
- Multi-module system architecture
- User authentication and authorization
- E-commerce workflow implementation

## 📝 Notes

- This is a prototype built for educational purposes
- Uses JSON file storage (suitable for demonstration; production would use a database)
- Frontend runs on port 4173
- All API calls are local to the development server

## 🔗 Links

- **Repository**: https://github.com/kua-University/DanaElectroMartWebsite-Electro-Ecommerce-
- **Assignment**: University Project

---

**Built by:** Dana | **Date:** 2024 | **Type:** Educational Project
