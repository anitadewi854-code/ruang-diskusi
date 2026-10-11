import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { asyncAddThread } from '../states/threads'

export default function NewThreadPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.user)
  const [form, setForm] = useState({ title: '', category: '', body: '' })

  if (!user) return <Navigate to='/login' replace />

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    if (await dispatch(asyncAddThread(form))) navigate('/')
  }

  return (
    <form className='panel' onSubmit={submit}>
      <h2>Tulis Thread Baru</h2>
      <input name='title' placeholder='Judul' value={form.title} onChange={change} required />
      <input name='category' placeholder='Kategori (contoh: react)' value={form.category} onChange={change} />
      <textarea name='body' placeholder='Isi thread' rows={7} value={form.body} onChange={change} required />
      <button className='primary'>Terbitkan</button>
    </form>
  )
}
