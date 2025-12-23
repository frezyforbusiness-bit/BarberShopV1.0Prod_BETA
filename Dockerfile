# Dockerfile per Backend - Build dalla root del repository
# Usa Ubuntu 20.04 (Focal) che ha libssl1.1 nativo per Prisma
FROM ubuntu:20.04

# Evita prompt interattivi durante apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Installa Node.js 20 e dipendenze base
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    openssl \
    libssl1.1 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# libssl1.1 è già installato sopra con Ubuntu 20.04
# Verifica che libssl1.1 sia disponibile
RUN ls -la /usr/lib/x86_64-linux-gnu/libssl.so.1.1 || echo "⚠️ libssl1.1 non trovato"

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

