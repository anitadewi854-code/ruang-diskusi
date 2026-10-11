import { createSlice } from '@reduxjs/toolkit'
import api from '../utils/api'
import { tracked } from './ui'
import { castVote } from './votes'

const detail = createSlice({
  name: 'detail',
  initialState: { thread: null },
  reducers: {
    setThread (state, action) { state.thread = action.payload },
    addComment (state, action) { state.thread.comments.unshift(action.payload) },
    setVotes (state, action) {
      const { id, up, down } = action.payload
      const { thread } = state
      const target = thread.id === id ? thread : thread.comments.find((c) => c.id === id)
      target.upVotesBy = up
      target.downVotesBy = down
    }
  }
})

export const { setThread, addComment, setVotes } = detail.actions
export default detail.reducer

export const asyncLoadDetail = (id) => tracked(async (dispatch) => {
  dispatch(setThread(null))
  dispatch(setThread(await api.thread(id)))
})

export const asyncAddComment = (id, content) => tracked(async (dispatch) => {
  dispatch(addComment(await api.addComment(id, content)))
  return true
})

export const asyncVoteDetail = (type, commentId) => (dispatch, getState) => {
  const { auth, detail: { thread } } = getState()
  const item = commentId ? thread.comments.find((c) => c.id === commentId) : thread
  const path = `/threads/${thread.id}${commentId ? `/comments/${commentId}` : ''}`
  return castVote(dispatch, auth.user, item, type, setVotes, path)
}
