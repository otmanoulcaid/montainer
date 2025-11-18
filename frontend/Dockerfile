FROM node:25-alpine3.21 AS builder

WORKDIR /app

COPY app/package*.json ./

RUN npm ci
COPY app .
RUN npm run build

FROM nginx:alpine

COPY config/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/build /var/www/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]