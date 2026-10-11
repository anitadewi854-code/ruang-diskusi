import { createSlice } from '@reduxjs/toolkit'
import api from '../utils/api'
import { tracked } from './ui'
import { castVote } from './votes'

const threads = createSlice({
  name: 'threads',
  initialState: { items: [], users: [], category: '' },
  reducers: {
    setData (state, action) {
      state.items = action.payload.threads
      state.users = action.payload.users
    },
    addThread (state, action) { state.items.unshift(action.payload) },
    setCategory (state, action) { state.category = action.payload },
    setVotes (state, action) {
      const { id, up, down } = action.payload
      const thread = state.items.find((t) => t.id === id)
      if (thread) {
        thread.upVotesBy = up
        thread.downVotesBy = down
      }
    }
  }
})

export const { setData, addThread, setCategory, setVotes } = threads.actions
export default threads.reducer

export const asyncLoadThreads = () => tracked(async (dispatch) => {
  const [list, users] = await Promise.all([api.threads(), api.users()])
  dispatch(setData({ threads: list, users }))
})

export const asyncAddThread = (form) => tracked(async (dispatch) => {
  dispatch(addThread(await api.addThread(form)))
  return true
})

export const asyncVoteThread = (id, type) => (dispatch, getState) => {
  const { auth, threads: { items } } = getState()
  const item = items.find((t) => t.id === id)
  return castVote(dispatch, auth.user, item, type, setVotes, `/threads/${id}`)
}
