# 🔧 Railway Setup SENZA Root Directory

Se Railway non ha l'opzione "Root Directory", usa questi Dockerfile dalla root.

## ✅ Configurazione

### Backend Service:

1. Settings → Build
2. **Builder**: `DOCKERFILE`
3. **Dockerfile Path**: `Dockerfile`
4. *(Root Directory lascia vuoto o `/`)*

### Frontend Service:

1. Settings → Build  
2. **Builder**: `DOCKERFILE`
3. **Dockerfile Path**: `Dockerfile.frontend`
4. *(Root Directory lascia vuoto o `/`)*

## 📁 File Dockerfile

- `Dockerfile` → Usa questo per **Backend** (copia da `backend/`)
- `Dockerfile.frontend` → Usa questo per **Frontend** (copia da `frontend/`)

## 🎯 Come Funziona

Questi Dockerfile:
1. Partono dalla **root del repository**
2. Copiano esplicitamente da `backend/` o `frontend/`
3. Non richiedono Root Directory configurato

## ✅ Vantaggi

- ✅ Funziona senza Root Directory
- ✅ Più semplice da configurare
- ✅ Un solo Dockerfile per servizio

---

**Pronto!** Configura i servizi con questi Dockerfile e dovrebbe funzionare subito.



