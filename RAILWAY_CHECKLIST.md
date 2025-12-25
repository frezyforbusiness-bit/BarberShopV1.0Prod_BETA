# ✅ Checklist Deploy Railway

Usa questa checklist per seguire il deploy passo-passo.

## 📦 Pre-Deploy (Locale)

- [ ] Codice committato e pushato su GitHub/GitLab
- [ ] Repository condiviso con Railway (se necessario)

## 🚂 Setup Railway

### Step 1: Progetto
- [ ] Login su [railway.app](https://railway.app)
- [ ] Clicca "New Project"
- [ ] Seleziona "Deploy from GitHub repo"
- [ ] Autorizza Railway → Seleziona repository `entrepeneuer`

### Step 2: Database PostgreSQL
- [ ] Click "+ New" → "Database" → "Add PostgreSQL"
- [ ] ⚠️ **COPIA** `DATABASE_URL` dalla tab "Variables"

### Step 3: Backend Service
- [ ] Click "+ New" → "GitHub Repo" (stesso repository)
- [ ] Settings → Root Directory: `/backend`
- [ ] Settings → Build Command: *(lascia vuoto, usa railway.json)*
- [ ] Settings → Start Command: *(lascia vuoto, usa railway.json)*

### Step 4: Backend Variables
Aggiungi tutte queste variabili nella tab "Variables":

- [ ] `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
- [ ] `JWT_SECRET` = *(genera con `openssl rand -base64 32`)*
- [ ] `JWT_REFRESH_SECRET` = *(genera con `openssl rand -base64 32`)*
- [ ] `JWT_EXPIRES_IN` = `15m`
- [ ] `JWT_REFRESH_EXPIRES_IN` = `7d`
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `FRONTEND_URL` = *(sarà aggiornato dopo deploy frontend)*

**Opzionali (per notifiche):**
- [ ] `SENDGRID_API_KEY` = *(se hai SendGrid)*
- [ ] `SENDGRID_FROM_EMAIL` = `noreply@barbershop.com`
- [ ] `TWILIO_ACCOUNT_SID` = *(se hai Twilio)*
- [ ] `TWILIO_AUTH_TOKEN` = *(se hai Twilio)*
- [ ] `TWILIO_PHONE_NUMBER` = *(se hai Twilio)*

### Step 5: Prisma Migration
**Dopo il primo deploy del backend:**

```bash
# Installa Railway CLI (se non l'hai fatto)
npm i -g @railway/cli

# Login
railway login

# Link al progetto (seleziona il progetto quando richiesto)
railway link

# Esegui migration
railway run --service backend npx prisma migrate deploy
```

- [ ] Migration eseguita con successo

### Step 6: Seed Database
```bash
railway run --service backend npm run seed
```

Questo crea:
- Shop: `mybarbershop`
- Admin: `admin@barbershop.com` / `admin123`
- Barber: `Mario Rossi`
- Service: `Taglio Capelli` (€25)

- [ ] Seed eseguito con successo

### Step 7: Backend Domain
- [ ] Vai in Backend → Settings → Networking
- [ ] Click "Generate Domain"
- [ ] **COPIA** l'URL (es: `backend-production-xxxx.up.railway.app`)

### Step 8: Frontend Service
- [ ] Click "+ New" → "GitHub Repo" (stesso repository)
- [ ] Settings → Root Directory: `/frontend`
- [ ] Settings → Build Command: *(lascia vuoto, usa railway.json)*
- [ ] Settings → Start Command: *(lascia vuoto, usa railway.json)*

### Step 9: Frontend Variables
Aggiungi nella tab "Variables":

- [ ] `VITE_API_URL` = `https://[BACKEND-URL]/api/v1`

⚠️ Sostituisci `[BACKEND-URL]` con l'URL copiato al Step 7!

### Step 10: Frontend Domain
- [ ] Vai in Frontend → Settings → Networking
- [ ] Click "Generate Domain"
- [ ] **COPIA** l'URL (es: `frontend-production-xxxx.up.railway.app`)

### Step 11: Aggiorna Variabili
- [ ] **Backend**: Aggiorna `FRONTEND_URL` con l'URL del frontend (Step 10)
- [ ] **Frontend**: Verifica che `VITE_API_URL` sia corretto

### Step 12: Verifica Deploy

**Backend:**
- [ ] Visita: `https://[BACKEND-URL]/api/v1`
- [ ] Dovresti vedere errore 404 (normale, significa che è online)
- [ ] Log backend senza errori

**Frontend:**
- [ ] Visita: `https://[FRONTEND-URL]`
- [ ] Vedi la pagina di booking
- [ ] Non ci sono errori nella console del browser

**Admin Login:**
- [ ] Vai su: `https://[FRONTEND-URL]/admin/login`
- [ ] Login con: `admin@barbershop.com` / `admin123`
- [ ] Accesso alla dashboard admin

## 🔧 Troubleshooting

### Backend non si avvia?
```bash
railway logs --service backend
```
- [ ] Controlla errori nei log
- [ ] Verifica `DATABASE_URL` corretta
- [ ] Verifica che migration sia stata eseguita

### Frontend non si connette al backend?
- [ ] Verifica `VITE_API_URL` nel frontend
- [ ] Verifica `FRONTEND_URL` nel backend (CORS)
- [ ] Controlla console browser per errori CORS

### Database connection error?
```bash
railway run --service backend npx prisma db pull
```

## ✨ Post-Deploy

- [ ] ✅ Cambia password admin dopo il primo login
- [ ] ✅ Testa creazione prenotazione
- [ ] ✅ Testa funzionalità admin
- [ ] ✅ Configura SendGrid/Twilio (se necessario)

---

## 📝 Comandi Utili

```bash
# Vedi logs in tempo reale
railway logs --service backend
railway logs --service frontend

# Apri shell nel container
railway shell --service backend

# Esegui comando
railway run --service backend npm run prisma:studio
```

---

🎉 **Fatto!** Il tuo sistema è deployato su Railway!


