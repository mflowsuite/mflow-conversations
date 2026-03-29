# Guía de Desarrollo Local

## Requisitos

- **Node.js** v18 o superior (`node --version`)
- **npm** v9 o superior (`npm --version`)
- **Git**

---

## Setup inicial (primera vez)

```bash
# 1. Clonar el repo
git clone https://github.com/[tu-usuario]/mflow-conversations.git
cd mflow-conversations

# 2. Instalar dependencias
npm install

# 3. Crear variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores reales (ver docs/ENV_VARIABLES.md)

# 4. Correr en desarrollo
npm run dev
```

El servidor arranca en `http://localhost:5173`

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción (genera carpeta `dist/`) |
| `npm run preview` | Preview del build de producción |
| `npx vercel dev` | Simula el entorno Vercel localmente (funciones + frontend) |

> **Recomendado para desarrollo**: usar `npx vercel dev` en vez de `npm run dev` para que las API functions también funcionen localmente.

---

## Estructura de archivos clave

```
src/
├── lib/
│   └── channels.js          ← configuración de los 4 canales (IDs Airtable)
├── hooks/
│   └── useAuth.js           ← gestión del JWT en localStorage
├── components/
│   ├── Login.jsx            ← pantalla de login
│   ├── Sidebar.jsx          ← lista de canales con badges
│   ├── ConversationList.jsx ← lista de sesiones del canal seleccionado
│   └── ChatView.jsx         ← burbujas de chat de una sesión
├── App.jsx                  ← router principal (login vs dashboard)
└── main.jsx                 ← punto de entrada

api/
├── login.js                 ← POST /api/login → valida credenciales, devuelve JWT
├── conversations.js         ← GET /api/conversations?channel=xxx → lista de sesiones
└── messages.js              ← GET /api/messages?channel=xxx&sessionId=xxx → mensajes
```

---

## Cómo agregar un nuevo canal/bot

1. Agregar la configuración en `src/lib/channels.js` (ver [docs/AIRTABLE.md](AIRTABLE.md))
2. El resto del dashboard lo toma automáticamente — no hay más cambios necesarios

---

## Flujo de datos en desarrollo

```
npm run dev / npx vercel dev
       │
       ▼
localhost:5173 (frontend React)
       │
       │ fetch /api/login
       │ fetch /api/conversations?channel=xxx
       │ fetch /api/messages?channel=xxx&sessionId=xxx
       ▼
localhost:3000/api/* (Vercel functions corriendo localmente)
       │
       │ Authorization: Bearer <jwt>
       ▼
api.airtable.com (Airtable REST API)
```

---

## Troubleshooting

**Error: AIRTABLE_TOKEN not found**
→ Verificar que `.env.local` existe y tiene el token correcto

**Error 401 en /api/conversations**
→ El JWT expiró o es inválido. Hacer logout y login de nuevo.

**Las conversaciones no cargan**
→ Verificar en la consola del browser (F12) si hay errores de red
→ Verificar que el `AIRTABLE_TOKEN` tenga los scopes `data.records:read`

**shadcn/ui component no encontrado**
→ Agregar el componente: `npx shadcn@latest add [nombre-componente]`
