import { expect, test } from '@playwright/test';
import { testCreateAccountAndLogin } from '../auth/helpers/test-create-account-and-login';
import { testCreatePortfolio } from '../portfolio/helpers/test-create-portfolio';

const symbol = 'WMT';
const secondPortfolioName = 'Yay';

test('add to portfolio from stock page', async ({ page }) => {
  await testCreateAccountAndLogin(page);
  await testCreatePortfolio({ page });

  // Search symbol
  await page.getByRole('textbox', { name: 'Search Candlezone...' }).fill(symbol);
  await page
    .getByRole('link', { name: 'Stock Walmart Inc. WMT Consumer Defensive' })
    .click();

  // Add stock to portfolio
  await page.getByRole('button', { name: 'Add stock to portfolio' }).click();
  await expect(page.getByRole('dialog', { name: 'New Order' })).toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Order created successfully.')).toBeVisible();
  await expect(page.locator('div[role="dialog"]')).toBeHidden();

  // Create second portfolio
  await page.getByRole('link', { exact: true, name: 'T' }).click();
  await page.getByRole('button', { name: 'T Test Portfolio Private' }).click();
  await page.getByText('Create a new portfolio').click();
  await page.getByRole('textbox', { name: 'Title' }).fill(secondPortfolioName);
  await page.getByRole('button', { name: 'Create' }).click();

  // Search symbol
  await page.getByRole('textbox', { name: 'Search Candlezone...' }).fill(symbol);
  await page
    .getByRole('link', { name: 'Stock Walmart Inc. WMT Consumer Defensive' })
    .click();

  // Add stock to second portfolio
  await page.getByRole('button', { name: 'Add stock to portfolio' }).click();
  await page.getByRole('button', { name: 'Portfolio Test Portfolio' }).click();
  await page.getByText(secondPortfolioName).click();
  await page.getByRole('button', { name: 'Submit' }).click();

  // Check stock in second portfolio
  await page
    .getByRole('link', {
      exact: true,
      name: secondPortfolioName.at(0)?.toUpperCase(),
    })
    .click();
  await expect(
    page.getByRole('cell', { name: 'Stock Walmart Inc. WMT' }),
  ).toBeVisible();
});
