/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable sonarjs/no-duplicate-string */

import { expect, test } from '@playwright/test'

test('sign in with test email', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByLabel('Sign In').click()

  await page.getByPlaceholder('john.doe@gmail.com').click()
  await page.getByPlaceholder('john.doe@gmail.com').fill('test@gmail.com')
  await page.getByPlaceholder('Enter your Password').click()
  await page.getByPlaceholder('Enter your Password').fill('haha12341234')

  await page.getByRole('button', { name: 'Sign in with Email' }).click()
  await expect(page.getByRole('main')).toContainText('My Portfolios')
})
