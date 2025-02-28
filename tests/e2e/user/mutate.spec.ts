import { expect, test } from '@playwright/test';
import { testCreateAccountAndLogin } from '../auth/helpers/test-create-account-and-login';
import { testUpdateUser } from './helpers/test-update-user';

const username = 'New Username';
const biography = 'Yohoo.';

test.describe('update user info', () => {
  test('update profile', async ({ page }) => {
    await testCreateAccountAndLogin(page);
    await testUpdateUser({ page });
  });

  test('update settings', async ({ page }) => {
    await testCreateAccountAndLogin(page);
    await testUpdateUser({ page });

    await page
      .locator('div')
      .filter({ hasText: /^N$/ })
      .getByLabel('User avatar')
      .click();
    await page.getByRole('link', { name: 'User avatar New Username' }).click();
    await expect(page.getByRole('main').getByText(username)).toBeVisible();
    await expect(page.getByText(biography)).toBeVisible();
  });
});
