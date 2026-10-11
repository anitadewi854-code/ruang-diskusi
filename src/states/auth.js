import { createSlice } from '@reduxjs/toolkit'
import api, { getToken, setToken } from '../utils/api'
import { notify, tracked } from './ui'

const auth = createSlice({
  name: 'auth',
  initialState: { user: null, ready: false },
  reducers: {
    setUser (state, action) {
      state.user = action.payload
      state.ready = true
    }
  }
})

export const { setUser } = auth.actions
export default auth.reducer

export const asyncLoadMe = () => tracked(async (dispatch) => {
  let user = null
  try {
    user = getToken() ? await api.me() : null
  } catch {
    setToken(null)
  }
  dispatch(setUser(user))
})

export const asyncLogin = ({ email, password }) => tracked(async (dispatch) => {
  setToken(await api.login({ email, password }))
  dispatch(setUser(await api.me()))
  return true
})

export const asyncRegister = (form) => tracked(async (dispatch) => {
  await api.register(form)
  dispatch(notify('Akun berhasil dibuat, silakan masuk'))
  return true
})

export const logout = () => (dispatch) => {
  setToken(null)
  dispatch(setUser(null))
}
