/**
 * Skenario pengujian Avatar:
 *  - ada URL avatar -> tampil gambar dengan alt nama user
 *  - tanpa avatar -> tampil inisial huruf besar
 *  - tanpa user -> tampil tanda tanya
 */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Avatar from './Avatar'

describe('Avatar', () => {
  it('menampilkan gambar bila user punya avatar', () => {
    render(<Avatar user={{ name: 'Anita', avatar: 'https://img.test/a.png' }} />)
    expect(screen.getByRole('img', { name: 'Anita' })).toHaveAttribute('src', 'https://img.test/a.png')
  })

  it('menampilkan inisial bila tidak ada avatar', () => {
    render(<Avatar user={{ name: 'budi' }} />)
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('menampilkan tanda tanya bila user tidak ada', () => {
    render(<Avatar />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })
})
