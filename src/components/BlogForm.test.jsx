import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput =  screen.getByPlaceholderText('write title here')
  const authorInput =  screen.getByPlaceholderText('write author here')
  const urlInput =  screen.getByPlaceholderText('write url here')
  const createButton =  screen.getByText('create')

  await user.type(titleInput, 'testing blog form')
  await user.type(authorInput, 'Dummy Author')
  await user.type(urlInput, 'http>//www.dummyblog.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing blog form')
  expect(createBlog.mock.calls[0][0].author).toBe('Dummy Author')
  expect(createBlog.mock.calls[0][0].url).toBe('http>//www.dummyblog.com')
})