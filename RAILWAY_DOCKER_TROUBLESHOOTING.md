# 🔧 Troubleshooting Dockerfile su Railway

## ❌ Errore: "/prisma": not found

Questo errore significa che Railway non trova la directory `prisma` durante il COPY.

## ✅ Soluzione 1: Verifica Root Directory (PRIMARIO)

**IMPORTANTE**: Assicurati che il Root Directory sia configurato:

### Backend Service:
1. Settings → **Root Directory** = `/backend`
2. Settings → **Dockerfile Path** = `Dockerfile` (non `backend/Dockerfile`)

Quando Root Directory è `/backend`, il Dockerfile viene eseguito DALLA directory backend, quindi i percorsi sono relativi a quella.

### Frontend Service:
1. Settings → **Root Directory** = `/frontend`
2. Settings → **Dockerfile Path** = `Dockerfile`

## ✅ Soluzione 2: Usa Dockerfile dalla Root (Alternativa)

Se Root Directory non funziona, usa il Dockerfile dalla root:

### Backend:
1. Settings → **Root Directory** = *(lascia vuoto o `/`)*
2. Settings → **Dockerfile Path** = `Dockerfile.backend`

Questo Dockerfile copia esplicitamente da `backend/`.

## 🔍 Verifica Build Context

Railway usa il **Root Directory** come build context. Questo significa:

- Se Root Directory = `/backend`, Dockerfile vede solo file in `backend/`
- Se Root Directory = `/`, Dockerfile vede tutto il repository

## 📝 Checklist

- [ ] Root Directory configurato correttamente (`/backend` per backend)
- [ ] Dockerfile Path corretto (relativo al Root Directory)
- [ ] Dockerfile Path = `Dockerfile` se Root Directory = `/backend`
- [ ] Dockerfile Path = `Dockerfile.backend` se Root Directory = `/`

## 🎯 Configurazione Consigliata

**Backend:**
- Root Directory: `/backend`
- Dockerfile Path: `Dockerfile`
- Build Context: `backend/`

**Frontend:**
- Root Directory: `/frontend`
- Dockerfile Path: `Dockerfile`
- Build Context: `frontend/`

---

Dopo aver configurato, trigger un nuovo deploy!


