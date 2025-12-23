# 🚂 Guida al Deploy su Railway

Questa guida ti accompagna passo-passo nel deploy del sistema Barbershop su Railway.

## 📋 Prerequisiti

1. Account Railway (crea su [railway.app](https://railway.app))
2. Git repository (GitHub/GitLab) con il codice
3. Account SendGrid (opzionale, per email)
4. Account Twilio (opzionale, per SMS)

## 🏗️ Architettura su Railway

Deployeremo **3 servizi separati**:
- **PostgreSQL** (database)
- **Backend** (NestJS API)
- **Frontend** (React + Vite)

## 📝 Step 1: Preparazione Repository

Assicurati che il codice sia su GitHub/GitLab:

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

## 🚀 Step 2: Setup Railway

### 2.1 Crea un Nuovo Progetto

1. Vai su [railway.app](https://railway.app)
2. Clicca su **"New Project"**
3. Seleziona **"Deploy from GitHub repo"**
4. Autorizza Railway ad accedere al tuo repository
5. Seleziona il repository `entrepeneuer`

### 2.2 Aggiungi PostgreSQL Database

1. Nel progetto Railway, clicca **"+ New"**
2. Seleziona **"Database"** → **"Add PostgreSQL"**
3. Railway creerà automaticamente un database PostgreSQL
4. **IMPORTANTE**: Copia la `DATABASE_URL` dalla scheda "Variables" del database

### 2.3 Deploy Backend

1. Clicca **"+ New"** → **"GitHub Repo"**
2. Seleziona lo stesso repository
3. Railway dovrebbe rilevare automaticamente che è un progetto NestJS
4. **IMPORTANTE**: 
   - Vai in **Settings** → **Root Directory** → Imposta `/backend`
   - Vai in **Settings** → **Build Command** → Lascia vuoto (usa railway.json)
   - Vai in **Settings** → **Start Command** → Lascia vuoto (usa railway.json)

### 2.4 Configura Variabili d'Ambiente Backend

Vai in **Variables** del servizio Backend e aggiungi:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-url.railway.app
SENDGRID_API_KEY=your-sendgrid-api-key-here
SENDGRID_FROM_EMAIL=noreply@barbershop.com
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

**Nota**: 
- `DATABASE_URL` usa la reference `${{Postgres.DATABASE_URL}}` per collegare automaticamente il database
- Genera secret JWT forti (almeno 32 caratteri) - puoi usare: `openssl rand -base64 32`

### 2.5 Esegui Migration Prisma

Dopo il primo deploy del backend:

1. Vai nel servizio Backend su Railway
2. Clicca sulla tab **"Deployments"**
3. Clicca sull'ultimo deployment
4. Vai su **"View Logs"**
5. Oppure usa Railway CLI:

```bash
# Installa Railway CLI
npm i -g @railway/cli

# Login
railway login

# Seleziona il progetto
railway link

# Esegui migration
railway run --service backend npm run prisma:migrate
```

**OPPURE** puoi aggiungere uno script che esegue le migration al deploy:

### 2.6 Deploy Frontend

1. Clicca **"+ New"** → **"GitHub Repo"**
2. Seleziona lo stesso repository
3. **IMPORTANTE**:
   - Vai in **Settings** → **Root Directory** → Imposta `/frontend`
   - Vai in **Settings** → **Build Command** → Lascia vuoto (usa railway.json)

### 2.7 Configura Variabili d'Ambiente Frontend

Vai in **Variables** del servizio Frontend e aggiungi:

```env
VITE_API_URL=https://your-backend-url.railway.app/api/v1
```

**Nota**: Sostituisci `your-backend-url` con l'URL del tuo servizio backend Railway (lo trovi in **Settings** → **Networking** → **Public Domain**)

## 🔧 Step 3: Esegui Prisma Migration

Prima che il backend funzioni, devi eseguire le migration del database:

### Opzione A: Via Railway Dashboard

1. Vai nel servizio **Backend**
2. Tab **"Deployments"**
3. Clicca sui **"..."** dell'ultimo deployment
4. Seleziona **"Open Shell"**
5. Esegui:
```bash
npx prisma migrate deploy
```

### Opzione B: Via Railway CLI (Raccomandato)

```bash
# Login a Railway
railway login

# Link al progetto
railway link

# Seleziona il servizio backend
railway service

# Esegui migration
railway run npx prisma migrate deploy
```

## 📊 Step 4: Crea Primo Shop e User Admin

Dopo le migration, crea il primo shop e admin user:

### Via Railway Shell:

```bash
# Apri shell nel backend
railway run --service backend node

# Poi esegui questo script:
```

Oppure crea un file `scripts/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crea Shop
  const shop = await prisma.shop.create({
    data: {
      name: 'My Barbershop',
      slug: 'mybarbershop',
      settings: {
        openingTime: '09:00',
        closingTime: '19:00',
        timezone: 'Europe/Rome',
        slotDurationMinutes: 30,
        bookingAdvanceDays: 30,
      },
      isActive: true,
    },
  });

  // Crea Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'admin@barbershop.com',
      passwordHash,
      role: 'ADMIN',
      shopId: shop.id,
      isActive: true,
    },
  });

  console.log('Shop created:', shop);
  console.log('Admin user created:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Esegui: `railway run --service backend npx ts-node scripts/seed.ts`

## 🌐 Step 5: Configura Domini Pubblici

### Backend:
1. Vai nel servizio **Backend** → **Settings** → **Networking**
2. Clicca **"Generate Domain"** o aggiungi un dominio custom
3. Copia l'URL (es: `backend-production.up.railway.app`)

### Frontend:
1. Vai nel servizio **Frontend** → **Settings** → **Networking**
2. Clicca **"Generate Domain"**
3. Copia l'URL (es: `frontend-production.up.railway.app`)

### Aggiorna Variabili:
- Nel **Backend**: Aggiorna `FRONTEND_URL` con l'URL del frontend
- Nel **Frontend**: Aggiorna `VITE_API_URL` con l'URL del backend + `/api/v1`

## ✅ Step 6: Verifica Deploy

1. **Backend**: Visita `https://your-backend-url.railway.app/api/v1` - dovresti vedere un errore 404 (normale, significa che è online)
2. **Frontend**: Visita l'URL del frontend - dovresti vedere la pagina di booking
3. **Database**: Verifica i log del backend che non ci sono errori di connessione

## 🔍 Troubleshooting

### Backend non si avvia:
- Verifica i log: **Deployments** → **View Logs**
- Controlla che `DATABASE_URL` sia corretta
- Verifica che Prisma migrations siano state eseguite

### Frontend non si connette al backend:
- Verifica `VITE_API_URL` nel frontend
- Controlla CORS nel backend (`FRONTEND_URL`)
- Verifica che il backend sia accessibile pubblicamente

### Errori Prisma:
```bash
# Rigenera Prisma Client
railway run --service backend npx prisma generate

# Controlla connessione DB
railway run --service backend npx prisma db pull
```

## 📝 Comandi Utili Railway CLI

```bash
# Login
railway login

# Link progetto
railway link

# Vedi logs in tempo reale
railway logs --service backend

# Esegui comando nel container
railway run --service backend npm run prisma:studio

# Vedi variabili d'ambiente
railway variables
```

## 🎉 Success!

Se tutto funziona:
- ✅ Backend API disponibile su Railway
- ✅ Frontend deployato e connesso
- ✅ Database PostgreSQL funzionante
- ✅ Admin può fare login

## 🔐 Sicurezza Post-Deploy

1. **Cambia password admin** dal primo login
2. **Genera nuovi JWT secrets** forti (32+ caratteri)
3. **Configura SendGrid/Twilio** per le notifiche reali
4. **Abilita HTTPS** (automatico su Railway)
5. **Configura rate limiting** se necessario

---

**Support**: Se hai problemi, controlla i log su Railway Dashboard o contatta il supporto Railway.

