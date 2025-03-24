import { expect, test } from '@playwright/test';

test('is symbol page functional', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Search Candlezone...' }).click();
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
  await page.getByRole('button', { name: '5D' }).click();
  await page.getByRole('button', { name: '1M' }).click();
  await page.getByRole('button', { name: '6M' }).click();
  await page.getByRole('button', { name: '1Y' }).click();
  await page.getByRole('button', { name: '5Y' }).click();
  await page.getByRole('button', { name: 'All' }).click();

  await page.getByRole('button', { name: 'See stock info' }).click();
  await expect(page.getByText('Apple Inc. designs,')).toBeVisible();

  await page.getByRole('button', { name: 'Stock Apple Inc. AAPL' }).click();
  await expect(
    page.getByRole('link', { name: 'Stock GoPro, Inc. GPRO' }),
  ).toBeVisible();
});
