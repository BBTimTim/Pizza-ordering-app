# syntax=docker/dockerfile:1

# 1. szakasz – a React alkalmazás buildelése
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
# Az nginx ugyanazon a címen szolgálja ki az API-t, ezért relatív URL elég (nincs CORS)
ARG VITE_API_URL=/api
ARG VITE_IMG_URL=/uploads
ARG VITE_GOOGLE_API_KEY=""
ARG VITE_EMAILJS_SERVICE_ID=""
ARG VITE_EMAILJS_TEMPLATE_ID=""
ARG VITE_EMAILJS_TEMPLATE_ID2=""
ARG VITE_EMAILJS_PUBLIC_KEY=""
ARG VITE_STRIPE_PUBLIC_KEY=""
RUN npm run build

# 2. szakasz – csak a kész statikus fájlok és az nginx
FROM nginx:1.27-alpine AS runtime
COPY docker/web/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
