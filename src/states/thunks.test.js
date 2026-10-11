/**
 * Skenario pengujian thunk function (Unit Test, API di-mock):
 *  - asyncLogin sukses: simpan token -> ambil profil -> dispatch setUser, mengembalikan true
 *  - asyncLogin gagal: dispatch notify berisi pesan error, loading tetap dimatikan, mengembalikan false
 *  - asyncLoadMe tanpa token: user di-set null tanpa memanggil API
 *  - asyncLoadThreads: memanggil threads & users bersamaan lalu dispatch setData
 *  - asyncLoadDetail: reset thread ke null lalu mengisi dengan data dari API
 *  - asyncVoteThread: user belum login -> notify, tanpa memanggil API
 *  - asyncVoteThread: optimistic update, lalu rollback + notify bila API gagal
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import api, { getToken, setToken } from '../utils/api'
import { asyncLoadMe, asyncLogin, setUser } from './auth'
import { asyncLoadDetail, setThread } from './detail'
import { asyncLoadThreads, asyncVoteThread, setData, setVotes } from './threads'
import { notify, start, stop } from './ui'

vi.mock('../utils/api', () => ({
  default: {
    login: vi.fn(),
    me: vi.fn(),
    users: vi.fn(),
    threads: vi.fn(),
    thread: vi.fn(),
    vote: vi.fn()
  },
  getToken: vi.fn(),
  setToken: vi.fn()
}))

const fakeUser = { id: 'u1', name: 'Anita', email: 'anita@mail.com' }

beforeEach(() => {
  vi.resetAllMocks()
})

describe('asyncLogin thunk', () => {
  it('menyimpan token lalu men-dispatch setUser saat login berhasil', async () => {
    api.login.mockResolvedValue('token-123')
    api.me.mockResolvedValue(fakeUser)
    const dispatch = vi.fn()

    const result = await asyncLogin({ email: 'a@a.com', password: '123456' })(dispatch, vi.fn())

    expect(setToken).toHaveBeenCalledWith('token-123')
    expect(dispatch).toHaveBeenCalledWith(start())
    expect(dispatch).toHaveBeenCalledWith(setUser(fakeUser))
    expect(dispatch).toHaveBeenLastCalledWith(stop())
    expect(result).toBe(true)
  })

  it('men-dispatch notify dan mengembalikan false saat login gagal', async () => {
    api.login.mockRejectedValue(new Error('Email atau password salah'))
    const dispatch = vi.fn()

    const result = await asyncLogin({ email: 'a@a.com', password: 'salah' })(dispatch, vi.fn())

    expect(dispatch).toHaveBeenCalledWith(notify('Email atau password salah'))
    expect(dispatch).not.toHaveBeenCalledWith(setUser(fakeUser))
    expect(dispatch).toHaveBeenLastCalledWith(stop())
    expect(result).toBe(false)
  })
})

describe('asyncLoadMe thunk', () => {
  it('mengisi user null tanpa memanggil API bila tidak ada token', async () => {
    getToken.mockReturnValue(null)
    const dispatch = vi.fn()

    await asyncLoadMe()(dispatch, vi.fn())

    expect(api.me).not.toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(setUser(null))
  })

  it('menghapus token dan mengisi user null bila token tidak valid', async () => {
    getToken.mockReturnValue('basi')
    api.me.mockRejectedValue(new Error('invalid'))
    const dispatch = vi.fn()

    await asyncLoadMe()(dispatch, vi.fn())

    expect(setToken).toHaveBeenCalledWith(null)
    expect(dispatch).toHaveBeenCalledWith(setUser(null))
  })
})

describe('asyncLoadThreads thunk', () => {
  it('mengambil threads dan users lalu men-dispatch setData', async () => {
    const threads = [{ id: 't1' }]
    const users = [{ id: 'u1' }]
    api.threads.mockResolvedValue(threads)
    api.users.mockResolvedValue(users)
    const dispatch = vi.fn()

    await asyncLoadThreads()(dispatch, vi.fn())

    expect(dispatch).toHaveBeenCalledWith(setData({ threads, users }))
  })
})

describe('asyncLoadDetail thunk', () => {
  it('mereset thread ke null lalu mengisi data dari API', async () => {
    const thread = { id: 't1', comments: [] }
    api.thread.mockResolvedValue(thread)
    const dispatch = vi.fn()

    await asyncLoadDetail('t1')(dispatch, vi.fn())

    const setThreadCalls = dispatch.mock.calls
      .map(([action]) => action)
      .filter((action) => action.type === setThread.type)

    expect(setThreadCalls).toEqual([setThread(null), setThread(thread)])
  })
})

describe('asyncVoteThread thunk', () => {
  const thread = { id: 't1', upVotesBy: [], downVotesBy: [] }
  const stateWith = (user) => () => ({ auth: { user }, threads: { items: [thread] } })

  it('meminta user login dan tidak memanggil API bila belum login', async () => {
    const dispatch = vi.fn()

    await asyncVoteThread('t1', 'up')(dispatch, stateWith(null))

    expect(dispatch).toHaveBeenCalledWith(notify('Masuk dulu untuk memberi vote'))
    expect(api.vote).not.toHaveBeenCalled()
  })

  it('melakukan optimistic update lalu mengirim vote ke API', async () => {
    api.vote.mockResolvedValue({})
    const dispatch = vi.fn()

    await asyncVoteThread('t1', 'up')(dispatch, stateWith(fakeUser))

    expect(dispatch).toHaveBeenCalledWith(setVotes({ id: 't1', up: ['u1'], down: [] }))
    expect(api.vote).toHaveBeenCalledWith('/threads/t1', 'up-vote')
  })

  it('mengembalikan vote ke kondisi semula dan notify bila API gagal', async () => {
    api.vote.mockRejectedValue(new Error('Gagal vote'))
    const dispatch = vi.fn()

    await asyncVoteThread('t1', 'up')(dispatch, stateWith(fakeUser))

    expect(dispatch).toHaveBeenNthCalledWith(1, setVotes({ id: 't1', up: ['u1'], down: [] }))
    expect(dispatch).toHaveBeenNthCalledWith(2, setVotes({ id: 't1', up: [], down: [] }))
    expect(dispatch).toHaveBeenNthCalledWith(3, notify('Gagal vote'))
  })
})
