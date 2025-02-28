import { expect, test } from '@playwright/test';
import { createAccountAndLogin } from '../auth/helpers/create-account-and-login';
import { testCreatePortfolio } from './helpers/test-create-portfolio';

test.describe('check unauthorized access', () => {
  test('private', async ({ page }) => {
    await createAccountAndLogin(page);
    await testCreatePortfolio({ page });
    const portfolioUrl = page.url();

    // Logout
    await page.getByRole('button', { name: 'User avatar' }).click();
    await page.getByRole('menuitem', { name: 'Sign Out' }).click();
    await expect(page.getByText('This page could not be found.')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Sign In' }).first(),
    ).toBeVisible();
    await createAccountAndLogin(page);

    // Check portfolio access
    await page.goto(portfolioUrl);
    await expect(page.getByText('This page could not be found.')).toBeVisible();

    // Check settings access
    await page.goto(`${portfolioUrl}/settings`);
    await expect(page.getByText('This page could not be found.')).toBeVisible();
  });

  test('public', async ({ page }) => {
    await createAccountAndLogin(page);
    await testCreatePortfolio({ isPublic: true, page });
    const portfolioUrl = page.url();

    // Logout
    await page.getByRole('button', { name: 'User avatar' }).click();
    await page.getByRole('menuitem', { name: 'Sign Out' }).click();
    await expect(page.getByText('This page could not be found.')).toBeHidden();
    await page.reload();
    await expect(
      page.getByRole('link', { name: 'Sign In' }).first(),
    ).toBeVisible();
    await createAccountAndLogin(page);

    // Check portfolio access
    await page.goto(portfolioUrl);
    await expect(
      page.getByRole('button', { name: 'Add new order' }),
    ).toBeHidden();
    await expect(page.getByRole('button', { name: 'Manage' })).toBeHidden();

    // Check settings access
    await page.goto(`${portfolioUrl}/settings`);
    await expect(page).not.toHaveURL(/\/settings$/);
  });
});
