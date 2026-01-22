FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build TS → JS
RUN npm run build

# Run migrations, then start app
CMD sh -c "npx mikro-orm migration:up && node dist/app.js"
