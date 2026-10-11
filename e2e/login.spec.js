/**
 * Skenario pengujian End-to-End alur login:
 *  1. Pengguna membuka aplikasi dan belum login (sidebar menampilkan "Masuk / Daftar")
 *  2. Pengguna membuka halaman login lalu mengisi email dan password
 *  3. Setelah submit, pengguna diarahkan ke beranda dan namanya tampil di sidebar
 *  4. Skenario gagal: password salah menampilkan pesan error dan tetap di halaman login
 *
 * Seluruh request ke Forum API di-mock memakai page.route agar pengujian stabil dan tidak
 * bergantung pada jaringan.
 */
import { expect, test } from '@playwright/test'

const API = 'https://forum-api.dicoding.dev/v1'
const user = { id: 'u1', name: 'Anita Dewi', email: 'anita@mail.com', avatar: '' }

const json = (route, data, status = 200) => route.fulfill({
  status,
  contentType: 'application/json',
  body: JSON.stringify(data)
})

test.beforeEach(async ({ page }) => {
  await page.route(`${API}/**`, (route) => {
    const request = route.request()
    const { pathname } = new URL(request.url())
    const path = pathname.replace('/v1', '')

    if (path === '/login') {
      const { password } = request.postDataJSON()
      return password === 'rahasia123'
        ? json(route, { status: 'success', message: 'ok', data: { token: 'token-e2e' } })
        : json(route, { status: 'fail', message: 'email or password is wrong' })
    }
    if (path === '/users/me') return json(route, { status: 'success', message: 'ok', data: { user } })
    if (path === '/users') return json(route, { status: 'success', message: 'ok', data: { users: [user] } })
    if (path === '/threads') {
      return json(route, {
        status: 'success',
        message: 'ok',
        data: {
          threads: [{
            id: 't1',
            title: 'Thread untuk pengujian E2E',
            body: 'Isi thread',
            category: 'react',
            createdAt: '2026-10-01T08:00:00.000Z',
            ownerId: 'u1',
            upVotesBy: [],
            downVotesBy: [],
            totalComments: 0
          }]
        }
      })
    }
    return json(route, { status: 'fail', message: 'not mocked' }, 404)
  })
})

test('pengguna dapat login dan melihat namanya di sidebar', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /Masuk \/ Daftar/ })).toBeVisible()

  await page.getByRole('link', { name: /Masuk \/ Daftar/ }).click()
  await expect(page.getByRole('heading', { name: 'Selamat Datang Kembali' })).toBeVisible()

  await page.getByPlaceholder('Email').fill('anita@mail.com')
  await page.getByPlaceholder(/Password/).fill('rahasia123')
  await page.getByRole('button', { name: 'Masuk' }).click()

  await expect(page.getByRole('heading', { name: 'Obrolan Terbaru' })).toBeVisible()
  await expect(page.getByText('Anita Dewi').first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Keluar' })).toBeVisible()
})

test('login gagal menampilkan pesan error dan tetap di halaman login', async ({ page }) => {
  await page.goto('/login')

  await page.getByPlaceholder('Email').fill('anita@mail.com')
  await page.getByPlaceholder(/Password/).fill('salahsalah')
  await page.getByRole('button', { name: 'Masuk' }).click()

  await expect(page.getByText('email or password is wrong')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Selamat Datang Kembali' })).toBeVisible()
})
