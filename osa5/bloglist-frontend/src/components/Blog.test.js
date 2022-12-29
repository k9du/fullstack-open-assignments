import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const testBlog = {
  title: 'Test-title',
  author: 'Test-author',
  url: 'Test-url',
  likes: 0,
  user: {
    username: 'test-user',
    name: 'name',
    id: 'id',
  }
}

test('Renders title', () => {
  render(<Blog blog={testBlog} handleBlogLike={() => {}} handleBlogDelete={() => {}} />)

  expect(screen.getByText('Test-title', { exact : false }))

})

test('Url, likes and user shown after click', async () => {
  render(<Blog blog={testBlog} handleBlogLike={() => {}} handleBlogDelete={() => {}} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  screen.debug(button)

  const url = screen.queryByText('Test-url')
  const likes = screen.queryByText('likes 0')
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  await user.click(button)
})

test('Clicking like twice counts twice', async () => {
  const mockHandler = jest.fn()

  render(<Blog blog={testBlog} handleBlogDelete={() => {}} handleBlogLike={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  screen.debug()

  expect(mockHandler.mock.calls).toHaveLength(2)
})
