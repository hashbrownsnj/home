// One-off CLI helper: generates a bcrypt hash to put in ADMIN_PASSWORD_HASH.
// Usage:
//   npm run hash-password -- "your-strong-password-here"
// The plaintext password is never stored anywhere — only the hash goes
// into server/.env.

import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('Usage: npm run hash-password -- "your-strong-password"')
  process.exit(1)
}

if (password.length < 12) {
  console.warn('[warning] That password is under 12 characters — consider something longer.')
}

const hash = bcrypt.hashSync(password, 12)
console.log('\nAdd this to server/.env:\n')
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`)
