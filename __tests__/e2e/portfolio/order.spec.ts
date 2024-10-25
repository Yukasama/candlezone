/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable sonarjs/no-duplicate-string */

import { db } from '@/lib/db';
import { expect, test } from '@playwright/test';
import { testLogin } from '../helpers/login';

test.describe('portfolios', () => {
  test.afterEach(async ({ page }) => {
    await page.getByRole('main').getByRole('link').nth(4).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByPlaceholder('CONFIRM').fill('CONFIRM');
    await page.getByRole('button', { name: 'Delete' }).click();
  });

  test.afterAll(async () => {
    await db.user.deleteMany({
      where: {
        email: {
          startsWith: 'playwright-test-',
        },
      },
    });
  });

  test('create and sell order', async ({ page }) => {
    // Login
    await testLogin(page);
    await expect(page.getByRole('main')).toContainText('My Portfolios');

    // Create portfolio
    await page.goto('/p/new');
    await page.getByText('Create a new portfolio').click();
    await page.getByPlaceholder('Choose your title...').fill('Test');
    await page.getByRole('button', { name: 'Create' }).click();

    // Add a stock order
    await page.getByLabel('Add orders').nth(1).click();
    await page.getByPlaceholder('Search stocks...').fill('Apple');
    await page.getByRole('option', { name: 'Apple Inc. AAPL' }).click();
    await page.getByLabel('Add new stocks').click();
    await expect(page.locator('tbody')).toContainText('Apple Inc.');

    // Add another stock order of the same stock
    await page.getByLabel('Action').click();
    await page.getByText('New Order').click();
    await page.getByLabel('Quantity').fill('2');
    await page.getByRole('button', { name: 'Create' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('tbody')).toContainText('3Shares');

    // Sell the position
    await page.getByLabel('Action').click();
    await page.getByRole('menuitem', { name: 'Sell Position' }).click();
    await expect(page.getByText('No stocks in this portfolio.')).toBeVisible();
  });

  test('update and delete order', async ({ page }) => {
    // Login
    await testLogin(page);
    await expect(page.getByRole('main')).toContainText('My Portfolios');

    // Create portfolio
    await page.goto('/p/new');
    await page.getByText('Create a new portfolio').click();
    await page.getByPlaceholder('Choose your title...').fill('Test2');
    await page.getByRole('button', { name: 'Create' }).click();

    // Rename order
    await page
      .locator('div')
      .filter({ hasText: /^OverviewManage$/ })
      .getByRole('button')
      .first()
      .click();
    await page.getByText('Rename').click();
    await page.getByPlaceholder('New portfolio title').fill('Test 2');
    await page.getByRole('button', { name: 'Rename' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'T Test 2 Private' }).click();

    // Make portfolio public
    await page
      .locator('div')
      .filter({ hasText: /^OverviewManage$/ })
      .getByRole('button')
      .first()
      .click();
    await page.getByText('Make public').click();
    await expect(
      page.getByRole('button', { name: 'T Test 2 Public' }),
    ).toBeVisible();

    // Add a stock order
    await page.getByLabel('Add orders').nth(1).click();
    await page.getByPlaceholder('Search stocks...').fill('aapl');
    await page.getByRole('option', { name: 'Apple Inc. AAPL' }).click();
    await page.getByLabel('Add new stocks').click();

    // Update the order
    await page.getByRole('main').getByRole('link').nth(3).click();
    await page.getByLabel('Action').click();
    await page.getByRole('menuitem', { name: 'Update Order' }).click();
    await page.getByPlaceholder('Custom Price').fill('220');
    await page.getByLabel('Quantity').click();
    await page.getByLabel('Quantity').fill('3');
    await page.getByLabel('Date').click();
    await page.getByRole('gridcell', { name: '20' }).click();

    // Delete the order
    await page.getByText('Update').click();
    await page.getByLabel('Action').click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText('Deleted')).toBeVisible();
  });
});
