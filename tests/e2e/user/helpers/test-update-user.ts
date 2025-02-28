import { expect, Page } from '@playwright/test';

interface Props {
  biography?: string;
  page: Page;
  username?: string;
}

export const testUpdateUser = async ({
  biography = 'Yohoo.',
  page,
  username = 'New Username',
}: Props) => {
  await page.getByRole('button', { name: 'User avatar' }).click();
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Biography' }).fill(biography);
  await page.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.locator('h2')).toContainText(username);
  await page.reload();

  const biographyField = page.getByPlaceholder('Enter your biography...');
  await expect(biographyField).toContainText(biography);
};
