# Dockerfile per Backend - Build dalla root del repository
# Usa node:20-bullseye che include libssl1.1 necessario per Prisma
FROM node:20-bullseye

WORKDIR /app

# Installa OpenSSL e librerie necessarie per Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    libssl1.1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copia package files dal backend
COPY backend/package*.json ./
COPY backend/package-lock.json* ./

# Installa dipendenze
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia schema Prisma (necessario per generare il client)
COPY backend/prisma ./prisma/

# Copia tutto il codice backend (prima del build)
COPY backend/ ./

# Genera Prisma Client e build dell'applicazione
RUN npx prisma generate && npm run build

# Verifica che il build sia stato creato (con debug)
RUN echo "=== Verifica dist directory ===" && \
    ls -la dist/src/ && \
    echo "=== Verifica main.js ===" && \
    test -f dist/src/main.js && \
    echo "✅ Build completato correttamente" || \
    (echo "❌ Build fallito - dist/src/main.js non trovato" && ls -la dist/ && exit 1)

EXPOSE 3000

# Usa path corretto (NestJS compila in dist/src/)
CMD ["node", "dist/src/main.js"]

