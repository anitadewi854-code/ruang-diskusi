import { configureStore } from '@reduxjs/toolkit'
import auth from './auth'
import detail from './detail'
import leaderboard from './leaderboard'
import threads from './threads'
import ui from './ui'

const store = configureStore({ reducer: { auth, ui, threads, detail, leaderboard } })

export default store
