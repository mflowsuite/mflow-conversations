# mflow-conversations — Dashboard de Conversaciones

Dashboard centralizado para monitorear las conversaciones de los bots de IA de **mFlowSuite**.
Consume datos de Airtable en tiempo real, agrupando mensajes por sesión.

## Bots monitoreados

| Bot | Negocio | Tabla Airtable |
|-----|---------|----------------|
| Eri | Distribuidora Cuarso | Preguntas Cuarso |
| Lara | Urban Denim | Urban Denim |
| Cami | Tinos Heladería (web) | Tinos |
| Cami | Tinos Heladería (QR) | Tinos QR |

## Stack

- **Frontend**: React 18 + Vite + shadcn/ui + Tailwind CSS
- **Backend**: Vercel Serverless Functions (API proxy seguro)
- **Auth**: JWT firmado con `jose`
- **Datos**: Airtable REST API (base `appKeg7OfvXmVrAiC`)
- **Hosting**: Vercel → dominio `chat.mflowsuite.com`

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) | Visión general del sistema y flujo de datos |
| [docs/AIRTABLE.md](docs/AIRTABLE.md) | Schema completo de las 4 tablas con IDs de campos |
| [docs/ENV_VARIABLES.md](docs/ENV_VARIABLES.md) | Variables de entorno requeridas y dónde configurarlas |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Guía paso a paso: GitHub → Vercel → Cloudflare DNS |
| [docs/DESARROLLO.md](docs/DESARROLLO.md) | Cómo correr el proyecto localmente |

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Crear archivo de variables de entorno local
cp .env.example .env.local
# Editar .env.local con tus valores

# Correr en desarrollo
npm run dev
```

## Deploy

Ver [docs/DEPLOY.md](docs/DEPLOY.md) para instrucciones completas.
El deploy es automático en cada `git push` a `main` via Vercel.

---

*Proyecto de mFlowSuite — [mflowsuite.com](https://mflowsuite.com)*
