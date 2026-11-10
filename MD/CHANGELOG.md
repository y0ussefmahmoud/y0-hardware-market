# 📜 CHANGELOG - Y0 Hardware Market

All notable changes to this project are documented in this file.

---

## [1.3.6] - 2026-11-10
### Added
- Created `MD/ARCHITECTURE.md` documenting all 40 static and dynamic routes, entity relationships, security standards, and state architecture.
- Added Multi-Vendor role support (`user`, `seller`, `admin`) with dedicated Seller Dashboard at `/[locale]/seller`.
- Added `products.seller_id` foreign key column with ownership checks on mutations.
- Added `requireSellerOrAdmin` authorization utility in `src/lib/auth.ts`.

### Changed
- Replaced internal loopback `fetch()` calls in Server Components (`/shop`, `/product/[slug]`) with direct MySQL `pool.query` queries, eliminating SSR `fetch failed` errors.
- Aligned Admin Operations HUD (`/[locale]/admin`) with the dark obsidian cyber-industrial design (`Sources/stitch_y0_hardware_marketplace_redesign/`).
- Standardized header account avatar button to direct all authenticated users to `/[locale]/account` with role indicators and direct dashboard triggers.
- Updated Next.js production build command to use `--webpack` flag to prevent Turbopack CSS panics.

### Fixed
- Fixed SWC / Next.js version synchronization across build environments.
- Fixed infinite loading spinner on `/account` by ensuring `/api/auth/me` returns `200 OK` for guests with `user: null`.
- Fixed auth session cookie flags by applying `sameSite: 'lax'`.

---

## [1.3.3] - 2026-11-10
### Fixed
- Resolved production SSR `fetch failed` connection errors by replacing loopback HTTP fetches with direct database queries.
- Configured `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_API_URL` in `.env.production`.

---

## [1.3.2] - 2026-11-10
### Changed
- Refactored Admin Dashboard UI (`src/app/[locale]/admin/page.tsx`) to match tactical cyberpunk theme.

---

## [1.3.1] - 2026-11-10
### Added
- Integrated Multi-Vendor seller role architecture and seller product routes.

---
*Designed & Powered by Y0ussef.com — Hotline: +20 1129334173*
