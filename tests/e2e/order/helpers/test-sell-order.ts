import { expect, Page } from '@playwright/test';

export const testSellOrder = async (page: Page) => {
  await page.getByRole('button', { name: 'Position actions' }).click();
  await page.getByRole('menuitem', { name: 'Sell Position' }).click();
  await page.getByRole('button', { name: 'I am sure, sell position' }).click();
  await expect(page.locator('div[role="dialog"]')).toBeHidden();
};
