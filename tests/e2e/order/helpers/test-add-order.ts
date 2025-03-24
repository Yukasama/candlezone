import { expect, Page } from '@playwright/test';

interface Props {
  invalid?: boolean;
  page: Page;
  refresh?: boolean;
  symbol?: string;
}

export const testAddOrder = async ({
  invalid,
  page,
  refresh,
  symbol = 'WMT',
}: Props) => {
  const quantity = invalid ? '-1' : '1';
  const price = invalid ? '-1' : '100';

  await page.getByRole('button', { name: 'Add new order' }).first().click();
  await page.getByRole('textbox', { name: 'Search Candlezone...' }).fill(symbol);
  await page.getByRole('button').filter({ hasText: symbol }).first().click();

  // Set quantity
  await page.getByRole('button', { name: 'Increase quantity' }).click();
  await page.getByRole('spinbutton', { name: 'quantity' }).fill(quantity);
  await page.getByRole('button', { name: 'Submit' }).click();

  const dialog = page.locator('div[role="dialog"]');
  if (invalid) {
    await expect(dialog).toBeVisible();
  }

  // Refresh price
  if (refresh) {
    const priceField = page.locator('input[name="price"]');
    const initialPrice = await priceField.inputValue();
    await priceField.fill('100');
    await page.getByRole('button', { name: 'Refresh price' }).click();
    await expect(priceField).toHaveValue(initialPrice, { timeout: 2000 });
  }

  // Set price
  await page.locator('input[name="price"]').fill(price);
  await page.getByRole('button', { name: 'Submit' }).click();

  if (invalid) {
    await expect(page.getByText('Order successful!')).toBeHidden();
  } else {
    await expect(page.getByText('Order successful!')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    const position = page.getByLabel('Position Manager').getByText(symbol);
    await expect(position).toBeVisible();
  }
};
