import { test, expect } from '@playwright/test';

test('Alur Pengguna: Cari dan Lihat Detail Lowongan', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.locator('h1')).toContainText('Masuk ke Dicoding Jobs');

  await page.fill('input[name="email"]', 'dicoding@gmail.com');
  await page.fill('input[name="password"]', '123');
  
  await page.click('button[type="submit"]');

  const welcomeHeading = page.locator('h1');
  await expect(welcomeHeading).toContainText('Temukan lowongan', { timeout: 10000 });

  const searchInput = page.locator('input[placeholder*="Cari posisi"]');
  await searchInput.fill('Developer');
  
  const vacancyCard = page.locator('text=Developer').first();
  await expect(vacancyCard).toBeVisible();

  await vacancyCard.click();

  await expect(page).toHaveURL(/\/detail-vacancy\/\d+/);
});