import { useState } from 'react'

const BlogForm = ({ createBlog, user }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const cleanBlogForm = () => {
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })
    cleanBlogForm()
  }

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            placeholder='write title here'
            value={title}
            name="Title"
            data-testid='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            placeholder='write author here'
            value={author}
            data-testid='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            placeholder='write url here'
            value={url}
            data-testid='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>

    </div>
  )
}

export default BlogForm