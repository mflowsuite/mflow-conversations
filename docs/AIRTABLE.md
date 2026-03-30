# Referencia Airtable

**Base ID**: `appKeg7OfvXmVrAiC`

---

## ⚠️ Nota crítica: returnFieldsByFieldId

Siempre incluir `returnFieldsByFieldId=true` en las llamadas a la API.
Sin este parámetro, los campos vienen indexados por NOMBRE (ej: `"Fecha"`),
pero el código los accede por ID (ej: `"fldMB4y02i8cpMtWm"`) → todo undefined → 0 sesiones.

```js
params.set('returnFieldsByFieldId', 'true')
```

---

## Tablas de conversaciones

### 1. Preguntas Cuarso — Bot: Eri
**Table ID**: `tbl9hcH6bU6PPetIq`

| Campo | Field ID | Tipo |
|-------|----------|------|
| Fecha | `fldMB4y02i8cpMtWm` | dateTime |
| Cliente | `fldMLyhXIIGMfYinb` | multilineText |
| Eri (bot) | `fld84jMaThxaaW47o` | multilineText |
| sessionId | `fldNROJb7j0M4jplx` | singleLineText |

---

### 2. Urban Denim — Bot: Lara
**Table ID**: `tblaJ3Vq1cMVHvNsL`

| Campo | Field ID | Tipo |
|-------|----------|------|
| Fecha | `fldN3VMkSAOih3NGH` | dateTime |
| Cliente | `fldNdpvhy0mS7fC7w` | multilineText |
| Lara (bot) | `fld9wa0uJzdg2doRJ` | multilineText |
| sessionId | `fldwDCbVvmh9ExmgL` | singleLineText |

---

### 3. Tinos — Bot: Cami (web)
**Table ID**: `tbl6XUcXUcfSagFTH`

| Campo | Field ID | Tipo |
|-------|----------|------|
| Fecha | `fldJhM3RLAhfKOF7D` | dateTime |
| Cliente | `fldJrgMOr0PPA0uys` | multilineText |
| Cami (bot) | `fld5K1h1CzGdvYgiF` | multilineText |
| sessionId | `fldERtE1oTwwTaBZK` | singleLineText |

---

### 4. Tinos QR — Bot: Cami (QR físico)
**Table ID**: `tblxm6kydaxl4kPuK`

| Campo | Field ID | Tipo |
|-------|----------|------|
| Fecha | `fldaGYbs4yzIESPIG` | dateTime |
| Cliente | `fldaQsUpKY7iu4E9v` | multilineText |
| Cami (bot) | `fldw9dpCVxYGp2qTI` | multilineText |
| sessionId | `fldBz27zAK2GjSf1y` | singleLineText |

---

## Estructura de un registro

Cada fila en Airtable = 1 turno de conversación:
- `Fecha` → timestamp del turno
- `Cliente` → lo que escribió el usuario
- `[Nombre del bot]` → respuesta del bot (puede contener Markdown, emojis, links)
- `sessionId` → UUID generado por n8n que agrupa los turnos de una misma sesión

Registros sin `sessionId` son mensajes viejos o de canales que no generan
IDs — se agrupan automáticamente por proximidad temporal (gap < 15 min).

## Cómo agregar un nuevo canal

1. Crear la tabla en Airtable con los mismos campos (Fecha, Cliente, BotName, sessionId)
2. Copiar los field IDs desde la URL de la tabla en Airtable
3. Agregar entrada en `api/conversations.js` → `CHANNEL_CONFIG`
4. Agregar entrada en `src/lib/channels.js` → `CHANNELS`
