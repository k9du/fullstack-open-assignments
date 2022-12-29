import React from 'react'
import { useState } from 'react'

const NewBlogForm = ({ handleBlogAdd }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submit = (event) => {
    event.preventDefault()

    handleBlogAdd({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')

  }

  return (
    <div>
      <h2>Add a new blog</h2>
      <form onSubmit={submit}>
        <div>
          Title: <input
            id='title-input'
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='write blog title here'
          />
        </div>
        <div>
          Author: <input
            id='author-input'
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
          Url: <input
            id='url-input'
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='write url here'
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlogForm