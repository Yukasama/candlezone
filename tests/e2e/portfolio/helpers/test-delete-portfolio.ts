import { expect, Page } from '@playwright/test';

interface Props {
  page: Page;
  title: string;
}

export const testDeletePortfolio = async ({ page, title }: Props) => {
  await page.getByRole('link', { name: 'Portfolio settings' }).click();
  await expect(page).toHaveURL(/^http?:\/\/[^/]+\/p\/[^/]+\/settings$/);
  await page.getByRole('button', { name: 'Delete Portfolio' }).click();
  await page.getByPlaceholder(title).fill(title);
  await page.getByPlaceholder('CONFIRM').click();
  await page.getByPlaceholder('CONFIRM').press('CapsLock');
  await page.getByPlaceholder('CONFIRM').fill('CONFIRM');
  await page.getByRole('button', { name: 'I am sure, delete' }).click();
};
