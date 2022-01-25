FROM node:16.13-alpine

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY . .

EXPOSE 3002
ENTRYPOINT ["npm", "run", "start"]