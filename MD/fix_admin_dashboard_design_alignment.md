# 🚨 URGENT FRONTEND FIX PROMPT: ALIGN ADMIN DASHBOARD WITH CYBERPUNK STITCH DESIGN

## 📌 Context & Problem Diagnosis

* **Project Name:** Y0 Hardware Market
* **Target Page:** `src/app/[locale]/admin/page.tsx` (Admin Dashboard)
* **Design Reference Path:** `Sources/stitch_y0_hardware_marketplace_redesign/`
  * `admin_operations_command_center_y0_hardware_market-code.html`
  * `admin_operations_command_center_y0_hardware_market-screen.png`

### ❌ The Issue:
The current rendered Admin Dashboard uses generic light-colored cards, purple headers, and default Material design UI elements (as shown in the screenshots). It does **NOT** match the dark tactical cyber-industrial aesthetic specified in the design HTML/PNG source files.

---

## ⚠️ STRICT SAFETY DIRECTIVES

1. **ZERO BACKEND & DATABASE MUTATIONS:** Maintain all existing backend API handlers (`/api/admin/*`) and database logic. Only update the JSX structure, layout, and Tailwind CSS styling.
2. **PRESERVE ALL ADMIN FUNCTIONALITY:** Keep all tab functionality working (Dashboard, Ops Command Center, Products, Orders, Users, Site Content) along with data fetching logic (`useAuth`, API calls).
3. **DOCUMENTATION & BRANDING:** Retain mandatory footer signature `"Designed & Powered by Y0ussef.com"` and hotline `+20 1129334173`. Append update logs to `README.md` and `MD/README.md`.

---

## 🎯 STEP-BY-STEP IMPLEMENTATION TASKLIST FOR LOCAL AGENT

### 1. Extract & Refactor UI Components from Design HTML
Open `Sources/stitch_y0_hardware_marketplace_redesign/admin_operations_command_center_y0_hardware_market-code.html` and extract the exact HTML structures, class names, and layout grids into `src/app/[locale]/admin/page.tsx` (or supporting sub-components in `src/components/admin/`).

### 2. Apply Theme & Style Normalization
- **Background & Containers:**
  - Replace the bright white/purple cards with dark obsidian tactical panels (`bg-surface-container-lowest` / `bg-[#0B0F17]` / `border border-outline-variant/20`).
- **Typography & Colors:**
  - Replace generic text styling with cyber-industrial typography (uppercase monospace headers, neon cyan/teal status indicators `#00F0FF`, `#00FF9D`, glowing badges).
- **Telemetry & Stats Cards:**
  - Format stats cards (Total Products, Total Orders, Total Users, Total Revenue) with tactical telemetry borders, metric labels (`// LIVE TELEMETRY`), and dark glassmorphic styling.
- **Tabs Navigation:**
  - Style the sub-navigation pills/tabs with high-contrast active cyber states (cyan outline glowing borders, terminal icons).
- **Data Tables (Users, Products, Orders):**
  - Convert standard white tables into dark terminal data grids with glowing role pills (`[ADMIN]`, `[USER]`, `[SELLER]`) and cyber action buttons.

### 3. Build & Type Verification
- Run `npx tsc --noEmit` (**0 Errors**).
- Run `npm run build` using Webpack (**Exit Code 0 across all 39 routes**).
- Commit & push changes with commit message: `fix: align admin dashboard UI with stitch cyberpunk design (v1.1.25)`.