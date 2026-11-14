#!/usr/bin/env bash
# ===== Y0 Hardware Market - Automated Symlink Setup Script (v1.3.10) =====
# Ensures the persistent uploads directory exists and is symbolically linked
# to ./public/uploads across deployments and version builds on Hostinger VPS.
#
# Developed by:
# - Arabic: م / يوسف محمود عبد الجواد
# - English: Eng / Youssef Mahmoud Abdelgawad
# - Business: https://y0ussef.com/
# - Whatsapp https://wa.me/201129334173

set -e

PERSISTENT_UPLOADS="/home/u732920986/domains/hardwaremarket.y0ussef.com/public_html/uploads"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_SYMLINK="$PROJECT_DIR/public/uploads"

echo "=== [Y0 Hardware Market] Symlink & Uploads Automation ==="
echo "1. Checking persistent directory: $PERSISTENT_UPLOADS"
mkdir -p "$PERSISTENT_UPLOADS"
chmod 755 "$PERSISTENT_UPLOADS"

echo "2. Preparing target link in: $TARGET_SYMLINK"
if [ -L "$TARGET_SYMLINK" ]; then
  echo "Existing symlink detected. Replacing..."
  rm -f "$TARGET_SYMLINK"
elif [ -d "$TARGET_SYMLINK" ]; then
  echo "Existing directory detected. Merging contents and linking..."
  cp -rn "$TARGET_SYMLINK"/* "$PERSISTENT_UPLOADS"/ 2>/dev/null || true
  rm -rf "$TARGET_SYMLINK"
fi

echo "3. Creating symbolic link:"
ln -s "$PERSISTENT_UPLOADS" "$TARGET_SYMLINK"

echo "4. Verification:"
ls -ld "$TARGET_SYMLINK"
echo "=== Symlink configured successfully! ==="
