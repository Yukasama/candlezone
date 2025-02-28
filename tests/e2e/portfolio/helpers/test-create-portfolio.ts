import { expect, Page } from '@playwright/test';

const portfolioTitle = 'Test Portfolio';

interface Props {
  isPublic?: boolean;
  name?: string;
  page: Page;
}

export const testCreatePortfolio = async ({ isPublic, name, page }: Props) => {
  await page.goto('/p/new');
  await page.getByText('Create a new portfolio').click();
  await page
    .getByRole('textbox', { name: 'Title' })
    .fill(name ?? portfolioTitle);

  if (isPublic) {
    await page.getByRole('switch', { name: 'Private' }).click();
  }

  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('main')).toContainText(name ?? portfolioTitle);
  await page.reload();
  await page
    .getByRole('link', { exact: true, name: name?.at(0)?.toUpperCase() ?? 'T' })
    .click();
};
