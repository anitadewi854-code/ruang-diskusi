import { createSlice } from '@reduxjs/toolkit'
import api from '../utils/api'
import { tracked } from './ui'

const leaderboard = createSlice({
  name: 'leaderboard',
  initialState: { items: [] },
  reducers: { setItems (state, action) { state.items = action.payload } }
})

export const { setItems } = leaderboard.actions
export default leaderboard.reducer

export const asyncLoadLeaderboard = () => tracked(async (dispatch) => {
  dispatch(setItems(await api.leaderboards()))
})
