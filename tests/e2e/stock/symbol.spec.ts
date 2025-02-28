import { expect, test } from '@playwright/test';

test('is symbol page functional', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Search Zenathra...' }).click();
  const aaplLink = page.getByRole('link', {
    exact: true,
    name: 'Stock Apple Inc. AAPL Technology',
  });
  await expect(aaplLink).toBeVisible();
  await aaplLink.click();

  await expect(
    page
      .locator('div')
      .filter({ hasText: /^Apple Inc\.$/ })
      .getByRole('paragraph'),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Stock Apple Inc. AAPL' }),
  ).toBeVisible();

  await expect(page.getByRole('application').first()).toBeVisible();
  await expect(page.getByText('1D5D1M6M1Y5YAll')).toBeVisible();
  await page.getByRole('button', { name: '5D' }).click();
  await expect(page.getByText('1D5D1M6M1Y5YAll')).toBeVisible();
  await page.getByRole('button', { name: '1M' }).click();
  await expect(page.getByText('1D5D1M6M1Y5YAll')).toBeVisible();
  await page.getByRole('button', { name: '6M' }).click();
  await expect(page.getByText('1D5D1M6M1Y5YAll')).toBeVisible();
  await page.getByRole('button', { name: '1Y' }).click();
  await expect(page.getByText('1D5D1M6M1Y5YAll')).toBeVisible();
  await page.getByRole('button', { name: '5Y' }).click();
  await expect(page.getByText('1D5D1M6M1Y5YAll')).toBeVisible();
  await page.getByRole('button', { name: 'All' }).click();
  await expect(page.getByText('1D5D1M6M1Y5YAll')).toBeVisible();
  await expect(page.getByText('Price: $')).toBeVisible();

  await page.getByRole('button', { name: 'See stock info' }).click();
  await expect(page.getByText('Apple Inc. designs,')).toBeVisible();

  await page.getByRole('button', { name: 'Stock Apple Inc. AAPL' }).click();
  await expect(
    page.getByRole('link', { name: 'Stock GoPro, Inc. GPRO' }),
  ).toBeVisible();
});
