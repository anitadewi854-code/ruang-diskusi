/**
 * Skenario pengujian Sidebar (integration dengan Redux store asli):
 *  - belum login: tampil tautan "Masuk / Daftar"
 *  - sudah login: tampil nama user dan tombol Keluar
 *  - klik Keluar mengosongkan user pada store
 */
import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import auth from '../states/auth'
import Sidebar from './Sidebar'

const setup = (user) => {
  const store = configureStore({
    reducer: { auth },
    preloadedState: { auth: { user, ready: true } }
  })
  render(
    <Provider store={store}>
      <MemoryRouter><Sidebar /></MemoryRouter>
    </Provider>
  )
  return store
}

describe('Sidebar', () => {
  it('menampilkan tautan masuk bila belum login', () => {
    setup(null)
    expect(screen.getByRole('link', { name: /Masuk \/ Daftar/ })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('button', { name: 'Keluar' })).not.toBeInTheDocument()
  })

  it('menampilkan nama user dan tombol keluar bila sudah login', () => {
    setup({ id: 'u1', name: 'Anita' })
    expect(screen.getByText('Anita')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Keluar' })).toBeInTheDocument()
  })

  it('mengosongkan user pada store saat tombol keluar diklik', async () => {
    const store = setup({ id: 'u1', name: 'Anita' })
    await userEvent.click(screen.getByRole('button', { name: 'Keluar' }))
    expect(store.getState().auth.user).toBeNull()
  })
})
