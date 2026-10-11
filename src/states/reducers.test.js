/**
 * Skenario pengujian fungsi reducer (Unit Test):
 *  - ui: counter loading naik/turun dan tidak pernah negatif; toast bisa diisi & dikosongkan
 *  - auth: setUser mengisi user sekaligus menandai aplikasi siap (ready)
 *  - threads: setData, addThread (thread baru di paling atas), setCategory, setVotes (id ada / tidak ada)
 *  - detail: addComment, setVotes untuk thread dan untuk komentar
 *  - leaderboard: setItems mengganti seluruh daftar
 */
import { describe, expect, it } from 'vitest'
import authReducer, { setUser } from './auth'
import detailReducer, { addComment, setThread, setVotes as setDetailVotes } from './detail'
import leaderboardReducer, { setItems } from './leaderboard'
import threadsReducer, { addThread, setCategory, setData, setVotes } from './threads'
import uiReducer, { notify, start, stop } from './ui'

describe('ui reducer', () => {
  it('menambah dan mengurangi counter loading', () => {
    let state = uiReducer(undefined, start())
    state = uiReducer(state, start())
    expect(state.loading).toBe(2)
    state = uiReducer(state, stop())
    expect(state.loading).toBe(1)
  })

  it('tidak membuat loading bernilai negatif', () => {
    const state = uiReducer({ loading: 0, toast: '' }, stop())
    expect(state.loading).toBe(0)
  })

  it('menyimpan dan mengosongkan pesan toast', () => {
    let state = uiReducer(undefined, notify('Gagal login'))
    expect(state.toast).toBe('Gagal login')
    state = uiReducer(state, notify(''))
    expect(state.toast).toBe('')
  })
})

describe('auth reducer', () => {
  it('mengisi user dan menandai ready saat setUser dipanggil', () => {
    const user = { id: 'u1', name: 'Anita' }
    const state = authReducer(undefined, setUser(user))
    expect(state).toEqual({ user, ready: true })
  })

  it('mengosongkan user (logout) tetapi tetap ready', () => {
    const state = authReducer({ user: { id: 'u1' }, ready: true }, setUser(null))
    expect(state).toEqual({ user: null, ready: true })
  })
})

describe('threads reducer', () => {
  const thread = (id, extra = {}) => ({ id, category: 'react', upVotesBy: [], downVotesBy: [], ...extra })

  it('setData mengisi daftar thread dan user', () => {
    const state = threadsReducer(undefined, setData({ threads: [thread('t1')], users: [{ id: 'u1' }] }))
    expect(state.items).toHaveLength(1)
    expect(state.users).toEqual([{ id: 'u1' }])
  })

  it('addThread menaruh thread baru di urutan paling atas', () => {
    const initial = { items: [thread('t1')], users: [], category: '' }
    const state = threadsReducer(initial, addThread(thread('t2')))
    expect(state.items.map((t) => t.id)).toEqual(['t2', 't1'])
  })

  it('setCategory mengubah kategori filter', () => {
    const state = threadsReducer(undefined, setCategory('redux'))
    expect(state.category).toBe('redux')
  })

  it('setVotes memperbarui vote pada thread yang cocok saja', () => {
    const initial = { items: [thread('t1'), thread('t2')], users: [], category: '' }
    const state = threadsReducer(initial, setVotes({ id: 't2', up: ['u1'], down: [] }))
    expect(state.items[1].upVotesBy).toEqual(['u1'])
    expect(state.items[0].upVotesBy).toEqual([])
  })

  it('setVotes tidak error bila id thread tidak ditemukan', () => {
    const initial = { items: [thread('t1')], users: [], category: '' }
    const state = threadsReducer(initial, setVotes({ id: 'x', up: ['u1'], down: [] }))
    expect(state.items[0].upVotesBy).toEqual([])
  })
})

describe('detail reducer', () => {
  const detailThread = () => ({
    id: 't1',
    upVotesBy: [],
    downVotesBy: [],
    comments: [{ id: 'c1', upVotesBy: [], downVotesBy: [] }]
  })

  it('setThread menyimpan thread detail', () => {
    const state = detailReducer(undefined, setThread(detailThread()))
    expect(state.thread.id).toBe('t1')
  })

  it('addComment menaruh komentar terbaru di atas', () => {
    const initial = { thread: detailThread() }
    const state = detailReducer(initial, addComment({ id: 'c2' }))
    expect(state.thread.comments.map((c) => c.id)).toEqual(['c2', 'c1'])
  })

  it('setVotes mengubah vote pada thread bila id cocok dengan thread', () => {
    const state = detailReducer({ thread: detailThread() }, setDetailVotes({ id: 't1', up: ['u1'], down: [] }))
    expect(state.thread.upVotesBy).toEqual(['u1'])
    expect(state.thread.comments[0].upVotesBy).toEqual([])
  })

  it('setVotes mengubah vote pada komentar bila id cocok dengan komentar', () => {
    const state = detailReducer({ thread: detailThread() }, setDetailVotes({ id: 'c1', up: [], down: ['u2'] }))
    expect(state.thread.comments[0].downVotesBy).toEqual(['u2'])
    expect(state.thread.downVotesBy).toEqual([])
  })
})

describe('leaderboard reducer', () => {
  it('setItems mengganti seluruh daftar klasemen', () => {
    const items = [{ user: { id: 'u1' }, score: 10 }]
    const state = leaderboardReducer({ items: [{ user: { id: 'old' }, score: 1 }] }, setItems(items))
    expect(state.items).toEqual(items)
  })
})
