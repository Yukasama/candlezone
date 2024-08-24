/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable sonarjs/no-duplicate-string */

import { expect, test } from '@playwright/test'

test.describe('Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.getByLabel('Sign In').click()
    await page.getByPlaceholder('john.doe@gmail.com').click()
    await page.getByPlaceholder('john.doe@gmail.com').fill('test@gmail.com')
    await page.getByPlaceholder('Enter your Password').click()
    await page.getByPlaceholder('Enter your Password').fill('haha12341234')
    await page.getByRole('button', { name: 'Sign in with Email' }).click()
    await expect(page.getByRole('main')).toContainText('My Portfolios')
  })

  test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.getByLabel('Sign In').click()
    await page.getByPlaceholder('john.doe@gmail.com').click()
    await page.getByPlaceholder('john.doe@gmail.com').fill('test@gmail.com')
    await page.getByPlaceholder('Enter your Password').click()
    await page.getByPlaceholder('Enter your Password').fill('haha12341234')
    await page.getByRole('button', { name: 'Sign in with Email' }).click()
    await expect(page.getByRole('main')).toContainText('My Portfolios')
    await page.goto('http://localhost:3000/dashboard')
    await page.goto('http://localhost:3000/p/cm084yjxd00023l3tvo4m342p')
    await page
      .locator('div')
      .filter({ hasText: /^OverviewManage$/ })
      .getByRole('button')
      .first()
      .click()
    await page.getByRole('main').getByRole('link').nth(4).click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByPlaceholder('CONFIRM').press('CapsLock')
    await page.getByPlaceholder('CONFIRM').fill('CONFIRM')
    await page.getByPlaceholder('CONFIRM').press('CapsLock')
    await page.getByRole('button', { name: 'Delete' }).click()
    await page
      .locator('div')
      .filter({ hasText: 'Create newCreate a new' })
      .nth(2)
      .click()
    await page.getByPlaceholder('Choose your title...').fill('Test')
    await page.getByRole('button', { name: 'Create' }).click()
    await page.getByLabel('Add orders').nth(1).click()
    await page.getByPlaceholder('Search stocks...').fill('Apple')
    await page.getByRole('option', { name: 'Apple Inc. AAPL' }).click()
    await page.getByLabel('Add new stocks').click()
    await expect(page.locator('tbody')).toContainText('Apple Inc.')
    await page.getByLabel('Action').click()
    await page.getByText('New Order').click()
    await page.getByLabel('Quantity').click()
    await page.getByLabel('Quantity').fill('2')
    await page.getByRole('button', { name: 'Create' }).click()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.locator('tbody')).toContainText('3Shares')
    await page.getByLabel('Action').click()
    await page.getByRole('menuitem', { name: 'Sell Position' }).click()
    await expect(page.getByRole('main')).toContainText(
      'No stocks in this portfolio.',
    )
    await page.getByRole('main').getByRole('link').nth(4).click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByPlaceholder('CONFIRM').press('CapsLock')
    await page.getByPlaceholder('CONFIRM').fill('CONFIRM')
    await page.getByPlaceholder('CONFIRM').press('CapsLock')
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByRole('heading')).toContainText(
      'You havent created a portfolio yet.',
    )
    await page.getByRole('link', { name: 'Dashboard' }).click()
  })
})
