# Desarrollo Local

## Setup

```bash
# Clonar el repo
git clone https://github.com/mflowsuite/mflow-conversations.git
cd mflow-conversations

# Instalar dependencias
npm install

# Variables de entorno (ver docs/ENV_VARIABLES.md)
# Crear .env.local con AIRTABLE_TOKEN, AUTH_SECRET, AUTH_USER, AUTH_PASS

# Correr con Vercel dev (incluye las API functions)
npx vercel dev
```

Con `npx vercel dev`, el frontend corre en `http://localhost:3000` y las
functions en `/api/*` también funcionan localmente.

> `npm run dev` (Vite solo) NO sirve para probar las funciones de `/api`.

## Comandos

| Comando | Uso |
|---------|-----|
| `npx vercel dev` | Desarrollo completo (frontend + API functions) |
| `npm run dev` | Solo frontend (útil para trabajo en UI sin API) |
| `npm run build` | Build de producción — correr antes de pushear para verificar |
| `npm run preview` | Preview del build |

## Archivos clave

### Backend (`/api`)
- `api/_auth.js` — verifica el JWT en cada request (importado por las otras functions)
- `api/login.js` — `POST /api/login` — valida usuario/pass, devuelve JWT
- `api/conversations.js` — `GET /api/conversations?channel=xxx` — único endpoint de datos

### Frontend (`/src`)
- `src/contexts/AuthContext.jsx` — estado global: token, login, logout, authFetch
- `src/lib/channels.js` — config de los 4 canales con field IDs de Airtable
- `src/lib/utils.js` — formatMessageDate, formatRelativeDate, truncate, cn
- `src/components/ConversationList.jsx` — lista de sesiones + auto-refresh 10s
- `src/components/ChatView.jsx` — burbujas de chat + botones 📤/📋
- `src/App.jsx` — layout, navegación mobile

## Cómo agregar un canal nuevo

1. En `api/conversations.js`, agregar entrada en `CHANNEL_CONFIG`:
```js
'nuevo-canal': {
  tableId: 'tblXXXXXXXXXXXXXX',
  fields: {
    fecha: 'fldXXXXXXXXXXXXXX',
    cliente: 'fldXXXXXXXXXXXXXX',
    bot: 'fldXXXXXXXXXXXXXX',
    sessionId: 'fldXXXXXXXXXXXXXX',
  },
},
```

2. En `src/lib/channels.js`, agregar entrada en `CHANNELS`:
```js
{
  id: 'nuevo-canal',
  name: 'Nombre del Canal',
  bot: 'NombreBot',
  emoji: '🤖',
  tableId: 'tblXXXXXXXXXXXXXX',
  fields: { /* mismos IDs */ },
  color: 'blue',
  bgClass: 'bg-blue-50',
  badgeClass: 'bg-blue-100 text-blue-700',
  bubbleClass: 'bg-blue-600 text-white',
  dotClass: 'bg-blue-500',
},
```

3. Push → deploy automático.

## Troubleshooting

**0 conversaciones en todos los canales**
→ Verificar que `api/conversations.js` tiene `returnFieldsByFieldId=true` en el fetch a Airtable.
→ Sin ese flag, todos los campos son `undefined` y no se crea ninguna sesión.

**401 en /api/conversations**
→ El JWT expiró (dura 24h). Hacer logout y login de nuevo.
→ O `AUTH_SECRET` cambió en Vercel — los tokens previos quedan inválidos.

**Deploy bloqueado en Vercel ("committer not associated")**
→ El email del committer git no coincide con el de la cuenta GitHub.
→ Corregir con `git config user.email "mflowsuite@gmail.com"` y hacer un commit vacío.

**Chat en blanco al clickear una conversación**
→ `session.messages` es undefined o vacío.
→ `api/conversations.js` debe incluir el array `messages` en cada sesión.
→ ChatView usa `session.messages` directamente (sin llamar a /api/messages).

**Los cambios en el browser no se ven**
→ Hacer hard refresh: Ctrl+Shift+R
→ Vercel puede tardar ~60s en propagar el deploy nuevo.
