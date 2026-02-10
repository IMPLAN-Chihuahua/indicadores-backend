# Usar Debian Bullseye en lugar de Alpine
FROM node:lts-bullseye-slim AS base

# Instalar Chromium y dependencias en Debian
RUN apt-get update && apt-get install -y \
    chromium \
    # nss 
    chromium-driver \
    libnss3\ 
    libfreetype6 \
    libharfbuzz0b \ 
    ca-certificates \ 
    fonts-freefont-ttf \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer para usar Chromium del sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Definir directorio de trabajo y exponer puerto
WORKDIR /home/node
EXPOSE 8080

# Etapa de desarrollo
FROM base AS dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
ENV NODE_ENV=development
COPY --chown=node:node . .
USER node
CMD ["npm", "run", "dev"]

# Etapa de producción
FROM base AS prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
ENV NODE_ENV=production
COPY --chown=node:node . .
USER node
HEALTHCHECK --interval=1m --timeout=3s --retries=5 \
    CMD ["wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080", "||", "exit", "1"]
CMD ["npm", "run", "start"]
