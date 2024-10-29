/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable sonarjs/no-duplicate-string */

import { expect, test } from '@playwright/test';

const email = 'test@gmail.com';
const password = 'haha12341234';
const wrongPassword = 'wrong';

test('successful login with test email', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Sign In').click();

  await page.getByPlaceholder('john.doe@gmail.com').click();
  await page.getByPlaceholder('john.doe@gmail.com').fill(email);
  await page.getByPlaceholder('Enter your Password').click();
  await page.getByPlaceholder('Enter your Password').fill(password);
  await page.getByRole('button', { name: 'Sign in with Email' }).click();

  await page.waitForURL('/dashboard');
  await expect(page.getByRole('main')).toContainText('My Portfolios');
});

test('failed login with test email', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Sign In').click();

  await page.getByPlaceholder('john.doe@gmail.com').click();
  await page.getByPlaceholder('john.doe@gmail.com').fill(email);
  await page.getByPlaceholder('Enter your Password').click();
  await page.getByPlaceholder('Enter your Password').fill(wrongPassword);
  await page.getByRole('button', { name: 'Sign in with Email' }).click();

  await expect(page.getByText('Invalid credentials.')).toBeVisible();
});
