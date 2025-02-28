import { expect, test } from '@playwright/test';

test('screener', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Screener' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill('AAPL');
  await expect(
    page.getByLabel('Screener Table').getByRole('link'),
  ).toContainText('Apple Inc.');

  await page.getByRole('combobox').filter({ hasText: 'Sector: Any' }).click();
  await page.getByRole('option', { name: 'Energy' }).click();
  await expect(page).toHaveURL(/^https?:\/\/[^/]+\/screener\?.*sector=Energy/);
  await expect(page.getByRole('strong')).toContainText('No results found.');
  await page.getByRole('textbox', { name: 'Search...' }).fill('');

  const rows = page.locator('tbody tr');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    await expect(rows.nth(i)).toContainText('Energy', { useInnerText: true });
  }
  await expect(rows).toHaveCount(10);

  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(
    page.getByRole('combobox').filter({ hasText: 'Sector: Any' }),
  ).toBeVisible();

  const rowsAfter = page.locator('tbody tr');
  const rowsWithEnergy = await rowsAfter.filter({ hasText: 'Energy' }).count();
  expect(rowsWithEnergy).toBeLessThan(10);
});
