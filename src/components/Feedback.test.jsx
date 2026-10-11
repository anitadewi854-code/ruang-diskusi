/**
 * Skenario pengujian Feedback (integration dengan Redux + react-hot-toast):
 *  - loading > 0 -> progress bar tampil; loading = 0 -> tidak tampil
 *  - pesan toast pada store ditampilkan lalu dikosongkan dari store
 */
import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import ui, { notify } from '../states/ui'
import Feedback from './Feedback'

const setup = (preloaded = { loading: 0, toast: '' }) => {
  const store = configureStore({ reducer: { ui }, preloadedState: { ui: preloaded } })
  render(<Provider store={store}><Feedback /></Provider>)
  return store
}

describe('Feedback', () => {
  it('menampilkan progress bar hanya saat loading', () => {
    setup({ loading: 1, toast: '' })
    expect(screen.getByRole('progressbar', { name: 'Memuat data' })).toBeInTheDocument()
  })

  it('tidak menampilkan progress bar saat tidak loading', () => {
    setup()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('menampilkan toast dari store lalu mengosongkan pesannya', async () => {
    const store = setup()
    store.dispatch(notify('Akun berhasil dibuat'))

    expect(await screen.findByText('Akun berhasil dibuat')).toBeInTheDocument()
    await waitFor(() => expect(store.getState().ui.toast).toBe(''))
  })
})
