import { expect, Page } from '@playwright/test';

export const navigateToHistory = async (page: Page) => {
  await page.getByRole('button', { name: 'Select mode' }).click();
  await page.getByRole('link', { name: 'Order History' }).click();
  await expect(page).toHaveURL(/^https?:\/\/[^/]+\/p\/[^/]+\/order-history$/);
};
