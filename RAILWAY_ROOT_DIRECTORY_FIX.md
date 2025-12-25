# 🔴 PROBLEMA CRITICO: Root Directory Non Configurato

## ⚠️ Errore `npm ci` - La Causa

L'errore `npm ci can only install with an existing package-lock.json` significa che Railway **non trova i file** perché sta cercando nella **root del repository** invece che nelle sottocartelle.

## ✅ SOLUZIONE IMMEDIATA (OBBLIGATORIA)

### 🔧 Step 1: Configura Root Directory per BACKEND

1. **Vai su Railway Dashboard**
2. **Seleziona il servizio BACKEND**
3. **Clicca su "Settings"** (icona ingranaggio in alto a destra)
4. **Scorri fino a "Root Directory"**
5. **Imposta il valore**: `/backend`
6. **Clicca "Save"** o "Update"

### 🔧 Step 2: Configura Root Directory per FRONTEND

1. **Seleziona il servizio FRONTEND**
2. **Settings** → **Root Directory**
3. **Imposta**: `/frontend`
4. **Clicca "Save"**

### 🔄 Step 3: Trigger Nuovo Deploy

Dopo aver salvato:
- Railway dovrebbe **automaticamente** triggerare un nuovo deploy
- Se non succede, vai su **"Deployments"** → Clicca **"..."** sull'ultimo deploy → **"Redeploy"**

## 📸 Come Trovare Root Directory nelle Settings

1. Nel servizio, clicca sulla tab **"Settings"**
2. Cerca la sezione **"Build & Deploy"**
3. Trova il campo **"Root Directory"**
4. Di default è vuoto o contiene `/`
5. **Cambialo** in `/backend` o `/frontend`

## ✅ Verifica

Dopo aver configurato il Root Directory, nei log del deploy vedrai:
- ✅ `Found package-lock.json` (o simile)
- ✅ Build che parte dalla cartella corretta
- ✅ `npm ci` che funziona

## 🎯 Checklist Rapida

- [ ] Backend: Root Directory = `/backend` nelle Settings
- [ ] Frontend: Root Directory = `/frontend` nelle Settings
- [ ] Nuovo deploy triggerato automaticamente o manualmente
- [ ] Build inizia senza errori `npm ci`

## ❌ Cosa NON Fare

- ❌ Non lasciare Root Directory vuoto o `/`
- ❌ Non usare `backend` senza lo slash iniziale
- ❌ Non aspettare che funzioni senza configurare Root Directory

---

**IMPORTANTE**: Questo è l'unico fix necessario. Una volta configurato il Root Directory, il build funzionerà perché i `package-lock.json` sono già nel repository.



