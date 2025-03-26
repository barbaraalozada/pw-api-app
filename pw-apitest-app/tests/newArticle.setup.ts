import { test as setup, expect } from '@playwright/test'

setup('Create new article', async ({ request }) => {
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": { "title": "new article (create article test)", "description": "(create article test", "body": "create article test", "tagList": [] }
        }
    })
    expect(articleResponse.status()).toEqual(201)

    const response = await articleResponse.json()
    const slugId = response.article.slug
    process.env['SLUGID'] = slugId
})