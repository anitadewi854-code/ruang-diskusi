import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ThreadCard from '../components/ThreadCard'
import { asyncLoadThreads, asyncVoteThread, setCategory } from '../states/threads'

export default function HomePage () {
  const dispatch = useDispatch()
  const { items, users, category } = useSelector((s) => s.threads)
  const user = useSelector((s) => s.auth.user)

  useEffect(() => { dispatch(asyncLoadThreads()) }, [dispatch])

  const categories = [...new Set(items.map((t) => t.category).filter(Boolean))]
  const shown = category ? items.filter((t) => t.category === category) : items

  return (
    <section>
      <h2>Obrolan Terbaru</h2>
      <div className='chips'>
        <button className={category ? '' : 'active'} onClick={() => dispatch(setCategory(''))}>Semua</button>
        {categories.map((c) => (
          <button key={c} className={c === category ? 'active' : ''} onClick={() => dispatch(setCategory(c))}>
            #{c}
          </button>
        ))}
      </div>
      {shown.map((t) => (
        <ThreadCard
          key={t.id}
          thread={t}
          owner={users.find((u) => u.id === t.ownerId)}
          userId={user?.id}
          onVote={(type) => dispatch(asyncVoteThread(t.id, type))}
        />
      ))}
    </section>
  )
}
