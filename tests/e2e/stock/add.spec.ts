import { expect, test } from '@playwright/test';
import { createAccountAndLogin } from '../auth/helpers/create-account-and-login';
import { testCreatePortfolio } from '../portfolio/helpers/test-create-portfolio';

test('add to portfolio from stock page', async ({ page }) => {
  await createAccountAndLogin(page);
  await testCreatePortfolio({ page });

  await page.getByRole('textbox', { name: 'Search Zenathra...' }).fill('WMT');
  await page
    .getByRole('link', { name: 'Stock Walmart Inc. WMT Consumer Defensive' })
    .click();
  await page.getByRole('button', { name: 'Add stock to portfolio' }).click();
  await expect(page.getByRole('dialog', { name: 'New Order' })).toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('div[role="dialog"]')).toBeHidden();
  await expect(page.getByText('Order created successfully.')).toBeVisible();

  await page.getByRole('link', { exact: true, name: 'T' }).click();
  await page.getByRole('button', { name: 'T Test Portfolio Private' }).click();
  await page.getByText('Create a new portfolio').click();
  await page.getByRole('textbox', { name: 'Title' }).fill('Yay');
  await page.getByRole('button', { name: 'Create' }).click();

  await page.getByRole('textbox', { name: 'Search Zenathra...' }).fill('WMT');
  await page
    .getByRole('link', { name: 'Stock Walmart Inc. WMT Consumer Defensive' })
    .click();
  await page.getByRole('button', { name: 'Add stock to portfolio' }).click();
  await page.getByRole('button', { name: 'Portfolio Test Portfolio' }).click();
  await page.getByText('Yay').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('link', { exact: true, name: 'Y' }).click();
  await expect(
    page.getByRole('cell', { name: 'Stock Walmart Inc. WMT' }),
  ).toBeVisible();
});
