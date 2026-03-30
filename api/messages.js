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

    // If sessionId is a record ID fallback (no real sessionId), fetch that record directly
    if (sessionId.startsWith('rec')) {
      const url = `https://api.airtable.com/v0/${BASE_ID}/${config.tableId}/${sessionId}`
      const airtableRes = await fetch(url, {
        headers: { Authorization: `Bearer ${airtableToken}` },
      })
      if (!airtableRes.ok) throw new Error(`Airtable error: ${airtableRes.status}`)
      const record = await airtableRes.json()
      records = [record]
    } else {
      const params = new URLSearchParams({
        filterByFormula: `{${config.fields.sessionId}} = "${sessionId}"`,
        pageSize: 100,
      })
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
