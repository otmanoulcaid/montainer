FROM node:latest

WORKDIR /app

COPY app .

RUN npm i

EXPOSE 3003

ENTRYPOINT [ "npm", "run", "dev" ]