FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/typeorm.config.ts ./
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/tsconfig.json ./
COPY --from=builder /usr/src/app/tsconfig.build.json ./

EXPOSE 3000

CMD ["node", "dist/src/main.js"]