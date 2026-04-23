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
  'positivo-juguetes': {
    tableId: 'tblUZsC3HmUzz85gv',
    fields: { fecha: 'fldxjktXyKWW9G5ur', cliente: 'fldxtOcUeauwZSUVg', bot: 'fldTMzH7pJlUUQGFt', sessionId: 'fldyz4E8DLOwOd1TC' },
  },
}

export default async function handler(req, res) {
  try {
    await verifyAuth(req)
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { channel: channelId, sessionId } = req.query
  const config = CHANNEL_CONFIG[channelId]
  if (!config) return res.status(400).json({ error: 'Unknown channel' })
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' })

  const airtableToken = process.env.AIRTABLE_TOKEN
  if (!airtableToken) return res.status(500).json({ error: 'Server config error' })

  try {
    let records

    if (sessionId.startsWith('rec')) {
      // Direct record fetch by Airtable record ID
      const url = `https://api.airtable.com/v0/${BASE_ID}/${config.tableId}/${sessionId}`
      const airtableRes = await fetch(url, {
        headers: { Authorization: `Bearer ${airtableToken}` },
      })
      if (!airtableRes.ok) throw new Error(`Airtable error: ${airtableRes.status}`)
      const record = await airtableRes.json()
      records = [record]

    } else if (sessionId.startsWith('time_')) {
      // Time-window group: time_STARTSECONDS_ENDSECONDS
      const parts = sessionId.split('_')
      const startMs = parseInt(parts[1], 10) * 1000
      const endMs = parseInt(parts[2], 10) * 1000
      // Add 1-second buffer so boundary records are included
      const startIso = new Date(startMs - 1000).toISOString()
      const endIso = new Date(endMs + 1000).toISOString()

      const formula = `AND(IS_AFTER({Fecha}, '${startIso}'), IS_BEFORE({Fecha}, '${endIso}'), {sessionId} = "")`
      const params = new URLSearchParams({ filterByFormula: formula, pageSize: 100 })
      params.append('sort[0][field]', config.fields.fecha)
      params.append('sort[0][direction]', 'asc')
      for (const fieldId of Object.values(config.fields)) {
        params.append('fields[]', fieldId)
      }

      const url = `https://api.airtable.com/v0/${BASE_ID}/${config.tableId}?${params}`
      const airtableRes = await fetch(url, {
        headers: { Authorization: `Bearer ${airtableToken}` },
      })
      if (!airtableRes.ok) throw new Error(`Airtable error: ${airtableRes.status}`)
      const data = await airtableRes.json()
      records = data.records

    } else {
      // Real sessionId — use field NAME {sessionId} not field ID
      const formula = `{sessionId} = "${sessionId}"`
      const params = new URLSearchParams({ filterByFormula: formula, pageSize: 100 })
      params.append('sort[0][field]', config.fields.fecha)
      params.append('sort[0][direction]', 'asc')
      for (const fieldId of Object.values(config.fields)) {
        params.append('fields[]', fieldId)
      }

      const url = `https://api.airtable.com/v0/${BASE_ID}/${config.tableId}?${params}`
      const airtableRes = await fetch(url, {
        headers: { Authorization: `Bearer ${airtableToken}` },
      })
      if (!airtableRes.ok) throw new Error(`Airtable error: ${airtableRes.status}`)
      const data = await airtableRes.json()
      records = data.records
    }

    const messages = records.map((r) => ({
      id: r.id,
      fecha: r.fields[config.fields.fecha],
      cliente: r.fields[config.fields.cliente] || null,
      bot: r.fields[config.fields.bot] || null,
    }))

    return res.status(200).json({ messages })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
