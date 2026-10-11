import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '../components/Avatar'
import { asyncLoadLeaderboard } from '../states/leaderboard'

export default function LeaderboardPage () {
  const dispatch = useDispatch()
  const items = useSelector((s) => s.leaderboard.items)

  useEffect(() => { dispatch(asyncLoadLeaderboard()) }, [dispatch])

  return (
    <section>
      <h2>🏆 Papan Kontributor</h2>
      {items.map(({ user, score }, i) => (
        <div className='card rank' key={user.id}>
          <b className='no'>{i + 1}</b>
          <Avatar user={user} size={40} />
          <span className='grow'>{user.name}</span>
          <b className='score'>{score} XP</b>
        </div>
      ))}
    </section>
  )
}
