# Arquitectura del Sistema

## Visión General

```
Usuario (browser)
      │
      │ HTTPS
      ▼
chat.mflowsuite.com  (Cloudflare DNS → CNAME → Vercel, proxy OFF)
      │
  ┌───┴──────────────────────────────────┐
  │            Vercel                    │
  │                                      │
  │  React + Vite (build estático)       │
  │  - Login, Sidebar, ConversationList  │
  │  - ChatView con burbujas y botones   │
  │                                      │
  │  Serverless Functions (/api/)        │
  │  POST /api/login                     │
  │  GET  /api/conversations  ───────────┼──► Airtable REST API
  └──────────────────────────────────────┘    base: appKeg7OfvXmVrAiC
```

## Flujo de autenticación

```
1. Usuario ingresa usuario/contraseña en Login
2. Frontend → POST /api/login { username, password }
3. api/login.js compara con AUTH_USER / AUTH_PASS (env vars en Vercel)
4. Si correcto → devuelve JWT firmado con HS256 usando `jose` (expira 24h)
5. El token se guarda en localStorage bajo la clave `mflow_token`
6. AuthContext (React Context) lo distribuye a toda la app
7. authFetch() inyecta Authorization: Bearer <token> en cada request a /api/*
```

## Flujo de datos

```
1. ConversationList llama a GET /api/conversations?channel=<channelId>
2. api/conversations.js:
   a. Verifica JWT
   b. Fetch ALL records de la tabla Airtable (con paginación interna)
      ⚠️ CRÍTICO: usa returnFieldsByFieldId=true para indexar por field ID
   c. Agrupa registros en sesiones:
      - Registro tiene sessionId real → agrupa por ese UUID
      - Registro sin sessionId → agrupa con contiguos (gap < 15 min),
        ID generado: auto-<recordId>
   d. Incluye array messages[] completo en cada sesión
   e. Devuelve { sessions, totalSessions }
3. ConversationList muestra las sesiones
4. Auto-refresh cada 10 segundos (reemplaza la lista completa)
5. Al click en una sesión → ChatView usa session.messages directamente
   (sin segunda llamada a la API)
```

## ⚠️ Decisiones críticas de implementación

### `returnFieldsByFieldId=true` en Airtable
Sin este parámetro, Airtable devuelve los campos con el NOMBRE como clave
(ej: `"Fecha"`, `"sessionId"`). El código accede por ID de campo
(ej: `"fldMB4y02i8cpMtWm"`). Si falta este flag → todos los campos son
`undefined` → 0 sesiones.

### Mensajes incluidos en sessions (no endpoint separado)
El archivo `api/messages.js` existe pero NO SE USA. Los mensajes se
incluyen en la respuesta de `/api/conversations` para:
- Evitar una segunda llamada por cada sesión clickeada
- Evitar problemas con `filterByFormula` en Airtable (requiere nombres de
  campos, y nosotros tenemos field IDs)

### Sesiones sin sessionId
Registros sin campo `sessionId` se agrupan automáticamente por proximidad
temporal (gap > 15 min = nueva sesión). ID: `auto-<recordId del primer mensaje>`.

## Estructura de archivos

```
Chat QR Viewer/
├── api/                         ← Vercel Serverless Functions
│   ├── _auth.js                 ← helper: verifica JWT en cada request
│   ├── login.js                 ← POST /api/login
│   ├── conversations.js         ← GET /api/conversations (único endpoint de datos)
│   └── messages.js              ← NO SE USA (está pero deprecado)
├── src/
│   ├── contexts/
│   │   └── AuthContext.jsx      ← estado global del JWT (login/logout/authFetch)
│   ├── hooks/
│   │   └── useAuth.js           ← re-exporta useAuth desde AuthContext
│   ├── lib/
│   │   ├── channels.js          ← config de los 4 canales con field IDs
│   │   └── utils.js             ← helpers: cn(), formatMessageDate(), truncate()
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ConversationList.jsx ← auto-refresh 10s, búsqueda local
│   │   └── ChatView.jsx         ← burbujas MD, botón 📤 exportar, 📋 por burbuja
│   ├── App.jsx                  ← layout 3 paneles + mobile navigation
│   └── main.jsx
├── docs/
├── public/
├── package.json
├── vite.config.js
└── vercel.json
```

## Estado del frontend (React)

```
AuthContext
└── App.jsx
      ├── activeChannel (string: 'cuarso' | 'urban-denim' | 'tinos' | 'tinos-qr')
      ├── activeSession (objeto completo: { sessionId, messages[], ... })
      ├── counts ({ channelId: totalSessions })
      └── mobilePanel ('sidebar' | 'conversations' | 'chat')
```

## Seguridad

- `AIRTABLE_TOKEN` nunca llega al browser — solo lo usan las serverless functions
- JWT firmado con `AUTH_SECRET` (HMAC-SHA256 via `jose`)
- Funciones retornan 401 si el JWT es inválido o expirado
- Credenciales viven solo como env vars en Vercel, nunca en código fuente
