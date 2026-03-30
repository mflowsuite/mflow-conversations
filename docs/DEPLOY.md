# Guía de Deploy

## Flujo normal

```
git add .
git commit -m "descripción"
git push origin main
→ Vercel detecta el push y despliega automáticamente (~1 min)
```

## ⚠️ Requisito crítico: email de git

El committer email en git **debe coincidir** con el email de la cuenta de GitHub
(`mflowsuite@gmail.com`) para que Vercel reconozca el deploy automático.

```bash
# Verificar configuración actual
git config user.email

# Corregir si es necesario
git config user.email "mflowsuite@gmail.com"
git config user.name "mflowsuite"
```

Si el email estaba mal y los deploys estaban bloqueados, hacer un commit vacío:
```bash
git commit --allow-empty -m "fix: trigger deploy"
git push
```

## Cloudflare DNS

El subdominio `chat.mflowsuite.com` apunta a Vercel via CNAME:

```
Type:   CNAME
Name:   chat
Target: cname.vercel-dns.com
Proxy:  DNS only (nube GRIS, NO naranja)
```

**Importante**: el proxy de Cloudflare debe estar DESACTIVADO (solo DNS).
Si está activado (naranja), Vercel no puede validar el dominio.

## Variables de entorno en Vercel

Ver [ENV_VARIABLES.md](ENV_VARIABLES.md). Las 4 variables necesarias:
- `AIRTABLE_TOKEN`
- `AUTH_SECRET`
- `AUTH_USER`
- `AUTH_PASS`

Después de cambiar variables → ir a Vercel → Deployments → Redeploy.

## URLs

| Entorno | URL |
|---------|-----|
| Producción | https://chat.mflowsuite.com |
| Vercel dashboard | https://vercel.com/mflowsuite/mflow-conversations |
| GitHub repo | https://github.com/mflowsuite/mflow-conversations |
