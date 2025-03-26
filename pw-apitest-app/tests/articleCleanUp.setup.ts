import { test as setup, expect } from '@playwright/test'

setup('Delete article', async({ request }) => {

    const deleteArticleRequest = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`)
    expect(deleteArticleRequest.status()).toEqual(204)
})