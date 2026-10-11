export default function VoteButtons ({ item, userId, onVote }) {
  const up = item.upVotesBy.includes(userId)
  const down = item.downVotesBy.includes(userId)

  return (
    <span className='votes'>
      <button className={up ? 'on-up' : ''} onClick={() => onVote('up')} aria-label='Suka'>
        ▲ {item.upVotesBy.length}
      </button>
      <button className={down ? 'on-down' : ''} onClick={() => onVote('down')} aria-label='Tidak suka'>
        ▼ {item.downVotesBy.length}
      </button>
    </span>
  )
}
