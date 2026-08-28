// ===== Home Page E2E Tests =====
// Test the home page functionality

import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/ar');
    
    // Check if page title is correct
    await expect(page).toHaveTitle(/Y0 Hardware/);
    
    // Check if hero section is visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display featured products', async ({ page }) => {
    await page.goto('/ar');
    
    // Wait for products to load
    await page.waitForSelector('.grid');
    
    // Check if product cards are visible
    const productCards = page.locator('.bg-white.rounded-lg.shadow-md');
    await expect(productCards.first()).toBeVisible();
  });

  test('should switch language from Arabic to English', async ({ page }) => {
    await page.goto('/ar');
    
    // Click language switcher
    await page.click('button:has-text("EN")');
    
    // Check if URL changed to English
    await expect(page).toHaveURL(/\/en/);
  });

  test('should navigate to shop page', async ({ page }) => {
    await page.goto('/ar');
    
    // Click on shop link
    await page.click('a:has-text("المتجر")');
    
    // Check if navigated to shop page
    await expect(page).toHaveURL(/\/shop/);
  });

  test('should display categories', async ({ page }) => {
    await page.goto('/ar');
    
    // Check if categories section is visible
    await expect(page.locator('text=الفئات')).toBeVisible();
    
    // Check if category cards are visible
    const categoryCards = page.locator('.bg-white.rounded-lg.shadow-md');
    await expect(categoryCards).toHaveCount(4);
  });
});
