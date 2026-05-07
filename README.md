# Dana ElectroMart Working Prototype

This prototype was built from the ElectroMart architecture notes and the provided UI references. It demonstrates the teacher's required evidence:

- User interaction: login, browse products, search/filter, add to cart, edit cart, manage profile, choose payment method, submit checkout form, view admin dashboard.
- API communication: the frontend calls local endpoints such as `GET /api/products`, `POST /api/cart`, `POST /api/checkout`, and `GET /api/dashboard`.
- Data storage/retrieval: the Node server stores and retrieves cart, orders, inventory, and module events in `data/store.json`.
- At least three interacting modules: Login/Profile, Catalog, Cart, Checkout/Order, Inventory, Payment, Notification, and Admin Dashboard are represented.

## Run

```powershell
npm start
```

Open:

```text
http://localhost:4173
```

## Demo Flow

1. Login from the welcome page.
2. Open Products and click Add to Cart.
3. Open Cart to see the saved cart returned from the API.
4. Open Profile to edit customer details.
5. Open Checkout, choose a payment method, submit the form, and the order is saved.
6. Open Admin to see revenue, recent orders, low stock alerts, and saved module events.
