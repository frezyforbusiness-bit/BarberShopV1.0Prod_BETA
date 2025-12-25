# 🔐 Variabili d'Ambiente Railway - BACKEND

## ⚠️ CRITICO: Queste variabili DEVONO essere configurate!

Vai su **Backend Service** → **Variables** e aggiungi:

### Variabili OBBLIGATORIE:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-url.railway.app
```

### Variabili OPZIONALI (per notifiche):

```env
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@barbershop.com
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

## 🔑 Come Generare JWT Secrets

Genera secret forti (almeno 32 caratteri):

```bash
# Opzione 1: OpenSSL
openssl rand -base64 32

# Opzione 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## ✅ Verifica

Dopo aver aggiunto le variabili:
1. **Save** le variabili
2. Railway dovrebbe triggerare un nuovo deploy
3. Nei log non dovresti più vedere "JwtStrategy requires a secret or key"

## 🎯 Checklist

- [ ] `DATABASE_URL` configurata (usa `${{Postgres.DATABASE_URL}}`)
- [ ] `JWT_SECRET` configurata (almeno 32 caratteri)
- [ ] `JWT_REFRESH_SECRET` configurata (almeno 32 caratteri)
- [ ] `JWT_EXPIRES_IN` = `15m`
- [ ] `JWT_REFRESH_EXPIRES_IN` = `7d`
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `FRONTEND_URL` = URL del frontend Railway

---

**IMPORTANTE**: Senza `JWT_SECRET`, l'applicazione non può partire!


