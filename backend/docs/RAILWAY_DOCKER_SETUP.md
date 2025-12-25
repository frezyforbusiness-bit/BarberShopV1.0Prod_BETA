# 🐳 Setup Railway con Dockerfile (Semplice)

## ✅ Configurazione su Railway

Ora che hai i Dockerfile, configura Railway per usarli.

### Backend Service:

1. Vai sul servizio **Backend** su Railway
2. **Settings** → **Build**:
   - **Builder**: Seleziona **"DOCKERFILE"**
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Root Directory**: `/backend` (IMPORTANTE!)
3. **Save**

### Frontend Service:

1. Vai sul servizio **Frontend** su Railway
2. **Settings** → **Build**:
   - **Builder**: Seleziona **"DOCKERFILE"**
   - **Dockerfile Path**: `frontend/Dockerfile`
   - **Root Directory**: `/frontend` (IMPORTANTE!)
3. **Save**

## 📋 Opzioni Frontend

Hai 2 opzioni per il frontend:

### Opzione 1: Production Build (Nginx) ✅ Raccomandato
- Usa: `frontend/Dockerfile`
- Build statico ottimizzato
- Serve con Nginx
- Più veloce in produzione

### Opzione 2: Dev Server (Vite)
- Usa: `frontend/Dockerfile.dev`
- Modalità sviluppo con hot-reload
- Utile per testing

## 🔄 Deploy

Dopo aver configurato:

1. Railway leggerà automaticamente il Dockerfile
2. Farà build dell'immagine Docker
3. Avvierà il container

## ✅ Vantaggi Dockerfile

- ✅ Più controllo sul processo di build
- ✅ Più prevedibile di Nixpacks
- ✅ Stesso comportamento locale e produzione
- ✅ Più facile debuggare

## 🎯 Checklist

- [ ] Backend: Builder = DOCKERFILE, Dockerfile Path = `backend/Dockerfile`
- [ ] Frontend: Builder = DOCKERFILE, Dockerfile Path = `frontend/Dockerfile`
- [ ] Root Directory configurato per entrambi
- [ ] Nuovo deploy triggerato
- [ ] Build completa con successo

---

**Pronto!** Ora Railway userà Dockerfile invece di Nixpacks. Molto più semplice e prevedibile.



