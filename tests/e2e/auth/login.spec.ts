import { expect, test } from '@playwright/test';
import { testCreateAccountAndLogin } from './helpers/test-create-account-and-login';

test('successful sign up and login with test email', async ({ page }) => {
  await testCreateAccountAndLogin(page);
  await expect(page.getByRole('button', { name: 'User avatar' })).toBeVisible();
});

test('failed login with test email', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Sign In').click();

  await page.getByPlaceholder('john.doe@gmail.com').click();
  await page.getByPlaceholder('john.doe@gmail.com').fill('test@gmail.com');
  await page.getByPlaceholder('Enter your Password').click();
  await page.getByPlaceholder('Enter your Password').fill('wrong');
  await page.getByRole('button', { name: 'Sign in with Email' }).click();

  await expect(page.getByText('Invalid credentials.')).toBeVisible();
});
