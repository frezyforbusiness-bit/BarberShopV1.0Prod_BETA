# ⚡ Quick Start: Deploy su Railway

## 🚀 In 5 Minuti

### 1. Prepara il Repository
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Crea Progetto su Railway
1. Vai su [railway.app](https://railway.app) e fai login
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Seleziona il repository `entrepeneuer`

### 3. Aggiungi PostgreSQL
1. **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Copia la `DATABASE_URL` dalla tab "Variables"

### 4. Deploy Backend
1. **"+ New"** → **"GitHub Repo"** (stesso repo)
2. **Settings** → **Root Directory**: `/backend`
3. **Variables** → Aggiungi:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=$(openssl rand -base64 32)
   JWT_REFRESH_SECRET=$(openssl rand -base64 32)
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://your-frontend-url.railway.app
   ```
   ⚠️ Genera i secret JWT con: `openssl rand -base64 32`

### 5. Esegui Migration
Dopo il primo deploy del backend, esegui:
```bash
# Installa Railway CLI
npm i -g @railway/cli

# Login e link
railway login
railway link

# Migration
railway run --service backend npx prisma migrate deploy
```

### 6. Seed Database
```bash
railway run --service backend npm run seed
```
Questo crea:
- Shop: `mybarbershop`
- Admin: `admin@barbershop.com` / `admin123`

### 7. Deploy Frontend
1. **"+ New"** → **"GitHub Repo"** (stesso repo)
2. **Settings** → **Root Directory**: `/frontend`
3. **Variables** → Aggiungi:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api/v1
   ```
   ⚠️ Sostituisci con l'URL del backend (trovalo in Settings → Networking)

### 8. Configura Domini
**Backend:**
- Settings → Networking → "Generate Domain"
- Copia l'URL e aggiorna `FRONTEND_URL` nel frontend

**Frontend:**
- Settings → Networking → "Generate Domain"
- Copia l'URL e aggiorna `VITE_API_URL` nel frontend

### 9. Test
- ✅ Backend: `https://your-backend-url.railway.app/api/v1`
- ✅ Frontend: `https://your-frontend-url.railway.app`
- ✅ Admin Login: `admin@barbershop.com` / `admin123`

---

## 🐛 Troubleshooting Rapido

**Backend non si avvia?**
```bash
railway logs --service backend
```

**Migration fallisce?**
```bash
railway run --service backend npx prisma migrate deploy
```

**Frontend non si connette?**
- Verifica `VITE_API_URL` nel frontend
- Verifica `FRONTEND_URL` nel backend (CORS)

---

📖 **Guida completa**: Vedi `RAILWAY_DEPLOY.md`


