import { verifyAuth } from './_auth.js'

const BASE_ID = 'appKeg7OfvXmVrAiC'

const CHANNEL_CONFIG = {
  'cuarso': {
    tableId: 'tbl9hcH6bU6PPetIq',
    fields: { fecha: 'fldMB4y02i8cpMtWm', cliente: 'fldMLyhXIIGMfYinb', bot: 'fld84jMaThxaaW47o', sessionId: 'fldNROJb7j0M4jplx' },
  },
  'urban-denim': {
    tableId: 'tblaJ3Vq1cMVHvNsL',
    fields: { fecha: 'fldN3VMkSAOih3NGH', cliente: 'fldNdpvhy0mS7fC7w', bot: 'fld9wa0uJzdg2doRJ', sessionId: 'fldwDCbVvmh9ExmgL' },
  },
  'tinos': {
    tableId: 'tbl6XUcXUcfSagFTH',
    fields: { fecha: 'fldJhM3RLAhfKOF7D', cliente: 'fldJrgMOr0PPA0uys', bot: 'fld5K1h1CzGdvYgiF', sessionId: 'fldERtE1oTwwTaBZK' },
  },
  'tinos-qr': {
    tableId: 'tblxm6kydaxl4kPuK',
    fields: { fecha: 'fldaGYbs4yzIESPIG', cliente: 'fldaQsUpKY7iu4E9v', bot: 'fldw9dpCVxYGp2qTI', sessionId: 'fldBz27zAK2GjSf1y' },
  },
}

async function fetchAllRecords(tableId, fields, token) {
  const fieldIds = Object.values(fields).join(',')
  let records = []
  let offset = null

  do {
    const params = new URLSearchParams({
      'fields[]': Object.values(fields),
      sort: JSON.stringify([{ field: fields.fecha, direction: 'desc' }]),
      pageSize: 100,
    })
    if (offset) params.set('offset', offset)

    const url = `https://api.airtable.com/v0/${BASE_ID}/${tableId}?${params}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error(`Airtable error: ${res.status}`)
    const data = await res.json()
    records = records.concat(data.records)
    offset = data.offset || null
  } while (offset)

  return records
}

export default async function handler(req, res) {
  try {
    await verifyAuth(req)
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const channelId = req.query.channel
  const config = CHANNEL_CONFIG[channelId]
  if (!config) return res.status(400).json({ error: 'Unknown channel' })

  const airtableToken = process.env.AIRTABLE_TOKEN
  if (!airtableToken) return res.status(500).json({ error: 'Server config error' })

  try {
    const records = await fetchAllRecords(config.tableId, config.fields, airtableToken)

    // Group by sessionId
    const sessionMap = new Map()
    for (const record of records) {
      const f = record.fields
      const sessionId = f[config.fields.sessionId]
      if (!sessionId) continue

      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, {
          sessionId,
          firstDate: f[config.fields.fecha],
          lastDate: f[config.fields.fecha],
          messageCount: 0,
          preview: '',
        })
      }
      const session = sessionMap.get(sessionId)
      session.messageCount += 1

      const fecha = f[config.fields.fecha]
      if (fecha > session.lastDate) session.lastDate = fecha
      if (fecha < session.firstDate) session.firstDate = fecha

      // Use client message as preview (first one found)
      if (!session.preview && f[config.fields.cliente]) {
        session.preview = f[config.fields.cliente]
      }
    }

    // Sort sessions by lastDate descending
    const sessions = Array.from(sessionMap.values()).sort(
      (a, b) => new Date(b.lastDate) - new Date(a.lastDate)
    )

    return res.status(200).json({
      sessions,
      totalSessions: sessions.length,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
