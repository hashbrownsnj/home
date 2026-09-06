import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectToDatabase } from './db.js'
import applicationsRouter from './routes/applications.js'

const PORT = process.env.PORT || 4000
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())

const app = express()

app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json({ limit: '200kb' }))

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'hashbrowns-apply-api' })
})

app.use('/api/applications', applicationsRouter)

// Fallback error handler for anything that slips past route-level try/catch.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[server] unhandled error:', err)
  res.status(500).json({ message: 'Unexpected server error.' })
})

async function start() {
  try {
    await connectToDatabase()
    app.listen(PORT, () => {
      console.log(`[server] Hash Browns apply API listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('[server] failed to start:', err.message)
    process.exit(1)
  }
}

start()
