import { SignJWT } from 'jose'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body || {}

  const expectedUser = process.env.AUTH_USER
  const expectedPass = process.env.AUTH_PASS
  const secret = process.env.AUTH_SECRET

  if (!expectedUser || !expectedPass || !secret) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  if (username !== expectedUser || password !== expectedPass) {
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  }

  const secretKey = new TextEncoder().encode(secret)
  const token = await new SignJWT({ sub: username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey)

  return res.status(200).json({ token })
}
