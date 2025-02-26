import { expect, Page } from '@playwright/test';

export const testDeletePortfolio = async (page: Page, title: string) => {
  await page.getByRole('link', { name: 'Portfolio settings' }).click();
  await expect(page).toHaveURL(/^https?:\/\/[^/]+\/p\/[^/]+\/settings$/);
  await page.getByRole('button', { name: 'Delete Portfolio' }).click();
  await page.getByPlaceholder(title).fill(title);
  await page.getByPlaceholder('CONFIRM').click();
  await page.getByPlaceholder('CONFIRM').press('CapsLock');
  await page.getByPlaceholder('CONFIRM').fill('CONFIRM');
  await page.getByRole('button', { name: 'I am sure, delete' }).click();
};
