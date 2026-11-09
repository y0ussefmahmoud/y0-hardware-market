# 🚀 PROMPT FOR LOCAL DEVELOPMENT AGENT: LOGO REPLACEMENT & BRANDING ALIGNMENT

## 📌 Context & Source Paths

* **Project Name:** Y0 Hardware Market (PC Builder & Silicon Ecommerce Platform)

* **Status:** LIVE PRODUCTION SYSTEM (Frontend-Only Refactoring).

* **Source Directory (v1.1.11):**
  `O:\y0ussefmahmoud\Work\Y0ussef\In Progress\Y0 Hardware Market\Y0 Hardware Market v1.1.11\Sources\stitch_y0_hardware_marketplace_redesign`

* **Reference Target Files:** `home_y0_hardware_market-code.html` and `home_y0_hardware_market-screen.png`

* **WhatsApp Hotline:** `+20 1129334173` (01129334173)

* **Footer Signature:** Must strictly retain `"Designed & Powered by Y0ussef.com"`.

## ⚠️ STRICT SAFETY DIRECTIVES (CRITICAL)

1. **ZERO BACKEND & DATABASE MUTATIONS:**
   * Do NOT modify any database schemas, API controllers, Prisma/TypeORM models, or server-side routing logic.
   * Restrict all changes strictly to the Frontend UI components (`Header.tsx`, `Navbar.tsx`, `Logo.tsx`, `Footer.tsx`).

2. **DOCUMENTATION & MEMORY PRESERVATION (APPEND ONLY):**
   * Do NOT delete or overwrite existing history in project `.md` files.
   * Append all new execution logs under timestamped headers.

## 🎯 AGENT EXECUTION TASKLIST FOR LOGO & HEADER FIX

### Step 1: Replace Logo Icon & Typography Hierarchy

* Access the reference source files in `v1.1.11\Sources\stitch_y0_hardware_marketplace_redesign`.
* Replace the generic/chip placeholder icon in `Header.tsx` with the official **Y0 Cyber Core Icon** (rounded square badge with cyan/purple dual-circuit tracing and central node dot).
* Align the text mark alongside the icon using the exact structure:
  ```html
  <div class="flex items-center gap-3 shrink-0">
    <!-- Cyber Badge Icon -->
    <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0b1326] border border-[#00f2fe]/40 shadow-[0_0_15px_rgba(0,242,254,0.25)]">
      <div class="w-6 h-6 relative flex items-center justify-center">
        <!-- Inner Tracing SVG / Icon Element matching image specification -->
        <span class="material-symbols-outlined text-[#00f2fe] text-[22px]">developer_board</span>
      </div>
    </div>
    <!-- Brand Typography Block -->
    <div class="flex items-center gap-2">
      <span class="font-headline-lg text-2xl font-extrabold tracking-tight text-white">Y<span class="text-[#6ffbbe]">0</span></span>
      <div class="h-6 w-px bg-outline-variant/50"></div>
      <div class="flex flex-col">
        <span class="font-spec-code-sm text-[12px] font-bold tracking-widest text-[#00f2fe] uppercase">HARDWARE</span>
        <span class="font-spec-code-sm text-[9px] tracking-[0.2em] text-outline uppercase">MARKET // EGY</span>
      </div>
    </div>
  </div>
  ```

### Step 2: Harmonize Header Navigation Deck

* Ensure the sub-navigation bar below the search bar retains the proper dark background (`bg-surface-container-lowest/90 backdrop-blur-xl`).
* Prevent label wrapping on smaller screens by adding `shrink-0` to all category links and wrapping `<nav>` with `overflow-x-auto whitespace-nowrap scrollbar-none`.
* Verify active route indicator styling:
  * Highlight active tab (e.g., **PC Builder / Rig Configurator**) with `bg-[#00f2fe] text-[#002022] font-bold`.
  * Highlight **Flash Deals & Daily Drops** with the pulsating `LIVE` badge (`bg-error-container text-error`).

### Step 3: Run Validation Suite & Append Documentation

1. Perform TypeScript check: `npx tsc --noEmit` (Must result in **0 Errors**).
2. Perform Next.js production build: `npm run build` (Must result in **Exit Code 0**).
3. **Append** the change log entry to `README.md` and `MD/README.md`.

## 📝 TEMPLATE FOR UPDATING PROJECT `.MD` FILES (APPEND MODE)

```
---
## 📦 Update Log: Phase 5 Logo & Header Visual Alignment (v1.1.11)
**Timestamp:** {{TIMESTAMP}}
**Status:** Completed (Frontend Safe Execution)

### 📌 Summary of Changes:
1. **Logo & Brand Identity Alignment:** Replaced generic placeholder icon with official Y0 Cyber Core badge and synchronized typography (`Y0 | HARDWARE MARKET // EGY`) as specified in `v1.1.11` source design templates.
2. **Header Navigation Deck Fix:** Resolved flex wrapping issues, added smooth horizontal overflow handling, and locked component spacing.
3. **Integrity & Safety Audit:** Zero modifications made to DB schema or API controllers. Preserved WhatsApp hotline (`+20 1129334173`) and `"Designed & Powered by Y0ussef.com"` signature.
4. **Build Status:** Passed `npx tsc --noEmit` and Next.js production build (`npm run build`).
---

```