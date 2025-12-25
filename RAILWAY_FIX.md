# 🔧 Fix: Railway Build Error

## Problema
Railway sta cercando di buildare dalla root del repository invece che dalle sottocartelle `backend/` e `frontend/`.

Errore: `Railpack could not determine how to build the app`

## ✅ Soluzione: Configurare Root Directory

### Per il Servizio Backend:

1. Vai sul servizio **Backend** su Railway
2. Clicca su **Settings** (ingranaggio)
3. Scorri fino a **"Root Directory"**
4. Imposta: `/backend`
5. Clicca **"Save"**

### Per il Servizio Frontend:

1. Vai sul servizio **Frontend** su Railway
2. Clicca su **Settings** (ingranaggio)
3. Scorri fino a **"Root Directory"**
4. Imposta: `/frontend`
5. Clicca **"Save"**

## 🔄 Dopo aver configurato Root Directory:

1. Railway dovrebbe triggerare un nuovo deploy automaticamente
2. Se non lo fa, vai su **"Deployments"** → **"Redeploy"**

## 📝 Verifica Build Command (Opzionale)

Dopo aver impostato il Root Directory, verifica anche:

### Backend Settings:
- **Build Command**: *(lascia vuoto - usa railway.json)*
- **Start Command**: *(lascia vuoto - usa railway.json)*

### Frontend Settings:
- **Build Command**: *(lascia vuoto - usa railway.json)*
- **Start Command**: *(lascia vuoto - usa railway.json)*

## ⚠️ Se il problema persiste:

### Opzione A: Usa Nixpacks direttamente

Nel servizio Backend, vai in Settings → Build:
- **Builder**: Seleziona "Nixpacks" manualmente
- **Build Command**: `npm ci && npx prisma generate && npm run build`

Nel servizio Frontend:
- **Builder**: Seleziona "Nixpacks" manualmente
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run preview`

### Opzione B: Verifica file railway.json

Assicurati che i file `backend/railway.json` e `frontend/railway.json` esistano e siano corretti.

## 🎯 Checkpoint

- [ ] Root Directory backend impostato a `/backend`
- [ ] Root Directory frontend impostato a `/frontend`
- [ ] Nuovo deploy triggerato
- [ ] Build completato con successo

---

**Nota**: Railway a volte non legge i file `railway.json` nelle sottocartelle se il Root Directory non è configurato. Una volta impostato il Root Directory, Railway dovrebbe trovare automaticamente i file di configurazione.


