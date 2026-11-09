# ⚡ Frontend Feature Prompt: Integrate User Account / Login Button in Header

## Objective
Add a dedicated, responsive **User Account / Login Button** to the `Header.tsx` top navigation bar to streamline authentication and account management for users and admins.

---

## 🛠️ Implementation Details

### 1. Update Header Component (`src/components/layout/Header.tsx` or equivalent)
In the top-right control section of the header (adjacent to Cart and Currency Toggle):

- **Guest State (Not Logged In):**
  - Render a clear **"Login / Register"** button or icon link.
  - Link target: `/${locale}/auth/login`
  - Design: Cyber-industrial styled button matching existing controls (e.g., `bg-surface-container-low hover:bg-surface-container-high px-space-sm py-1.5 rounded transition-all text-on-surface`).
  - Icon: `<span class="material-symbols-outlined">person</span>` or `<span class="material-symbols-outlined">account_circle</span>`.

- **Authenticated State (Logged In):**
  - Display an active User Avatar / Profile badge.
  - Dropdown or direct link target: `/${locale}/account` (or `/${locale}/admin` if `user.role === 'admin'`).
  - Optional badge indicator for active session status.

### 2. Layout & Spacing Guardrails
- Ensure the header container maintains proper flex spacing (`gap-space-sm`) and does not push the search bar or cart button out of view on mid-sized viewports.
- Keep z-index levels clear (`z-20` / `z-30`) so click events register cleanly on desktop and mobile drawer menus.

---

## 🧪 Verification & Directives
- **TypeScript Check:** Run `npx tsc --noEmit` to ensure zero typing errors.
- **Production Build:** Execute `npm run build` to confirm all 39+ routes compile cleanly (Exit Code 0).
- **Preserve Branding & Footer:** Maintain the mandatory footer signature `"Designed & Powered by Y0ussef.com"` and hotline `+20 1129334173`.
- **Zero Backend Mutation:** Keep database and API logic unchanged.
- **Logging:** Append execution logs to `README.md` and `MD/README.md`.

v1.1.13