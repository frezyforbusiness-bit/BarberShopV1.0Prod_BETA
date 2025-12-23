# Dockerfile per Backend - Build dalla root del repository
FROM node:20-alpine

WORKDIR /app

# Copia package files dal backend
COPY backend/package*.json ./

# Installa dipendenze
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Installa OpenSSL per Prisma (fix warning)
RUN apk add --no-cache openssl1.1-compat

# Copia tutto il codice backend (prima del build)
COPY backend/ ./

# Genera Prisma Client
RUN npx prisma generate

# Build dell'applicazione
RUN npm run build

# Verifica che il build sia stato creato (con debug)
RUN echo "=== Verifica dist directory ===" && \
    ls -la dist/ && \
    echo "=== Verifica main.js ===" && \
    test -f dist/main.js && \
    echo "✅ Build completato correttamente" || \
    (echo "❌ Build fallito - dist/main.js non trovato" && ls -la dist/ && exit 1)

EXPOSE 3000

# Usa path assoluto per sicurezza
CMD ["node", "dist/main.js"]

