import api from '../utils/api'
import { notify } from './ui'

export const nextVotes = (item, userId, type) => {
  const up = item.upVotesBy.filter((id) => id !== userId)
  const down = item.downVotesBy.filter((id) => id !== userId)
  const already = (type === 'up' ? item.upVotesBy : item.downVotesBy).includes(userId)
  if (!already) (type === 'up' ? up : down).push(userId)
  return { up, down, apiType: already ? 'neutral-vote' : `${type}-vote` }
}

// Optimistic update: state diubah dulu, dikembalikan bila request gagal
export const castVote = async (dispatch, user, item, type, setVotes, path) => {
  if (!user) {
    dispatch(notify('Masuk dulu untuk memberi vote'))
    return
  }
  const next = nextVotes(item, user.id, type)
  dispatch(setVotes({ id: item.id, up: next.up, down: next.down }))
  try {
    await api.vote(path, next.apiType)
  } catch (error) {
    dispatch(setVotes({ id: item.id, up: item.upVotesBy, down: item.downVotesBy }))
    dispatch(notify(error.message))
  }
}
