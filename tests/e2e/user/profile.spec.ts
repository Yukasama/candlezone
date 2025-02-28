import { expect, test } from '@playwright/test';
import { createAccountAndLogin } from '../auth/helpers/create-account-and-login';

const username = 'New Username';
const biography = 'Yohoo.';

test('update profile', async ({ page }) => {
  await createAccountAndLogin(page);

  await page.getByRole('button', { name: 'User avatar' }).click();
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Biography' }).fill(biography);
  await page.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.locator('h2')).toContainText(username);
  await page.reload();
  await expect(page.getByPlaceholder('Enter your biography...')).toContainText(
    biography,
  );
});
