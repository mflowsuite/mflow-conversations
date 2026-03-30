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

const GAP_MS = 15 * 60 * 1000 // 15 minutes between messages = new session

async function fetchAllRecords(tableId, fields, token) {
  let records = []
  let offset = null

  do {
    const params = new URLSearchParams()
    for (const fieldId of Object.values(fields)) {
      params.append('fields[]', fieldId)
    }
    params.set('sort[0][field]', fields.fecha)
    params.set('sort[0][direction]', 'asc')
    params.set('pageSize', '100')
    params.set('returnFieldsByFieldId', 'true') // keys are field IDs, not names
    if (offset) params.set('offset', offset)

    const url = `https://api.airtable.com/v0/${BASE_ID}/${tableId}?${params}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Airtable ${res.status}: ${text}`)
    }
    const data = await res.json()
    records = records.concat(data.records || [])
    offset = data.offset || null
  } while (offset)

  return records
}

function groupIntoSessions(records, fields) {
  const sessionMap = new Map()
  let lastAutoSession = null

  for (const record of records) {
    const f = record.fields
    const realSid = f[fields.sessionId]
    const date = f[fields.fecha] || record.createdTime
    const msg = {
      id: record.id,
      fecha: date,
      cliente: f[fields.cliente] || null,
      bot: f[fields.bot] || null,
    }

    if (realSid) {
      if (!sessionMap.has(realSid)) {
        sessionMap.set(realSid, { sessionId: realSid, firstDate: date, lastDate: date, messages: [] })
      }
      const s = sessionMap.get(realSid)
      s.lastDate = date
      s.messages.push(msg)
      lastAutoSession = null
    } else {
      const needNew = !lastAutoSession ||
        (new Date(date) - new Date(lastAutoSession.lastDate)) > GAP_MS
      if (needNew) {
        const sid = `auto-${record.id}`
        lastAutoSession = { sessionId: sid, firstDate: date, lastDate: date, messages: [] }
        sessionMap.set(sid, lastAutoSession)
      }
      lastAutoSession.lastDate = date
      lastAutoSession.messages.push(msg)
    }
  }

  return Array.from(sessionMap.values())
    .sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate))
    .map(s => ({
      sessionId: s.sessionId,
      firstDate: s.firstDate,
      lastDate: s.lastDate,
      messageCount: s.messages.length,
      preview: (s.messages[0]?.cliente || '').substring(0, 120),
      messages: s.messages,
    }))
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
    const sessions = groupIntoSessions(records, config.fields)
    return res.status(200).json({ sessions, totalSessions: sessions.length })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
