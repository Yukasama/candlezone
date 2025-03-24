import test, { expect } from '@playwright/test';
import { testCreateAccountAndLogin } from '../auth/helpers/test-create-account-and-login';

test('check recent stock', async ({ page }) => {
  await testCreateAccountAndLogin(page);

  await page.getByRole('textbox', { name: 'Search Candlezone...' }).fill('WMT');
  await page.getByRole('link', { name: /WMT/i }).first().click();
  await expect(page).toHaveURL(/\/stocks\/WMT/);

  await page.waitForTimeout(2000);
  await page.reload();
  await expect(page.getByRole('link', { name: 'Go to WMT' })).toBeVisible();

  await page.getByRole('button', { name: 'Open sidebar' }).click();
  await expect(
    page.getByRole('link', { name: 'Stock Walmart Inc. WMT' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});
