import { createSlice } from '@reduxjs/toolkit'

const ui = createSlice({
  name: 'ui',
  initialState: { loading: 0, toast: '' },
  reducers: {
    start (state) { state.loading += 1 },
    stop (state) { state.loading = Math.max(0, state.loading - 1) },
    notify (state, action) { state.toast = action.payload }
  }
})

export const { start, stop, notify } = ui.actions
export default ui.reducer

// Membungkus thunk: menampilkan loading indicator dan pesan error dari API
export const tracked = (fn) => async (dispatch, getState) => {
  dispatch(start())
  try {
    return await fn(dispatch, getState)
  } catch (error) {
    dispatch(notify(error.message))
    return false
  } finally {
    dispatch(stop())
  }
}
