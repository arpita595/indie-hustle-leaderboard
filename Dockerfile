FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ARG GIT_SHA=local
ENV GIT_SHA=$GIT_SHA PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]