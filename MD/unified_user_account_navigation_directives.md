# ⚡ Frontend Navigation Directive: Unified Account Routing & Role Dashboards

## 📌 Context & Objective
Currently, clicking the user profile badge in the top header (`Header.tsx`) conditionally routes `admin` users directly to `/${locale}/admin` and regular users to `/${locale}/account`. 

### Required UX Change:
1. **Universal Profile Link in Header:** When any authenticated user (User, Admin, or Seller) clicks their user name / avatar button in the header, they **MUST ALWAYS** be directed to their profile page: `/${locale}/account`.
2. **Dashboard Quick Action inside Account Page:** The `/${locale}/account` page already renders a dedicated **`DASHBOARD`** button for elevated roles (Admin / Seller). This allows them to navigate to their respective command centers (`/${locale}/admin` or `/${locale}/seller`) directly from their profile.

---

## 🛠️ Step-by-Step Implementation Protocol for Local Agent

### Step 1: Update Header Navigation (`src/components/layout/Header.tsx` or equivalent)

Inspect the authenticated account node rendering block in `Header.tsx`:

* Change the target `href` for the main user profile button so that it always points to `/${locale}/account` regardless of `user.role`.

```tsx
{/* Authenticated User State */}
<a
  href={`/${locale}/account`}
  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-container/20 border border-primary-container/40 text-primary-container hover:bg-primary-container/30 text-xs font-bold transition-all z-20"
>
  <span className="material-symbols-outlined text-[18px]">account_circle</span>
  <span className="max-w-[100px] truncate">{user.first_name || user.name || 'Account'}</span>
  {user.role === 'admin' && (
    <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-1.5 py-0.5 rounded uppercase border border-cyan-500/30 font-mono">
      Admin
    </span>
  )}
  {user.role === 'seller' && (
    <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded uppercase border border-amber-500/30 font-mono">
      Seller
    </span>
  )}
</a>
```

### Step 2: Verify Profile Page Dashboard Link (`src/app/[locale]/account/page.tsx`)

Ensure the `/${locale}/account` page continues to render the `DASHBOARD` button at the bottom of the profile card when `user.role === 'admin'` or `user.role === 'seller'`:

* **For Admin (`user.role === 'admin'`):** Target link `/${locale}/admin`.
* **For Seller (`user.role === 'seller'`):** Target link `/${locale}/seller` (or admin command center seller scope).

### Step 3: Verification & Safety Protocol

1. **TypeScript Check:** Run `npx tsc --noEmit` (**0 Errors**).
2. **Production Build:** Execute `npm run build` using Webpack (**Exit Code 0**).
3. **Brand Continuity:** Maintain mandatory footer signature `"Designed & Powered by Y0ussef.com"` and hotline `+20 1129334173`.
4. **Documentation:** Append execution logs to `README.md` and `MD/README.md`.