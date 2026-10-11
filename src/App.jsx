import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import Feedback from './components/Feedback'
import Sidebar from './components/Sidebar'
import AuthPage from './pages/AuthPage'
import DetailPage from './pages/DetailPage'
import HomePage from './pages/HomePage'
import LeaderboardPage from './pages/LeaderboardPage'
import NewThreadPage from './pages/NewThreadPage'
import { asyncLoadMe } from './states/auth'

export default function App () {
  const dispatch = useDispatch()
  const ready = useSelector((s) => s.auth.ready)

  useEffect(() => { dispatch(asyncLoadMe()) }, [dispatch])

  if (!ready) return <Feedback />

  return (
    <div className='layout'>
      <Sidebar />
      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/threads/:id' element={<DetailPage />} />
          <Route path='/new' element={<NewThreadPage />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
          <Route path='/login' element={<AuthPage />} />
          <Route path='/register' element={<AuthPage register />} />
        </Routes>
      </main>
      <Feedback />
    </div>
  )
}
