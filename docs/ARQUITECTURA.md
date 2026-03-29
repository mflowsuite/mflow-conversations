# Arquitectura del Sistema

## Visión General

```
Usuario (browser)
      │
      │ HTTPS
      ▼
chat.mflowsuite.com  (CNAME → Vercel)
      │
  ┌───┴──────────────────────────────┐
  │         Vercel                   │
  │                                  │
  │  ┌─────────────────────────┐     │
  │  │  React + Vite (static)  │     │
  │  │  - Login page           │     │
  │  │  - Dashboard (3 paneles)│     │
  │  │  - Sidebar (4 bots)     │     │
  │  │  - ConversationList     │     │
  │  │  - ChatView             │     │
  │  └────────────┬────────────┘     │
  │               │ fetch            │
  │  ┌────────────▼────────────┐     │
  │  │  Serverless Functions   │     │
  │  │  POST /api/login        │     │
  │  │  GET  /api/conversations│─────┼──► Airtable API
  │  │  GET  /api/messages     │     │    (base appKeg7OfvXmVrAiC)
  │  └─────────────────────────┘     │
  └──────────────────────────────────┘
```

## Flujo de Autenticación

```
1. Usuario ingresa usuario/contraseña en Login
2. Frontend → POST /api/login { username, password }
3. Serverless function compara con AUTH_USER / AUTH_PASS (env vars)
4. Si correcto → devuelve JWT firmado (expira en 24h)
5. Frontend guarda JWT en localStorage
6. Todos los requests a /api/* incluyen header: Authorization: Bearer <jwt>
7. Serverless functions validan JWT antes de consultar Airtable
```

## Flujo de Datos (Conversaciones)

```
1. Usuario selecciona un canal (ej: Urban Denim)
2. Frontend → GET /api/conversations?channel=urban-denim
3. Function consulta Airtable: todos los registros de tblaJ3Vq1cMVHvNsL
4. Function agrupa registros por sessionId en el servidor
5. Devuelve lista de sesiones con: sessionId, fecha, nro de mensajes, preview
6. Usuario clickea una sesión
7. Frontend → GET /api/messages?channel=urban-denim&sessionId=xxx
8. Function devuelve todos los mensajes de esa sesión ordenados por Fecha
9. Frontend renderiza como burbujas de chat
```

## Estructura de Carpetas

```
Chat QR Viewer/
├── README.md
├── docs/                        ← documentación del proyecto
│   ├── ARQUITECTURA.md
│   ├── AIRTABLE.md
│   ├── ENV_VARIABLES.md
│   ├── DEPLOY.md
│   └── DESARROLLO.md
├── src/                         ← código fuente React
│   ├── components/
│   │   ├── ui/                  ← componentes shadcn/ui (auto-generados)
│   │   ├── Login.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ConversationList.jsx
│   │   └── ChatView.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── lib/
│   │   └── utils.js             ← helpers (cn, formatDate, etc.)
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── api/                         ← Vercel Serverless Functions
│   ├── login.js                 ← POST /api/login
│   ├── conversations.js         ← GET /api/conversations
│   └── messages.js              ← GET /api/messages
├── public/
├── .env.example                 ← plantilla de variables de entorno
├── .env.local                   ← variables locales (en .gitignore)
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── components.json              ← config shadcn/ui
└── vercel.json
```

## Seguridad

- El `AIRTABLE_TOKEN` **nunca** llega al browser — solo lo usan las serverless functions
- JWT firmado con `AUTH_SECRET` (HMAC-SHA256 via `jose`)
- Las funciones retornan 401 si el JWT es inválido o expirado
- Las credenciales `AUTH_USER` / `AUTH_PASS` viven solo en las env vars de Vercel
