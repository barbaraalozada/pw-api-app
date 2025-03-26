import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })
  await page.goto('https://conduit.bondaracademy.com/')
})

test('has title', async ({ page }) => {
  //const tags = ['automation', 'playwright']

  await page.route('*/**/api/articles*', async route => {
    page.waitForTimeout(500)
    const response = await route.fetch()
    const responseBody = await response.json()

    responseBody.articles[0].title = "This is a MOCK test title"
    responseBody.articles[0].description = "This is a MOCK test description"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })
  await page.getByText('Global Feed').click()

  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
  //await expect(page.locator('.tag-default.tag-pill')).toHaveText(tags)
  await expect(page.locator('app-article-list h1').first()).toContainText("This is a MOCK test title")
  await expect(page.locator('app-article-list p').first()).toContainText("This is a MOCK test description")
})

test('Delete article', async ({ page, request }) => {

  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": { "title": "new article (delete article test)", "description": "(delete article test", "body": "new new", "tagList": [] }
    }
  })
  expect(articleResponse.status()).toEqual(201)

  await page.getByText('Global Feed').click()
  await page.getByText('new article (delete article test)').click()
  await page.getByRole('button', { name: 'Delete Article' }).first().click()
  await expect(page.locator('app-article-list h1').first()).not.toContainText("new article (delete article test)")
})

test('Create article', async ({ page, request }) => {
  await page.getByText('New Article').click()
  await page.getByPlaceholder("Article Title").fill("Playwright is awesome")
  await page.getByPlaceholder("What's this article about?").fill("About Playwright")
  await page.getByPlaceholder("Write your article (in markdown)").fill("We like to use playwright for automation")
  await page.getByRole('button', { name: 'Publish Article' }).click()

  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const articleResponseBody = await articleResponse.json()
  const slugId = articleResponseBody.article.slug

  await expect(page.locator('app-article-page h1')).toContainText("Playwright is awesome")

  await page.getByText('Home').click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).toContainText("Playwright is awesome")

  const deleteArticleRequest = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)
  expect(deleteArticleRequest.status()).toEqual(204)
})