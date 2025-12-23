# Dockerfile per Backend - Build dalla root del repository
# Usa node:20 (non alpine) per migliore compatibilità con Prisma
FROM node:20-slim

WORKDIR /app

# Installa dipendenze di sistema per Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copia package files dal backend
COPY backend/package*.json ./

# Installa dipendenze
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia tutto il codice backend (prima del build)
COPY backend/ ./

# Pulisci cache Prisma e genera Prisma Client con binary corretto
RUN rm -rf node_modules/.prisma || true && \
    rm -rf node_modules/@prisma/client || true && \
    npx prisma generate

# Build dell'applicazione
RUN npm run build

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

