FROM node:20-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN npm install

COPY . .

# Build TS → JS
RUN npx tsc

# Run migrations using compiled JS config
CMD sh -c "npx mikro-orm migration:up --config dist/mikro-orm.config.js"
# CMD sh -c "npx mikro-orm migration:up && node dist/app.js"
