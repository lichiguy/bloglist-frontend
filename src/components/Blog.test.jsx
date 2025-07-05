/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Test blog for render',
  author: 'Emiliano Reyes',
  url: 'http://pruebablog.com',
  likes: 10,
  user: {
    username: 'lichiguy',
    name: 'Emiliano',
  }
}

const user = {
  username: 'lichiguy',
  name: 'Emiliano',
}

const mockHandler = vi.fn()

describe('Blog', async () => {
  let container

  beforeEach(() => {
    container = render(<Blog
      blog={blog}
      user={user}
      updateBlog={mockHandler}
    />).container
  })

  test('renders title and author', () => {
    const visibleDiv = container.querySelector('.visible-info')
    const hiddenDiv = container.querySelector('.hidden-info')

    expect(visibleDiv).not.toHaveStyle('display: none')
    expect(hiddenDiv).toHaveStyle('display: none')
  })

  test('shows the aditional info after clickinh button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.hidden-info')
    expect(div).not.toHaveStyle('display: none')
  })

  test('calls the like controller when button is clicked', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButotn = screen.getByText('like')
    await user.click(likeButotn)
    await user.click(likeButotn)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
