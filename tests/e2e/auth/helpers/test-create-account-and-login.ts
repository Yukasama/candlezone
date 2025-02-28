import { Page } from '@playwright/test';
import { generateRandomPassword, getRandomTestEmail } from './generators';

export const testCreateAccountAndLogin = async (page: Page) => {
  const browserName =
    page.context().browser()?.browserType().name() ?? 'unknown';
  const testEmail = getRandomTestEmail(browserName);
  const password = generateRandomPassword();

  await page.goto('/');
  await page.getByLabel('Sign In').click();
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await page.waitForURL('/sign-up');

  await page.getByPlaceholder('john.doe@gmail.com').click();
  await page.getByPlaceholder('john.doe@gmail.com').fill(testEmail);

  await page.getByPlaceholder('Enter your Password').click();
  await page.getByPlaceholder('Enter your Password').fill(password);

  await page.getByPlaceholder('Confirm your Password').click();
  await page.getByPlaceholder('Confirm your Password').fill(password);

  await page.getByRole('button', { name: 'Sign up with Email' }).click();
  await page.waitForURL('/dashboard');
};
