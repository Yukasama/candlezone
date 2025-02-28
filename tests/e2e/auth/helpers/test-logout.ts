import { expect, Page } from '@playwright/test';

export const testLogout = async (page: Page) => {
  await page.getByRole('button', { name: 'User avatar' }).click();
  await page.getByRole('menuitem', { name: 'Sign Out' }).click();
  await expect(
    page.getByRole('link', { name: 'Sign In' }).first(),
  ).toBeVisible();
};
