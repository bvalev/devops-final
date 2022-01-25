FROM node:16.13-alpine

WORKDIR /app

COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3001
ENTRYPOINT ["npm", "run", "serve"]