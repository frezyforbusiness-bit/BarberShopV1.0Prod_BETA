# 🔧 Configurazione Builder su Railway

## ✅ Usa NIXPACKS (Raccomandato)

Per questo progetto (NestJS + React), usa **NIXPACKS** come builder.

## 📋 Come Configurarlo

### Backend Service:

1. Vai sul servizio **Backend** su Railway
2. Clicca su **Settings** (ingranaggio)
3. Sezione **"Build"**:
   - **Builder**: Seleziona **"NIXPACKS"** (o "Nixpacks")
   - **Build Command**: *(lascia vuoto)* → userà `nixpacks.toml`
   - **Start Command**: *(lascia vuoto)* → userà `nixpacks.toml`
4. Sezione **"Root Directory"**: Imposta `/backend`
5. **Save**

### Frontend Service:

1. Vai sul servizio **Frontend** su Railway
2. **Settings** → **Build**:
   - **Builder**: Seleziona **"NIXPACKS"**
   - **Build Command**: *(lascia vuoto)*
   - **Start Command**: *(lascia vuoto)*
3. **Root Directory**: Imposta `/frontend`
4. **Save**

## 🎯 Builder Disponibili

Railway supporta diversi builder:

| Builder | Quando Usarlo | Questo Progetto |
|---------|---------------|-----------------|
| **NIXPACKS** ✅ | Node.js, Python, Go, Rust, etc. | **USA QUESTO** |
| **DOCKERFILE** | Se hai un Dockerfile custom | Non necessario |
| **Railpack** ❌ | Auto-detection (spesso fallisce) | **NON usare** |

## 📁 File di Configurazione

Ho già creato i file necessari:

### Backend:
- ✅ `backend/nixpacks.toml` - Configurazione Nixpacks
- ✅ `backend/railway.json` - Fallback config Railway

### Frontend:
- ✅ `frontend/nixpacks.toml` - Configurazione Nixpacks  
- ✅ `frontend/railway.json` - Fallback config Railway

## 🔍 Come Verificare

Dopo aver configurato:

1. Trigger un nuovo deploy
2. Nei log dovresti vedere:
   ```
   using build driver nixpacks-vX.X.X
   ╭─────────────────╮
   │ Nixpacks X.X.X  │
   ╰─────────────────╯
   ```

## ⚠️ Se Vedi "Railpack"

Se nei log vedi ancora "Railpack", significa che:
- Il builder non è stato configurato come NIXPACKS
- O Railway sta usando auto-detection

**Fix**: Vai in Settings → Builder → Seleziona manualmente **"NIXPACKS"**

## 📝 Configurazione Attuale

I file `nixpacks.toml` sono configurati per:

**Backend:**
- Node.js 20
- PostgreSQL (per Prisma)
- Comandi: `npm ci || npm install` → `prisma generate` → `npm run build`
- Start: `npm run start:prod`

**Frontend:**
- Node.js 20
- Comandi: `npm ci --legacy-peer-deps || npm install --legacy-peer-deps` → `npm run build`
- Start: `npm run preview`

---

**In sintesi**: Usa **NIXPACKS** come builder per entrambi i servizi. È il builder standard per progetti Node.js su Railway.

