import { expect, test } from '@playwright/test'

test('Like counter increase', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/')
    await page.getByText('Global Feed').click()
    
    const firstLikeButton = await page.locator('app-article-preview').first().locator('button')
    await expect(firstLikeButton).toContainText('0')
    await firstLikeButton.click()
    await page.waitForTimeout(2000)
    await expect(firstLikeButton).toContainText('1')

})