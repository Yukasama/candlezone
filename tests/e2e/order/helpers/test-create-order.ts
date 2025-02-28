import { expect, Page } from '@playwright/test';

export const testCreateOrder = async (page: Page) => {
  await page.getByRole('button', { name: 'Add new order' }).first().click();
  await page.getByRole('button', { name: /AMZN/i }).click();

  const priceField = page
    .locator('div')
    .filter({ hasText: /^USD$/ })
    .getByRole('spinbutton');
  await expect(priceField).toHaveValue(/^[1-9]\d{0,5}\.?\d{0,2}$/);

  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.locator('div[role="dialog"]')).toBeHidden();

  const position = page.getByLabel('Position Manager').getByText('AMZN');
  await expect(position).toBeVisible();
};
