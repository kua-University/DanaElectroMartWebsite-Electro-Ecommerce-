
⚡ Dana ElectroMart – Enterprise Full-Stack E-Commerce Platform

Dana ElectroMart is a modern full-stack E-Commerce platform engineered using Node.js, Express.js, SQLite, Redis, and Docker technologies.
The system demonstrates real-world Software Engineering concepts including REST API development, caching systems, containerization, and scalable architecture design.

The platform allows users to browse electronic products, manage shopping carts, and process orders through a responsive frontend and secure backend infrastructure.

🏗️ System Architecture
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP / REST API
┌────────────────────────────▼────────────────────────────────────┐
│                     FRONTEND (HTML/CSS/JS)                      │
│                                                                 │
│ Pages: Login │ Products │ Cart │ Orders                         │
│ Features: Product Browsing │ Cart Management │ Checkout         │
└────────────────────────────┬────────────────────────────────────┘
                             │ /api/*
┌────────────────────────────▼────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                   │
│                                                                 │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────┐             │
│  │  Routes  │──▶│ Controllers  │──▶│   Services   │             │
│  └──────────┘   └──────────────┘   └──────────────┘             │
│                                                                 │
│ Middleware: CORS │ JSON Parser │ Redis Cache                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
               ┌─────────────┴─────────────┐
               ▼                           ▼
      ┌─────────────────┐        ┌─────────────────┐
      │ SQLite Database │        │ Redis Cache     │
      │ Product Storage │        │ Cached Products │
      └─────────────────┘        └─────────────────┘

RESTful API Design	backend/routes/	Standardized API communication
Component Separation	frontend/	Separates pages and frontend functionality
Caching Strategy	Redis Layer	Improves API response speed and scalability
☁️ DevOps & Deployment Infrastructure

Dana ElectroMart integrates modern DevOps practices and scalable deployment architecture.

🐳 Containerization

The system uses Docker to isolate:

Frontend service
Backend API service
Redis cache service
⚡ Redis Performance Layer

Redis is used as an in-memory caching system to:

Reduce repeated database queries
Improve product loading speed
Increase application performance
🔄 Docker Compose Orchestration

Docker Compose manages communication between:

Express backend
SQLite database
Redis cache
🐳 Docker Architecture
┌─────────────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE NETWORK                       │
│                                                                 │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐ │
│  │   Frontend   │       │    Backend   │       │    Redis     │ │
│  │ (HTML/CSS)   │◀─────▶│ (Node:5000)  │◀─────▶│   (:6379)    │ │
│  └──────┬───────┘       └──────┬───────┘       └──────┬───────┘ │
│         │                      │                      │         │
└─────────┼──────────────────────┼──────────────────────┼─────────┘
          ▼                      ▼                      ▼
   [ Frontend UI ]        [ REST API ]          [ Cache Layer ]
🔥 Core Features
👤 User Features
User login system
Product browsing
Shopping cart management
Total price calculation
Order placement system
🛒 Product System
Product listing API
Product retrieval endpoints
Dynamic frontend rendering
⚡ Redis Caching
Product caching system
Faster API responses
Reduced SQLite load
🧾 Order Processing
Create customer orders
Store order information
Checkout flow simulation
🐳 DevOps Integration
Dockerized backend services
Multi-container orchestration
Simplified deployment workflow
🛠️ Technology Stack
Layer	Technology	Purpose
Frontend	HTML5, CSS3, JavaScript	User Interface
Backend	Node.js, Express.js	REST API Server
Database	SQLite	Lightweight relational database
Cache	Redis	In-memory caching layer
DevOps	Docker, Docker Compose	Containerization & orchestration
🔑 Environment Configuration
Backend Configuration

Create a .env file inside backend/

PORT=5000
REDIS_HOST=redis
REDIS_PORT=6379
📡 API Reference

Base URL:

http://localhost:5000/api
Method	Endpoint	Description
GET	/products	Retrieve all products
GET	/products/:id	Retrieve single product
POST	/orders	Place new order
GET	/orders	Retrieve orders
🚀 Rapid Setup Guide
Option 1 — Docker Setup (Recommended)
1. Clone Repository
git clone https://github.com/your-username/Dana-ElectroMart.git

cd Dana-ElectroMart
2. Start Docker Containers
docker-compose up --build
Application URLs

Backend API:

http://localhost:5000

Frontend:

Open directly in browser:

frontend/login.html
Option 2 — Local Development Setup
1. Install Dependencies
npm install express cors sqlite3 redis
2. Run Backend Server
node backend/server.js

Backend runs at:

http://localhost:5000
3. Run Frontend

Open:

frontend/login.html
🗄️ Database Structure
Products Table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    description TEXT
);
Orders Table
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    total REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
📁 Project Structure
Dana-ElectroMart/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── database/
│   ├── cache/
│   └── server.js
│
├── frontend/
│   ├── login.html
│   ├── products.html
│   ├── cart.html
│   ├── css/
│   └── js/
│
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
🔐 Security Features
CORS protection
Input validation
Secure API structure
Redis-based performance optimization
📚 Educational Objectives

This project demonstrates:

Full-stack web development
REST API engineering
SQLite database integration
Redis caching concepts
Docker containerization
Docker Compose orchestration
Backend architecture organization
👨‍💻 Author

Created by Danayt

📄 License

Educational Project • All Rights Reserved © 2026

⭐ About

Dana ElectroMart is a full-stack E-Commerce platform designed for Software Engineering and DevOps learning purposes using Node.js, Express.js, SQLite, Redis, and Docker technologies.