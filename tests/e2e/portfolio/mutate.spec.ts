import { expect, test } from '@playwright/test';
import { createAccountAndLogin } from '../auth/helpers/login';
import { testCreatePortfolio } from './helpers/test-create-portfolio';
import { testDeletePortfolio } from './helpers/test-delete-portfolio';

const portfolioTitle = 'Test Portfolio';
const newPortfolioTitle = 'New Portfolio';

test.describe('create', () => {
  test('create portfolio', async ({ page }) => {
    await createAccountAndLogin(page);

    await page.getByRole('button', { name: 'User avatar' }).click();
    await page.getByRole('link', { name: 'Portfolios' }).click();
    await page.getByText('Create a new portfolio').click();
    await page.getByRole('textbox', { name: 'Title' }).fill(portfolioTitle);
    await page.getByRole('switch', { name: 'Private' }).click();
    await page.getByRole('radio', { name: '#6366f1' }).click();
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('main')).toContainText(portfolioTitle);
  });
});

test.describe('update', () => {
  test('update portfolio', async ({ page }) => {
    await createAccountAndLogin(page);
    await testCreatePortfolio(page);

    // Update portfolio
    await page.getByRole('link', { name: 'Portfolio settings' }).click();
    await page
      .getByRole('textbox', { name: 'Choose portfolio title' })
      .fill(newPortfolioTitle);
    await page.getByRole('switch', { name: 'Make portfolio public' }).click();
    await page.getByRole('radio', { name: '#8b5cf6' }).click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByRole('main')).toContainText(newPortfolioTitle);
  });
});

test.describe('delete', () => {
  test('delete portfolio', async ({ page }) => {
    await createAccountAndLogin(page);
    await testCreatePortfolio(page);
    await testDeletePortfolio(page, portfolioTitle);

    await page.waitForURL('/p/new');
    await expect(page.getByRole('heading')).toContainText(
      "You haven't created a portfolio yet.",
    );
  });

  test('delete second portfolio', async ({ page }) => {
    await createAccountAndLogin(page);
    await testCreatePortfolio(page);

    await page
      .getByRole('button', { name: 'T Test Portfolio Private' })
      .click();
    await page.getByText('Create new').click();
    await page.getByRole('textbox', { name: 'Title' }).fill(newPortfolioTitle);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('main')).toContainText(newPortfolioTitle);

    await testDeletePortfolio(page, newPortfolioTitle);

    await expect(page.getByRole('main')).toContainText(portfolioTitle);
  });
});
