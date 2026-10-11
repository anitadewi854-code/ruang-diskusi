/**
 * Skenario pengujian ThreadCard:
 *  - menampilkan judul (sebagai tautan ke detail), kategori, dan nama pemilik
 *  - membersihkan tag HTML pada isi thread dan memotong teks panjang
 *  - menampilkan "Anonim" bila pemilik tidak ditemukan
 *  - meneruskan aksi vote ke handler onVote
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ThreadCard from './ThreadCard'

const baseThread = {
  id: 'thread-1',
  title: 'Belajar Redux',
  body: '<p>Isi <b>thread</b> pertama</p>',
  category: 'redux',
  createdAt: '2026-10-01T08:00:00.000Z',
  totalComments: 3,
  upVotesBy: [],
  downVotesBy: []
}

const renderCard = (props = {}) => render(
  <MemoryRouter>
    <ThreadCard thread={baseThread} owner={{ id: 'u1', name: 'Budi' }} userId='u1' onVote={() => {}} {...props} />
  </MemoryRouter>
)

describe('ThreadCard', () => {
  it('menampilkan judul sebagai link ke halaman detail, kategori, dan pemilik', () => {
    renderCard()
    expect(screen.getByRole('link', { name: 'Belajar Redux' })).toHaveAttribute('href', '/threads/thread-1')
    expect(screen.getByText('#redux')).toBeInTheDocument()
    expect(screen.getByText('Budi')).toBeInTheDocument()
    expect(screen.getByText(/3 komentar/)).toBeInTheDocument()
  })

  it('membersihkan tag HTML dari isi thread', () => {
    renderCard()
    expect(screen.getByText('Isi thread pertama')).toBeInTheDocument()
  })

  it('memotong isi thread yang terlalu panjang', () => {
    renderCard({ thread: { ...baseThread, body: 'a'.repeat(300) } })
    expect(screen.getByText(`${'a'.repeat(140)}...`)).toBeInTheDocument()
  })

  it('menampilkan Anonim bila pemilik tidak ditemukan', () => {
    renderCard({ owner: undefined })
    expect(screen.getByText('Anonim')).toBeInTheDocument()
  })

  it('meneruskan klik vote ke onVote', async () => {
    const onVote = vi.fn()
    renderCard({ onVote })
    await userEvent.click(screen.getByRole('button', { name: 'Suka' }))
    expect(onVote).toHaveBeenCalledWith('up')
  })
})
