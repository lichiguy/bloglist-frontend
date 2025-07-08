const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Testing User',
                username: 'testingMaster',
                password: 'password123'
            }
        })
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('Blogs')
        await expect(locator).toBeVisible()
        await expect(page.getByText('login to application')).toBeVisible()
    })

    describe('Login', () => {
        test('succeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'testingMaster', 'password123')
            await expect(page.getByText('Testing User logged in')).toBeVisible()
        })

        test('fails with incorrect credentials', async ({ page }) => {
            await loginWith(page, 'testingMaster', 'wrongPass')
            await expect(page.getByText('Wrong username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'testingMaster', 'password123')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'Testing blog created', 'Dummy author', 'www.dummyurl.com')
            await expect(page.locator('.visible-info')).toBeVisible()
        })

        test('a blog can be edited', async ({ page }) => {
            await createBlog(page, 'Testing blog created', 'Dummy author', 'www.dummyurl.com')
            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            await page.waitForTimeout(3000)
            expect(page.getByText('likes: 1').waitFor())
        })

        test('a blog can be deleted by the user', async ({ page }) => {
            await createBlog(page, 'Testing blog created', 'Dummy author', 'www.dummyurl.com')
            await page.getByRole('button', { name: 'view' }).click()
            page.on('dialog', window => window.accept())
            await page.getByRole('button', { name: 'remove' }).click()
            await expect(page.locator('.visible-info')).not.toBeVisible()
        })

        test('only the user who created the blog can delete it', async ({ page, request }) => {
            await request.post('/api/users', {
                data: {
                    name: 'Emiliano Reyes',
                    username: 'testingMaster2',
                    password: 'password1234'
                }
            })
            await createBlog(page, 'Testing blog created', 'Dummy author', 'www.dummyurl.com')
            await expect(page.locator('.visible-info')).toBeVisible()
            await page.getByRole('button', { name: 'log out' }).click()
            await loginWith(page, 'testingMaster2', 'password1234')
            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })

        test('blogs are ordered by number of likes', async ({ page }) => {
            await createBlog(page, 'Testing blog created 1', 'Dummy author', 'www.dummyurl.com')
            await createBlog(page, 'Testing blog created 2', 'Dummy author', 'www.dummyurl.com')
            await createBlog(page, 'Testing blog created 3', 'Dummy author', 'www.dummyurl.com')

            await page.getByTestId('Testing blog created 1').click()
            await page.getByTestId('Testing blog created 3').click()
            await page.getByTestId('Testing blog created 2').click()

            const likeButtons = await page.getByRole('button', { name: 'like' }).all()

            for (let i = 0; i < 3; i++) await likeButtons[1].click()
            await page.waitForTimeout(3000)

            for (let i = 0; i < 2; i++) await likeButtons[0].click()
            await page.waitForTimeout(3000)

            for (let i = 0; i < 1; i++) await likeButtons[2].click()
            await page.waitForTimeout(3000)

            const blogElements = await page.locator('.hidden-info').all()

            const blogTexts = await Promise.all(blogElements.map(el => el.textContent()))


            expect(blogTexts[0]).toContain('Testing blog created 3')
            expect(blogTexts[1]).toContain('Testing blog created 1')
            expect(blogTexts[2]).toContain('Testing blog created 2')
        })
    })
})