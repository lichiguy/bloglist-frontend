import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, user, deleteBlog }) => {
  const [infoVisible, setInfoVisible] = useState(false)
  const [blogLikes, setBlogLikes] = useState(blog.likes)

  const hideWhenVisible = { display: infoVisible ? 'none' : '' }
  const showWhenVisible = { display: infoVisible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const newBlog = {
      user: blog.user,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blogLikes + 1,
      id: blog.id
    }

    await updateBlog(newBlog)
    await setBlogLikes(newBlog.likes)
  }

  const handleDeleteBlog = () => {
    deleteBlog(blog)
  }

  const deleteButton = () => (
    <button onClick={handleDeleteBlog}>remove</button>
  )

  //console.log(blog)

  return (
    <div className='visible-info' style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button data-testid={blog.title} onClick={() => setInfoVisible(true)}>view</button>
      </div>
      <div className='hidden-info' style={showWhenVisible}>
        {blog.title} <button onClick={() => setInfoVisible(false)}>hide</button> <br />
        <a href={blog.url}>{blog.url}</a> <br />
        {blog.author} <br />
        likes: {blogLikes} <button onClick={handleLike}>like</button><br />
        {blog.user.name}
        {(blog.user.name === user.name) && deleteButton()}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default Blog