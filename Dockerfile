FROM  node:22-alpine3.22
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && pnpm run dev"]