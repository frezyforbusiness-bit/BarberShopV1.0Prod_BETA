# 🚨 FIX URGENTE: Errore npm ci

## Il Problema

Railway continua a dare errore `npm ci can only install with an existing package-lock.json` anche se il file esiste.

## ✅ SOLUZIONE DEFINITIVA (2 PASSI)

### STEP 1: Configura Root Directory (CRITICO!)

**Questo è il passo più importante!** Senza questo, Railway non troverà mai i file.

#### Backend:
1. Vai sul servizio **Backend** su Railway
2. **Settings** (icona ingranaggio) → **"Root Directory"**
3. Imposta: `/backend`
4. **Save**

#### Frontend:
1. Vai sul servizio **Frontend** su Railway  
2. **Settings** → **"Root Directory"**
3. Imposta: `/frontend`
4. **Save**

### STEP 2: Verifica Build Settings

Dopo aver configurato Root Directory, verifica che:

#### Backend Settings:
- **Builder**: NIXPACKS (o Nixpacks)
- **Build Command**: *(lascia vuoto - usa nixpacks.toml o railway.json)*
- **Start Command**: *(lascia vuoto - usa nixpacks.toml)*

#### Frontend Settings:
- **Builder**: NIXPACKS
- **Build Command**: *(lascia vuoto)*
- **Start Command**: *(lascia vuoto)*

### STEP 3: Trigger Nuovo Deploy

1. Dopo aver salvato Root Directory, Railway dovrebbe triggerare automaticamente un nuovo deploy
2. Se non succede, vai su **Deployments** → Clicca **"Redeploy"** sull'ultimo deploy

## 🔍 Verifica nei Log

Dopo il nuovo deploy, nei log dovresti vedere:

✅ **Successo:**
```
Installing dependencies...
Found package-lock.json
Running npm ci...
```

❌ **Ancora errore:**
```
npm ci can only install...
```
→ Significa che Root Directory NON è configurato correttamente

## 💡 Fallback Aggiunto

Ho aggiornato i file `nixpacks.toml` per usare `npm ci || npm install` come fallback, ma questo funziona solo se Railway trova i file (quindi Root Directory deve essere configurato).

## 🎯 Checklist Finale

- [ ] Backend: Root Directory = `/backend` ✅
- [ ] Frontend: Root Directory = `/frontend` ✅  
- [ ] Nuovo deploy triggerato
- [ ] Log mostrano "Found package-lock.json" o "Installing dependencies"
- [ ] Build completa senza errori

---

**IMPORTANTE**: Il Root Directory è la SOLA cosa che risolve questo problema. Senza di esso, Railway cercherà sempre nella root e non troverà mai i file nelle sottocartelle.


