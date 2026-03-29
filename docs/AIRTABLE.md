# Referencia Airtable

**Base ID**: `appKeg7OfvXmVrAiC`
**Nombre**: Distriland

---

## Tablas de Conversaciones

### 1. Preguntas Cuarso — Bot: Eri
**Table ID**: `tbl9hcH6bU6PPetIq`
**Negocio**: Distribuidora Cuarso (productos dentales GUM)
**Registros**: ~143

| Campo | ID | Tipo | Descripción |
|-------|----|------|-------------|
| Fecha | `fldMB4y02i8cpMtWm` | dateTime | Timestamp del mensaje |
| Cliente | `fldMLyhXIIGMfYinb` | multilineText | Mensaje del cliente |
| Eri | `fld84jMaThxaaW47o` | multilineText | Respuesta del bot (puede contener Markdown) |
| sessionId | `fldNROJb7j0M4jplx` | singleLineText | UUID que agrupa mensajes de una conversación |

**Ejemplo de registro**:
```json
{
  "Fecha": "2026-03-24T19:05:09.000Z",
  "Cliente": "no gracias",
  "Eri": "Perfecto, ¿podrías darme por favor tu nombre, apellido, teléfono y email para poder finalizar el pedido?",
  "sessionId": "7f288432-c8da-4075-b730-c38f69d193fc"
}
```

---

### 2. Urban Denim — Bot: Lara
**Table ID**: `tblaJ3Vq1cMVHvNsL`
**Negocio**: Urban Denim (ropa)
**Registros**: ~398

| Campo | ID | Tipo | Descripción |
|-------|----|------|-------------|
| Fecha | `fldN3VMkSAOih3NGH` | dateTime | Timestamp del mensaje |
| Cliente | `fldNdpvhy0mS7fC7w` | multilineText | Mensaje del cliente |
| Lara | `fld9wa0uJzdg2doRJ` | multilineText | Respuesta del bot (puede contener Markdown + links) |
| sessionId | `fldwDCbVvmh9ExmgL` | singleLineText | UUID que agrupa mensajes de una conversación |

**Ejemplo de registro**:
```json
{
  "Fecha": "2026-03-22T15:11:34.000Z",
  "Cliente": "wide leg talle 41",
  "Lara": "No tenemos wide leg disponible en talle 41 en este momento. ¿Querés buscar otro modelo?",
  "sessionId": "44e6f173-b2ad-4de1-acf6-df160d665c49"
}
```

---

### 3. Tinos — Bot: Cami (web)
**Table ID**: `tbl6XUcXUcfSagFTH`
**Negocio**: Tinos Heladería (chat desde web)
**Registros**: 0 (tabla vacía por ahora)

| Campo | ID | Tipo | Descripción |
|-------|----|------|-------------|
| Fecha | `fldJhM3RLAhfKOF7D` | dateTime | Timestamp del mensaje |
| Nombre | `fldhcCXfjzh2Rlgu2` | singleLineText | Nombre del cliente (opcional) |
| Cliente | `fldJrgMOr0PPA0uys` | multilineText | Mensaje del cliente |
| Cami | `fld5K1h1CzGdvYgiF` | multilineText | Respuesta del bot |
| sessionId | `fldERtE1oTwwTaBZK` | singleLineText | UUID que agrupa mensajes |

---

### 4. Tinos QR — Bot: Cami (QR)
**Table ID**: `tblxm6kydaxl4kPuK`
**Negocio**: Tinos Heladería (chat via QR físico en el local)
**Registros**: ~30

| Campo | ID | Tipo | Descripción |
|-------|----|------|-------------|
| Fecha | `fldaGYbs4yzIESPIG` | dateTime | Timestamp del mensaje |
| Cliente | `fldaQsUpKY7iu4E9v` | multilineText | Mensaje del cliente |
| Cami | `fldw9dpCVxYGp2qTI` | multilineText | Respuesta del bot (puede contener Markdown + imágenes) |
| sessionId | `fldBz27zAK2GjSf1y` | singleLineText | UUID que agrupa mensajes |

**Ejemplo de registro**:
```json
{
  "Fecha": "2026-03-28T17:38:01.000Z",
  "Cliente": "¿Tenéis opciones sin lactosa o sin gluten?",
  "Cami": "¡Claro! 🍦\n\n- Opciones sin gluten: Tenemos el Cono Sin Gluten...",
  "sessionId": "764396c3-d656-4ff9-9700-c6ba98c0e9f8"
}
```

---

## Configuración en el código

Cada canal se define en `src/lib/channels.js`:

```js
export const CHANNELS = [
  {
    id: 'cuarso',
    name: 'Cuarso',
    bot: 'Eri',
    emoji: '🦷',
    tableId: 'tbl9hcH6bU6PPetIq',
    fields: {
      fecha: 'fldMB4y02i8cpMtWm',
      cliente: 'fldMLyhXIIGMfYinb',
      bot: 'fld84jMaThxaaW47o',
      sessionId: 'fldNROJb7j0M4jplx',
    },
    color: 'blue',
  },
  {
    id: 'urban-denim',
    name: 'Urban Denim',
    bot: 'Lara',
    emoji: '👖',
    tableId: 'tblaJ3Vq1cMVHvNsL',
    fields: {
      fecha: 'fldN3VMkSAOih3NGH',
      cliente: 'fldNdpvhy0mS7fC7w',
      bot: 'fld9wa0uJzdg2doRJ',
      sessionId: 'fldwDCbVvmh9ExmgL',
    },
    color: 'purple',
  },
  {
    id: 'tinos',
    name: 'Tinos',
    bot: 'Cami',
    emoji: '🍦',
    tableId: 'tbl6XUcXUcfSagFTH',
    fields: {
      fecha: 'fldJhM3RLAhfKOF7D',
      cliente: 'fldJrgMOr0PPA0uys',
      bot: 'fld5K1h1CzGdvYgiF',
      sessionId: 'fldERtE1oTwwTaBZK',
    },
    color: 'pink',
  },
  {
    id: 'tinos-qr',
    name: 'Tinos QR',
    bot: 'Cami',
    emoji: '📱',
    tableId: 'tblxm6kydaxl4kPuK',
    fields: {
      fecha: 'fldaGYbs4yzIESPIG',
      cliente: 'fldaQsUpKY7iu4E9v',
      bot: 'fldw9dpCVxYGp2qTI',
      sessionId: 'fldBz27zAK2GjSf1y',
    },
    color: 'pink',
  },
]
```

## Notas importantes

- Cada **fila** en Airtable = **1 turno** de conversación (mensaje del cliente + respuesta del bot)
- Las sesiones se identifican por `sessionId` (UUID generado por n8n)
- Los mensajes del bot pueden contener **Markdown** con links, imágenes y emojis — renderizarlos con `react-markdown`
- Airtable no soporta GROUP BY — la agrupación por sesión se hace en el servidor (serverless function)
- La API de Airtable pagina con cursores (`offset`) — el servidor maneja la paginación internamente
