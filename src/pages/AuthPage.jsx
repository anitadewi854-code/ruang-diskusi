import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { asyncLogin, asyncRegister } from '../states/auth'

export default function AuthPage ({ register = false }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    const ok = await dispatch(register ? asyncRegister(form) : asyncLogin(form))
    if (ok) navigate(register ? '/login' : '/')
  }

  return (
    <form className='panel' onSubmit={submit}>
      <h2>{register ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}</h2>
      {register && <input name='name' placeholder='Nama' value={form.name} onChange={change} required />}
      <input name='email' type='email' placeholder='Email' value={form.email} onChange={change} required />
      <input name='password' type='password' placeholder='Password (min. 6 karakter)' minLength={6} value={form.password} onChange={change} required />
      <button className='primary'>{register ? 'Daftar' : 'Masuk'}</button>
      <p>
        {register
          ? <>Sudah punya akun? <Link to='/login'>Masuk</Link></>
          : <>Belum punya akun? <Link to='/register'>Daftar</Link></>}
      </p>
    </form>
  )
}
