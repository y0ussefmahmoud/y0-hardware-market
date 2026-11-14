# 📜 CHANGELOG - Y0 Hardware Market

All notable changes to this project are documented in this file.

---

## [1.3.10] - 2026-11-14
### Added
- Created centralized image URL resolution utility (`src/lib/image.ts`) with `getImageUrl` and `getProductMainImage` helpers.
- Added automated Hostinger VPS symbolic link deployment script (`scripts/setup-symlink.sh`).
- Added cyber-industrial dark placeholder assets (`public/placeholder.svg`, `public/placeholder.jpg`, `public/placeholder.png`).

### Changed
- Hardened upload API (`src/app/api/upload/route.ts`) with strict file extension validation, MIME type checks, filename sanitization, and clean relative `/uploads/...` URL returns.
- Standardized product image rendering and preview thumbnails across `ProductCard`, `product/[slug]`, `cart`, `checkout`, `admin`, and `seller` dashboards.
- Bumped application and documentation version to **v1.3.10**.

### Fixed
- Fixed image preview rendering issues and broken thumbnail paths in admin and seller modals.
- Fixed 404 Not Found on missing `/placeholder.jpg` by providing valid static placeholder assets.

---

## [1.3.9] - 2026-11-14
### Added
- Added `is_featured BOOLEAN DEFAULT FALSE` column to MySQL `products` table schema and indexes.
- Integrated `is_featured` toggle / checkbox in Admin Operations HUD and Seller Dashboard product management modals.
- Implemented robust, URL-friendly slug generation utility (`src/lib/slug.ts`) supporting Arabic and English characters with automatic collision resolution on product creation and updates.
- Configured storefront homepage and featured API to prioritize `is_featured = 1` products for top showcase placement.
- Added missing `next-intl` localization messages: `nav.shop` and `shop.tryAdjustingFilters` in both `ar.json` and `en.json`.

### Changed
- Bumped application and documentation version to **v1.3.9**.
- Enhanced `/[locale]/product/[slug]` and `/api/products/slug/[slug]` resolution with URI decoding, case-insensitive comparison, and numeric ID fallback.

### Fixed
- Resolved `Product not found` 404 errors on dynamic product specification pages for newly created items.
- Eliminated `MISSING_MESSAGE` runtime warnings in navigation and shop filter UI.
- Hardened `ProductCard` image rendering with clean fallback handling.

---

## [1.3.8] - 2026-11-14
### Added
- Permanent uploads and symbolic link (Symlink) architecture linking `./public/uploads` to persistent directory `/home/u732920986/domains/hardwaremarket.y0ussef.com/public_html/uploads` on Hostinger VPS.
- Support for optional `process.env.UPLOAD_DIR` configuration in `src/app/api/upload/route.ts` with clean fallback to `path.join(process.cwd(), 'public', 'uploads')`.
- Role authorization update on image uploads to support multi-vendor sellers (`requireSellerOrAdmin`).
- Dedicated section and shell automation guide for persistent uploads symlinks in `MD/DEPLOYMENT.md`.

### Changed
- Bumped project version to **v1.3.8** across `package.json`, architecture blueprints, and deployment documentation.
- Updated `.env.example` and `.env.production` to document the persistent uploads directory variable.

### Fixed
- Resolved `404 Not Found` errors for uploaded product assets after versioned builds or directory redeployments (`hbuilds/versions/<version-id>/`).

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
