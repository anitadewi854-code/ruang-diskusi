import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { logout } from '../states/auth'
import Avatar from './Avatar'

export default function Sidebar () {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)

  return (
    <aside className='sidebar'>
      <h1 className='brand'>Ruang<span>Diskusi</span></h1>
      <nav>
        <NavLink to='/' end>🏠 Beranda</NavLink>
        <NavLink to='/new'>✏️ Tulis Thread</NavLink>
        <NavLink to='/leaderboard'>🏆 Kontributor</NavLink>
      </nav>
      <div className='me'>
        {user
          ? (
            <>
              <Avatar user={user} size={36} />
              <b>{user.name}</b>
              <button onClick={() => dispatch(logout())}>Keluar</button>
            </>
            )
          : <NavLink to='/login'>🔑 Masuk / Daftar</NavLink>}
      </div>
    </aside>
  )
}
