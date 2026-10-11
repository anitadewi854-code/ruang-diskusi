import ThreadCard from './ThreadCard'

const thread = {
  id: 'thread-1',
  title: 'Bagaimana cara menguji thunk di Redux?',
  body: '<p>Aku bingung cara mock API pada thunk. Ada yang punya contoh <b>sederhana</b>?</p>',
  category: 'redux',
  createdAt: '2026-10-01T08:00:00.000Z',
  totalComments: 4,
  upVotesBy: ['u2'],
  downVotesBy: []
}

export default {
  title: 'Components/ThreadCard',
  component: ThreadCard,
  args: { thread, owner: { id: 'u1', name: 'Budi Santoso' }, userId: 'u2', onVote: () => {} }
}

export const Default = {}
export const PemilikTidakDikenal = { args: { owner: undefined } }
export const IsiPanjang = { args: { thread: { ...thread, body: 'Teks panjang. '.repeat(40) } } }
