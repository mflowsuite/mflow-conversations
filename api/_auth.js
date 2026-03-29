import { jwtVerify } from 'jose'

export async function verifyAuth(req) {
  const authHeader = req.headers['authorization'] || ''
  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) throw new Error('No token')

  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('No secret configured')

  const secretKey = new TextEncoder().encode(secret)
  await jwtVerify(token, secretKey)
}
