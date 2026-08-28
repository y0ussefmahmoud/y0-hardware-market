// ===== Authentication E2E Tests =====
// Test login and registration functionality

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/ar');
    
    // Click on login link
    await page.click('text=تسجيل الدخول');
    
    // Check if navigated to login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/ar');
    
    // Click on register link
    await page.click('text=إنشاء حساب');
    
    // Check if navigated to registration page
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/ar/auth/login');
    
    // Check if email input is visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Check if password input is visible
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check if login button is visible
    await expect(page.locator('button:has-text("تسجيل الدخول")')).toBeVisible();
  });

  test('should display registration form', async ({ page }) => {
    await page.goto('/ar/auth/register');
    
    // Check if name input is visible
    await expect(page.locator('input[placeholder*="الاسم"]')).toBeVisible();
    
    // Check if email input is visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Check if password input is visible
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check if register button is visible
    await expect(page.locator('button:has-text("إنشاء حساب")')).toBeVisible();
  });
});
