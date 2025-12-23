# Backend Dockerfile per Railway
FROM node:20-alpine

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze (incluse dev per build)
RUN npm ci || npm install

# Copia tutto il codice (incluse prisma directory)
COPY . .

# Genera Prisma Client e build
RUN npx prisma generate && npm run build

# Esponi porta
EXPOSE 3000

# Comando di start
CMD ["npm", "run", "start:prod"]
