# mflow-conversations

Dashboard web para monitorear conversaciones de los bots de IA de mflowsuite.

**URL producción:** https://chat.mflowsuite.com
**Repo:** https://github.com/mflowsuite/mflow-conversations
**Deploy:** Vercel — auto-deploy en cada `git push origin main`

## Bots / Canales

| Canal | Bot | Negocio |
|-------|-----|---------|
| 🦷 Cuarso | Eri | Cuarso dental |
| 👖 Urban Denim | Lara | Urban Denim ropa |
| 🍦 Tinos | Cami | Tinos helados (web) |
| 📱 Tinos QR | Cami | Tinos helados (QR físico) |

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Vercel Serverless Functions (`/api`)
- **Auth:** JWT HS256 con `jose` (24h)
- **Datos:** Airtable REST API (base `appKeg7OfvXmVrAiC`)
- **DNS:** Cloudflare (CNAME → Vercel, proxy OFF)

## Deploy rápido

```bash
git add .
git commit -m "descripción"
git push origin main
# Vercel despliega en ~1 min
```

> El email del committer git debe ser `mflowsuite@gmail.com`

## Documentación

| Doc | Contenido |
|-----|-----------|
| [ARQUITECTURA.md](docs/ARQUITECTURA.md) | Flujo de datos, decisiones de implementación, estructura |
| [AIRTABLE.md](docs/AIRTABLE.md) | Field IDs de las 4 tablas, nota crítica sobre `returnFieldsByFieldId` |
| [ENV_VARIABLES.md](docs/ENV_VARIABLES.md) | Variables de entorno y cómo configurarlas |
| [DEPLOY.md](docs/DEPLOY.md) | Deploy, DNS Cloudflare, troubleshooting de Vercel |
| [DESARROLLO.md](docs/DESARROLLO.md) | Setup local, comandos, cómo agregar un canal nuevo |
