import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './db.js'
import applicationsRouter from './routes/applications.js'
import authRouter from './routes/auth.js'

const PORT = process.env.PORT || 4000
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())

// Fail fast on missing secrets rather than booting into an insecure state.
if (process.env.NODE_ENV === 'production') {
  const required = ['JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH']
  const missing = required.filter((key) => !process.env[key])
  if (missing.length) {
    console.error(`[server] Missing required env vars in production: ${missing.join(', ')}`)
    process.exit(1)
  }
}

const app = express()

app.set('trust proxy', 1) // needed so req.ip / rate limiting work correctly behind a proxy/load balancer
app.use(helmet())
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '200kb' }))
app.use(cookieParser())

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'hashbrowns-apply-api' })
})

app.use('/api/auth', authRouter)
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
