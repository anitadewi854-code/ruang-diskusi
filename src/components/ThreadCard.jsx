import { Link } from 'react-router-dom'
import { formatDate, snippet } from '../utils/format'
import Avatar from './Avatar'
import VoteButtons from './VoteButtons'

export default function ThreadCard ({ thread, owner, userId, onVote }) {
  return (
    <article className='card'>
      <div className='meta'>
        <Avatar user={owner} size={32} />
        <b>{owner?.name || 'Anonim'}</b>
        <time>{formatDate(thread.createdAt)}</time>
      </div>
      <span className='tag'>#{thread.category}</span>
      <h3><Link to={`/threads/${thread.id}`}>{thread.title}</Link></h3>
      <p>{snippet(thread.body)}</p>
      <div className='foot'>
        <VoteButtons item={thread} userId={userId} onVote={onVote} />
        <span>💬 {thread.totalComments || 0} komentar</span>
      </div>
    </article>
  )
}
