# Dockerfile per Backend - Quando Root Directory è /backend
# Questo Dockerfile assume che il build context sia la directory backend
FROM node:20-bullseye

WORKDIR /app

# Installa OpenSSL e librerie necessarie per Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    libssl1.1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copia package files
COPY package*.json ./
COPY prisma ./prisma/

# Installa dipendenze
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia tutto il codice backend
COPY . .

# Genera Prisma Client e build
RUN npx prisma generate && npm run build

EXPOSE 3000

# Usa path corretto (NestJS compila in dist/src/)
CMD ["node", "dist/src/main.js"]

