# 🚀 Y0 Hardware Market v1.1.25: Admin Redesign & Seller Role Integration

## 📌 Objectives & Scope
1. **Admin Command Center UI Overhaul**: Redesign the Admin Dashboard (`/[locale]/admin`) to strictly match the cyber-industrial command center design from `Sources/stitch_y0_hardware_marketplace_redesign/admin_operations_command_center_y0_hardware_market-code.html`.
2. **Database & Role Schema Update**: Add the `seller` role option alongside `admin` and `user`.
3. **Seller Dashboard**: Implement a dedicated light vendor panel for users with the `seller` role where they can add, edit, and delete **only their own products**.
4. **Admin User Management**: Enable admins to promote/demote user roles (`user` <-> `seller` <-> `admin`) directly from the users table.

---

## 🛠️ Implementation Steps for Local Agent

### 1. Database Schema & API Adjustments
- **Users Table / Enum / Check constraint**: Ensure the `role` field in the database supports `'user'`, `'seller'`, and `'admin'`.
- **Products Table**: Add a `seller_id` or `created_by_user_id` foreign key column (nullable for admin products) to track which vendor/seller owns each product.
- **Products API (`/api/products`)**:
  - When a `seller` creates a product, automatically assign their `user_id` as the owner.
  - Restrict update/delete operations so sellers can only modify or delete products where `product.seller_id === current_user.id`.
  - Admins retain global CRUD permissions.

### 2. Admin Command Center UI Redesign (`src/app/[locale]/admin/page.tsx`)
- Incorporate the tactical cyberpunk layout from the design source files:
  - Dark HUD container with primary neon accents (`cyan-400`, `primary-container`).
  - Real-time telemetry cards, stock health indicators, and quick-action tabs (Dashboard, Ops Command, Products, Orders, Users, Site Content).
  - High-contrast terminal tables with clean typography and interactive management buttons.

### 3. Seller Dashboard & Portal (`src/app/[locale]/seller/page.tsx` or role-based routing)
- When a user with role `seller` logs in, redirect them or provide access to their vendor management panel:
  - Add Product modal / form.
  - List of their active hardware listings with live stock counters, pricing, and delete/edit triggers.
  - Strict guard: hide global store stats, system users, and other sellers' items.

---

## 🧪 Verification Protocol
1. Run `npx tsc --noEmit` (**0 Errors**).
2. Run `npm run build` (**Exit Code 0**).
3. Verify brand footer continuity (`"Designed & Powered by Y0ussef.com"` and hotline `+20 1129334173`).
4. Append execution logs to `README.md` and `MD/README.md`.