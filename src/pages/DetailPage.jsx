import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import VoteButtons from '../components/VoteButtons'
import { asyncAddComment, asyncLoadDetail, asyncVoteDetail } from '../states/detail'
import { formatDate, plain } from '../utils/format'

export default function DetailPage () {
  const { id } = useParams()
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const thread = useSelector((s) => s.detail.thread)
  const [content, setContent] = useState('')

  useEffect(() => { dispatch(asyncLoadDetail(id)) }, [id, dispatch])

  if (!thread || thread.id !== id) return null

  const submit = async (e) => {
    e.preventDefault()
    if (await dispatch(asyncAddComment(id, content))) setContent('')
  }

  return (
    <section>
      <article className='card'>
        <span className='tag'>#{thread.category}</span>
        <h2>{thread.title}</h2>
        <div className='meta'>
          <Avatar user={thread.owner} size={36} />
          <b>{thread.owner.name}</b>
          <time>{formatDate(thread.createdAt)}</time>
        </div>
        <p className='body'>{plain(thread.body)}</p>
        <VoteButtons item={thread} userId={user?.id} onVote={(type) => dispatch(asyncVoteDetail(type))} />
      </article>

      <h3>{thread.comments.length} Komentar</h3>
      {user
        ? (
          <form className='comment-form' onSubmit={submit}>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder='Tulis komentarmu...' required />
            <button className='primary'>Kirim</button>
          </form>
          )
        : <p><Link to='/login'>Masuk</Link> untuk ikut berkomentar.</p>}

      {thread.comments.map((c) => (
        <div className='card comment' key={c.id}>
          <div className='meta'>
            <Avatar user={c.owner} size={28} />
            <b>{c.owner.name}</b>
            <time>{formatDate(c.createdAt)}</time>
          </div>
          <p className='body'>{plain(c.content)}</p>
          <VoteButtons item={c} userId={user?.id} onVote={(type) => dispatch(asyncVoteDetail(type, c.id))} />
        </div>
      ))}
    </section>
  )
}
