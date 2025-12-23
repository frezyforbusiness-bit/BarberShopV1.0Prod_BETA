# Dockerfile per Backend - Build dalla root del repository
# Usa node:20 standard (non slim) per migliore compatibilità con Prisma
FROM node:20

WORKDIR /app

# Installa dipendenze di sistema per Prisma
# Installa sia OpenSSL 3.x che compatibilità per 1.1.x se necessario
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    libssl3 \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Crea symlink per libssl.so.1.1 se Prisma lo richiede (workaround)
RUN if [ ! -f /usr/lib/x86_64-linux-gnu/libssl.so.1.1 ]; then \
      ln -s /usr/lib/x86_64-linux-gnu/libssl.so.3 /usr/lib/x86_64-linux-gnu/libssl.so.1.1 || true; \
    fi

# Copia package files dal backend
COPY backend/package*.json ./

# Installa dipendenze
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia tutto il codice backend (prima del build)
COPY backend/ ./

# Pulisci cache Prisma e genera Prisma Client con binary corretto
# Forza Prisma a rilevare correttamente il sistema
RUN rm -rf node_modules/.prisma || true && \
    rm -rf node_modules/@prisma/client || true && \
    PRISMA_SKIP_POSTINSTALL_GENERATE=false npx prisma generate

# Verifica quale binary è stato generato
RUN echo "=== Prisma binaries generati ===" && \
    find node_modules/.prisma/client -name "*.so.node" -o -name "*.node" | head -5

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

