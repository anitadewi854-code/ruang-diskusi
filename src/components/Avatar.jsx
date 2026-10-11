export default function Avatar ({ user, size = 40 }) {
  const style = { width: size, height: size }
  if (user?.avatar) return <img className='avatar' src={user.avatar} alt={user.name} style={style} />
  return <span className='avatar' style={style}>{(user?.name || '?')[0].toUpperCase()}</span>
}
