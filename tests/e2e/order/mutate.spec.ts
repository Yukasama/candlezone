import { expect, test } from '@playwright/test';
import { testCreateAccountAndLogin } from '../auth/helpers/test-create-account-and-login';
import { testCreatePortfolio } from '../portfolio/helpers/test-create-portfolio';
import { navigateToHistory } from './helpers/navigate-to-history';
import { testAddOrder } from './helpers/test-add-order';
import { testSellOrder } from './helpers/test-sell-order';

test.describe('create', () => {
  test('add order and refresh price', async ({ page }) => {
    await testCreateAccountAndLogin(page);
    await testCreatePortfolio({ page });
    await testAddOrder({ page, refresh: true });
  });

  test('add order incorrectly', async ({ page }) => {
    await testCreateAccountAndLogin(page);
    await testCreatePortfolio({ page });
    await testAddOrder({ invalid: true, page });
  });
});

test.describe('update', () => {
  test('update order', async ({ page }) => {
    await testCreateAccountAndLogin(page);
    await testCreatePortfolio({ page });
    await testAddOrder({ page });
    await navigateToHistory(page);

    // Update order
    await page.getByRole('button', { name: 'Update order' }).click();
    await page.getByRole('button', { name: 'Increase quantity' }).click();
    await page.locator('input[name="price"]').fill('100.01');
    await page.getByRole('button', { name: 'Update' }).click();
    await expect(page.locator('div[role="dialog"]')).toBeHidden();
    await expect(page.locator('p', { hasText: /^100.01$/ })).toBeVisible();
    await expect(page.locator('p', { hasText: /^2$/ })).toBeVisible();
  });

  test('update order incorrectly', async ({ page }) => {
    await testCreateAccountAndLogin(page);
    await testCreatePortfolio({ page });
    await testAddOrder({ page });
    await testSellOrder(page);
    await navigateToHistory(page);

    // Update order (incorrectly)
    await page.getByRole('button', { name: 'Update order' }).first().click();
    await page.getByRole('button', { name: 'Increase quantity' }).click();
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(page.getByText('Not enough quantity to sell.')).toBeVisible();
  });
});

test.describe('delete', () => {
  test('sell order', async ({ page }) => {
    await testCreateAccountAndLogin(page);
    await testCreatePortfolio({ page });
    await testAddOrder({ page });

    // New order
    await page.getByRole('button', { name: 'Position actions' }).click();
    await page.getByRole('menuitem', { name: 'New Order' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('div[role="dialog"]')).toBeHidden();
    await expect(page.getByText('2Shares')).toBeVisible();

    await testSellOrder(page);
  });

  test('delete order', async ({ page }) => {
    await testCreateAccountAndLogin(page);
    await testCreatePortfolio({ page });
    await testAddOrder({ page });
    await navigateToHistory(page);

    // Delete order
    await page.getByRole('button', { name: 'Delete order' }).first().click();
    await page
      .getByRole('textbox', { name: 'Confirm deletion of order' })
      .fill('CONFIRM');
    await page.getByRole('button', { name: 'I am sure, delete' }).click();
    await expect(page.locator('div[role="dialog"]')).toBeHidden();
    await expect(page.getByText('Order successfully deleted.')).toBeVisible();
    await expect(page.locator('div', { hasText: /^Deleted$/ })).toBeVisible();
  });
});
