FROM node:20-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN npm install

COPY . .

# Build TS → JS
RUN npx tsc

CMD sh -c "npx mikro-orm migration:up --config dist/mikro-orm.config.js && node dist/src/app.js"
