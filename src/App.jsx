import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const setNotification = (error) => {
    setErrorMessage(error)
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setNotification('Wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch (exception) {
      setNotification('Blog was not created, complete the form')
    }
  }

  const deleteBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      await blogService.remove(blogObject)
      setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
    }
  }

  const updateLikes = async (blogObject) => {
    const returnedBlog = await blogService.update(blogObject)
    returnedBlog.user = blogObject.user
    setBlogs(blogs.map((blog) => blog.id !== blogObject.id ? blog : returnedBlog))
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>login to application</h1>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  return (
    <div>
      <h2>Blogs</h2>
      <Notification errorMessage={errorMessage} />
      {!user && loginForm()}
      {user && <div>
        <p>
          {user.name} logged in<button onClick={handleLogout}>log out</button>
        </p>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs.sort((a, b) => {
          return a.likes - b.likes
        }).map((blog) => (
          <div key={blog.id}>
            <Blog blog={blog} updateBlog={updateLikes} deleteBlog={deleteBlog} user={user} />
          </div>
        ))}
      </div>}
    </div>
  )
}

export default App
