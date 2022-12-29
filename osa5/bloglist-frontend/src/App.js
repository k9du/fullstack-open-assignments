import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='ok'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  const [addVisible, setAddVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  // Get user info from window storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      console.log(user.token)
      blogService.setToken(user.token)
    }
  }, [])

  const handleBlogLike = async (blog) => {
    const updatedLikes = {
      ...blog,
      likes: blog.likes + 1,
    }

    const copy = {
      ...updatedLikes
    }
    // Delete the user object, because we don't need all the info of the user
    delete copy.user

    // Instead just use the id of the user
    copy.user = blog.user.id

    console.log('COPY', copy)

    await blogService.updateBlog(blog.id, copy)
    setBlogs(blogs.map(b => b.id !== blog.id ? b : updatedLikes))
  }

  // Login
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      console.log('logged in')
    } catch (exception) {
      console.log('cant log in')
      setErrorMessage('Wrong username or password')
      setUsername('')
      setPassword('')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3500)
    }
  }

  // Logout
  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleBlogDelete = async (blog) => {
    await blogService.deleteBlog(blog.id)
    setBlogs(blogs.filter(b => b.id !== blog.id))
  }

  const handleBlogAdd = async (blog) => {
    const response = await blogService.create(blog)

    setBlogs([...blogs, response])
    setMessage(`A new blog ${response.title} by ${response.author} added`)
    setTimeout(() => {
      setMessage(null)
    }, 3500)
  }

  const visibleButton = () => {
    const hideWhenVisible = { display: addVisible ? 'none' : '' }
    const showWhenVisible = { display: addVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setAddVisible(true)}>New blog</button>
        </div>
        <div style={showWhenVisible}>
          <NewBlogForm handleBlogAdd={handleBlogAdd}/>
          <button onClick={() => setAddVisible(false)}>Cancel</button>
        </div>
      </div>
    )
  }


  if (user === null) {
    return (
      <>
        <LoginForm
          handleLogin={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
          username={username}
          password={password}
          errorMessage={errorMessage}
          ErrorNotification={ErrorNotification}/>
      </>
    )
  }

  // {blogs.sort((a,b) => b.likes - a.likes )}

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message}/>
      <b>{user.name} logged in <button onClick={handleLogout}>logout</button></b>
      <br />
      {visibleButton()}
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleBlogLike={handleBlogLike} handleBlogDelete={handleBlogDelete}/>
      )}
    </div>
  )
}

export default App
