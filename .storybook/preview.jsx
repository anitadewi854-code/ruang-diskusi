import { MemoryRouter } from 'react-router-dom'
import '../src/styles.css'

export const decorators = [
  (Story) => (
    <MemoryRouter>
      <div style={{ padding: 24, maxWidth: 560 }}><Story /></div>
    </MemoryRouter>
  )
]

export const parameters = { backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#0f172a' }] } }
