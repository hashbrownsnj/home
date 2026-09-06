import mongoose from 'mongoose'

let connectingPromise = null

/**
 * Connects to MongoDB using MONGODB_URI. Safe to call multiple times —
 * reuses the in-flight connection attempt instead of opening duplicates.
 */
export function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection)
  if (connectingPromise) return connectingPromise

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy server/.env.example to server/.env and fill it in.')
  }

  mongoose.connection.on('connected', () => {
    console.log('[db] connected to MongoDB')
  })
  mongoose.connection.on('error', (err) => {
    console.error('[db] connection error:', err.message)
  })
  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected from MongoDB')
  })

  connectingPromise = mongoose.connect(uri).then((conn) => {
    connectingPromise = null
    return conn
  })

  return connectingPromise
}
