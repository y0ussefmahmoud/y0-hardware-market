# 🚀 PROMPT FOR LOCAL DEVELOPMENT AGENT

## 📌 Context & System Environment
- **Project Name:** Y0 Hardware Market (PC Builder & Silicon Ecommerce Platform)
- **Status:** LIVE PRODUCTION SYSTEM.
- **Client Contact / WhatsApp Hotline:** `+20 1129334173` (01129334173)
- **Signature & Credits:** Must retain `"Designed & Powered by Y0ussef.com"` across all footers and metadata.

---

## ⚠️ STRICT SAFETY DIRECTIVES (CRITICAL)

1. **NO BACKEND OR DATABASE MUTATIONS:**
   - The production Database schema, tables, triggers, and existing Backend API routes are **STRICTLY READ-ONLY / UNTOUCHABLE** unless explicitly requested.
   - All UI enhancements must adapt to the existing API data shapes without breaking current schema contracts.
   - Use safe data fallback mechanisms in the UI if optional backend attributes are null or undefined.

2. **SAFE FRONTEND MODIFICATIONS:**
   - Apply Frontend UI updates, new views (Admin Operations Command Center, Flash Deals & Drops Matrix, PC Builder HUD, Order Telemetry) strictly within the UI layer (Components, Pages, Styles).
   - Ensure zero regression on existing user authentication, cart persistence, or InstaPay payment webhooks.
   - Retain all Tailwind CSS custom design tokens: Cyber-Industrial color palette (`#0b1326`, `#00f2fe`, `#6ffbbe`, `#d2bbff`), typography (`Inter`, `JetBrains Mono`), and structural spacing.

3. **DOCUMENTATION & MEMORY PRESERVATION (NON-NEGOTIABLE):**
   - **APPEND ONLY:** When updating documentation, project logs, or `.md` files (e.g., `CHANGELOG.md`, `README.md`, `SYSTEM_ARCHITECTURE.md`), **NEVER OVERWRITE OR DELETE EXISTING HISTORY**.
   - Always append new entries with timestamped headers (e.g., `## [Phase 3 Update - YYYY-MM-DD]`).
   - Log all modified UI components, updated assets, and integration endpoints for full auditing.

---

## 🎯 AGENT EXECUTION TASKLIST

### Step 1: Ingest Canvas UI Components
- Integrate the newly designed Phase 3 HTML/Tailwind templates into the local framework structure:
  - **Admin Command Center:** `Admin Operations Command Center` (Order Silicon Matrix, Bench Thermal Controller, InstaPay OCR Radar, Serial Scanner).
  - **Flash Deals & Drops:** `Apex Silicon Drops Matrix` (Countdown Ticker, Tier-1 Bento Grid, High-Throughput Drops, Cairo 24h Timeline, WhatsApp Telemetry Radar with hotline `+20 1129334173`).

### Step 2: Wire Frontend State & Props Safely
- Bind dynamic props to UI components without modifying backend models:
  - Connect local cart state & 15-minute countdown locks.
  - Connect WhatsApp / SMS alert trigger form to standard client notification hook (using `+20 1129334173` as default target / admin notification).
  - Ensure InstaPay manual validation modal toggles gracefully without disrupting transaction logs.

### Step 3: Run Local Validation & Auditing
- Verify responsive layout across Desktop, Tablet, and Mobile viewports.
- Run type checks (`tsc`) and build validation (`npm run build`).

### Step 4: Documentation Update Protocol
- Open project `.md` documentation files.
- **Append** the complete record of Phase 3 additions:
  - List of new components/routes added.
  - Integration status of WhatsApp notification node (`01129334173`).
  - Confirmation that DB Schema and Backend APIs were untouched.

---

## 📝 TEMPLATE FOR UPDATING PROJECT `.MD` FILES (APPEND MODE)

```markdown
---
## 📦 Update Log: Phase 3 UI Integration
**Timestamp:** {{TIMESTAMP}}
**Status:** Completed (Frontend Safe Execution)

### 📌 Summary of Changes:
1. **Admin Operations Command Center:** Integrated live telemetry dashboard, order matrix, InstaPay receipt inspection modal, and burn-in bench controller.
2. **Flash Deals & Silicon Drops:** Implemented high-frequency deal matrix, live countdowns, drop timeline, and Egyptian WhatsApp alert node (`+20 1129334173`).
3. **Integrity Check:** Backend services and DB schema were preserved 100% without alteration.
4. **Branding:** Verified "Designed & Powered by Y0ussef.com" footer signature.
---
```