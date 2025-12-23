# Backend Dockerfile per Railway
FROM node:20-alpine

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze (fallback a npm install se package-lock.json non esiste)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia schema Prisma (importante: prima di tutto)
COPY prisma ./prisma/

# Verifica che lo schema esista e genera Prisma Client
RUN ls -la prisma/ && npx prisma generate

# Copia tutto il resto del codice
COPY . .

# Build dell'applicazione (postbuild eseguirà anche prisma generate ma è già fatto)
RUN npm run build

# Esponi porta
EXPOSE 3000

# Comando di start
CMD ["npm", "run", "start:prod"]
