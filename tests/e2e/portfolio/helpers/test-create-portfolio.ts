import { expect, Page } from '@playwright/test';

const portfolioTitle = 'Test Portfolio';

export const testCreatePortfolio = async (page: Page) => {
  await page.goto('/p/new');
  await page.getByText('Create a new portfolio').click();
  await page.getByRole('textbox', { name: 'Title' }).fill(portfolioTitle);
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('main')).toContainText(portfolioTitle);
};
