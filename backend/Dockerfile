
FROM node:alpine As development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
