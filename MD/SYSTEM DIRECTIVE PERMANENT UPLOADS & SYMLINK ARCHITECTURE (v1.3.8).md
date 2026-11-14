# 📚 SYSTEM DIRECTIVE: PERMANENT UPLOADS & SYMLINK ARCHITECTURE (v1.3.8)

## 📌 Context & Objective

In the **Y0 Hardware Market** platform (v1.3.8), product images and user uploads stored under `/uploads/` encountered `404 Not Found` errors in production on Hostinger VPS after every new deployment or versioned rebuild (`hbuilds/versions/<version-id>/`).

To permanently solve this issue without breaking existing functionality or losing files, the local agent must implement and document a permanent **Symbolic Link (Symlink)** strategy linking the application's upload directory to the persistent shared folder at `/home/u732920986/domains/hardwaremarket.y0ussef.com/public_html/uploads`.

## ⚠️ STRICT SAFEGUARD RULES FOR THE LOCAL AGENT

1. **ZERO BREAKING CHANGES:** Do not alter core database schemas or existing working API routes unless directly related to image upload path resolution.

2. **PRESERVE HISTORICAL LOGS:** Never delete legacy documentation or previous changelogs. Append all new v1.3.8 updates cleanly.

3. **MANDATORY BRANDING:** Ensure footer signatures (`"Designed & Powered by Y0ussef.com"`) and hotlines (`+20 1129334173`) remain completely untouched.

## 🛠️ STEP-BY-STEP IMPLEMENTATION TASKS

### 1. Backend Upload Path Verification (`src/app/api/...` or upload handlers)

* Verify that file upload endpoints (e.g., product image uploads) save files into the designated public uploads directory correctly.

* Ensure fallback paths check `process.env.UPLOAD_DIR` or default cleanly to `public/uploads` for local development while respecting the symlink in production.

### 2. Symbolic Link & Deployment Automation (`MD/DEPLOYMENT.md`)

* Document the exact shell commands required on Hostinger VPS to maintain the persistent link across version builds:

  ```
  # Ensure target persistent directory exists in public_html
  mkdir -p /home/u732920986/domains/hardwaremarket.y0ussef.com/public_html/uploads
  
  # Inside the active build directory (e.g., hbuilds/current or version folder):
  rm -rf ./public/uploads
  ln -s /home/u732920986/domains/hardwaremarket.y0ussef.com/public_html/uploads ./public/uploads
  
  ```

### 3. Documentation Overhaul (`README.md`, `MD/CHANGELOG.md`, `MD/DEPLOYMENT.md`)

* Update version tag across all documentation files to **v1.3.8**.

* Add a dedicated section in `MD/DEPLOYMENT.md` explaining the Persistent Uploads Architecture and Symlink maintenance.

* Append v1.3.8 release notes in `MD/CHANGELOG.md`.

## 🧪 VERIFICATION PROTOCOL

1. **TypeScript Check:** Run `npx tsc --noEmit` (**Must return 0 Errors**).

2. **Production Build:** Run `npm run build --webpack` (**Must succeed with Exit Code 0**).

3. **Git Commit & Push:** Commit changes with message:
   `fix: implement persistent uploads symlink architecture and update docs (v1.3.8)`