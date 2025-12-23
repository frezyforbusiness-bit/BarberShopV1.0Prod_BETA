# Dockerfile per Backend - Build dalla root del repository
FROM node:20-alpine

WORKDIR /app

# Copia package files dal backend
COPY backend/package*.json ./

# Installa dipendenze
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia schema Prisma
COPY backend/prisma ./prisma/

# Installa OpenSSL per Prisma (fix warning)
RUN apk add --no-cache openssl1.1-compat

# Genera Prisma Client
RUN npx prisma generate

# Copia tutto il codice backend
COPY backend/ ./

# Build dell'applicazione
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

