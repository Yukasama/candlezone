import { expect, test } from '@playwright/test';
import { createAccountAndLogin } from '../auth/helpers/create-account-and-login';
import { testCreatePortfolio } from './helpers/test-create-portfolio';

test.describe('public', () => {
  test('check settings access', async ({ page }) => {
    await createAccountAndLogin(page);
    await testCreatePortfolio(page);
    const portfolioUrl = page.url();

    // Logout
    await page.getByRole('button', { name: 'User avatar' }).click();
    await page.getByRole('menuitem', { name: 'Sign Out' }).click();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await createAccountAndLogin(page);

    // Check settings access
    await page.goto(`${portfolioUrl}/settings`);
    await expect(page).not.toHaveURL(/\/settings$/);
  });
});
