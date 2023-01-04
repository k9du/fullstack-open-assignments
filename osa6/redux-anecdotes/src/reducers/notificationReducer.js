import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice(
  {
  name: 'notification',
  initialState: 'moii', // empty ( or not)
  }
)

export default notificationSlice.reducer