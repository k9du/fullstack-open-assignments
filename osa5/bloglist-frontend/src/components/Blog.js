import React from 'react'
import { useState } from 'react'

const BlogInfo = ({ blog, likeEvent, isCreatorOfBlog, deleteEvent }) => {
  return (
    <div>
      <div>{blog.url}</div>
      <div>likes {blog.likes} <button onClick={likeEvent}>like the blog</button></div>
      <div>{blog.user.name}</div>
      {isCreatorOfBlog() && <button onClick={deleteEvent}>Remove blog</button>}
    </div>
  )
}

const Blog = ({ blog, handleBlogLike, handleBlogDelete }) => {
  const [addVisible, setAddVisible] = useState(false)

  console.log(blog)
  const blogStyle = {
    paddingTop: 4,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 3
  }

  const likeEvent = (event) => {
    event.preventDefault()
    handleBlogLike(blog)
  }

  const isCreatorOfBlog = () => {
    // Get bool value of equality between blog creator and who is logged in to choose whether or not
    // to render the remove blog button on screen
    return (
      blog.user.username === JSON.parse(window.localStorage.getItem('loggedBlogappUser'))?.username
    )
  }

  const deleteEvent = (event) => {
    event.preventDefault()
    if (window.confirm(`Do you wish to delete blog ${blog.title}?`)) {
      handleBlogDelete(blog)
    }
  }

  return (
    <div className="blog" style={blogStyle}>
      <p>{blog.title} {blog.author} <button onClick={() => setAddVisible(!addVisible)}>{addVisible ? 'hide' : 'view'}</button>
        { addVisible && (
          BlogInfo({ blog, likeEvent, isCreatorOfBlog, deleteEvent })
        )
        }</p>
    </div>
  )

}

export default Blog