import { expect, test } from '@playwright/test';
import { testCreateAccountAndLogin } from '../auth/helpers/test-create-account-and-login';
import { testLogout } from '../auth/helpers/test-logout';
import { testCreatePortfolio } from './helpers/test-create-portfolio';

test('private', async ({ page }) => {
  await testCreateAccountAndLogin(page);
  await testCreatePortfolio({ page });
  const portfolioUrl = page.url();

  // Logout and login with a different account
  await testLogout(page);
  await expect(page.getByText('This page could not be found.')).toBeVisible();
  await testCreateAccountAndLogin(page);

  // Check portfolio access
  await page.goto(portfolioUrl);
  await expect(page.getByText('This page could not be found.')).toBeVisible();

  // Check settings access
  await page.goto(`${portfolioUrl}/settings`);
  await expect(page.getByText('This page could not be found.')).toBeVisible();
});

test('public', async ({ page }) => {
  await testCreateAccountAndLogin(page);
  await testCreatePortfolio({ isPublic: true, page });

  const portfolioUrl = page.url();

  // Logout and login with a different account
  await testLogout(page);
  await expect(page.getByText('This page could not be found.')).toBeHidden();
  await testCreateAccountAndLogin(page);

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
