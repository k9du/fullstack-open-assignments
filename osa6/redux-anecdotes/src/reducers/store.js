import anecdoteReducer from './anecdoteReducer'
import notificationReducer from './notificationReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    notification: notificationReducer,
  }
})

export default store