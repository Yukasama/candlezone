import { expect, test } from '@playwright/test';
import { createAccountAndLogin } from '../auth/helpers/login';
import { testCreatePortfolio } from '../portfolio/helpers/test-create-portfolio';
import { navigateToHistory } from './helpers/navigate-to-history';
import { testCreateOrder } from './helpers/test-create-order';

test.describe('create', () => {
  test('add order and refresh price', async ({ page }) => {
    await createAccountAndLogin(page);
    await testCreatePortfolio(page);

    // Add order
    await page.getByRole('button', { name: 'Add new order' }).first().click();
    await page
      .getByRole('textbox', { name: 'Search Zenathra...' })
      .fill('walmart');
    await page
      .getByRole('button', { name: /Walmart/i })
      .first()
      .click();
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();
    await page.getByRole('spinbutton', { name: 'Quantity' }).click();
    await page.getByRole('spinbutton', { name: 'Quantity' }).fill('5');

    // Change price
    const initialPrice = await page
      .locator('div')
      .filter({ hasText: /^USD$/ })
      .getByRole('spinbutton')
      .inputValue();
    await page
      .locator('div')
      .filter({ hasText: /^USD$/ })
      .getByRole('spinbutton')
      .fill('67');
    await page.getByRole('button', { name: 'Refresh price' }).click();
    await expect(
      page.locator('div').filter({ hasText: /^USD$/ }).getByRole('spinbutton'),
    ).toHaveValue(initialPrice, { timeout: 2000 });

    await page.getByRole('button', { name: 'Submit' }).click();
  });
});

test.describe('update', () => {
  test('update order', async ({ page }) => {
    await createAccountAndLogin(page);
    await testCreatePortfolio(page);
    await testCreateOrder(page);
    await navigateToHistory(page);

    // Update order
    await page.getByRole('button', { name: 'Update order' }).click();
    await page.getByRole('button', { name: 'Increase quantity' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^USD$/ })
      .getByRole('spinbutton')
      .fill('100.01');
    await page.getByRole('button', { name: 'Update' }).click();
    await expect(page.locator('div[role="dialog"]')).toBeHidden();
    await expect(page.locator('p', { hasText: /^100.01$/ })).toBeVisible();
    await expect(page.locator('p', { hasText: /^2$/ })).toBeVisible();
  });

  test('update order incorrectly', async ({ page }) => {
    await createAccountAndLogin(page);
    await testCreatePortfolio(page);
    await testCreateOrder(page);

    // Sell order
    await page.getByRole('button', { name: 'Position actions' }).click();
    await page.getByRole('menuitem', { name: 'Sell Position' }).click();
    await page
      .getByRole('button', { name: 'I am sure, sell position' })
      .click();
    await expect(page.locator('div[role="dialog"]')).toBeHidden();

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
    await createAccountAndLogin(page);
    await testCreatePortfolio(page);
    await testCreateOrder(page);

    // New order
    await page.getByRole('button', { name: 'Position actions' }).click();
    await page.getByRole('menuitem', { name: 'New Order' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('tbody')).toContainText('2Shares');

    // Sell order
    await page.getByRole('button', { name: 'Position actions' }).click();
    await page.getByRole('menuitem', { name: 'Sell Position' }).click();
    await page
      .getByRole('button', { name: 'I am sure, sell position' })
      .click();
  });

  test('delete order', async ({ page }) => {
    await createAccountAndLogin(page);
    await testCreatePortfolio(page);
    await testCreateOrder(page);
    await navigateToHistory(page);

    // Delete order
    await page.getByRole('button', { name: 'Delete order' }).first().click();
    await page
      .getByRole('textbox', { name: 'Confirm deletion of order' })
      .press('CapsLock');
    await page
      .getByRole('textbox', { name: 'Confirm deletion of order' })
      .fill('CONFIRM');
    await page.getByRole('button', { name: 'I am sure, delete' }).click();
    await expect(page.locator('div[role="dialog"]')).toBeHidden();
    await expect(page.getByText('Order successfully deleted.')).toBeVisible();
    await expect(page.locator('div', { hasText: /^Deleted$/ })).toBeVisible();
  });
});
