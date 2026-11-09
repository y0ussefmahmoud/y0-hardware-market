# 🚀 PROMPT FOR LOCAL DEVELOPMENT AGENT: HOMEPAGE DESIGN FIX & STRUCTURAL ALIGNMENT

## 📌 Context & Target Source Path

* **Project Name:** Y0 Hardware Market (PC Builder & Silicon Ecommerce Platform)
* **Status:** LIVE PRODUCTION SYSTEM (Frontend-Only Refactoring).
* **Reference Source Path:**  
  `O:\y0ussefmahmoud\Work\Y0ussef\In Progress\Y0 Hardware Market\Y0 Hardware Market v1.0.26\Sources\stitch_y0_hardware_marketplace_redesign`
* **Target View to Fix:** Homepage (`/` or `app/page.tsx` / `pages/index.tsx`) and global Navigation Header (`Header.tsx`).
* **Hotline / Contact Target:** `+20 1129334173` (01129334173)
* **Signature & Credits:** Must retain `"Designed & Powered by Y0ussef.com"` across all footers and metadata.

---

## ⚠️ STRICT SAFETY DIRECTIVES (NON-NEGOTIABLE)

1. **ZERO BACKEND & DATABASE MUTATIONS:**
   * Do NOT alter database schemas, Prisma/TypeORM models, migration files, API endpoints, or server-side controllers.
   * Adapt the UI components to existing prop schemas and mock data states safely.

2. **PRESERVE DOCUMENTATION HISTORY (APPEND ONLY):**
   * Never delete or replace existing history in `.md` files. Append all newly performed steps to project documentation files with clear headers.

---

## 🎯 AGENT EXECUTION TASKLIST FOR HOMEPAGE FIX

### Step 1: Ingest Exact Layout & Styling from Source

* Access the reference design source directory:
  `O:\y0ussefmahmoud\Work\Y0ussef\In Progress\Y0 Hardware Market\Y0 Hardware Market v1.0.26\Sources\stitch_y0_hardware_marketplace_redesign`
* Inspect the HTML structure and Tailwind classes used in `home_y0_hardware_market-code_2.html` / `stitch` templates for:
  * **Navigation Header (`Header.tsx`):** Double-deck bar spacing, correct positioning of `Y0.MARKET` logo, search bar width, currency selector, cart HUD, and horizontal overflow handling (`overflow-x-auto whitespace-nowrap scrollbar-none`).
  * **Main Container Padding:** Increase `<main>` top padding to `pt-36 lg:pt-40` so the top status bar and hero banner do not collide or render behind the fixed header.
  * **Hero Section:** Re-align dual column hero banner, voltage ambient glow circles (`bg-primary-container/10 blur-[130px]`), live core telemetry GPU HUD widget, and metric cards (`Active Die Stock`, `Direct Warranty`, etc.).
  * **Flash Hardware Clearance Grid:** Wire proper card grid ratios (`grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg`) and standard badges.
  * **Hardware Category Bento Grid:** Ensure all 6 bento cards (`GPUs`, `CPUs`, `Motherboards`, `RAM`, `Storage`, `PSU`) adopt the cyber-industrial container tokens (`bg-surface-container-low`, hover glow effects, micro-spec tags).
  * **Live Rig Architect & Wattage Calculator Widget:** Restore the interactive slot layout and real-time telemetry sidebar.

### Step 2: Fix Navigation Header Layout Issues

* Resolve flex wrapping/overflow glitch on header links:
  * Prevent category links from wrapping awkwardly by applying `shrink-0` to navigation items and setting `overflow-x-auto` on the sub-nav wrapper.
  * Fix Z-index and backdrop blur (`bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.5)] z-50`).

### Step 3: Verify Color Palette & Tailwind Config

* Verify `tailwind.config.js` or `globals.css` includes all required tokens from the source:
  * `surface`: `#0b1326`
  * `surface-container-low`: `#131b2e`
  * `surface-container-lowest`: `#060e20`
  * `primary-container`: `#00f2fe`
  * `tertiary-fixed`: `#6ffbbe`
  * `secondary`: `#d2bbff`

### Step 4: Validate Build & Append Project Logs

1. Run TypeScript check: `npx tsc --noEmit` (Ensure **0 Errors**).
2. Run Next.js production build: `npm run build` (Ensure **Exit Code 0**).
3. **Append** the resolution log to `README.md` and `MD/README.md` following the append-only rule.

---

## 📝 TEMPLATE FOR UPDATING PROJECT `.MD` FILES (APPEND MODE)

```markdown
---
## 📦 Update Log: Phase 4 Homepage & Navigation Alignment
**Timestamp:** {{TIMESTAMP}}
**Status:** Completed (Frontend Safe Alignment)

### 📌 Summary of Changes:
1. **Header & Navigation Fix:** Aligned double-deck cyber header from source template `stitch_y0_hardware_marketplace_redesign`, resolved flex wrapping glitches, added `shrink-0` and smooth horizontal overflow.
2. **Homepage Restructure:** Synchronized Hero section, Flash Clearance cards, Category Bento grid, and Rig Configurator widget with exact source parameters.
3. **Paddings & Offsets:** Adjusted main wrapper padding (`pt-36 lg:pt-40`) to eliminate element overlap under the fixed navigation bar.
4. **Safety & Verification:** Confirmed 0 DB/API mutations. Verified WhatsApp hotline (`+20 1129334173`) and `"Designed & Powered by Y0ussef.com"` signature. Passed `npx tsc --noEmit` and `npm run build`.
---
```