/**
 * Skenario pengujian VoteButtons:
 *  - menampilkan jumlah upvote dan downvote
 *  - memberi penanda aktif pada tombol sesuai vote milik user
 *  - memanggil onVote dengan 'up' / 'down' saat tombol diklik
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import VoteButtons from './VoteButtons'

const item = { upVotesBy: ['u1', 'u2'], downVotesBy: ['u3'] }

describe('VoteButtons', () => {
  it('menampilkan jumlah upvote dan downvote', () => {
    render(<VoteButtons item={item} userId='x' onVote={() => {}} />)
    expect(screen.getByRole('button', { name: 'Suka' })).toHaveTextContent('2')
    expect(screen.getByRole('button', { name: 'Tidak suka' })).toHaveTextContent('1')
  })

  it('menandai tombol suka aktif bila user sudah upvote', () => {
    render(<VoteButtons item={item} userId='u1' onVote={() => {}} />)
    expect(screen.getByRole('button', { name: 'Suka' })).toHaveClass('on-up')
    expect(screen.getByRole('button', { name: 'Tidak suka' })).not.toHaveClass('on-down')
  })

  it('memanggil onVote dengan tipe yang sesuai saat diklik', async () => {
    const onVote = vi.fn()
    render(<VoteButtons item={item} userId='x' onVote={onVote} />)

    await userEvent.click(screen.getByRole('button', { name: 'Suka' }))
    await userEvent.click(screen.getByRole('button', { name: 'Tidak suka' }))

    expect(onVote).toHaveBeenNthCalledWith(1, 'up')
    expect(onVote).toHaveBeenNthCalledWith(2, 'down')
  })
})
