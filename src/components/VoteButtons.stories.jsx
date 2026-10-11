import VoteButtons from './VoteButtons'

export default {
  title: 'Components/VoteButtons',
  component: VoteButtons,
  args: { onVote: () => {} }
}

export const Netral = { args: { item: { upVotesBy: ['a', 'b'], downVotesBy: ['c'] }, userId: 'x' } }
export const SudahUpvote = { args: { item: { upVotesBy: ['me', 'b'], downVotesBy: [] }, userId: 'me' } }
export const SudahDownvote = { args: { item: { upVotesBy: [], downVotesBy: ['me'] }, userId: 'me' } }
