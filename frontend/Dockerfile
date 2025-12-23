# Frontend Dockerfile per Railway
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze (con legacy-peer-deps per React 19)
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copia tutto il codice
COPY . .

# Build dell'applicazione
RUN npm run build

# Stage production - serve i file statici
FROM nginx:alpine

# Copia i file buildati
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configurazione nginx (opzionale)
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
